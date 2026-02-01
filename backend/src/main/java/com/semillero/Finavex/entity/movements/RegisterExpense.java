package com.semillero.Finavex.entity.movements;

import com.semillero.Finavex.entity.User;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name="Gastos")
public class RegisterExpense {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(name="tipo-movimiento", nullable = false)
    private String movementType;

    @Column(name="Valor-gasto", nullable=false)
    private BigDecimal amount;

    @Column(name="Fecha-movimiento-gasto", nullable = false)
    private LocalDateTime date;

    @Column(name="nota-movimiento", nullable=true)
    private String noteMovement;

    @ManyToOne
    @JoinColumn(name="id-user", nullable=false, unique = false)
    private User user;
}
