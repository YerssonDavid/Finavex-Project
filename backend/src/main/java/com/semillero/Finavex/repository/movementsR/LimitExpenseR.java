package com.semillero.Finavex.repository.movementsR;

import com.semillero.Finavex.dto.movementsMoney.limitExpense.ResponseDataRegistryDataBase;
import com.semillero.Finavex.entity.movements.LimitExpense;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LimitExpenseR extends JpaRepository<LimitExpense, Long> {

    @Query("SELECT new com.semillero.Finavex.dto.movementsMoney.limitExpense.ResponseDataRegistryDataBase(l.valueLimit, l.expirationDate, l.dateRegistryLimit) " +
           "FROM LimitExpense l WHERE l.idUser.id = :idUser")
    ResponseDataRegistryDataBase findByIdUser_Id(@Param("idUser") Long idUser);
}
