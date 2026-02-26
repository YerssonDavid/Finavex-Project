package com.semillero.Finavex.entity;

import com.semillero.Finavex.Validated.Create;
import com.semillero.Finavex.Validated.Update;
import com.semillero.Finavex.entity.movements.MoneyNow;
import com.semillero.Finavex.entity.movements.SavingsMoneyUsers;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@ToString(exclude="password")
@Table(name= "users")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="name", nullable = false, length = 100)
    @NotBlank(groups = {Create.class, Update.class}, message = "El nombre es obligatorio")
    @Pattern(regexp = "^[a-zA-Z áéíóúÁÉÍÓÚñÑ]+$", message="El nombre es invalido!")
    private String name;

    @Column(name="middle_name", nullable = true, length = 100)
    @Pattern(regexp = "^[a-zA-Z áéíóúÁÉÍÓÚñÑ]+$", message="El nombre es invalido!")
    private String middleName;

    @Column(name="last_name", nullable = false, length = 100)
    @NotBlank(groups = {Create.class, Update.class}, message = "El apellido es obligatorio")
    @Pattern(regexp = "^[a-zA-Z áéíóúÁÉÍÓÚñÑ]+$", message="El nombre es invalido!")
    private String surname;

    @Column(name="second_surname", nullable = true, length = 100)
    @Pattern(regexp = "^[a-zA-Z áéíóúÁÉÍÓÚñÑ]+$", message="El nombre es invalido!")
    private String secondSurname;

    @Column(name="document_number", nullable = false, length = 11, unique = true)
    @NotBlank(groups={Create.class, Update.class}, message = "El número de documento es obligatorio")
    private String documentNumber;

    @Column(name="age", nullable= false)
    @NotNull(groups = {Create.class, Update.class}, message = "La edad es obligatoria")
    @Min(value = 18, groups = {Create.class, Update.class}, message = "La edad debe ser mayor a 18")
    private Integer age;

    @Column(name="date_of_birth", nullable = false, length = 10)
    @NotBlank(groups = {Create.class, Update.class}, message = "La fecha de nacimiento es obligatoria")
    private String dateOfBirth;

    @Column(name="phone", nullable = false, length = 10)
    @NotBlank(groups = {Create.class, Update.class}, message = "El teléfono es obligatorio")
    private String phone;

    @Column(name="email", nullable = false, length = 150, unique = true)
    @NotBlank(groups = {Create.class, Update.class}, message = "El email es obligatorio")
    @Email(groups = {Create.class, Update.class}, message = "Email inválido")
    private String email;

    @PrePersist
    @PreUpdate
    public void normalizeEmail(){
        if(this.email != null){
            this.email = this.email.trim().toLowerCase();
        }
    }

    @Column(name="password", nullable = false, length = 100)
    @NotBlank(groups = {Create.class, Update.class}, message = "La contraseña es obligatoria")
    private String password;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    //Guarda el registro en la tabla MoneyNow con una relación uno a uno
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private MoneyNow moneyNow;

    // Guardamos el registro de los ahorros del usuario en la tabla SavingsMoneyUsers con una relación uno a muchos
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SavingsMoneyUsers> savingsMoneyUsers;
}
