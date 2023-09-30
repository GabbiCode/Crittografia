import { Cipher, Cripto, Sbox, Codifica } from './cipher.js';

const cipher = new Cipher();
let cifra = document.getElementById('d1');
let decifra = document.getElementById('d2');
const cripto = new Cripto();
const str = new Codifica();
const sbox = new Sbox();

function cifra_testo() {
    const testo = $('#testo_cifra').val();
    const chiave = $('#chiave_cifra').val();
    if (!testo || !chiave) return;
    const testo_cifrato = cipher.encrypt(testo, chiave);
    $('#d1').text(testo_cifrato);
}

function decifra_testo() {
    const testo = $('#testo_decifra').val();
    const chiave = $('#chiave_decifra').val();
    if (!testo || !chiave) return;
    const testo_decifrato = cipher.decrypt(testo, chiave);
    $('#d2').text(testo_decifrato);
}

function copy(testo) {
	navigator.clipboard.writeText(testo);
}

let ultima_pagina = 'genera_chiave';
$(document).ready(function() {
    $('#btn-cifra').on('click', () => {
        cifra_testo();
    });
    $('#btn-decifra').on('click', () => {
        decifra_testo();
    });
    $('.apri_sezione').click((b) => {
        b = b.currentTarget;
        const target = $(b).attr('data-target');
        if (ultima_pagina == target) return;
        document.querySelectorAll('.sezione').forEach((sezione, i) => {
            $(sezione).slideUp(250);
        });
        $('#' + target).slideDown(250);
        ultima_pagina = target;
    });
    $('#genera_chiave_casuale').click(()=>{
        generaChiaveCasuale();    
    })
    $('#l_chiave').change(()=>{
        generaChiaveCasuale();
    });
    $('#test_btn').click(()=>{
        test();
    });
    generaChiaveCasuale();
    html_obj.init();
    /**
     * prove random
     */
    test();
});

function test() {
    var l = document.getElementById('l_chiave').value;
    l = parseInt(l);
    const chiave = cripto.generate_encryption_key(l);
    const testo = random_frasi[numero_casuale(0, random_frasi.length - 1)];
    $('#testo_cifra').val(testo);
    $('#chiave_cifra').val(chiave);
    const testo_cifrato = cipher.encrypt(testo, chiave);
    $('#d1').text(testo_cifrato);
    // ---
    $('#testo_decifra').val(testo_cifrato);
    $('#chiave_decifra').val(chiave);
    const testo_decifrato = cipher.decrypt(testo_cifrato, chiave);
    $('#d2').text(testo_decifrato);
}

const random_frasi = [
    'Password1234',
    'Ciao',
    '🤑🤑😀😀😂😂',
    '(*^_^*)',
    '( •̀ ω •́ )',
    'Messaggio di prova',
    '100.000.000€',
    '你 - こんにちは - Привет - שלום'
]

function numero_casuale(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function generaChiaveCasuale() {
    var l = document.getElementById('l_chiave').value;
    l = parseInt(l);
    document.getElementById('chiave').value = cripto.generate_encryption_key(l);
}

let html_obj = {
    init() {
        document.querySelectorAll('.btn-spawn').forEach(spawn => {
            const target = spawn.getAttribute('data-target');
            spawn.innerHTML = this.buttons(target);
        });
    },

    buttons: (target) => {
        return `<div class="btn-sequence">
        <!-- COPIA -->
        <button type="button" class="btn text copy_value check_animation" data-target="${target}" title="Copia">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"></path>
            </svg>
        </button>
        <!-- INCOLLA -->
        <button type="button" class="btn text paste_to check_animation" data-target-to-paste="${target}"
            title="Incolla Password">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z">
                </path>
            </svg>
        </button>
        <!-- RESET -->
        <button type="button" class="btn text reset-input check_animation" data-id-reset="${target}"
            title="Reset">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z">
                </path>
            </svg>
        </button>
        </div>`;
    }
}