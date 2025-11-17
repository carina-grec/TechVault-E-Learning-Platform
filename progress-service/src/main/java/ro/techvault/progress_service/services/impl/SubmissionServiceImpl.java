package ro.techvault.progress_service.services.impl;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ro.techvault.progress_service.config.MessagingConfig;
import ro.techvault.progress_service.dtos.SubmissionGradingJob;
import ro.techvault.progress_service.dtos.SubmissionRequest;
import ro.techvault.progress_service.dtos.SubmissionResponse;
import ro.techvault.progress_service.dtos.TestCasePayload;
import ro.techvault.progress_service.enums.SubmissionStatus;
import ro.techvault.progress_service.models.Submission;
import ro.techvault.progress_service.repositories.SubmissionRepository;
import ro.techvault.progress_service.services.SubmissionService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SubmissionServiceImpl implements SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Override
    public SubmissionResponse createSubmission(SubmissionRequest request, UUID learnerId) {
        Submission submission = new Submission();
        submission.setLearnerId(learnerId);
        submission.setQuestId(request.questId());
        submission.setSubmittedCode(request.submittedCode());
        submission.setStatus(SubmissionStatus.PENDING);

        Submission savedSubmission = submissionRepository.save(submission);
        List<TestCasePayload> testCases =
                request.testCases() == null ? List.of() : request.testCases();

        SubmissionGradingJob job = new SubmissionGradingJob(
                savedSubmission.getId(),
                savedSubmission.getQuestId(),
                savedSubmission.getSubmittedCode(),
                request.language(),
                testCases
        );
        rabbitTemplate.convertAndSend(MessagingConfig.GRADING_QUEUE_NAME, job);
        return mapSubmission(savedSubmission);
    }

    @Override
    public Page<SubmissionResponse> getSubmissions(UUID learnerId, UUID questId, SubmissionStatus status, Pageable pageable) {
        Page<Submission> page;
        if (questId != null && status != null) {
            page = submissionRepository.findByLearnerIdAndQuestIdAndStatus(learnerId, questId, status, pageable);
        } else if (questId != null) {
            page = submissionRepository.findByLearnerIdAndQuestId(learnerId, questId, pageable);
        } else if (status != null) {
            page = submissionRepository.findByLearnerIdAndStatus(learnerId, status, pageable);
        } else {
            page = submissionRepository.findByLearnerId(learnerId, pageable);
        }
        return page.map(this::mapSubmission);
    }

    @Override
    public SubmissionResponse getSubmission(UUID learnerId, UUID submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .filter(entity -> entity.getLearnerId().equals(learnerId))
                .orElseThrow(() -> new RuntimeException("Submission not found"));
        return mapSubmission(submission);
    }

    @Override
    public List<SubmissionResponse> getRecentSubmissions(UUID learnerId, int limit) {
        return submissionRepository.findTop5ByLearnerIdOrderByTimestampDesc(learnerId).stream()
                .limit(limit)
                .map(this::mapSubmission)
                .collect(Collectors.toList());
    }

    private SubmissionResponse mapSubmission(Submission submission) {
        return new SubmissionResponse(
                submission.getId(),
                submission.getQuestId(),
                submission.getStatus(),
                submission.isSuccess(),
                submission.getScore(),
                submission.getStdout(),
                submission.getStderr(),
                submission.getResultsJson(),
                submission.getTimestamp()
        );
    }
}
