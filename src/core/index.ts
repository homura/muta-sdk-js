import { encode } from 'rlp';
import { sign, publicKeyCreate } from 'secp256k1';
import createKeccakHash from 'keccak';
import { toHex } from '../utils';
import { PREFIX_ADDRESS_ACCOUNT } from './constant';

function hash(buffer: Buffer): Buffer {
  return createKeccakHash('keccak256')
    .update(buffer)
    .digest();
}

/**
 * create a public key from private key
 */
export { publicKeyCreate };

/**
 * calculate an account address from a public key
 * @param publicKey
 */
export function addressFromPublicKey(publicKey: Buffer): Buffer {
  const hashed = hash(publicKey);
  const address = hashed.slice(0, 20);
  const magicAddressPrefix = Buffer.from([PREFIX_ADDRESS_ACCOUNT]);
  return Buffer.concat([Buffer.from(magicAddressPrefix), Buffer.from(address)]);
}

/**
 * create a Transfer Transaction signature
 * @param tx
 * @param privateKey
 */
export function signTransferTx(
  tx: TransferTx,
  privateKey: Buffer
): InputEncryption {
  let orderedTx = [
    tx.chainId,
    tx.feeCycle,
    tx.feeAssetId,
    tx.nonce,
    tx.timeout
  ];
  orderedTx = orderedTx.concat([
    tx.carryingAmount,
    tx.carryingAssetId,
    tx.receiver
  ]);

  const encoded = encode(orderedTx);
  const txHash = hash(encoded);

  const { signature } = sign(txHash, privateKey);
  return {
    txHash: toHex(txHash),
    pubkey: toHex(publicKeyCreate(privateKey)),
    signature: toHex(signature)
  };
}