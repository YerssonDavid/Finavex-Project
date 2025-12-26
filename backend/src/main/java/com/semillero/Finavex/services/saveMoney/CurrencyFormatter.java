package com.semillero.Finavex.services.saveMoney;

import org.springframework.stereotype.Component;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
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

        /*DecimalFormatSymbols symbols = new DecimalFormatSymbols(new Locale("es", "CO"));
        DecimalFormat decimalFormat = new DecimalFormat("#,##0.00", symbols);*/

        NumberFormat decimalFormat = NumberFormat.getNumberInstance(new Locale("es", "CO"));
        return decimalFormat.format(amount);
    }
}

