package com.semillero.Finavex.repository.movementsR;

import com.semillero.Finavex.entity.movements.SavingsMovements;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface SavingsUserR extends JpaRepository<SavingsMovements, Long> {
    boolean existsById(Long id);

    @Query("""
            SELECT COALESCE(SUM(s.amount), 0)
            FROM SavingsMoneyUsers s
            WHERE s.user.id = (SELECT u.id FROM User u WHERE u.email = :email)
        """)
    BigDecimal sumTotalSavingsByEmail(String email);
}
