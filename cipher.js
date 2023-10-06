import { Logica } from './class/Logica.js';
import { Codifica } from './class/Codifica.js';
import { Cripto } from './class/Cripto.js';
import { Hash } from './class/Hash.js';
import { Sbox } from './class/Sbox.js';
import { ShiftRows } from './class/ShiftRows.js';
import { MixColumns } from './class/MixColumns.js';
import { PseudoRandomNumber } from './class/PseudoRandomNumber.js';

export {
    Logica,
    Codifica,
    Cripto,
    Hash,
    Sbox,
    ShiftRows,
    MixColumns,
    PseudoRandomNumber
};

export class Hexagon {
    constructor(rounds = 12) {
        this.blocchi = 128;
        this.rounds = rounds;
        this.logica = new Logica();
        this.str = new Codifica();
        this.cripto = new Cripto();
        this.hash = new Hash();
        this.sbox = new Sbox();
        this.shift_rows = new ShiftRows();
        this.prn = new PseudoRandomNumber();
        this.reverse = false;
    }
    /**
     * Utilizza questo metodo per gestire gli errori durante la cifratura
     */
    encrypt(testo, chiave) {
        const startTime = performance.now();
        const testo_cifrato = this.hexagon_encrypt(testo, chiave);
        try {
            const endTime = performance.now();
            const tempoTrascorso = endTime - startTime;
            $('#tempo_di_cifratura').html(`${tempoTrascorso.toFixed(3)} ms`);
            return testo_cifrato;
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
            return this.hexagon_decrypt(testo, chiave);
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
    hexagon_encrypt(testo, chiave) {
        // inizializzo le variabili
        this.reverse = false;
        testo = this.str.utf8_(testo).binario_().string();
        const chiavi = this.cripto.get_3_key(chiave);
        // CHIAVE 0
        // XOR PARZIALE
        testo = this.cripto.xor_parziale(testo, chiavi[0]);
        // --------
        // LENGTH BLOCCHI NULLI
        const suddivisione_in_blocchi = this.cripto.blocks(testo, this.blocchi);
        const lunghezza_blocchi_nulli = suddivisione_in_blocchi.len;
        testo = suddivisione_in_blocchi.testo;
        // CHIAVE 1
        // ROUND
        const chiavi_cifratura = this.calcola_chiavi_round(chiavi[1]);
        for (let i = 0; i < this.rounds; i++) {
            // XOR, SHIFT, SBOX
            testo = this.round(testo, chiavi_cifratura[i]);
        }
        testo = testo.join('');
        // --------
        // CHIAVE 2
        // XOR PARZIALE
        testo = this.cripto.xor_parziale(testo, chiavi[2]);
        // ultime operazioni
        testo = this.cripto.ultima_fase_cifratura(testo, lunghezza_blocchi_nulli);
        return testo;
    }
    /**
     * Decifra del testo
     * @param {*} testo stringa base 64
     * @param {*} chiave in formato esadecimale
     */
    hexagon_decrypt(testo, chiave) {
        // calcolo i bit nulli
        const testo_bits = this.cripto.split_testo_decifrato(testo);
        const null_bits = parseInt(this.str._hex(testo_bits.bit.match(/\d+/g).join('')).string());
        testo = this.cripto.completa_base_64(testo_bits.testo);
        // inizializzo le variabili
        this.reverse = true;
        testo = this.str._base64(testo).binario_().string();
        const chiavi = this.cripto.get_3_key(chiave);
        // CHIAVE 0
        // XOR PARZIALE
        testo = this.cripto.xor_parziale(testo, chiavi[2]);
        // --------
        testo = this.cripto.blocks(testo, this.blocchi).testo;
        // CHIAVE 1
        // pre calcola le chiavi
        const chiavi_decifratura = this.calcola_chiavi_round(chiavi[1], true);
        // ROUNDS
        for (let i = 0; i < this.rounds; i++) {
            // SBOX, SHIFT, XOR
            testo = this.round(testo, chiavi_decifratura[i], true);
        }
        testo = testo.join('');
        // --------
        // CHIAVE 2
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
     */
    chiave_round(chiave) {
        chiave = this.hash._256(chiave, 'HEX');
        chiave = this.str._hex(chiave).binario_().string();
        return chiave;
    }
    /**
     * calcola le chiavi per la cifratura / decifratura
     */
    calcola_chiavi_round(chiave) {
        const chiavi = [];
        for (let i = 0; i < this.rounds; i++) {
            chiave = this.chiave_round(chiave);
            chiavi.push(chiave.match(/.{1,128}/g));
        }
        return this.reverse ? chiavi.reverse() : chiavi;
    }
    /**
     * esegue un round
     * @param {*} testo stringa binaria completa
     * @param {*} chiave 
     * @returns 
     */
    round(testo, chiave) {
        this.prn.init(chiave[0], 128, this.reverse);
        for (let i = 0; i < testo.length; i++) {
            /** reverse ?
             *  true => sbox -> shift -> xor -> permuta
             * false => permuta -> xor -> shift -> sbox
            */
            const chiave_round = i % 2 == 0 ? chiave[0] : chiave[1];
            const operazione = this.reverse
                ? (t) => this.permuta_round(
                            this.xor_round(
                                this.shift_round(
                                    this.sbox_round(t)), chiave_round))
                : (t) => this.sbox_round(
                            this.shift_round(
                                this.xor_round(
                                    this.permuta_round(t), chiave_round)));
            testo[i] = operazione(testo[i]);
        }
        // restituisco il testo unito
        return testo;
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
    permuta_round = (t) => {
        return this.prn.permuta(t);
    }
    /**
     * SHIFT ROUND utilizzata in round
     */
    shift_round = (t) => {
        // SHIFT ROWS
        return this.shift_rows.init(t).shift(this.reverse).string();
    }
    /**
     * SBOX utilizzata nel round
     */
    sbox_round = (t) => {
        return this.sbox.sostituzione_completa(t, this.reverse);
    }
    /**
     * esegue il log per controllare lo stato 
     */
    check(testo) {
        console.log(this.str._binario(testo.join('')).base64_().string());
    }
}