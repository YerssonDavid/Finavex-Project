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
    private String name;

    @Column(name="Segundo Nombre", nullable = true, length = 100)
    private String middleName;

    @Column(name="Apellido", nullable = false, length = 100)
    private String surname;

    @Column(name="Segundo Apellido", nullable = true, length = 100)
    private String secondSurname;

    @Column(name="age", nullable= false, length=3)
    private Integer age;

    @Column(name="fecha_nacimiento", nullable = false, length = 8)
    private String dateOfBirth;

    @Column(name="telefono", nullable = false, length = 10)
    private String phone;

    @Column(name="email", nullable = false, length = 100, unique = true)
    @Email
    private String email;

    @Column(name="password", nullable = false, length = 100)
    private String password;

}
