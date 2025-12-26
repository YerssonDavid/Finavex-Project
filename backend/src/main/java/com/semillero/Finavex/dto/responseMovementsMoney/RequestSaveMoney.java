package com.semillero.Finavex.dto.responseMovementsMoney;

import com.semillero.Finavex.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestSaveMoney {
    private Double savedAmount;
    private String note;
    private LocalDate date;
    private User user;
}
