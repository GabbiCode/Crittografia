export class ShiftRows {
    constructor() {
        this.blocco = new Array(4).fill([]).map(() => new Uint8Array(4));
        // quello sopra riportato è solo un esempio
    }
    /**
     * inizializza il blocco su cui verrà eseguita la shift rows
     * @param {*} bits stringa binaria da 128 bit
     */
    init(bits) {
        this.blocco = ShiftRows.divide_rows(bits, 32) // Suddividi in blocchi da 32 bit (128 / 4)
            .map(riga => ShiftRows.divide_rows(riga, 8)); // Suddividi ciascuna riga in byte
        return this;
    }
    /**
     * esegue la shift rows sul blocco generato dopo la init()
     */
    shift(reverse) {
        for (let i = 1; i < 4; i++) {
            for (let j = 0; j < i; j++) {
                if (reverse) {
                    [this.blocco[i][0], this.blocco[i][1], this.blocco[i][2], this.blocco[i][3]] =
                    [this.blocco[i][3], this.blocco[i][0], this.blocco[i][1], this.blocco[i][2]];
                } else {
                    [this.blocco[i][0], this.blocco[i][1], this.blocco[i][2], this.blocco[i][3]] =
                    [this.blocco[i][1], this.blocco[i][2], this.blocco[i][3], this.blocco[i][0]];
                }
            }
        }
        return this;
    }
    /**
     * restituisce il risultato in formato string
     */
    string() {
        return this.blocco.flat().join('');
    }
    /**
     * FUNZIONI STATICHE
     */
    /**
     * suddividi una stringa in parti uguali di lunghezza
     * @param {*} stringa string
     * @param {*} lunghezza intero
     * @returns 
     */
    static divide_rows(stringa, lunghezza) {
        const parti = [];
        for (let i = 0; i < stringa.length; i += lunghezza) {
            parti.push(stringa.slice(i, i + lunghezza));
        }
        return parti;
    }
}