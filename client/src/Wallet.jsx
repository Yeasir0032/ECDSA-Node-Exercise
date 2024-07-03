import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { bytesToHex } from "ethereum-cryptography/utils";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  async function onChange(evt) {
    const address = evt.target.value;
    setPrivateKey(address);
    const publicKey = bytesToHex(secp256k1.getPublicKey(address));
    setAddress(publicKey);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${publicKey}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Type your private key"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>
      <div className="public-address">Public Key: {address}</div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
