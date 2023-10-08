export class Logica {
    constructor() {  }
    /**
     * il bit1 viene restituito come risultato
     */
    and(bit0, bit1) {
        bit0 = parseInt(bit0);
        bit1 = parseInt(bit1);
        return bit0 && bit1;
    }
    or(bit0, bit1) {
        bit0 = parseInt(bit0);
        bit1 = parseInt(bit1);
        return bit0 || bit1;
    }
    xor(bit0, bit1) {
        bit0 = parseInt(bit0);
        bit1 = parseInt(bit1);
        return bit0 ^ bit1;
    }
    not(bit) {
        bit = parseInt(bit);
        return !bit;
    }
}