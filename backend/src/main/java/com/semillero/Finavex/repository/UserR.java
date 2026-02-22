package com.semillero.Finavex.repository;

import com.semillero.Finavex.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserR extends JpaRepository<User, Long> {

    //Buscar por cedula
    boolean existsByDocumentNumber(String documentNumber);

    //Buscar por correo
    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    //Find by number phone
    boolean existsByPhone(String phone);

    String email(String email);

    @Query("""
            SELECT u.id
            FROM User u
            WHERE u.email = :email
    """)
    Long getIdByEmail(String email);
}
