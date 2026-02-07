package com.semillero.Finavex.entity.movements;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name="savings_money_users")
public class SavingsMoneyUsers {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private long id;

    @Email
    @NotBlank(message = "El email se requiere")
    @Column(name="email", nullable = false)
    private String email;

    @NotBlank(message = "El nombre se requiere")
    @Column(name="name_savings", nullable = false)
    private String nameSavings;

    @Positive
    @DecimalMin("0.01")
    @NotNull(message = "El monto no puede ser nulo")
    @Column(name="amount", nullable = false)
    private BigDecimal amount;

    @Column(name="date_of_registry", nullable = false)
    private LocalDateTime dateOfRegistry;

}
