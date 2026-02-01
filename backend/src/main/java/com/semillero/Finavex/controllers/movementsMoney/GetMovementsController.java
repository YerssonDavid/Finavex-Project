package com.semillero.Finavex.controllers.movementsMoney;

import com.semillero.Finavex.dto.movementsMoney.RequestGetMovements;
import com.semillero.Finavex.dto.movementsMoney.ResponseGetMovements;
import com.semillero.Finavex.services.movementsS.GetMovements;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/movements")
@RequiredArgsConstructor
public class GetMovementsController {
    private final GetMovements getMovements;

    @PostMapping
    public ResponseEntity<List<ResponseGetMovements>> getMovements(@Valid @RequestBody RequestGetMovements requestGetMovements){
        List<ResponseGetMovements> movements = getMovements.getMovementsUser(requestGetMovements);
        return ResponseEntity.ok(movements);
    }
}
