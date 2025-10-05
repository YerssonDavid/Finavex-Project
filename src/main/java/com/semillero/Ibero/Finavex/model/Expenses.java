package com.semillero.Ibero.Finavex.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Table(name= "compras")
@Entity
public class Expenses {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_registro_compra;

    @Column(name="Cantidad_compra", nullable = false)
    private Integer cantidad_compra;

    @Column(name="fecha_registro_compra", nullable = false, length = 8)
    private String fecha_registro_compra;

    @JoinColumn(name="id_usuario", nullable = false)
    @ManyToOne
    private User usuario;
}
