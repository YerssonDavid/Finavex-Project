package com.semillero.Finavex.dto.aiVoiceDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseAIVoice {
    private String token;
    private String region;
}
