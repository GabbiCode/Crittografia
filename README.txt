Cifratura:
 - XOR chiave 0
 - OPERAZIONI PER OGNI ROUND Rounds (n) chiave 1
   * nuova chiave_round = hash
   * OPERAZIONI PER OGNI BLOCCO chiave_round
     - PERMUTA
     - XOR
     - SHIFT ROWS
     - SBOX
 - XOR chiave 2

Decifratura:
 - XOR chiave 2
 - OPERAZIONI PER OGNI ROUND Rounds (n) chiave 1
   * OPERAZIONI PER OGNI BLOCCO chiave_round
     - SBOX
     - SHIFT ROWS
     - XOR
     - PERMUTA
   * nuova chiave_round = hash
 - XOR chiave 0