package com.semillero.Finavex.repository.movementsR;

import com.semillero.Finavex.entity.User;
import com.semillero.Finavex.entity.movements.SavingsPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface SavingsPlanR extends JpaRepository <SavingsPlan, Long> {
    @Query("""
            SELECT sp
            FROM SavingsPlan sp
            WHERE sp.user.id = :id
""")
    List<SavingsPlan> getSavingsPlanByUserId (Long id);

    boolean existsByUserId(Long id);

}
