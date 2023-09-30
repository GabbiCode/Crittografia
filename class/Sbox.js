import { Cripto } from './Cripto.js';

export class Sbox {
    constructor(sbox, reverse_sbox) {
        this.sbox = sbox;
        this.reverse_sbox = reverse_sbox;
        this.cripto = new Cripto();
    }
    /**
     * Sostituzione di una singola stringa da 4 bit
     * @param {*} bit i 4 bit da sostituire
     * @param {*} reverse true per eseguire la funzione inversa false per non eseguirla
     * @returns 
     */
    sostituzione(bit, reverse) {
        const index = parseInt(bit, 2);
        return reverse ? this.reverse_sbox[index] : this.sbox[index];
    }
    /**
     * Sostituzione di un intera stringa binaria
     * @param {*} bits la stringa binaria
     * @param {*} reverse true per eseguire la funzione inversa false per non eseguirla
     * @returns 
     */
    sostituzione_completa(bits, reverse) {
        if (bits.length % 8 != 0) {
            throw new Error('La stringa binaria non è un multiplo di 8');
        }
        bits = bits.match(/.{1,8}/g);
        let result = '';
        for (let i = 0; i < bits.length; i++) {
            const bit_sostituiti = this.sostituzione(bits[i], reverse);
            result += bit_sostituiti;
        }
        return result;
    }
    /**
     * Converte un numero in binario utilizzando n bit
     * @param {*} numero il numero da convertire
     * @param {*} n numero di bit da restituire
     * @returns 
     */
    bin(numero, n) {
        let binario = (numero >>> 0).toString(2);
        while (binario.length < n) {
            binario = "0" + binario;
        }
        return binario;
    }
    /**
     * crea una sbox passando una chiave in forma binaria
     * @param {*} chiave chiave in forma binaria
     * @returns 
     */
    genera_sbox(chiave) {
        const int_array = this.cripto.genera_numeri_seed(chiave, 256);
        const sbox = [];
        const reverse_sbox = [];
        int_array.forEach((n, i) => {
            sbox.push(this.bin(n, 8));
            reverse_sbox[n] = this.bin(i, 8);
        });
        this.sbox = sbox;
        this.reverse_sbox = reverse_sbox;
    }
    /**
     * restituisce le sbox
     * @returns 
     */
    get_sbox() {
        return {
            sbox: this.sbox,
            reverse_sbox: this.reverse_sbox
        }
    }
}