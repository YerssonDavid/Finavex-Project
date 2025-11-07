package com.semillero.Ibero.Finavex.model;

import com.semillero.Ibero.Finavex.Validated.Create;
import com.semillero.Ibero.Finavex.Validated.Update;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
    // OPCIONAL - Sin @NotBlank porque nullable = true
    private String middleName;

    @Column(name="Apellido", nullable = false, length = 100)
    @NotBlank(groups = {Create.class, Update.class}, message = "El apellido es obligatorio")
    private String surname;

    @Column(name="Segundo Apellido", nullable = true, length = 100)
    // OPCIONAL - Sin validación porque nullable = true
    private String secondSurname;

    @Column(name="age", nullable= false, length=3)
    @NotBlank(groups = {Create.class, Update.class}, message = "La edad es obligatoria")
    private Integer age;

    @Column(name="fecha_nacimiento", nullable = false, length = 8)
    @NotBlank(groups = {Create.class, Update.class}, message = "La fecha de nacimiento es obligatoria")
    private String dateOfBirth;

    @Column(name="telefono", nullable = false, length = 10)
    @NotBlank(groups = {Create.class, Update.class}, message = "El teléfono es obligatorio")
    private String phone;

    @Column(name="email", nullable = false, length = 100, unique = true)
    @NotBlank(groups = {Create.class, Update.class}, message = "El email es obligatorio")
    @Email(groups = {Create.class, Update.class}, message = "Email inválido")
    private String email;

    @Column(name="password", nullable = false, length = 100)
    @NotBlank(groups = {Create.class, Update.class}, message = "La contraseña es obligatoria")
    private String password;

}
