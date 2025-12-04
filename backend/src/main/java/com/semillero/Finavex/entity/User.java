package com.semillero.Finavex.entity;

import com.semillero.Finavex.Validated.Create;
import com.semillero.Finavex.Validated.Update;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
@Table(name= "Usuarios")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="nombre", nullable = false, length = 100)
    @NotBlank(groups = {Create.class, Update.class}, message = "El nombre es obligatorio")
    private String name;

    @Column(name="Segundo Nombre", nullable = true, length = 100)
    private String middleName;

    @Column(name="Apellido", nullable = false, length = 100)
    @NotBlank(groups = {Create.class, Update.class}, message = "El apellido es obligatorio")
    private String surname;

    @Column(name="Segundo Apellido", nullable = true, length = 100)
    private String secondSurname;

    @Column(name="Numero_Documento", nullable = false, length = 11, unique = true)
    @NotBlank(groups={Create.class, Update.class}, message = "El número de documento es obligatorio")
    private String documentNumber;

    @Column(name="age", nullable= false)
    @NotNull(groups = {Create.class, Update.class}, message = "La edad es obligatoria")
    @Min(value = 18, groups = {Create.class, Update.class}, message = "La edad debe ser mayor a 18")
    private Integer age;

    @Column(name="fecha_nacimiento", nullable = false, length = 10)
    @NotBlank(groups = {Create.class, Update.class}, message = "La fecha de nacimiento es obligatoria")
    private String dateOfBirth;

    @Column(name="telefono", nullable = false, length = 10)
    @NotBlank(groups = {Create.class, Update.class}, message = "El teléfono es obligatorio")
    private String phone;

    @Column(name="email", nullable = false, length = 150, unique = true)
    @NotBlank(groups = {Create.class, Update.class}, message = "El email es obligatorio")
    @Email(groups = {Create.class, Update.class}, message = "Email inválido")
    private String email;

    @Column(name="password", nullable = false, length = 100)
    @NotBlank(groups = {Create.class, Update.class}, message = "La contraseña es obligatoria")
    private String password;

    @Column(name="numero-intentos-contraseña", nullable = false)
    private Integer numberAttemptPassword = 0;

}
