const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const { keccak256 } = require("ethereum-cryptography/keccak.js");

app.use(cors());
app.use(express.json());

const balances = {
  "035e086bc97ec18f2616988f573aba6f6410bb573410abb652c0c02393f7890df6": 100,
  "0213890b4fd23581f6c6c6e9e3c510bf6343a8aae95d387ac3be3b9d918e542d1c": 50,
  "032813ca9a2fdb09ea765c43ef8f44d9160cbc99fdc2a20f1139e770d318671395": 75,
};

app.get("/balance/:publicKey", (req, res) => {
  const { publicKey } = req.params;
  const balance = balances[publicKey] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signature, messageHash, sender, recipient, amount } = req.body;

  // convert stringified bigints back to bigints
  const sig = {
    ...signature,
    r: BigInt(signature.r),
    s: BigInt(signature.s),
  };
  const hashMessage = (message) => keccak256(Uint8Array.from(message));
  const isSigned = secp256k1.verify(sig, hashMessage(messageHash), sender);
  if (isSigned) {
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
