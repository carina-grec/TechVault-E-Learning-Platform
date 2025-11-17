package ro.techvault.cdnservice.services;

import io.minio.BucketExistsArgs;
import io.minio.ListObjectsArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.Result;
import io.minio.messages.Item;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class StorageService {

    private final MinioClient minioClient;
    private final String bucket;
    private final String publicBaseUrl;

    public StorageService(MinioClient minioClient,
                          @Value("${minio.bucket}") String bucket,
                          @Value("${minio.public-url}") String publicBaseUrl) {
        this.minioClient = minioClient;
        this.bucket = bucket;
        this.publicBaseUrl = publicBaseUrl;
    }

    @PostConstruct
    public void ensureBucket() {
        try {
            boolean exists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());
            if (!exists) {
                minioClient.makeBucket(io.minio.MakeBucketArgs.builder().bucket(bucket).build());
            }
        } catch (Exception e) {
            throw new RuntimeException("Unable to initialize MinIO bucket", e);
        }
    }

    public StoredObject upload(MultipartFile file) {
        String objectName = UUID.randomUUID() + "-" + file.getOriginalFilename();
        try (InputStream inputStream = file.getInputStream()) {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectName)
                            .stream(inputStream, file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );
            return new StoredObject(objectName, String.format("%s/%s/%s", publicBaseUrl, bucket, objectName));
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload object", e);
        }
    }

    public List<StoredObject> list() {
        Iterable<Result<Item>> results = minioClient.listObjects(
                ListObjectsArgs.builder().bucket(bucket).build()
        );
        return StreamSupport.stream(results.spliterator(), false)
                .map(result -> {
                    try {
                        Item item = result.get();
                        return new StoredObject(item.objectName(), String.format("%s/%s/%s", publicBaseUrl, bucket, item.objectName()));
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                })
                .collect(Collectors.toList());
    }

    public record StoredObject(String objectKey, String url) {}
}
