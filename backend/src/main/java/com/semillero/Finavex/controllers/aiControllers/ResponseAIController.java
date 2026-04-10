package com.semillero.Finavex.controllers.aiControllers;

import com.semillero.Finavex.dto.aiDto.ResponseAI;
import com.semillero.Finavex.services.assistendAI.JobStore;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping()
@RequiredArgsConstructor
public class ResponseAIController {
    private final JobStore jobStore;
    @GetMapping("/response/{jobId}")
    @Operation(
            summary = "Get AI Response",
            description = "Get the result of an AI processing job by its jobId.",
            method = "GET",
            tags = {"AI Assistant"}
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Job result or pending status"),
            @ApiResponse(responseCode = "404", description = "Job not found")
    })
    public ResponseEntity<ResponseAI> getResponseAI(
            @Parameter(description = "The ID of the job", required = true)
            @PathVariable String jobId) {

        Object value = jobStore.get(jobId);

        if(value == null){
            return ResponseEntity.notFound().build();
        } else if("PENDING".equals(value)){
            return ResponseEntity.ok().body(new ResponseAI(
                    "Procesando...",
                    LocalDateTime.now()
            ));
        } else if(value instanceof ResponseAI responseAI){
            return ResponseEntity.ok().body(responseAI);
        } else if(value instanceof String error){
            return ResponseEntity.badRequest().body(new ResponseAI(
                    error,
                    LocalDateTime.now()
            ));
        }
        return ResponseEntity.internalServerError().build();
    }
}
