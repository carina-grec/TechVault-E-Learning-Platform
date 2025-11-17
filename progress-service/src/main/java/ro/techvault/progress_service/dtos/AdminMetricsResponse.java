package ro.techvault.progress_service.dtos;

public record AdminMetricsResponse(
        long totalSubmissions,
        long submissionsToday,
        long completedSubmissions,
        long pendingSubmissions
) {
}
