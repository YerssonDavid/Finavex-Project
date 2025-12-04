package com.semillero.Finavex.repository;

import com.semillero.Finavex.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserR extends JpaRepository<User, Long> {

    //Buscar por cedula
    boolean existsByDocumentNumber(String documentNumber);

    //Buscar por correo
    boolean existsByEmail(String email);

    User findByEmail(String email);
}
