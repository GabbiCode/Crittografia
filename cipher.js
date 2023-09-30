import { Logica } from './class/Logica.js';
import { Codifica } from './class/Codifica.js';
import { Cripto } from './class/Cripto.js';
import { Hash } from './class/Hash.js';
import { Sbox } from './class/Sbox.js';

export {
    Logica,
    Codifica,
    Cripto,
    Hash,
    Sbox
};

export class Cipher {
    constructor(rounds = 24) {
        this.blocchi = 128;
        this.rounds = rounds;
        this.logica = new Logica();
        this.str = new Codifica();
        this.cripto = new Cripto();
        this.hash = new Hash();
        this.sbox = new Sbox();
    }
    /**
     * Utilizza questo metodo per gestire gli errori durante la cifratura
     */
    encrypt(testo, chiave) {
        try {
            return this.cifrario_(testo, chiave);
        } catch (error) {
            console.log("Errore durante la cifratura: " + error);
            return ':(';
        }
    }
    /**
     * Utilizza questo metodo per gestire gli errori durante la decifratura
     */
    decrypt(testo, chiave) {
        try {
            return this._cifrario(testo, chiave);
        } catch (error) {
            console.log("Errore durante la decifratura: " + error);
            return ':(';
        }
    }
    /**
     * Cifra del testo
     * @param {*} testo stringa
     * @param {*} chiave in formato esadecimale
     */
    cifrario_(testo, chiave) {
        // inizializzo le variabili
        testo = this.str.utf8_(testo).binario_().string();
        const chiavi = this.cripto.get_3_key(chiave);
        // XOR PARZIALE
        testo = this.cripto.xor_parziale(testo, chiavi[0]);
        // SBOX
        this.sbox.genera_sbox(chiavi[0]);
        testo = this.sbox.sostituzione_completa(testo, false);
        // LENGTH BLOCCHI NULLI
        const lunghezza_blocchi_nulli = this.cripto.blocks(testo, this.blocchi).len;
        // ROUND
        let chiave_round = chiavi[1];
        // ---
        for (let i = 0; i < this.rounds; i++) {
            // CHIAVE
            const nuova_chiave = this.chiave_round(chiave_round, i);
            chiave_round = nuova_chiave.binario;
            // SBOX
            this.sbox.genera_sbox(chiave_round);
            testo = this.sbox.sostituzione_completa(testo, false);
            // PERMUTA
            testo = this.round(testo, chiave_round, false);
        }
        // SBOX
        this.sbox.genera_sbox(chiavi[2]);
        testo = this.sbox.sostituzione_completa(testo, false);
        // XOR PARZIALE
        testo = this.cripto.xor_parziale(testo, chiavi[2]);
        // ultime operazioni
        testo = this.cripto.ultima_fase(testo, lunghezza_blocchi_nulli);
        return testo;
    }
    /**
     * Decifra del testo
     * @param {*} testo stringa base 64
     * @param {*} chiave in formato esadecimale
     */
    _cifrario(testo, chiave) {
        // calcolo i bit nulli
        const testo_bits = this.cripto.split_testo_decifrato(testo);
        const null_bits = parseInt(this.str._hex(testo_bits.bit.match(/\d+/g).join('')).string());
        testo = this.cripto.completa_base_64(testo_bits.testo);
        // inizializzo le variabili
        testo = this.str._base64(testo).binario_().string();
        const chiavi = this.cripto.get_3_key(chiave);
        // XOR PARZIALE
        testo = this.cripto.xor_parziale(testo, chiavi[2]);
        // SBOX
        this.sbox.genera_sbox(chiavi[2]);
        testo = this.sbox.sostituzione_completa(testo, true);
        // ROUND
        let chiave_round = chiavi[1];
        // pre calcola le chiavi
        const chiavi_decifratura = [];
        for (let i = 0; i < this.rounds; i++) {
            const nuova_chiave = this.chiave_round(chiave_round, i);
            chiave_round = nuova_chiave.binario;
            chiavi_decifratura.push(chiave_round);
        }
        chiavi_decifratura.reverse();
        // ROUNDS
        for (let i = 0; i < this.rounds; i++) {
            // PERMUTA
            testo = this.round(testo, chiavi_decifratura[i], true);
            // SBOX
            this.sbox.genera_sbox(chiavi_decifratura[i]);
            testo = this.sbox.sostituzione_completa(testo, true);
        }
        // SBOX
        this.sbox.genera_sbox(chiavi[0]);
        testo = this.sbox.sostituzione_completa(testo, true);
        // rimuovo caratteri nulli
        testo = this.cripto.rimuovi_nulli(testo, null_bits);
        // XOR PARZIALE
        testo = this.cripto.xor_parziale(testo, chiavi[0]);
        // converto in formato normale
        testo = this.str._binario(testo)._utf8().string();
        return testo;
    }
    /**
     * chiavi round
     * @param {*} chiave in binario
     * @param {*} indice numero
     */
    chiave_round(chiave, indice) {
        chiave = this.str._binario(chiave).string();
        chiave = this.hash._256(chiave + indice, 'TEXT');
        chiave = this.hash._128(chiave, 1);
        const chiave_binaria = this.str._hex(chiave).binario_().string();
        return {
            hex: chiave,
            binario: chiave_binaria
        }
    }
    /**
     * esegue un round
     * @param {*} testo stringa binaria completa
     * @param {*} chiave 
     * @returns 
     */
    round(testo, chiave, reverse) {
        // genero i blocchi
        testo = this.cripto.blocks(testo, this.blocchi).blocks;
        const blocchi_cifrati = [];
        for (let i = 0; i < testo.length; i++) {
            /** reverse ?
             * true => xor -> permuta
             * false => permuta -> xor 
            */
            const operazione = reverse
                ? (t) => this.permuta_round(this.xor_round(testo[i], chiave), chiave, reverse)
                : (t) => this.xor_round(this.permuta_round(testo[i], chiave, reverse), chiave);
            blocchi_cifrati.push(operazione(testo[i]));
        }
        // restituisco il testo unito
        return blocchi_cifrati.join('');
    }
    /**
     * XOR utilizzata in round
     */
    xor_round = (t, c) => {
        return this.cripto.xor_completa(t, c);
    }
    /**
     * PERMUTA utilizzata in round
     */
    permuta_round = (t, c, r) => {
        return this.cripto.permuta(t, c, r);
    }
    /**
     * esegue il log per controllare lo stato 
     */
    check(testo) {
        console.log(this.str._binario(testo).base64_().string());
    }
}