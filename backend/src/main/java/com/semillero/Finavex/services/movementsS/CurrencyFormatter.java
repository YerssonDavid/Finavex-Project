package com.semillero.Finavex.services.movementsS;

import org.springframework.stereotype.Component;
import java.text.NumberFormat;
import java.util.Locale;

@Component
public class CurrencyFormatter {

    /**
     * Formatea un Double a moneda sin símbolo ($)
     * Ejemplo: 14000.00 -> "14.000,00"
     */
    public String formatCurrencyWithoutSymbol(Double amount) {
        if (amount == null) {
            return "0,00";
        }

        NumberFormat decimalFormat = NumberFormat.getNumberInstance(new Locale("es", "CO"));
        return decimalFormat.format(amount);
    }
}

