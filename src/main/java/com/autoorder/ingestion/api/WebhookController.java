package com.autoorder.ingestion.api;

import com.autoorder.ingestion.application.IngestionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final IngestionService ingestionService;

    @PostMapping
    public ResponseEntity<Void> receive(@Validated @RequestBody WebhookRequestDto dto) {
        ingestionService.ingest(dto);
        return ResponseEntity.accepted().build();
    }
}
