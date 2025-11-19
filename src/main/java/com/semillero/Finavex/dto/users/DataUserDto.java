package com.semillero.Finavex.dto.users;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DataUserDto {
    private String name;
    private String surname;
    private String email;
}
