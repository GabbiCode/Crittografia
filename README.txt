Cifratura:
 - XOR chiave 0
 - SBOX chiave 0
 - OPERAZIONI PER OGNI ROUND Rounds (24) chiave 1
   * nuova chiave_round = hash + indice
   * SBOX chiave_round
   * OPERAZIONI PER OGNI BLOCCO chiave_round
     - PERMUTA
     - XOR
 - SBOX chiave 2
 - XOR chiave 2

Decifratura:
 - XOR chiave 2
 - SBOX chiave 2
 - OPERAZIONI PER OGNI ROUND Rounds (24) chiave 1
   * OPERAZIONI PER OGNI BLOCCO chiave_round
     - XOR
     - PERMUTA
   * SBOX chiave_round
   * nuova chiave_round = hash + indice
 - SBOX chiave 0
 - XOR chiave 0