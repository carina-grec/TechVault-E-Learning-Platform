package ro.techvault.grading_service.consumers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import ro.techvault.grading_service.clients.piston.PistonClient;
import ro.techvault.grading_service.clients.piston.PistonExecutionResponse;
import ro.techvault.grading_service.dtos.SubmissionGradingJob;
import ro.techvault.grading_service.dtos.TestCasePayload;
import ro.techvault.grading_service.models.Submission;
import ro.techvault.grading_service.repositories.SubmissionRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class GradingJobConsumer {

    private static final Logger log = LoggerFactory.getLogger(GradingJobConsumer.class);

    private final SubmissionRepository submissionRepository;
    private final PistonClient pistonClient;
    private final ObjectMapper objectMapper;

    public GradingJobConsumer(SubmissionRepository submissionRepository,
                              PistonClient pistonClient,
                              ObjectMapper objectMapper) {
        this.submissionRepository = submissionRepository;
        this.pistonClient = pistonClient;
        this.objectMapper = objectMapper;
    }

    @RabbitListener(queues = "grading-jobs-queue")
    public void onMessage(SubmissionGradingJob job) {
        log.info("Received grading job for submission ID: {}", job.submissionId());

        // 1. Find the submission and mark it as GRADING
        Submission submission = submissionRepository.findById(job.submissionId())
                .orElse(null);

        if (submission == null) {
            log.error("Submission not found: {}", job.submissionId());
            return; // Can't grade something that doesn't exist
        }

        submission.setStatus("GRADING");
        submission.setScore(null);
        submissionRepository.save(submission);

        List<TestCasePayload> testCases = job.testCases() == null ? Collections.emptyList() : job.testCases();
        try {
            if (testCases.isEmpty()) {
                executeSingleRun(submission, job);
            } else {
                executeTestSuite(submission, job, testCases);
            }
        } catch (Exception ex) {
            log.error("Piston execution failed for submission {}", job.submissionId(), ex);
            submission.setStatus("ERROR");
            submission.setSuccess(false);
            submission.setScore(0.0);
            submission.setStdout("");
            submission.setStderr(ex.getMessage());
            submission.setResultsJson("{}");
        }

        submissionRepository.save(submission);
        log.info("Grading complete for submission ID: {}", job.submissionId());
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private void executeSingleRun(Submission submission, SubmissionGradingJob job) {
        log.info("Calling Piston executor for language: {}", job.language());
        PistonExecutionResponse response = pistonClient.execute(job.language(), job.submittedCode(), null);
        boolean success = response != null
                && response.run() != null
                && response.run().code() != null
                && response.run().code() == 0;

        submission.setStatus(success ? "COMPLETED" : "ERROR");
        submission.setSuccess(success);
        submission.setStdout(response != null && response.run() != null ? safe(response.run().stdout()) : "");
        submission.setStderr(response != null && response.run() != null ? safe(response.run().stderr()) : "");
        submission.setResultsJson(response == null ? "{}" : pistonClient.serializeResponse(response));
    }

    private void executeTestSuite(Submission submission,
                                  SubmissionGradingJob job,
                                  List<TestCasePayload> testCases) {
        log.info("Running {} test case(s) for submission {}", testCases.size(), job.submissionId());
        List<TestCaseResult> results = new ArrayList<>();
        int passed = 0;
        for (TestCasePayload testCase : testCases) {
            try {
                PistonExecutionResponse response = pistonClient.execute(
                        job.language(),
                        job.submittedCode(),
                        testCase.input()
                );
                var run = response != null ? response.run() : null;
                String stdout = run != null ? safe(run.stdout()) : "";
                String stderr = run != null ? safe(run.stderr()) : "";
                Integer exitCode = run != null ? run.code() : null;
                // Some languages (e.g., Java) omit the exit code when they terminate cleanly,
                // so treat null as success unless an error is surfaced elsewhere.
                boolean exitedClean = (exitCode == null || exitCode == 0);
                String actual = normalize(stdout);
                boolean matches = actual.equals(normalize(testCase.expectedOutput()));
                boolean passedCase = exitedClean && matches;
                if (passedCase) {
                    passed++;
                }
                results.add(new TestCaseResult(
                        testCase.description(),
                        testCase.input(),
                        testCase.expectedOutput(),
                        actual,
                        passedCase,
                        exitCode,
                        stdout,
                        stderr,
                        null
                ));
            } catch (Exception ex) {
                log.warn("Test case execution failed for submission {}: {}", submission.getId(), ex.getMessage());
                results.add(new TestCaseResult(
                        testCase.description(),
                        testCase.input(),
                        testCase.expectedOutput(),
                        "",
                        false,
                        null,
                        "",
                        ex.getMessage(),
                        ex.getMessage()
                ));
            }
        }

        double score = testCases.isEmpty() ? 0.0 : (passed * 100.0d) / testCases.size();
        submission.setStatus("COMPLETED");
        submission.setSuccess(passed == testCases.size());
        submission.setScore(score);
        submission.setStdout("");
        submission.setStderr("");
        submission.setResultsJson(writeResultsJson(new TestSuiteSummary(
                passed,
                testCases.size(),
                score,
                results
        )));
    }

    private String normalize(String value) {
        return value == null ? "" : value.replace("\r\n", "\n").trim();
    }

    private String writeResultsJson(Object summary) {
        try {
            return objectMapper.writeValueAsString(summary);
        } catch (JsonProcessingException e) {
            log.warn("Unable to serialize grading summary", e);
            return "{}";
        }
    }

    private record TestCaseResult(
            String description,
            String input,
            String expectedOutput,
            String actualOutput,
            boolean passed,
            Integer exitCode,
            String stdout,
            String stderr,
            String error
    ) {}

    private record TestSuiteSummary(
            int passed,
            int total,
            double score,
            List<TestCaseResult> results
    ) {}
}
