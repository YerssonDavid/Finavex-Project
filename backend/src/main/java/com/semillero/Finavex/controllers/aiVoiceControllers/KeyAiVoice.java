package com.semillero.Finavex.controllers.aiVoiceControllers;

import com.semillero.Finavex.dto.aiVoiceDto.ResponseAIVoice;
import com.semillero.Finavex.services.assistendAIVoice.BotAIVoice;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai-voice")
@RequiredArgsConstructor
public class KeyAiVoice {

    private final BotAIVoice botAIVoice;

    @GetMapping()
    public ResponseEntity<ResponseAIVoice> getKeyAIVoice() {
        return botAIVoice.getTokenAIVoice();
    }
}
