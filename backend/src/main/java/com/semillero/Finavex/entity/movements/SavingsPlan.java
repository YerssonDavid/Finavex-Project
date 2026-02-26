package com.semillero.Finavex.entity.movements;

import com.semillero.Finavex.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name="savings_plan_id")
@Data
public class SavingsPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message="Se requiere un nombre para el plan de ahorro")
    @Column(name="name_plan", nullable = false)
    @Pattern(regexp = "^[a-zA-Z áéíóúÁÉÍÓÚñÑ]+$", message="El nombre es invalido!")
    private String nameSavingsPlan;

    @NotNull(message = "Se requiere un valor para la meta de ahorro")
    // Value minimum of $1.000 for meta plan
    @DecimalMin("1000.00")
    @Column(name="meta_plan", nullable = false)
    private BigDecimal amountMetaPlan;

    @Column(name="description_plan_savings")
    @NotBlank(message = "Se requiere una descripción para el plan de ahorro")
    @Pattern(regexp = "^[a-zA-Z áéíóúÁÉÍÓÚñÑ]+$", message="El nombre es invalido!")
    private String descriptionPlanSavings;

    @ManyToOne
    @JoinColumn(name="user_id", nullable = false)
    private User user;
}
