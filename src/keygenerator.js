const { ec } = require("elliptic");
const EC = new ec("secp256k1");

const key = EC.genKeyPair();
const publicKey = key.getPublic("hex");
const privateKey = key.getPrivate("hex");

console.log("Youre public key is: ", publicKey);
console.log("Youre private key is: ", privateKey);