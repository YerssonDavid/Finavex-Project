package com.semillero.Finavex.controllers.Users;

import com.semillero.Finavex.dto.ApiResponse;
import com.semillero.Finavex.dto.DtoLogin;
import com.semillero.Finavex.dto.LoginResponse;
import com.semillero.Finavex.services.Users.LoginServ;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/Users")
@RequiredArgsConstructor
public class Login {
    private final LoginServ loginServ;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> loginUser(@Valid @RequestBody DtoLogin dtoLogin){
        return loginServ.loginUser(dtoLogin);
    }
}
