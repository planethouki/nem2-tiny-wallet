const independence = require('../../src/utils/independence');
const sha3 = require('../../src/utils/sha3');

describe('sha3', () => {
    test('getTransactionHash', () => {
        const { getTransactionHash } = sha3;
        const g = "6C1B92391CCB41C96478471C2634C111D9E989DECD66130C0430B5B8D20117CD";
        const p = "B000000000000000123AF01746042B9F01F1E429EFC3B3CE4EA82C02E54E548B04C721A3BB1EB8A3619980F361B9AEA9942BC11504E2D5E801C7884AFBFE5136E6E3D6DF212AE40E1B9BBCAB6DDAB54C3534F3C47B0E42518435CB767F55743C97D09A12A1EC0B490000000001985441204E0000000000000529DE0208000000988063F3D1382D8715866432067E251B0106ADD4868428BC0000010000000000EEAFF441BA994BE7EBB39274FB000000";
        const h = "DD7C0A664F804E5651C557A57B16E7A189F727E18AD282B578710991A1102B6C";
        expect(getTransactionHash(p, g)).toBe(h);
    });
});

describe('independence', () => {
    test('endian', () => {
        const { endian } = independence;
        expect(endian("5B66E76BECAD0860")).toBe("6008ADEC6BE7665B");
        expect(endian("EEAFF441BA994BE7")).toBe("E74B99BA41F4AFEE");
    });

    test('uint8ArrayToHex', () => {
        const { uint8ArrayToHex } = independence;
        expect(uint8ArrayToHex(new Uint8Array([0, 1, 2]))).toBe("000102");
        expect(uint8ArrayToHex(new Uint8Array([255, 254]))).toBe("FFFE");
    });

    test('hexToUint8Array', () => {
        const { hexToUint8Array } = independence;
        const a = hexToUint8Array("000102");
        expect(a).toBeInstanceOf(Uint8Array);
        expect(a.length).toBe(3);
        expect(a).toContain(0);
        expect(a).toContain(1);
        expect(a).toContain(2);
    });

});
