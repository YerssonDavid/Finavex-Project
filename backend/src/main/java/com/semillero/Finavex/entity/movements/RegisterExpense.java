package com.semillero.Finavex.entity.movements;

import com.semillero.Finavex.entity.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="Gastos")
public class RegisterExpense {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(name="Valor-gasto", nullable=false)
    private Double expenseAmount;

    @Column(name="Fecha-movimiento-gasto", nullable = false)
    private LocalDateTime date;

    @Column(name="nota-movimiento", nullable=true)
    private String noteMovement;

    @ManyToOne
    @JoinColumn(name="id-user", nullable=false, unique = false)
    private User user;
}
