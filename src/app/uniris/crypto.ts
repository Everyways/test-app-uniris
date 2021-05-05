// import * as Crypto from 'crypto-js';
import * as CryptoJS from "crypto-js";

import Utilities from './utilities';
import * as Elliptic from 'elliptic';

export default class CryptoUtils {



  /**
   * Generate a keypair using a derivation function with a seed and an index. Each keys is prepending with a curve identification.
   * @param {String} seed Keypair derivation seed
   * @param {Integer} index Number to identify the order of keys to generate
   * @param {String} curve Elliptic curve to use ("ed25519", "P256", "secp256k1")
   */
  public static deriveKeyPair(
    seed: string,
    index: number,
    curve: string = 'ed25519'
  ) {
    if (index < 0) {
      throw "'index' must be a positive number";
    }

    const pvBuf = this.derivePrivateKey(seed, index);

    const ec_eddsa = new Elliptic.eddsa('ed25519');
    const ec_P256 = new Elliptic.ec('p256');
    const ec_secp256k1 = new Elliptic.ec('secp256k1');

    switch (curve) {
        case 'ed25519':
          const curve_id_buf_ed25519 = Uint8Array.from([0]);
          const key_ed25519 = ec_eddsa.keyFromSecret(pvBuf);
          const pubBuf_ed25519 = key_ed25519.getPublic();
          return {
            privateKey: Utilities.concatUint8Arrays([curve_id_buf_ed25519, pvBuf]),
            publicKey: Utilities.concatUint8Arrays([curve_id_buf_ed25519, pubBuf_ed25519]),
          };
        case 'P256':
          const curve_id_buf_P256 = Uint8Array.from([1]);
          const key_P256 = ec_P256.keyFromPrivate(pvBuf);
          const pubBuf_P256 = Utilities.hexToUint8Array(key_P256.getPublic().encode('hex', true));
          return {
            privateKey: Utilities.concatUint8Arrays([curve_id_buf_P256, pvBuf]),
            publicKey: Utilities.concatUint8Arrays([curve_id_buf_P256, pubBuf_P256]),
          };
        case 'secp256k1':
          const curve_id_buf = Uint8Array.from([2]);
          const key = ec_secp256k1.keyFromPrivate(pvBuf);
          const pubBuf = Utilities.hexToUint8Array(key.getPublic().encode('hex', true));
          return {
            privateKey: Utilities.concatUint8Arrays([curve_id_buf, pvBuf]),
            publicKey: Utilities.concatUint8Arrays([curve_id_buf, pubBuf]),
          };
      default:
        throw 'Curve not supported';
    }
  }

  public static derivePrivateKey(seed: string, index: number) {
    //Derive master keys
    // const buf = crypto.HmacSHA512('','').update(seed).digest();
    const buf = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA512, '').update(seed).finalize();
    const masterKey = buf.toString().slice(0, 32);
    const masterEntropy = buf.toString().slice(32, 64);

    //Derive the final seed
    const index_buf = Utilities.encodeInt32(index);
    const extended_seed = Utilities.concatUint8Arrays([masterKey, index_buf]);

    const hmac_buf = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA512, masterEntropy).update(extended_seed.toString()).finalize();
    // The first 32 bytes become the next private key
    return hmac_buf.toString().slice(0, 32);
  }
}
