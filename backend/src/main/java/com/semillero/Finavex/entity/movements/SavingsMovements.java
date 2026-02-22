package com.semillero.Finavex.entity.movements;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="savings_movements")
@Data
public class SavingsMovements {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;

    @Positive
    @DecimalMin("50.00")
    @Column(name="amount", nullable = false)
    private BigDecimal amount;

    @Column(name="date", nullable = false)
    private LocalDateTime dateRegistry;

    // Relation directly with the savings plan
    @ManyToOne
    @JoinColumn(name = "savings_plan_id", nullable = false)
    private SavingsPlan savingsPlan;
}
