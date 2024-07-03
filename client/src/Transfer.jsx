import { useState } from "react";
import server from "./server";

import { keccak256 } from "ethereum-cryptography/keccak.js";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { bytesToHex, toHex, utf8ToBytes } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  const hashMessage = (message) => keccak256(Uint8Array.from(message));
  const signMessage = (msg) =>
    secp256k1.sign(hashMessage(msg), privateKey, { recovery: true });
  async function transfer(evt) {
    evt.preventDefault();
    // TODO : Sign the transaction here
    const msg = { amount: parseInt(sendAmount), recipient };
    const sig = signMessage(msg);

    const stringifyBigInts = (obj) => {
      for (let prop in obj) {
        let value = obj[prop];
        if (typeof value === "bigint") {
          obj[prop] = value.toString();
        } else if (typeof value === "object" && value !== null) {
          obj[prop] = stringifyBigInts(value);
        }
      }
      return obj;
    };

    // stringify bigints before sending to server
    const sigStringed = stringifyBigInts(sig);
    console.log(sigStringed);
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        messageHash: msg,
        signature: sigStringed,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
