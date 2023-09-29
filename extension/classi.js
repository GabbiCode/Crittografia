/**
 * funzioni aggiuntive
 */
function proporzione(x, y, c, v) {
    if (x === null) {
        // Calcola x
        return (c * y) / v;
    } else if (y === null) {
        // Calcola y
        return (x * v) / c;
    } else if (c === null) {
        // Calcola c
        return (x * v) / y;
    } else if (v === null) {
        // Calcola v
        return (c * y) / x;
    } else {
        // Proporzioni non valide
        throw new Error("Proporzioni non valide");
    }
}

/** 
 * completa una stringa base 64
*/
function completa_base_64(base64String) {
    const lunghezzaStringa = base64String.length;
    const caratteriMancanti = 4 - (lunghezzaStringa % 4);
    if (caratteriMancanti === 4) {
        // La stringa Base64 è già completa, quindi non è necessario fare nulla.
        return base64String;
    }
    // Aggiungi i caratteri "=" mancanti alla fine della stringa.
    return base64String + "=".repeat(caratteriMancanti);
}