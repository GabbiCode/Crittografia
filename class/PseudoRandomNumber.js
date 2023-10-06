export class PseudoRandomNumber {
    constructor() {
        this.x;
        this.n;
        this.a = 1664525;
        this.m = 4503599627370496;
        this.random_numbers = [];
    }
    /*
     * formula : x = (a * x) % m
     * max : 17179869184 ((2 ** 32) * 4)
    */
    init(k, n, reverse = false) {
        this.random_numbers.length = 0;
        let result = 0;
        k = k.match(/.{1,32}/g).map((a) => { result += parseInt(a, 2)});
        this.random_numbers = this.rng(result, n).from_0();
        if (reverse) {
            // Inverti l'array indice
            const invertedIndice = [];
            for (let i = 0; i < n; i++) {
                invertedIndice[this.random_numbers[i]] = i;
            }
            this.random_numbers = invertedIndice;
        }
    }
    rng(x = this.x, n = this.n) {
        for (let i = 0; i < n; i++) {
            x = (this.a * x) % this.m;
            this.random_numbers.push(x);
        }
        return this;
    }
    from_0() {
        const indici = this.random_numbers.map((numero, i) => i).sort((a, b) => {
            return this.random_numbers[a] - this.random_numbers[b];
        });
        return indici;
    }
    /**
     * Permuta a blocchi una stringa binaria utilizzando una chiave
     * @param {*} input binario
     * @param {*} chiave binaria
     * @returns 
     */
    permuta(input) {
        const bits = [...input];
        let risultato = '';
        for (let i = 0; i < input.length; i++) {
            risultato += bits[this.random_numbers[i]];
        }
        return risultato;
    }
}