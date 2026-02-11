package com.semillero.Finavex.entity.movements;

import com.semillero.Finavex.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name="savings_plan")
@Data
public class SavingsPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message="Se requiere un nombre para el plan de ahorro")
    @Column(name="name_plan", nullable = false)
    private String nameSavingsPlan;

    @NotNull(message = "Se requiere un valor para la meta de ahorro")
    // Value minimum of $1.000 for meta plan
    @DecimalMin("1000.00")
    @Column(name="meta_plan", nullable = false)
    private BigDecimal amountMetaPlan;

    @ManyToOne
    @JoinColumn(name="user_id", nullable = false)
    private User userId;
}
