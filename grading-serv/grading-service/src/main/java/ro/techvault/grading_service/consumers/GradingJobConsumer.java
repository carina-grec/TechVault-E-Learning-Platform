package ro.techvault.grading_service.consumers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate; // We'll use this for the API call
import ro.techvault.grading_service.dtos.SubmissionGradingJob;
import ro.techvault.grading_service.models.Submission;
import ro.techvault.grading_service.repositories.SubmissionRepository;

@Service
public class GradingJobConsumer {

    private static final Logger log = LoggerFactory.getLogger(GradingJobConsumer.class);

    @Autowired
    private SubmissionRepository submissionRepository;

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
        submissionRepository.save(submission);

        // 2. --- PSEUDO-CODE for calling the External Code Runner ---
        log.info("Calling external code runner for language: {}", job.language());
        // In a real app:
        // ExternalRunnerRequest apiRequest = new ExternalRunnerRequest(job.submittedCode());
        // ExternalRunnerResponse apiResponse = restTemplate.postForObject("http://external-runner.com/run", apiRequest, ExternalRunnerResponse.class);

        String fakeStdout = "10";
        String fakeStderr = "";
        String fakeResultsJson = "{\"testCases\": [{\"passed\": true, \"name\": \"Test 1\"}]}";
        boolean fakeIsSuccess = true;
        // --- End of Pseudo-code ---

        // 3. Update the submission with the final results
        submission.setStatus("COMPLETED");
        submission.setSuccess(fakeIsSuccess);
        submission.setStdout(fakeStdout);
        submission.setStderr(fakeStderr);
        submission.setResultsJson(fakeResultsJson);

        submissionRepository.save(submission);
        log.info("Grading complete for submission ID: {}", job.submissionId());
    }
}