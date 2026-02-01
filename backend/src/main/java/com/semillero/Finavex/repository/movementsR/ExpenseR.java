package com.semillero.Finavex.repository.movementsR;

import com.semillero.Finavex.dto.movementsMoney.ResponseGetMovements;
import com.semillero.Finavex.entity.movements.RegisterExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;

@Repository
public interface ExpenseR extends JpaRepository<RegisterExpense, Long> {
    @Query("""
                SELECT COALESCE(SUM(m.amount), 0)
                FROM RegisterExpense m
                WHERE m.user.id = (SELECT u.id FROM User u WHERE u.email = :email)
                        AND m.date >= :start
                        AND m.date < :end
            """)

    Double sumByPeriod(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("email") String email
    );

    @Query("SELECT u.id FROM User u WHERE u.email = :email")
    Long idByEmail(@Param("email") String email);


    @Query("""
            SELECT new com.semillero.Finavex.dto.movementsMoney.ResponseGetMovements(
                        'EXPENSE',
                         e.date,
                         e.noteMovement,
                         e.amount
                         )
                        FROM RegisterExpense e
                        WHERE e.user.id = :userId
                        AND e.date >= :startDate
                        ORDER BY e.date DESC
                        """)
    Collection<ResponseGetMovements> findMovementsByUserId(
            @Param("userId") Long userId,
            @Param("startDate") LocalDateTime startDate
    );
}

