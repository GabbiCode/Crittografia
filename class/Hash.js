export class Hash {
    /**
     * genera hash in base ai parametri passati dalla funzione
     * @param {*} testo 
     * @param {*} bit 
     * @param {*} codifica TEXT, HEX, B64 || BASE64
     * @param {*} codifica_output 
     * @returns 
     */
    hash(testo, bit, codifica) {
        const shaObj = new jsSHA(bit, codifica);
        shaObj.update(testo);
        return shaObj.getHash('HEX');
    }
    _256(testo, codifica) {
        return this.hash(testo, 'SHA-256', codifica);
    }
    _384(testo, codifica) {
        return this.hash(testo, 'SHA-384', codifica);
    }
    _512(testo, codifica) {
        return this.hash(testo, 'SHA-512', codifica);
    }
    /**
     * Genera chiave da 128 con uno degli algoritmi di hash
     * @param {*} by_using Quale codifica usare per generare la chiave da 128 bit
     * @param {*} posizione inizio = 0, centro = 1, fine = 2
     */
    _128(hash, posizione = 0) {
        return this.sub_keys(hash, 128, posizione);
    }
    /**
     * Restituisce una delle 3 chiavi generate
     * @param {*} hash 
     * @param {*} posizione 
     * @returns 
     */
    sub_keys(hash, key_length, posizione) {
        key_length /= 4;
        if (key_length <= 0 || key_length > hash.length) {
            throw new Error("Lunghezza della chiave non valida.");
        }
        switch (posizione) {
            case 0: // Inizio
                return hash.slice(0, key_length);
            case 1: // Centro
                const start = Math.max(0, Math.floor((hash.length - key_length) / 2));
                return hash.slice(start, start + key_length);
            case 2: // Fine
                return hash.slice(hash.length - key_length);
            default:
                return hash; // Valore di default: restituisci la stringa iniziale
        }
    }
}