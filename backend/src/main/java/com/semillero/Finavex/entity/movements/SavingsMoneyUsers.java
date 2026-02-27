package com.semillero.Finavex.entity.movements;

import com.semillero.Finavex.entity.User;
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

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank(message = "El nombre se requiere")
    @Column(name="name_savings", nullable = false)
    @Pattern(regexp = "^[a-zA-Z áéíóúÁÉÍÓÚñÑ]+$", message="El nombre es invalido!")
    private String nameSavings;

    @Positive
    @DecimalMin("0.01")
    @NotNull(message = "El monto no puede ser nulo")
    @Column(name="amount", nullable = false)
    private BigDecimal amount;

    @Column(name="date_of_registry", nullable = false)
    private LocalDateTime dateOfRegistry;

}
