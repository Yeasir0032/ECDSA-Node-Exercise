const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const { bytesToHex } = require("ethereum-cryptography/utils");

const prvKey = secp256k1.utils.randomPrivateKey();
const pblKey = secp256k1.getPublicKey(prvKey);
console.log(bytesToHex(prvKey));
console.log(bytesToHex(pblKey));
