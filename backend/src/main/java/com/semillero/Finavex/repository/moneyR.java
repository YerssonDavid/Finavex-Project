package com.semillero.Finavex.repository;

import com.semillero.Finavex.entity.SaveMoney;
import org.springframework.data.jpa.repository.JpaRepository;

public interface moneyR extends JpaRepository<SaveMoney, Long> {
}
