package com.semillero.Finavex.services.movementsS;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

@Component
public class CurrencyFormatter {

    /**
     * Formatea un BigDecimal a moneda sin símbolo ($)
     * Ejemplo: 14000.00 -> "14.000,00"
     */
    public String formatCurrencyWithoutSymbol(BigDecimal amount) {
        if (amount == null) {
            return "0,00";
        }

        NumberFormat decimalFormat = NumberFormat.getNumberInstance(new Locale("es", "CO"));
        return decimalFormat.format(amount);
    }
}

