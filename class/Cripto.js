import { Codifica } from './Codifica.js';
import { Logica } from './Logica.js';

export class Cripto {
    constructor() {
        this.str = new Codifica();
        this.logica = new Logica();
    }
    /**
     * suddivide la stringa binaria in blocchi di ugual misura
     * @param {*} bits 
     * @param {*} blockSize 
     * @returns 
    */
    blocks(bits, dimensione = 128) {
        const blocks = [];
        let lunghezza_ultimo_blocco = 0;
        // Dividi la stringa dei bit in blocchi di lunghezza blockSize
        for (let i = 0; i < bits.length; i += dimensione) {
            let block = bits.slice(i, i + dimensione);
            // Aggiungi zeri se il blocco non è esattamente di blockSize bit
            while (block.length < dimensione) {
                block += '0';
                lunghezza_ultimo_blocco++;
            }
            blocks.push(block);
        }
        return {
            testo: blocks,
            len: lunghezza_ultimo_blocco
        };
    }
    /**
     * rimuove i caratteri nulli
     */
    rimuovi_nulli(bits, n) {
        if (n == 0) {
            return bits;
        } else {
            return bits.slice(0, -n);
        }
    }
    /**
     * genera 3 chiavi
     */
    get_3_key(input) {
        // Crea un oggetto jsSHA per l'hash SHA-384
        const sha = new jsSHA('SHA-512', 'HEX');
        // Aggiungi l'input da hashare
        sha.update(input);
        // Calcola l'hash SHA-384
        const hash = sha.getHash('HEX');
        // Dividi l'hash in 4 parti uguali (ognuna da 128 bit)
        const sub_keys = hash.match(/.{32}/g);
        const main_key = sub_keys[1] + sub_keys[2];
        const subKeys = [
            this.str._hex(sub_keys[0]).binario_().string(),
            main_key,
            this.str._hex(sub_keys[3]).binario_().string()
        ];
        return subKeys;
    }
    /**
     * genera una chiave crittografica casuale
     * @param {*} bitLength valgono le potenze di due
     * @returns 
     */
    generate_encryption_key(bitLength = 128) {
        if (bitLength % 32 != 0) {
            throw new Error("Il numero di bit deve essere una potenza di 2 e maggiore o uguale a 32 bit");
        }
        // Genera un array di byte casuali
        const randomBytes = new Uint8Array(bitLength / 8);
        window.crypto.getRandomValues(randomBytes);
        // Converti l'array di byte in formato esadecimale (hex)
        const keyHex = Array.from(randomBytes)
            .map((byte) => byte.toString(16).padStart(2, "0"))
            .join("");
        return keyHex;
    }
    /**
     * restituisce la stringa divisa dall'ultimo '=' per identificare 
     * dove è scritto il numero di byte da rimuovere durante la decifratura
     * @param {*} inputString 
     * @returns 
     */
    split_testo_decifrato(inputString) {
        inputString = inputString.replaceAll('=', '');
        const bit = inputString.slice(-24); // Ottieni gli ultimi 24 caratteri
        const testo = inputString.slice(0, -24); // Ottieni i caratteri rimanenti
        return {
            testo: testo,
            bit: bit
        };
    }
    /**
    * FUNZIONE CHE CREA UN ID DA N CARATTERI
    */
    generaKeyN(n) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;
        for (let i = 0; i < n; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    /** 
    * completa una stringa base 64
    */
    completa_base_64(base64String) {
        const lunghezzaStringa = base64String.length;
        const caratteriMancanti = 4 - (lunghezzaStringa % 4);
        if (caratteriMancanti === 4) {
            // La stringa Base64 è già completa, quindi non è necessario fare nulla.
            return base64String;
        }
        // Aggiungi i caratteri "=" mancanti alla fine della stringa.
        return base64String + "=".repeat(caratteriMancanti);
    }
    /**
     * mescola il numero di byte nulli nella stringa cifrata
     */
    mescola_byte_nulli(bit, stringa) {
        stringa = [...stringa];
        let posizioni = [];
        // genero le posizioni
        for (let i = 0; i < bit.length; i++) {
            let posizione_casuale = Math.floor(Math.random() * stringa.length);
            while (posizioni.indexOf(posizione_casuale) !== -1) {
                posizione_casuale = Math.floor(Math.random() * stringa.length);
            }
            posizioni.push(posizione_casuale);
        }
        const posizioni_ordinate = posizioni.sort((a, b) => { return a - b });
        posizioni_ordinate.forEach((posizione, i) => {
            stringa.splice((posizione + i), 0, bit[i]);
        });
        stringa = stringa.join('');
        return stringa;
    }
    /**
     * completa l'ultima fase della cifratura
     */
    ultima_fase_cifratura(testo, lunghezza_ultimo_blocco) {
        // converti in base 64
        testo = this.str._binario(testo).base64_().string();
        // eseguo uno split degli =
        testo = testo.split("=");
        // gestisco i bit nulli
        const conteggio = testo.length - 1;
        let null_bits = this.str.hex_(lunghezza_ultimo_blocco.toString()).string();
        const caratteri_nulli_aggiuntivi = 24 - null_bits.length;
        null_bits = this.mescola_byte_nulli(null_bits, this.generaKeyN(caratteri_nulli_aggiuntivi));
        // inserisco gli = al fondo della stringa
        testo = testo.join('') + null_bits + "=".repeat(conteggio);
        return testo;
    }
    /**
     * deriva una stringa binaria eseguendo delle xor
     * @param {*} chiave1 
     * @param {*} chiave2 
     * @returns 
     */
    xor_parziale(chiave1, chiave2) {
        let result = '';
        for (let i = 0; i < chiave1.length; i++) {
            result += this.logica.xor(chiave1[i], chiave2[i % chiave2.length]);
        }
        return result;
    }
    /**
     * deriva una stringa binaria eseguendo delle xor in maniera completa
     * il numero di bit degli argomenti deve essere lo stesso
     * @param {*} chiave1 
     * @param {*} chiave2 
     * @returns 
     */
    xor_completa(chiave1, chiave2) {
        let result = '';
        for (let i = 0; i < chiave1.length; i++) {
            result += this.logica.xor(chiave1[i], chiave2[i]);
        }
        return result;
    }
}
