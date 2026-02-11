package com.semillero.Finavex.repository.movementsR;

import com.semillero.Finavex.entity.movements.SavingsPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SavingsPlanR extends JpaRepository <SavingsPlan, Long> {
    @Query("""
            SELECT sp
            FROM SavingsPlan sp
            JOIN sp.userId u
            WHERE u.id = :id
""")
    SavingsPlan getSavingsPlanByUserId (Long id);
}
