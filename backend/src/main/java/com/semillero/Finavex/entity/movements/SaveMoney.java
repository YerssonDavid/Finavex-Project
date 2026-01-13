package com.semillero.Finavex.entity.movements;


import com.semillero.Finavex.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name="Ahorros")
@Getter
@Setter
public class SaveMoney {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="valor-ahorrado", nullable = false)
    private Double savedAmount;

    @Column(name="fecha-movimento-ingreso", nullable= false, length = 10)
    private LocalDateTime date;

    @Column(name="nota-movimiento", nullable=true, length = 100)
    private String noteMovement;

    @ManyToOne
    @JoinColumn(name="id-user", nullable = false, unique = false)
    private User user;
}
