package com.semillero.Finavex.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@AllArgsConstructor
@Builder
public class ResponseComparisonCode {
    private String message;
    private boolean success;
}
