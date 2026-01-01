package com.semillero.Finavex.controllers.aiControllers;

import com.semillero.Finavex.dto.aiDto.RequestAI;
import com.semillero.Finavex.dto.aiDto.ResponseAI;
import com.semillero.Finavex.services.assistendAI.AssistendAIBot;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/AI/chat")
@RequiredArgsConstructor
public class AIController {
    private final AssistendAIBot assistendAIBot;

    @PostMapping("/question")
    public ResponseEntity<ResponseAI> askQuestion(@Valid @RequestBody RequestAI question){
        Float temperature = 0.7f;
        Integer tokenMax = 950;
       return assistendAIBot.explain(question);
    }
}
