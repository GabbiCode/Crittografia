Cifratura:
 - XOR chiave 0
 - OPERAZIONI PER OGNI ROUND Rounds (24) chiave 1
   * nuova chiave_round = hash + indice
   * OPERAZIONI PER OGNI BLOCCO chiave_round
     - XOR
     - SHIFT ROWS
     - SBOX
 - XOR chiave 2

Decifratura:
 - XOR chiave 2
 - OPERAZIONI PER OGNI ROUND Rounds (24) chiave 1
   * OPERAZIONI PER OGNI BLOCCO chiave_round
     - SBOX
     - SHIFT ROWS
     - XOR
   * nuova chiave_round = hash + indice
 - XOR chiave 0