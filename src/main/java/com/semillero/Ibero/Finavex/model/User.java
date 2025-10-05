package com.semillero.Ibero.Finavex.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Entity
@Data
@Table(name= "Usuarios")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name="email", nullable = false, length = 100, unique = true)
    @Email
    private String email;

    @Column(name="fecha_nacimiento", nullable = false, length = 8)
    private String fechaNacimiento;

    @Column(name="password", nullable = false, length = 100)
    private String password;

    @Column(name="telefono", nullable = false, length = 10)
    private String telefono;
}
