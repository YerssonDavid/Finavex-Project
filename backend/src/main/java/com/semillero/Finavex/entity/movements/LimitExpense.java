package com.semillero.Finavex.entity.movements;

import com.semillero.Finavex.entity.User;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Data
@Table(name="limit_expense", schema="movement_money_normal")
public class LimitExpense {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;


    @OneToOne(fetch= FetchType.LAZY)
    @JoinColumn(name="id_user", nullable=false, unique=true)
    private User idUser;

    @Column(name="value_limit", nullable = false)
    private BigDecimal valueLimit;

    @Column(name="expiration_date", nullable = false)
    private Date expirationDate;

    @Column(name = "date_registry_limit", nullable = false)
    private LocalDateTime dateRegistryLimit;
}
