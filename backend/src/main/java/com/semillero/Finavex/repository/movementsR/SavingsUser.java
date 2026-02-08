package com.semillero.Finavex.repository.movementsR;

import com.semillero.Finavex.entity.movements.SavingsMoneyUsers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface SavingsUser extends JpaRepository<SavingsMoneyUsers, Long> {
}
