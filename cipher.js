import { OperazioniLogiche } from './class/OperazioniLogiche.js';
import { Codifica } from './class/Codifica.js';
import { OperazioniCrittografiche } from './class/OperazioniCrittografiche.js';
import { Hash } from './class/Hash.js';
import { Sbox } from './class/Sbox.js';

export class Cipher {
    constructor(rounds = 24) {
        this.blocchi = 128;
        this.rounds = rounds;
        this.logica = new OperazioniLogiche();
        this.str = new Codifica();
        this.cripto = new OperazioniCrittografiche();
        this.hash = new Hash();
        this.sbox = new Sbox();
    }
    /**
     * Cifra del testo
     * @param {*} testo stringa
     * @param {*} chiave in formato esadecimale
     */
    cifra(testo, chiave) {
        // rimuovo i caratteri illegali
        testo = this.str.illegal_characters(testo);
        // inizializzo le variabili
        testo = this.str.binario_(testo).string();
        const chiavi = this.cripto.get_3_key(chiave);
        // XOR
        testo = this.deriva(testo, chiavi[0]);
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
            // ---
            testo = this.round(testo, chiave_round, false);
        }
        // SBOX
        this.sbox.genera_sbox(chiavi[2]);
        testo = this.sbox.sostituzione_completa(testo, false);
        // XOR
        testo = this.deriva(testo, chiavi[2]);
        // ultime operazioni
        testo = this.cripto.ultima_fase(testo, lunghezza_blocchi_nulli);
        return testo;
    }
    /**
     * Decifra del testo
     * @param {*} testo stringa base 64
     * @param {*} chiave in formato esadecimale
     */
    decifra(testo, chiave) {
        const testo_bits = this.cripto.split_testo_decifrato(testo);
        const null_bits = parseInt(this.str._hex(testo_bits.bit.match(/\d+/g).join('')).string());
        testo = completa_base_64(testo_bits.testo);
        // inizializzo le variabili
        testo = this.str._base64(testo).binario_().string();
        const chiavi = this.cripto.get_3_key(chiave);
        // XOR
        testo = this.deriva(testo, chiavi[2]);
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
        // PERMUTO
        for (let i = 0; i < this.rounds; i++) {
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
        // XOR
        testo = this.deriva(testo, chiavi[0]);
        // converto in formato normale
        testo = this.str._binario(testo).string();
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
        testo = this.cripto.blocks(testo, this.blocchi).blocks;
        const blocchi_cifrati = [];
        for (let i = 0; i < testo.length; i++) {
            const mixed_bits = this.cripto.permuta(testo[i], chiave, reverse);
            blocchi_cifrati.push(mixed_bits);
        }
        return blocchi_cifrati.join('');
    }
    /**
     * deriva una stringa binaria eseguendo delle xor
     * @param {*} chiave1 
     * @param {*} chiave2 
     * @returns 
     */
    deriva(chiave1, chiave2) {
        let result = '';
        for (let i = 0; i < chiave1.length; i++) {
            result += this.logica.xor(chiave1[i], chiave2[i % chiave2.length]).string();
        }
        return result;
    }
}