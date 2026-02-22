package com.semillero.Finavex.entity.movements;

import com.semillero.Finavex.entity.User;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name="Expenses")
public class RegisterExpense {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(name="movement_type", nullable = false)
    private String movementType;

    @Column(name="expense_value", nullable=false)
    private BigDecimal amount;

    @Column(name="date_movement_expense", nullable = false)
    private LocalDateTime date;

    @Column(name="movement_note", nullable=true)
    private String noteMovement;

    @ManyToOne
    @JoinColumn(name="id_user", nullable=false, unique = false)
    private User user;
}
