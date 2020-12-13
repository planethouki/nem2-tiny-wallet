const chai = require('chai');
const assert = chai.assert;
const Nem2 = require('../../src/utils/nem2');

describe('nem2', () => {
    const timestampNemesisBlock = 1573430400;
    const networkType = 152;
    const privateKey = "D3F7D6AD37D2F7380445ADB537181BB1C48D8294BA197AE1C14304736B442250";
    const publicKey = "713FA4446275F62173186194F4FE898917BC2C05C9273E000461951A3557A255";

    it('publicKey', () => {
        const s = new Nem2(privateKey, networkType);
        assert.equal(s.getPublicKey(), publicKey);
    });

    it('getPlainAddress', () => {
        const s = new Nem2(privateKey, networkType);
        assert.equal(s.getPlainAddress(), "TC7ULQWT6A3Z6GTCMJUQSCD5G6YZNOVPVZ7UYPA");
    });

    it('createDeadline', () => {
        const s = new Nem2(privateKey, networkType);
        const deadlineValue = 34407852293;
        assert.equal(s.createDeadline(deadlineValue), "0000000802DE2905");
    });

    it('getBase32DecodeAddress', () => {
        const s = new Nem2(privateKey, networkType);
        const addressPlain = "TC7ULQWT6A3Z6GTCMJUQSCD5G6YZNOVPVZ7UYPA";
        const addressPretty = "TC7ULQ-WT6A3Z-6GTCMJ-UQSCD5-G6YZNO-VPVZ7U-YPA";
        const rawAddress = "98BF45C2D3F0379F1A62626909087D37B196BAAFAE7F4C3C";
        assert.equal(s.getBase32DecodeAddress(addressPlain), rawAddress);
        assert.equal(s.getBase32DecodeAddress(addressPretty), rawAddress);
    });

    it('sign', () => {
        const pk = "A68F71CFE7157A774C654FEC5E97AEB3574A886E98AD84C7571DFB8C002F2C87";
        const s = new Nem2(pk, networkType);
        const g = "6C1B92391CCB41C96478471C2634C111D9E989DECD66130C0430B5B8D20117CD";
        const t = "B000000000000000E0C2CB976396E58868855270152FA4770F2A0A8E37294BA9FE5E3BED09EB081D5CEF4BBA448C56B8EC81731BB6CB861C9AA70984968EF57C332E98868375B1081B9BBCAB6DDAB54C3534F3C47B0E42518435CB767F55743C97D09A12A1EC0B490000000001985441204E000000000000ECFA190408000000988063F3D1382D8715866432067E251B0106ADD4868428BC0000010000000000EEAFF441BA994BE7EBB39274FB000000";
        const sig = s.sign(t, g);
        const expected = "E0C2CB976396E58868855270152FA4770F2A0A8E37294BA9FE5E3BED09EB081D5CEF4BBA448C56B8EC81731BB6CB861C9AA70984968EF57C332E98868375B108";
        assert.equal(sig, expected);
    });
});

