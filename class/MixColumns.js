import { Funzioni as f } from './Funzioni.js';

export class MixColumns {
    constructor() {
        this.blocco = new Array(4).fill([]).map(() => new Uint8Array(4));
        this.chiave = new Array(4).fill([]).map(() => new Uint8Array(4));
        // quello sopra riportato è solo un esempio
    }
    /**
     * inizializza il blocco su cui verrà eseguita la shift rows
     * @param {*} bits stringa binaria da 128 bit
     */
    init(bits, chiave) {
        this.blocco = bits.match(/.{1,8}/g).map(bin => parseInt(bin, 2));
        this.chiave = chiave.match(/.{1,8}/g).map(bin => parseInt(bin, 2));
        return this;
    }
    /**
     * esegue la mix block tra la chiave e testo tra le colonne
     */
    mix(reverse) {
        let result = '';
        for (let i = 0; i < 16; i++) {
            const bin = MixColumns.moltiplica(this.blocco[i], this.chiave[i], reverse);
            result += bin;
        }
        return result;
    }
    /**
     * FUNZIONI STATICHE
     */
    static moltiplica(bin1, bin2, reverse) {
        const calcolo = (a, b) => {
            return MixColumns.bin(f.proporzione(reverse ? a / b : a * b, 65025, null, 255).toFixed(0), 8);
        }
        const risultato = bin1 >= bin2 ? calcolo(bin1, bin2) : calcolo(bin2, bin1);
        bin1 >= bin2 ? console.log(bin1, bin2) : console.log(bin2, bin1);
        return risultato;
    }
    /**
     * Converte un numero in binario utilizzando n bit
     * @param {*} numero il numero da convertire
     * @param {*} n numero di bit da restituire
     * @returns 
     */
    static bin(numero, n) {
        let binario = (numero >>> 0).toString(2);
        while (binario.length < n) {
            binario = "0" + binario;
        }
        return binario;
    }
}