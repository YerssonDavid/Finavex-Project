package com.semillero.Finavex.entity.movements;

import com.semillero.Finavex.entity.User;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name="Saldo-actual")
public class MoneyNow {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;

    //Solo se actualiza, no se crea un nuevo registro
    @OneToOne
    @JoinColumn(name="id_user", nullable=false, unique= true)
    private User user;

    @Column(name="saldo_actual", nullable = false)
    private BigDecimal currentBalance;

    @Column(name="Fecha_registro", nullable = false)
    private LocalDateTime dateRegister;
}
