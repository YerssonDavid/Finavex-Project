package com.semillero.Finavex.controllers.aiControllers;

import com.semillero.Finavex.dto.aiDto.JobResponseID;
import com.semillero.Finavex.dto.aiDto.RequestAI;
import com.semillero.Finavex.dto.aiDto.ResponseAI;
import com.semillero.Finavex.services.assistendAI.AIClientOpenAI;
import com.semillero.Finavex.services.assistendAI.AiOpenAI;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/AI/chat")
@RequiredArgsConstructor
public class AIController {
    private final AiOpenAI aiOpenAI;

    @PostMapping("/question")
    //Documentation Swagger - API AI Assistant
    @Operation(
            summary="Ask a question to the AI Asistant of OpenAI Finavex",
            description="Api endpoint to ask question to the AI Assistant of OpenAU Finavex, only question about finances",
            method = "POST",
            tags={"Ai Assistant OpenAI - Finavex"},
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Request body to ask question to the AI Assistant of OpenAI Finavex",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = RequestAI.class)
                    ),
                    required = true
            )
    )
    public ResponseEntity<JobResponseID> askQuestion(@Valid @RequestBody RequestAI question){
        //Code of processing the question
        String jobId = UUID.randomUUID().toString();

        aiOpenAI.processAsync(jobId, question);

       return ResponseEntity.accepted()
               .body(new JobResponseID(jobId));
    }
}
