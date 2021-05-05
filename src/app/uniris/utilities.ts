export default class Utilities {
  public static uint8ArrayToHex(bytes) {
    return bytes.reduce(
      (str, byte) => str + byte.toString(16).padStart(2, '0'),
      ''
    );
  }

  /**
   * Encode an hexadecimal string into a Uint8Array
   * @param {Uint8Array} hexString Hexadecimal string
   */
  public static hexToUint8Array = function (hexString) {
    return new Uint8Array(
      hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );
  }

  /**
   * Concat a list of Uint8Array
   * @param {Array} arrays Uint8Arrays
   */
  public static concatUint8Arrays = function (arrays) {
    // sum of individual array lengths
    let totalLength = arrays.reduce((acc, value) => acc + value.length, 0);

    if (!arrays.length) return new Uint8Array();

    let result = new Uint8Array(totalLength);

    // for each array - copy it over result
    // next array is copied right after the previous one
    let length = 0;
    for (let array of arrays) {
      result.set(array, length);
      length += array.length;
    }

    return result;
  };

  public static encodeInt32 = function (number) {
    let array = new ArrayBuffer(4);
    let view = new DataView(array);
    view.setUint32(0, number, true);
    return new Uint8Array(array).reverse();
  }

}
