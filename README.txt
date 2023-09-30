Cifratura:
 - XOR chiave 0
 - SBOX chiave 0
 - PERMUTAZIONE Rounds (24) chiave 1
   * nuova chiave_round = hash + indice
   * SBOX chiave_round
   * permutazione
 - SBOX chiave 2
 - XOR chiave 2

Decifratura:
 - XOR chiave 2
 - SBOX chiave 2
 - PERMUTAZIONE Rounds (24) chiave 1
   * permutazione
   * SBOX chiave_round
   * nuova chiave_round = hash + indice
 - SBOX chiave 0
 - XOR chiave 0