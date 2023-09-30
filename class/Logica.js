export class Logica {
    constructor() {
        this.bit = null;
        this.bit0 = false;
        this.bit1 = false;
    }
    check(bit) {
        if (typeof bit === 'number' || typeof bit === 'string') {
            if (bit === '1' || bit === 'true' || bit == 1) {
                bit = true;
            } else if (bit === '0' || bit === 'false' || bit == 0) {
                bit = false;
            } else {
                throw new Error('Input non valido. Utilizzare solo booleani, "1", "0", "true" o "false" come bit.');
            }
        }
        return bit;
    }
    /**
     * inizializza bit
     */
    init(bit0 = null, bit1 = null) {
        // bit 0
        if (bit0 != null) this.bit0 = this.check(bit0);
        // bit 1
        if (bit1 != null) this.bit1 = this.check(bit1);
    }
    /**
     * resetta impostazioni
     */
    reset() {
        this.bit = null;
        this.bit0 = false;
        this.bit1 = false;
    }
    /**
     * il bit1 viene restituito come risultato
     */
    and(bit0 = this.bit0, bit1 = this.bit) {
        this.init(bit0, bit1);
        this.bit = bit0 && bit1;
        return this;
    }
    or(bit0 = this.bit0, bit1 = this.bit) {
        this.init(bit0, bit1);
        this.bit = bit0 || bit1;
        return this;
    }
    xor(bit0 = this.bit0, bit1 = this.bit) {
        this.init(bit0, bit1);
        this.bit = this.bit0 ^ this.bit1 ? true : false;
        return this;
    }
    not(bit0 = this.bit) {
        this.init(bit0);
        this.bit = !this.bit0;
        return this;
    }
    string() {
        return this.bit ? 1 : 0;
    }
}