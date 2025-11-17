package ro.techvault.progress_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.techvault.progress_service.dtos.AdminMetricsResponse;
import ro.techvault.progress_service.services.LearnerProgressService;

@RestController
@RequestMapping("/api/admin/metrics")
public class AdminMetricsController {

    @Autowired
    private LearnerProgressService learnerProgressService;

    @GetMapping("/overview")
    public ResponseEntity<AdminMetricsResponse> overview() {
        return ResponseEntity.ok(learnerProgressService.getAdminMetrics());
    }
}
