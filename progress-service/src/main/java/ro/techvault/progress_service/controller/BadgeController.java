package ro.techvault.progress_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.techvault.progress_service.dtos.BadgeResponse;
import ro.techvault.progress_service.dtos.LearnerBadgeResponse;
import ro.techvault.progress_service.services.LearnerProgressService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class BadgeController {

    @Autowired
    private LearnerProgressService learnerProgressService;

    @GetMapping("/badges/catalog")
    public ResponseEntity<List<BadgeResponse>> catalog() {
        return ResponseEntity.ok(learnerProgressService.getBadgeCatalog());
    }

    @GetMapping("/learner/badges")
    public ResponseEntity<List<LearnerBadgeResponse>> learnerBadges(
            @RequestHeader("X-User-Id") UUID learnerId
    ) {
        return ResponseEntity.ok(learnerProgressService.getLearnerBadges(learnerId));
    }
}
