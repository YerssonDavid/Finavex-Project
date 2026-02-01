package com.semillero.Finavex.repository.movementsR;

import com.semillero.Finavex.dto.movementsMoney.ResponseGetMovements;
import com.semillero.Finavex.entity.movements.SaveMoney;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;

public interface SaveR extends JpaRepository<SaveMoney, Long> {

    @Query("""
                SELECT COALESCE(SUM(m.amount), 0)
                FROM SaveMoney m
                WHERE m.user.id = (SELECT u.id FROM User u WHERE u.email = :email)
                  AND m.date >= :start
                  AND m.date < :end
            """)

    Double sumByPeriod(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("email") String email
    );

    //Exist user by Email
    @Query("""
            SELECT COUNT(m) > 0
            FROM SaveMoney m
            WHERE m.user.id = (SELECT u.id FROM User u WHERE u.email = :email)
        """)
    boolean existsByEmail(@Param("email") String email);


    @Query("""
                    SELECT new com.semillero.Finavex.dto.movementsMoney.ResponseGetMovements(
                    'INCOME',
                    s.date,
                    s.noteMovement,
                    s.amount
                    )
                    FROM SaveMoney s
                    WHERE s.user.id = :userId
                    AND s.date >= :startDate
                    ORDER BY s.date DESC
            """)
    Collection<ResponseGetMovements> findMovementsByUserId(
            @Param("userId") Long userId,
            @Param("startDate") LocalDateTime startDate
    );
}

