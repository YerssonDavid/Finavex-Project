package com.semillero.Finavex.repository;

import com.semillero.Finavex.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserR extends JpaRepository<User, Long> {

    //Buscar por cedula
    boolean existsByDocumentNumber(String documentNumber);

    //Buscar por correo
    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);
}
