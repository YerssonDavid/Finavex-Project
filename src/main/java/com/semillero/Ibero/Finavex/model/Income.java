package com.semillero.Ibero.Finavex.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Table(name= "Ingresos")
@Entity
public class Income {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_registro_ingreso;

    @Column(name="Cantidad", nullable = false)
    private Long Cantidad;

    @Column(name="fecha_registro_ingreso", nullable = false, length = 8)
    private String fecha_registro_ingreso;

    @JoinColumn(name="id_usuario", nullable = false)
    @ManyToOne
    private User usuario;
}
