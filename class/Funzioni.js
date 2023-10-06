export class Funzioni {
    /**
     * Proporzione
     * @returns 
     */
    static proporzione(x, y, c, v) {
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
            return null;
        }
    }
}