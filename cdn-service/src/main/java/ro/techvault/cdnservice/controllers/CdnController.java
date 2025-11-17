package ro.techvault.cdnservice.controllers;

import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ro.techvault.cdnservice.services.StorageService;
import ro.techvault.cdnservice.services.StorageService.StoredObject;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cdn")
public class CdnController {

    @Autowired
    private StorageService storageService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> upload(@RequestParam("file") @NotNull MultipartFile file) {
        StoredObject storedObject = storageService.upload(file);
        return ResponseEntity.ok(Map.of(
                "key", storedObject.objectKey(),
                "url", storedObject.url()
        ));
    }

    @GetMapping("/files")
    public ResponseEntity<List<StoredObject>> list() {
        return ResponseEntity.ok(storageService.list());
    }
}
