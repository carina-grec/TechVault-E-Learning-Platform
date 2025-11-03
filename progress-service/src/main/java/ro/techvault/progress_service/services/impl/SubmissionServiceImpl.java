package ro.techvault.progress_service.services.impl;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.techvault.progress_service.config.MessagingConfig;
import ro.techvault.progress_service.dtos.SubmissionGradingJob;
import ro.techvault.progress_service.dtos.SubmissionRequest;
import ro.techvault.progress_service.dtos.SubmissionResponse;
import ro.techvault.progress_service.enums.SubmissionStatus;
import ro.techvault.progress_service.models.Submission;
import ro.techvault.progress_service.repositories.SubmissionRepository;
import ro.techvault.progress_service.services.SubmissionService;

import java.util.UUID;

@Service
public class SubmissionServiceImpl implements SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private RabbitTemplate rabbitTemplate; // Spring's tool for sending messages

    @Override
    public SubmissionResponse createSubmission(SubmissionRequest request, UUID learnerId) {

        // 1. Create and save the Submission as PENDING
        Submission submission = new Submission();
        submission.setLearnerId(learnerId);
        submission.setQuestId(request.questId());
        submission.setSubmittedCode(request.submittedCode());
        submission.setStatus(SubmissionStatus.PENDING);

        Submission savedSubmission = submissionRepository.save(submission);

        // 2. Create the "order ticket" (the message)
        SubmissionGradingJob job = new SubmissionGradingJob(
                savedSubmission.getId(),
                savedSubmission.getQuestId(),
                savedSubmission.getSubmittedCode(),
                request.language() // Pass the language
        );

        // 3. Publish the message to the queue
        rabbitTemplate.convertAndSend(MessagingConfig.GRADING_QUEUE_NAME, job);

        // 4. Return the "PENDING" response to the user immediately
        return new SubmissionResponse(
                savedSubmission.getId(),
                savedSubmission.getQuestId(),
                savedSubmission.getStatus(),
                savedSubmission.getTimestamp()
        );
    }
}