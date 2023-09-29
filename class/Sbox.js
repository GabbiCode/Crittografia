import { OperazioniCrittografiche } from './OperazioniCrittografiche.js';

export class Sbox {
    constructor(sbox, reverse_sbox) {
        this.sbox = sbox;
        this.reverse_sbox = reverse_sbox;
        this.cripto = new OperazioniCrittografiche();
    }
    /**
     * imposta le sbox di default
     */
    default() {
        /*
            Ingresso:  0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15
            Uscita:   14   4  13   1   2  15  11   8   3  10   6  12   5   9   0   7
        */
        this.sbox = [
            "1110", "0100", "1101", "0001",
            "0010", "1111", "1011", "1000",
            "0011", "1010", "0110", "1100",
            "0101", "1001", "0000", "0111"
        ];
        /*
            Ingresso:  0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15
            Uscita:    14  3   4   8   1   12  10  15  7   13  9   6  11   2   0   5
        */
        this.inverse_sbox = [
            '1110', '0011', '0100', '1000',
            '0001', '1100', '1010', '1111',
            '0111', '1101', '1001', '0110',
            '1011', '0010', '0000', '0101'
        ];
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
        if (bits.length % 4 != 0) {
            throw new Error('La stringa binaria non è un multiplo di 4');
        }
        bits = bits.match(/.{1,4}/g);
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
        const int_array = this.cripto.genera_numeri_seed(chiave, 16);
        const sbox = [];
        const reverse_sbox = [];
        int_array.forEach((n, i) => {
            sbox.push(this.bin(n, 4));
            reverse_sbox[n] = this.bin(i, 4);
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