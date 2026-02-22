package com.semillero.Finavex.entity.movements;


import com.semillero.Finavex.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="Savings")
@Getter
@Setter
public class SaveMoney {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="movement_type", nullable = false)
    private String movementType;

    @Column(name="savings_value", nullable = false)
    private BigDecimal amount;

    @Column(name="date_movement_income", nullable= false, length = 10)
    private LocalDateTime date;

    @Column(name="movement_note", nullable=true, length = 100)
    private String noteMovement;

    @ManyToOne
    @JoinColumn(name="id_user", nullable = false, unique = false)
    private User user;
}
