const independence = require('../../src/utils/independence')

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

    test('parseNodeVersion', () => {
        const { parseNodeVersion } = independence;
        const a = parseNodeVersion(16777472);
        expect(a).toBe('1.0.1.0')
    });
});
