(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var RFC4648 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
var RFC4648_HEX = '0123456789ABCDEFGHIJKLMNOPQRSTUV'
var CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

function readChar (alphabet, char) {
  var idx = alphabet.indexOf(char)

  if (idx === -1) {
    throw new Error('Invalid character found: ' + char)
  }

  return idx
}

module.exports = function base32Decode (input, variant) {
  var alphabet

  switch (variant) {
    case 'RFC3548':
    case 'RFC4648':
      alphabet = RFC4648
      input = input.replace(/=+$/, '')
      break
    case 'RFC4648-HEX':
      alphabet = RFC4648_HEX
      input = input.replace(/=+$/, '')
      break
    case 'Crockford':
      alphabet = CROCKFORD
      input = input.toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1')
      break
    default:
      throw new Error('Unknown base32 variant: ' + variant)
  }

  var length = input.length

  var bits = 0
  var value = 0

  var index = 0
  var output = new Uint8Array((length * 5 / 8) | 0)

  for (var i = 0; i < length; i++) {
    value = (value << 5) | readChar(alphabet, input[i])
    bits += 5

    if (bits >= 8) {
      output[index++] = (value >>> (bits - 8)) & 255
      bits -= 8
    }
  }

  return output.buffer
}

},{}],2:[function(require,module,exports){
var RFC4648 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
var RFC4648_HEX = '0123456789ABCDEFGHIJKLMNOPQRSTUV'
var CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

module.exports = function base32Encode (buffer, variant, options) {
  options = options || {}
  var alphabet, defaultPadding

  switch (variant) {
    case 'RFC3548':
    case 'RFC4648':
      alphabet = RFC4648
      defaultPadding = true
      break
    case 'RFC4648-HEX':
      alphabet = RFC4648_HEX
      defaultPadding = true
      break
    case 'Crockford':
      alphabet = CROCKFORD
      defaultPadding = false
      break
    default:
      throw new Error('Unknown base32 variant: ' + variant)
  }

  var padding = (options.padding !== undefined ? options.padding : defaultPadding)
  var length = buffer.byteLength
  var view = new Uint8Array(buffer)

  var bits = 0
  var value = 0
  var output = ''

  for (var i = 0; i < length; i++) {
    value = (value << 8) | view[i]
    bits += 8

    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31]
  }

  if (padding) {
    while ((output.length % 8) !== 0) {
      output += '='
    }
  }

  return output
}

},{}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
(function (global){(function (){
/*!
 * hash-wasm (https://www.npmjs.com/package/hash-wasm)
 * (c) Dani Biro
 * @license MIT
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.hashwasm = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    /* eslint-disable import/prefer-default-export */
    /* eslint-disable no-bitwise */
    var _a;
    function getGlobal() {
        if (typeof globalThis !== 'undefined')
            return globalThis;
        // eslint-disable-next-line no-restricted-globals
        if (typeof self !== 'undefined')
            return self;
        if (typeof window !== 'undefined')
            return window;
        return global;
    }
    const globalObject = getGlobal();
    const nodeBuffer = (_a = globalObject.Buffer) !== null && _a !== void 0 ? _a : null;
    const textEncoder = globalObject.TextEncoder ? new globalObject.TextEncoder() : null;
    function intArrayToString(arr, len) {
        return String.fromCharCode(...arr.subarray(0, len));
    }
    function hexCharCodesToInt(a, b) {
        return (((a & 0xF) + ((a >> 6) | ((a >> 3) & 0x8))) << 4) | ((b & 0xF) + ((b >> 6) | ((b >> 3) & 0x8)));
    }
    function writeHexToUInt8(buf, str) {
        const size = str.length >> 1;
        for (let i = 0; i < size; i++) {
            const index = i << 1;
            buf[i] = hexCharCodesToInt(str.charCodeAt(index), str.charCodeAt(index + 1));
        }
    }
    const alpha = 'a'.charCodeAt(0) - 10;
    const digit = '0'.charCodeAt(0);
    function getDigestHex(tmpBuffer, input, hashLength) {
        let p = 0;
        /* eslint-disable no-plusplus */
        for (let i = 0; i < hashLength; i++) {
            let nibble = input[i] >>> 4;
            tmpBuffer[p++] = nibble > 9 ? nibble + alpha : nibble + digit;
            nibble = input[i] & 0xF;
            tmpBuffer[p++] = nibble > 9 ? nibble + alpha : nibble + digit;
        }
        /* eslint-enable no-plusplus */
        return String.fromCharCode.apply(null, tmpBuffer);
    }
    const getUInt8Buffer = nodeBuffer !== null
        ? (data) => {
            if (typeof data === 'string') {
                const buf = nodeBuffer.from(data, 'utf8');
                return new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
            }
            if (nodeBuffer.isBuffer(data)) {
                return new Uint8Array(data.buffer, data.byteOffset, data.length);
            }
            if (ArrayBuffer.isView(data)) {
                return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
            }
            throw new Error('Invalid data type!');
        }
        : (data) => {
            if (typeof data === 'string') {
                return textEncoder.encode(data);
            }
            if (ArrayBuffer.isView(data)) {
                return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
            }
            throw new Error('Invalid data type!');
        };
    const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const base64Lookup = new Uint8Array(256);
    for (let i = 0; i < base64Chars.length; i++) {
        base64Lookup[base64Chars.charCodeAt(i)] = i;
    }
    function encodeBase64(data, pad = true) {
        const len = data.length;
        const extraBytes = len % 3;
        const parts = [];
        const len2 = len - extraBytes;
        for (let i = 0; i < len2; i += 3) {
            const tmp = ((data[i] << 16) & 0xFF0000)
                + ((data[i + 1] << 8) & 0xFF00)
                + (data[i + 2] & 0xFF);
            const triplet = base64Chars.charAt((tmp >> 18) & 0x3F)
                + base64Chars.charAt((tmp >> 12) & 0x3F)
                + base64Chars.charAt((tmp >> 6) & 0x3F)
                + base64Chars.charAt(tmp & 0x3F);
            parts.push(triplet);
        }
        if (extraBytes === 1) {
            const tmp = data[len - 1];
            const a = base64Chars.charAt(tmp >> 2);
            const b = base64Chars.charAt((tmp << 4) & 0x3F);
            parts.push(`${a}${b}`);
            if (pad) {
                parts.push('==');
            }
        }
        else if (extraBytes === 2) {
            const tmp = (data[len - 2] << 8) + data[len - 1];
            const a = base64Chars.charAt(tmp >> 10);
            const b = base64Chars.charAt((tmp >> 4) & 0x3F);
            const c = base64Chars.charAt((tmp << 2) & 0x3F);
            parts.push(`${a}${b}${c}`);
            if (pad) {
                parts.push('=');
            }
        }
        return parts.join('');
    }
    function getDecodeBase64Length(data) {
        let bufferLength = Math.floor(data.length * 0.75);
        const len = data.length;
        if (data[len - 1] === '=') {
            bufferLength -= 1;
            if (data[len - 2] === '=') {
                bufferLength -= 1;
            }
        }
        return bufferLength;
    }
    function decodeBase64(data) {
        const bufferLength = getDecodeBase64Length(data);
        const len = data.length;
        const bytes = new Uint8Array(bufferLength);
        let p = 0;
        for (let i = 0; i < len; i += 4) {
            const encoded1 = base64Lookup[data.charCodeAt(i)];
            const encoded2 = base64Lookup[data.charCodeAt(i + 1)];
            const encoded3 = base64Lookup[data.charCodeAt(i + 2)];
            const encoded4 = base64Lookup[data.charCodeAt(i + 3)];
            bytes[p] = (encoded1 << 2) | (encoded2 >> 4);
            p += 1;
            bytes[p] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            p += 1;
            bytes[p] = ((encoded3 & 3) << 6) | (encoded4 & 63);
            p += 1;
        }
        return bytes;
    }

    class Mutex {
        constructor() {
            this.mutex = Promise.resolve();
        }
        lock() {
            let begin = () => { };
            this.mutex = this.mutex.then(() => new Promise(begin));
            return new Promise((res) => {
                begin = res;
            });
        }
        dispatch(fn) {
            return __awaiter(this, void 0, void 0, function* () {
                const unlock = yield this.lock();
                try {
                    return yield Promise.resolve(fn());
                }
                finally {
                    unlock();
                }
            });
        }
    }

    const MAX_HEAP = 16 * 1024;
    const wasmMutex = new Mutex();
    const wasmModuleCache = new Map();
    function WASMInterface(binary, hashLength) {
        return __awaiter(this, void 0, void 0, function* () {
            let wasmInstance = null;
            let memoryView = null;
            let initialized = false;
            if (typeof WebAssembly === 'undefined') {
                throw new Error('WebAssembly is not supported in this environment!');
            }
            const writeMemory = (data, offset = 0) => {
                memoryView.set(data, offset);
            };
            const getMemory = () => memoryView;
            const getExports = () => wasmInstance.exports;
            const setMemorySize = (totalSize) => {
                wasmInstance.exports.Hash_SetMemorySize(totalSize);
                const arrayOffset = wasmInstance.exports.Hash_GetBuffer();
                const memoryBuffer = wasmInstance.exports.memory.buffer;
                memoryView = new Uint8Array(memoryBuffer, arrayOffset, totalSize);
            };
            const loadWASMPromise = wasmMutex.dispatch(() => __awaiter(this, void 0, void 0, function* () {
                if (!wasmModuleCache.has(binary.name)) {
                    const asm = decodeBase64(binary.data);
                    const promise = WebAssembly.compile(asm);
                    wasmModuleCache.set(binary.name, promise);
                }
                const module = yield wasmModuleCache.get(binary.name);
                wasmInstance = yield WebAssembly.instantiate(module, {
                // env: {
                //   emscripten_memcpy_big: (dest, src, num) => {
                //     const memoryBuffer = wasmInstance.exports.memory.buffer;
                //     const memView = new Uint8Array(memoryBuffer, 0);
                //     memView.set(memView.subarray(src, src + num), dest);
                //   },
                //   print_memory: (offset, len) => {
                //     const memoryBuffer = wasmInstance.exports.memory.buffer;
                //     const memView = new Uint8Array(memoryBuffer, 0);
                //     console.log('print_int32', memView.subarray(offset, offset + len));
                //   },
                // },
                });
                // wasmInstance.exports._start();
            }));
            const setupInterface = () => __awaiter(this, void 0, void 0, function* () {
                if (!wasmInstance) {
                    yield loadWASMPromise;
                }
                const arrayOffset = wasmInstance.exports.Hash_GetBuffer();
                const memoryBuffer = wasmInstance.exports.memory.buffer;
                memoryView = new Uint8Array(memoryBuffer, arrayOffset, MAX_HEAP);
            });
            const init = (bits = null) => {
                initialized = true;
                wasmInstance.exports.Hash_Init(bits);
            };
            const updateUInt8Array = (data) => {
                let read = 0;
                while (read < data.length) {
                    const chunk = data.subarray(read, read + MAX_HEAP);
                    read += chunk.length;
                    memoryView.set(chunk);
                    wasmInstance.exports.Hash_Update(chunk.length);
                }
            };
            const update = (data) => {
                if (!initialized) {
                    throw new Error('update() called before init()');
                }
                const Uint8Buffer = getUInt8Buffer(data);
                updateUInt8Array(Uint8Buffer);
            };
            const digestChars = new Uint8Array(hashLength * 2);
            const digest = (outputType, padding = null) => {
                if (!initialized) {
                    throw new Error('digest() called before init()');
                }
                initialized = false;
                wasmInstance.exports.Hash_Final(padding);
                if (outputType === 'binary') {
                    // the data is copied to allow GC of the original memory object
                    return memoryView.slice(0, hashLength);
                }
                return getDigestHex(digestChars, memoryView, hashLength);
            };
            const isDataShort = (data) => {
                if (typeof data === 'string') {
                    // worst case is 4 bytes / char
                    return data.length < MAX_HEAP / 4;
                }
                return data.byteLength < MAX_HEAP;
            };
            let canSimplify = isDataShort;
            switch (binary.name) {
                case 'argon2.wasm':
                case 'scrypt.wasm':
                    canSimplify = () => true;
                    break;
                case 'blake2b.wasm':
                case 'blake2s.wasm':
                    // if there is a key at blake2b then cannot simplify
                    canSimplify = (data, initParam) => initParam <= 512 && isDataShort(data);
                    break;
                case 'xxhash64.wasm': // cannot simplify
                    canSimplify = () => false;
                    break;
            }
            // shorthand for (init + update + digest) for better performance
            const calculate = (data, initParam = null, digestParam = null) => {
                if (!canSimplify(data, initParam)) {
                    init(initParam);
                    update(data);
                    return digest('hex', digestParam);
                }
                const buffer = getUInt8Buffer(data);
                memoryView.set(buffer);
                wasmInstance.exports.Hash_Calculate(buffer.length, initParam, digestParam);
                return getDigestHex(digestChars, memoryView, hashLength);
            };
            yield setupInterface();
            return {
                getMemory,
                writeMemory,
                getExports,
                setMemorySize,
                init,
                update,
                digest,
                calculate,
                hashLength,
            };
        });
    }

    var name = "blake2b.wasm";
    var data = "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";
    var wasmJson = {
    	name: name,
    	data: data
    };

    function lockedCreate(mutex, binary, hashLength) {
        return __awaiter(this, void 0, void 0, function* () {
            const unlock = yield mutex.lock();
            const wasm = yield WASMInterface(binary, hashLength);
            unlock();
            return wasm;
        });
    }

    const mutex = new Mutex();
    let wasmCache = null;
    function validateBits(bits) {
        if (!Number.isInteger(bits) || bits < 8 || bits > 512 || bits % 8 !== 0) {
            return new Error('Invalid variant! Valid values: 8, 16, ..., 512');
        }
        return null;
    }
    function getInitParam(outputBits, keyBits) {
        // eslint-disable-next-line no-bitwise
        return outputBits | (keyBits << 16);
    }
    /**
     * Calculates BLAKE2b hash
     * @param data Input data (string, Buffer or TypedArray)
     * @param bits Number of output bits, which has to be a number
     *             divisible by 8, between 8 and 512. Defaults to 512.
     * @param key Optional key (string, Buffer or TypedArray). Maximum length is 64 bytes.
     * @returns Computed hash as a hexadecimal string
     */
    function blake2b(data, bits = 512, key = null) {
        if (validateBits(bits)) {
            return Promise.reject(validateBits(bits));
        }
        let keyBuffer = null;
        let initParam = bits;
        if (key !== null) {
            keyBuffer = getUInt8Buffer(key);
            if (keyBuffer.length > 64) {
                return Promise.reject(new Error('Max key length is 64 bytes'));
            }
            initParam = getInitParam(bits, keyBuffer.length);
        }
        const hashLength = bits / 8;
        if (wasmCache === null || wasmCache.hashLength !== hashLength) {
            return lockedCreate(mutex, wasmJson, hashLength)
                .then((wasm) => {
                wasmCache = wasm;
                if (initParam > 512) {
                    wasmCache.writeMemory(keyBuffer);
                }
                return wasmCache.calculate(data, initParam);
            });
        }
        try {
            if (initParam > 512) {
                wasmCache.writeMemory(keyBuffer);
            }
            const hash = wasmCache.calculate(data, initParam);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new BLAKE2b hash instance
     * @param bits Number of output bits, which has to be a number
     *             divisible by 8, between 8 and 512. Defaults to 512.
     * @param key Optional key (string, Buffer or TypedArray). Maximum length is 64 bytes.
     */
    function createBLAKE2b(bits = 512, key = null) {
        if (validateBits(bits)) {
            return Promise.reject(validateBits(bits));
        }
        let keyBuffer = null;
        let initParam = bits;
        if (key !== null) {
            keyBuffer = getUInt8Buffer(key);
            if (keyBuffer.length > 64) {
                return Promise.reject(new Error('Max key length is 64 bytes'));
            }
            initParam = getInitParam(bits, keyBuffer.length);
        }
        const outputSize = bits / 8;
        return WASMInterface(wasmJson, outputSize).then((wasm) => {
            if (initParam > 512) {
                wasm.writeMemory(keyBuffer);
            }
            wasm.init(initParam);
            const obj = {
                init: initParam > 512
                    ? () => {
                        wasm.writeMemory(keyBuffer);
                        wasm.init(initParam);
                        return obj;
                    }
                    : () => {
                        wasm.init(initParam);
                        return obj;
                    },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 128,
                digestSize: outputSize,
            };
            return obj;
        });
    }

    var name$1 = "argon2.wasm";
    var data$1 = "AGFzbQEAAAABKQVgAX8Bf2AAAX9gEH9/f39/f39/f39/f39/f38AYAR/f39/AGACf38AAwYFAAECAwQEBQFwAQEBBQYBAQSAgAIGCAF/AUGQqAQLB0EEBm1lbW9yeQIAEkhhc2hfU2V0TWVtb3J5U2l6ZQAADkhhc2hfR2V0QnVmZmVyAAEOSGFzaF9DYWxjdWxhdGUABAqCNAVbAQF/QQAhAQJAIABBACgCgAhrIgBFDQACQCAAQRB2IABBgIB8cSAASWoiAEAAQX9HDQBB/wEhAQwBC0EAIQFBAEEAKQOACCAAQRB0rXw3A4AICyABQRh0QRh1C2oBAn8CQEEAKAKICCIADQBBAD8AQRB0IgA2AogIQYCAIEEAKAKACGsiAUUNAAJAIAFBEHYgAUGAgHxxIAFJaiIAQABBf0cNAEEADwtBAEEAKQOACCAAQRB0rXw3A4AIQQAoAogIIQALIAALnA8BA34gACAEKQMAIhAgACkDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDCAQIAwpAwCFIhBCIIkiETcDACAIIBEgCCkDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAEIBAgBCkDAIUiEEIoiSIRNwMAIAAgESAAKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAMIBAgDCkDAIUiEEIwiSIRNwMAIAggESAIKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAEIBAgBCkDAIVCAYk3AwAgASAFKQMAIhAgASkDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDSAQIA0pAwCFIhBCIIkiETcDACAJIBEgCSkDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAFIBAgBSkDAIUiEEIoiSIRNwMAIAEgESABKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACANIBAgDSkDAIUiEEIwiSIRNwMAIAkgESAJKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAFIBAgBSkDAIVCAYk3AwAgAiAGKQMAIhAgAikDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDiAQIA4pAwCFIhBCIIkiETcDACAKIBEgCikDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAGIBAgBikDAIUiEEIoiSIRNwMAIAIgESACKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAOIBAgDikDAIUiEEIwiSIRNwMAIAogESAKKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAGIBAgBikDAIVCAYk3AwAgAyAHKQMAIhAgAykDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDyAQIA8pAwCFIhBCIIkiETcDACALIBEgCykDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAHIBAgBykDAIUiEEIoiSIRNwMAIAMgESADKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAPIBAgDykDAIUiEEIwiSIRNwMAIAsgESALKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAHIBAgBykDAIVCAYk3AwAgACAFKQMAIhAgACkDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDyAQIA8pAwCFIhBCIIkiETcDACAKIBEgCikDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAFIBAgBSkDAIUiEEIoiSIRNwMAIAAgESAAKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAPIBAgDykDAIUiEEIwiSIRNwMAIAogESAKKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAFIBAgBSkDAIVCAYk3AwAgASAGKQMAIhAgASkDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDCAQIAwpAwCFIhBCIIkiETcDACALIBEgCykDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAGIBAgBikDAIUiEEIoiSIRNwMAIAEgESABKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAMIBAgDCkDAIUiEEIwiSIRNwMAIAsgESALKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAGIBAgBikDAIVCAYk3AwAgAiAHKQMAIhAgAikDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDSAQIA0pAwCFIhBCIIkiETcDACAIIBEgCCkDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAHIBAgBykDAIUiEEIoiSIRNwMAIAIgESACKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACANIBAgDSkDAIUiEEIwiSIRNwMAIAggESAIKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAHIBAgBykDAIVCAYk3AwAgAyAEKQMAIhAgAykDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDiAQIA4pAwCFIhBCIIkiETcDACAJIBEgCSkDACISfCASQgGGQv7///8fgyAQQiCIfnwiEDcDACAEIBAgBCkDAIUiEEIoiSIRNwMAIAMgESADKQMAIhJ8IBBCGIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAOIBAgDikDAIUiEEIwiSIRNwMAIAkgESAJKQMAIhJ8IBBCEIhC/////w+DIBJCAYZC/v///x+DfnwiEDcDACAEIBAgBCkDAIVCAYk3AwALhxoBAX9BACEEQQAgAikDACABKQMAhTcDkAhBACACKQMIIAEpAwiFNwOYCEEAIAIpAxAgASkDEIU3A6AIQQAgAikDGCABKQMYhTcDqAhBACACKQMgIAEpAyCFNwOwCEEAIAIpAyggASkDKIU3A7gIQQAgAikDMCABKQMwhTcDwAhBACACKQM4IAEpAziFNwPICEEAIAIpA0AgASkDQIU3A9AIQQAgAikDSCABKQNIhTcD2AhBACACKQNQIAEpA1CFNwPgCEEAIAIpA1ggASkDWIU3A+gIQQAgAikDYCABKQNghTcD8AhBACACKQNoIAEpA2iFNwP4CEEAIAIpA3AgASkDcIU3A4AJQQAgAikDeCABKQN4hTcDiAlBACACKQOAASABKQOAAYU3A5AJQQAgAikDiAEgASkDiAGFNwOYCUEAIAIpA5ABIAEpA5ABhTcDoAlBACACKQOYASABKQOYAYU3A6gJQQAgAikDoAEgASkDoAGFNwOwCUEAIAIpA6gBIAEpA6gBhTcDuAlB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";
    var wasmJson$1 = {
    	name: name$1,
    	data: data$1
    };

    function encodeResult(salt, options, res) {
        const parameters = [
            `m=${options.memorySize}`,
            `t=${options.iterations}`,
            `p=${options.parallelism}`,
        ].join(',');
        return `$argon2${options.hashType}$v=19$${parameters}$${encodeBase64(salt, false)}$${encodeBase64(res, false)}`;
    }
    const uint32View = new DataView(new ArrayBuffer(4));
    function int32LE(x) {
        uint32View.setInt32(0, x, true);
        return new Uint8Array(uint32View.buffer);
    }
    function hashFunc(blake512, buf, len) {
        return __awaiter(this, void 0, void 0, function* () {
            if (len <= 64) {
                const blake = yield createBLAKE2b(len * 8);
                blake.update(int32LE(len));
                blake.update(buf);
                return blake.digest('binary');
            }
            const r = Math.ceil(len / 32) - 2;
            const ret = new Uint8Array(len);
            blake512.init();
            blake512.update(int32LE(len));
            blake512.update(buf);
            let vp = blake512.digest('binary');
            ret.set(vp.subarray(0, 32), 0);
            for (let i = 1; i < r; i++) {
                blake512.init();
                blake512.update(vp);
                vp = blake512.digest('binary');
                ret.set(vp.subarray(0, 32), i * 32);
            }
            const partialBytesNeeded = len - 32 * r;
            let blakeSmall;
            if (partialBytesNeeded === 64) {
                blakeSmall = blake512;
                blakeSmall.init();
            }
            else {
                blakeSmall = yield createBLAKE2b(partialBytesNeeded * 8);
            }
            blakeSmall.update(vp);
            vp = blakeSmall.digest('binary');
            ret.set(vp.subarray(0, partialBytesNeeded), r * 32);
            return ret;
        });
    }
    function getHashType(type) {
        switch (type) {
            case 'd':
                return 0;
            case 'i':
                return 1;
            default:
                return 2;
        }
    }
    function argon2Internal(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { parallelism, iterations, hashLength } = options;
            const password = getUInt8Buffer(options.password);
            const salt = getUInt8Buffer(options.salt);
            const version = 0x13;
            const hashType = getHashType(options.hashType);
            const { memorySize } = options; // in KB
            const [argon2Interface, blake512] = yield Promise.all([
                WASMInterface(wasmJson$1, 1024),
                createBLAKE2b(512),
            ]);
            // last block is for storing the init vector
            argon2Interface.setMemorySize(memorySize * 1024 + 1024);
            const initVector = new Uint8Array(24);
            const initVectorView = new DataView(initVector.buffer);
            initVectorView.setInt32(0, parallelism, true);
            initVectorView.setInt32(4, hashLength, true);
            initVectorView.setInt32(8, memorySize, true);
            initVectorView.setInt32(12, iterations, true);
            initVectorView.setInt32(16, version, true);
            initVectorView.setInt32(20, hashType, true);
            argon2Interface.writeMemory(initVector, memorySize * 1024);
            blake512.init();
            blake512.update(initVector);
            blake512.update(int32LE(password.length));
            blake512.update(password);
            blake512.update(int32LE(salt.length));
            blake512.update(salt);
            blake512.update(int32LE(0)); // key length + key
            blake512.update(int32LE(0)); // associatedData length + associatedData
            const segments = Math.floor(memorySize / (parallelism * 4)); // length of each lane
            const lanes = segments * 4;
            const param = new Uint8Array(72);
            const H0 = blake512.digest('binary');
            param.set(H0);
            for (let lane = 0; lane < parallelism; lane++) {
                param.set(int32LE(0), 64);
                param.set(int32LE(lane), 68);
                let position = lane * lanes;
                let chunk = yield hashFunc(blake512, param, 1024);
                argon2Interface.writeMemory(chunk, position * 1024);
                position += 1;
                param.set(int32LE(1), 64);
                chunk = yield hashFunc(blake512, param, 1024);
                argon2Interface.writeMemory(chunk, position * 1024);
            }
            const C = new Uint8Array(1024);
            writeHexToUInt8(C, argon2Interface.calculate(new Uint8Array([]), memorySize));
            const res = yield hashFunc(blake512, C, hashLength);
            if (options.outputType === 'hex') {
                const digestChars = new Uint8Array(hashLength * 2);
                return getDigestHex(digestChars, res, hashLength);
            }
            if (options.outputType === 'encoded') {
                return encodeResult(salt, options, res);
            }
            // return binary format
            return res;
        });
    }
    const validateOptions = (options) => {
        if (!options || typeof options !== 'object') {
            throw new Error('Invalid options parameter. It requires an object.');
        }
        if (!options.password) {
            throw new Error('Password must be specified');
        }
        options.password = getUInt8Buffer(options.password);
        if (options.password.length < 1) {
            throw new Error('Password must be specified');
        }
        if (!options.salt) {
            throw new Error('Salt must be specified');
        }
        options.salt = getUInt8Buffer(options.salt);
        if (options.salt.length < 8) {
            throw new Error('Salt should be at least 8 bytes long');
        }
        if (!Number.isInteger(options.iterations) || options.iterations < 1) {
            throw new Error('Iterations should be a positive number');
        }
        if (!Number.isInteger(options.parallelism) || options.parallelism < 1) {
            throw new Error('Parallelism should be a positive number');
        }
        if (!Number.isInteger(options.hashLength) || options.hashLength < 4) {
            throw new Error('Hash length should be at least 4 bytes.');
        }
        if (!Number.isInteger(options.memorySize)) {
            throw new Error('Memory size should be specified.');
        }
        if (options.memorySize < 8 * options.parallelism) {
            throw new Error('Memory size should be at least 8 * parallelism.');
        }
        if (options.outputType === undefined) {
            options.outputType = 'hex';
        }
        if (!['hex', 'binary', 'encoded'].includes(options.outputType)) {
            throw new Error(`Insupported output type ${options.outputType}. Valid values: ['hex', 'binary', 'encoded']`);
        }
    };
    /**
     * Calculates hash using the argon2i password-hashing function
     * @returns Computed hash
     */
    function argon2i(options) {
        return __awaiter(this, void 0, void 0, function* () {
            validateOptions(options);
            return argon2Internal(Object.assign(Object.assign({}, options), { hashType: 'i' }));
        });
    }
    /**
     * Calculates hash using the argon2id password-hashing function
     * @returns Computed hash
     */
    function argon2id(options) {
        return __awaiter(this, void 0, void 0, function* () {
            validateOptions(options);
            return argon2Internal(Object.assign(Object.assign({}, options), { hashType: 'id' }));
        });
    }
    /**
     * Calculates hash using the argon2d password-hashing function
     * @returns Computed hash
     */
    function argon2d(options) {
        return __awaiter(this, void 0, void 0, function* () {
            validateOptions(options);
            return argon2Internal(Object.assign(Object.assign({}, options), { hashType: 'd' }));
        });
    }
    const getHashParameters = (password, encoded) => {
        const regex = /^\$argon2(id|i|d)\$v=([0-9]+)\$((?:[mtp]=[0-9]+,){2}[mtp]=[0-9]+)\$([A-Za-z0-9+/]+)\$([A-Za-z0-9+/]+)$/;
        const match = encoded.match(regex);
        if (!match) {
            throw new Error('Invalid hash');
        }
        const [, hashType, version, parameters, salt, hash] = match;
        if (version !== '19') {
            throw new Error(`Unsupported version: ${version}`);
        }
        const parsedParameters = {};
        const paramMap = { m: 'memorySize', p: 'parallelism', t: 'iterations' };
        parameters.split(',').forEach((x) => {
            const [n, v] = x.split('=');
            parsedParameters[paramMap[n]] = parseInt(v, 10);
        });
        return Object.assign(Object.assign({}, parsedParameters), { password, hashType: hashType, salt: decodeBase64(salt), hashLength: getDecodeBase64Length(hash), outputType: 'encoded' });
    };
    const validateVerifyOptions = (options) => {
        if (!options || typeof options !== 'object') {
            throw new Error('Invalid options parameter. It requires an object.');
        }
        if (options.hash === undefined || typeof options.hash !== 'string') {
            throw new Error('Hash should be specified');
        }
    };
    /**
     * Verifies password using the argon2 password-hashing function
     * @returns True if the encoded hash matches the password
     */
    function argon2Verify(options) {
        return __awaiter(this, void 0, void 0, function* () {
            validateVerifyOptions(options);
            const params = getHashParameters(options.password, options.hash);
            validateOptions(params);
            const hashStart = options.hash.lastIndexOf('$') + 1;
            const result = yield argon2Internal(params);
            return result.substring(hashStart) === options.hash.substring(hashStart);
        });
    }

    var name$2 = "blake2s.wasm";
    var data$2 = "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";
    var wasmJson$2 = {
    	name: name$2,
    	data: data$2
    };

    const mutex$1 = new Mutex();
    let wasmCache$1 = null;
    function validateBits$1(bits) {
        if (!Number.isInteger(bits) || bits < 8 || bits > 256 || bits % 8 !== 0) {
            return new Error('Invalid variant! Valid values: 8, 16, ..., 256');
        }
        return null;
    }
    function getInitParam$1(outputBits, keyBits) {
        // eslint-disable-next-line no-bitwise
        return outputBits | (keyBits << 16);
    }
    /**
     * Calculates BLAKE2s hash
     * @param data Input data (string, Buffer or TypedArray)
     * @param bits Number of output bits, which has to be a number
     *             divisible by 8, between 8 and 256. Defaults to 256.
     * @param key Optional key (string, Buffer or TypedArray). Maximum length is 32 bytes.
     * @returns Computed hash as a hexadecimal string
     */
    function blake2s(data, bits = 256, key = null) {
        if (validateBits$1(bits)) {
            return Promise.reject(validateBits$1(bits));
        }
        let keyBuffer = null;
        let initParam = bits;
        if (key !== null) {
            keyBuffer = getUInt8Buffer(key);
            if (keyBuffer.length > 32) {
                return Promise.reject(new Error('Max key length is 32 bytes'));
            }
            initParam = getInitParam$1(bits, keyBuffer.length);
        }
        const hashLength = bits / 8;
        if (wasmCache$1 === null || wasmCache$1.hashLength !== hashLength) {
            return lockedCreate(mutex$1, wasmJson$2, hashLength)
                .then((wasm) => {
                wasmCache$1 = wasm;
                if (initParam > 512) {
                    wasmCache$1.writeMemory(keyBuffer);
                }
                return wasmCache$1.calculate(data, initParam);
            });
        }
        try {
            if (initParam > 512) {
                wasmCache$1.writeMemory(keyBuffer);
            }
            const hash = wasmCache$1.calculate(data, initParam);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new BLAKE2s hash instance
     * @param bits Number of output bits, which has to be a number
     *             divisible by 8, between 8 and 256. Defaults to 256.
     * @param key Optional key (string, Buffer or TypedArray). Maximum length is 32 bytes.
     */
    function createBLAKE2s(bits = 256, key = null) {
        if (validateBits$1(bits)) {
            return Promise.reject(validateBits$1(bits));
        }
        let keyBuffer = null;
        let initParam = bits;
        if (key !== null) {
            keyBuffer = getUInt8Buffer(key);
            if (keyBuffer.length > 32) {
                return Promise.reject(new Error('Max key length is 32 bytes'));
            }
            initParam = getInitParam$1(bits, keyBuffer.length);
        }
        const outputSize = bits / 8;
        return WASMInterface(wasmJson$2, outputSize).then((wasm) => {
            if (initParam > 512) {
                wasm.writeMemory(keyBuffer);
            }
            wasm.init(initParam);
            const obj = {
                init: initParam > 512
                    ? () => {
                        wasm.writeMemory(keyBuffer);
                        wasm.init(initParam);
                        return obj;
                    }
                    : () => {
                        wasm.init(initParam);
                        return obj;
                    },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 64,
                digestSize: outputSize,
            };
            return obj;
        });
    }

    var name$3 = "crc32.wasm";
    var data$3 = "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";
    var wasmJson$3 = {
    	name: name$3,
    	data: data$3
    };

    const mutex$2 = new Mutex();
    let wasmCache$2 = null;
    /**
     * Calculates CRC-32 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function crc32(data) {
        if (wasmCache$2 === null) {
            return lockedCreate(mutex$2, wasmJson$3, 4)
                .then((wasm) => {
                wasmCache$2 = wasm;
                return wasmCache$2.calculate(data);
            });
        }
        try {
            const hash = wasmCache$2.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new CRC-32 hash instance
     */
    function createCRC32() {
        return WASMInterface(wasmJson$3, 4).then((wasm) => {
            wasm.init();
            const obj = {
                init: () => { wasm.init(); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 4,
                digestSize: 4,
            };
            return obj;
        });
    }

    var name$4 = "md4.wasm";
    var data$4 = "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";
    var wasmJson$4 = {
    	name: name$4,
    	data: data$4
    };

    const mutex$3 = new Mutex();
    let wasmCache$3 = null;
    /**
     * Calculates MD4 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function md4(data) {
        if (wasmCache$3 === null) {
            return lockedCreate(mutex$3, wasmJson$4, 16)
                .then((wasm) => {
                wasmCache$3 = wasm;
                return wasmCache$3.calculate(data);
            });
        }
        try {
            const hash = wasmCache$3.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new MD4 hash instance
     */
    function createMD4() {
        return WASMInterface(wasmJson$4, 16).then((wasm) => {
            wasm.init();
            const obj = {
                init: () => { wasm.init(); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 64,
                digestSize: 16,
            };
            return obj;
        });
    }

    var name$5 = "md5.wasm";
    var data$5 = "AGFzbQEAAAABEgRgAAF/YAAAYAF/AGACf38BfwMHBgABAgMBAgQFAXABAQEFBAEBBAQGCAF/AUGgiQULB1MGBm1lbW9yeQIADkhhc2hfR2V0QnVmZmVyAAAJSGFzaF9Jbml0AAELSGFzaF9VcGRhdGUAAgpIYXNoX0ZpbmFsAAQOSGFzaF9DYWxjdWxhdGUABQqsFgYFAEGACAstAEEAQv6568XpjpWZEDcCkIgBQQBCgcaUupbx6uZvNwKIiAFBAEIANwKAiAEL6AIBA39BAEEAKAKAiAEiASAAakH/////AXEiAjYCgIgBQQAoAoSIASEDAkAgAiABTw0AQQAgA0EBaiIDNgKEiAELQQAgAyAAQR12ajYChIgBAkACQAJAAkACQAJAIAFBP3EiAw0AQYAIIQIMAQtBwAAgA2siAiAASw0BIANBGGohA0EAIQEDQCADIAFqQYCIAWogAUGACGotAAA6AAAgAyABQQFqIgFqQdgARw0AC0GYiAFBwAAQAxogACACayEAIAJBgAhqIQILIABBwABPDQEgACEDDAILIABFDQJBACEBIANBmIgBakEALQCACDoAACAAQQFGDQIgA0GZiAFqIQMgAEF/aiECA0AgAyABaiABQYEIai0AADoAACACIAFBAWoiAUcNAAwDCwsgAEE/cSEDIAIgAEFAcRADIQILIANFDQBBACEBA0AgAUGYiAFqIAIgAWotAAA6AAAgAyABQQFqIgFHDQALCwu0EAEZf0EAKAKUiAEhAkEAKAKQiAEhA0EAKAKMiAEhBEEAKAKIiAEhBQNAIABBCGooAgAiBiAAQRhqKAIAIgcgAEEoaigCACIIIABBOGooAgAiCSAAQTxqKAIAIgogAEEMaigCACILIABBHGooAgAiDCAAQSxqKAIAIg0gDCALIAogDSAJIAggByADIAZqIAIgAEEEaigCACIOaiAFIAQgAiADc3EgAnNqIAAoAgAiD2pB+Miqu31qQQd3IARqIhAgBCADc3EgA3NqQdbunsZ+akEMdyAQaiIRIBAgBHNxIARzakHb4YGhAmpBEXcgEWoiEmogAEEUaigCACITIBFqIABBEGooAgAiFCAQaiAEIAtqIBIgESAQc3EgEHNqQe6d9418akEWdyASaiIQIBIgEXNxIBFzakGvn/Crf2pBB3cgEGoiESAQIBJzcSASc2pBqoyfvARqQQx3IBFqIhIgESAQc3EgEHNqQZOMwcF6akERdyASaiIVaiAAQSRqKAIAIhYgEmogAEEgaigCACIXIBFqIAwgEGogFSASIBFzcSARc2pBgaqaampBFncgFWoiECAVIBJzcSASc2pB2LGCzAZqQQd3IBBqIhEgECAVc3EgFXNqQa/vk9p4akEMdyARaiISIBEgEHNxIBBzakGxt31qQRF3IBJqIhVqIABBNGooAgAiGCASaiAAQTBqKAIAIhkgEWogDSAQaiAVIBIgEXNxIBFzakG+r/PKeGpBFncgFWoiECAVIBJzcSASc2pBoqLA3AZqQQd3IBBqIhEgECAVc3EgFXNqQZPj4WxqQQx3IBFqIhUgESAQc3EgEHNqQY6H5bN6akERdyAVaiISaiAHIBVqIA4gEWogCiAQaiASIBUgEXNxIBFzakGhkNDNBGpBFncgEmoiECAScyAVcSASc2pB4sr4sH9qQQV3IBBqIhEgEHMgEnEgEHNqQcDmgoJ8akEJdyARaiISIBFzIBBxIBFzakHRtPmyAmpBDncgEmoiFWogCCASaiATIBFqIA8gEGogFSAScyARcSASc2pBqo/bzX5qQRR3IBVqIhAgFXMgEnEgFXNqQd2gvLF9akEFdyAQaiIRIBBzIBVxIBBzakHTqJASakEJdyARaiISIBFzIBBxIBFzakGBzYfFfWpBDncgEmoiFWogCSASaiAWIBFqIBQgEGogFSAScyARcSASc2pByPfPvn5qQRR3IBVqIhAgFXMgEnEgFXNqQeabh48CakEFdyAQaiIRIBBzIBVxIBBzakHWj9yZfGpBCXcgEWoiEiARcyAQcSARc2pBh5vUpn9qQQ53IBJqIhVqIAYgEmogGCARaiAXIBBqIBUgEnMgEXEgEnNqQe2p6KoEakEUdyAVaiIQIBVzIBJxIBVzakGF0o/PempBBXcgEGoiESAQcyAVcSAQc2pB+Me+Z2pBCXcgEWoiEiARcyAQcSARc2pB2YW8uwZqQQ53IBJqIhVqIBcgEmogEyARaiAZIBBqIBUgEnMgEXEgEnNqQYqZqel4akEUdyAVaiIQIBVzIhUgEnNqQcLyaGpBBHcgEGoiESAVc2pBge3Hu3hqQQt3IBFqIhIgEXMiGiAQc2pBosL17AZqQRB3IBJqIhVqIBQgEmogDiARaiAJIBBqIBUgGnNqQYzwlG9qQRd3IBVqIhAgFXMiFSASc2pBxNT7pXpqQQR3IBBqIhEgFXNqQamf+94EakELdyARaiISIBFzIgkgEHNqQeCW7bV/akEQdyASaiIVaiAPIBJqIBggEWogCCAQaiAVIAlzakHw+P71e2pBF3cgFWoiECAVcyIVIBJzakHG/e3EAmpBBHcgEGoiESAVc2pB+s+E1X5qQQt3IBFqIhIgEXMiCCAQc2pBheG8p31qQRB3IBJqIhVqIBkgEmogFiARaiAHIBBqIBUgCHNqQYW6oCRqQRd3IBVqIhEgFXMiECASc2pBuaDTzn1qQQR3IBFqIhIgEHNqQeWz7rZ+akELdyASaiIVIBJzIgcgEXNqQfj5if0BakEQdyAVaiIQaiAMIBVqIA8gEmogBiARaiAQIAdzakHlrLGlfGpBF3cgEGoiESAVQX9zciAQc2pBxMSkoX9qQQZ3IBFqIhIgEEF/c3IgEXNqQZf/q5kEakEKdyASaiIQIBFBf3NyIBJzakGnx9DcempBD3cgEGoiFWogCyAQaiAZIBJqIBMgEWogFSASQX9zciAQc2pBucDOZGpBFXcgFWoiESAQQX9zciAVc2pBw7PtqgZqQQZ3IBFqIhAgFUF/c3IgEXNqQZKZs/h4akEKdyAQaiISIBFBf3NyIBBzakH96L9/akEPdyASaiIVaiAKIBJqIBcgEGogDiARaiAVIBBBf3NyIBJzakHRu5GseGpBFXcgFWoiECASQX9zciAVc2pBz/yh/QZqQQZ3IBBqIhEgFUF/c3IgEHNqQeDNs3FqQQp3IBFqIhIgEEF/c3IgEXNqQZSGhZh6akEPdyASaiIVaiANIBJqIBQgEWogGCAQaiAVIBFBf3NyIBJzakGho6DwBGpBFXcgFWoiECASQX9zciAVc2pBgv3Nun9qQQZ3IBBqIhEgFUF/c3IgEHNqQbXk6+l7akEKdyARaiISIBBBf3NyIBFzakG7pd/WAmpBD3cgEmoiFSAEaiAWIBBqIBUgEUF/c3IgEnNqQZGnm9x+akEVd2ohBCAVIANqIQMgEiACaiECIBEgBWohBSAAQcAAaiEAIAFBQGoiAQ0AC0EAIAI2ApSIAUEAIAM2ApCIAUEAIAQ2AoyIAUEAIAU2AoiIASAAC6ECAQN/QQAoAoCIASIAQT9xIgFBmIgBakGAAToAAAJAAkACQCABQT9zIgJBB0sNAAJAIAJFDQAgAUGZiAFqIQADQCAAQQA6AAAgAEEBaiEAIAJBf2oiAg0ACwtBwAAhAkGYiAFBwAAQAxpBACEADAELIAJBCEYNASABQQFqIQALIABBj4gBaiEBA0AgASACakEAOgAAIAJBd2ohACACQX9qIQIgAEEASg0AC0EAKAKAiAEhAAtBACAAQRV2OgDTiAFBACAAQQ12OgDSiAFBACAAQQV2OgDRiAFBACAAQQN0IgI6ANCIAUEAIAI2AoCIAUEAQQAoAoSIATYC1IgBQZiIAUHAABADGkEAQQApAoiIATcDgAhBAEEAKQKQiAE3A4gICzMAQQBC/rnrxemOlZkQNwKQiAFBAEKBxpS6lvHq5m83AoiIAUEAQgA3AoCIASAAEAIQBAs=";
    var wasmJson$5 = {
    	name: name$5,
    	data: data$5
    };

    const mutex$4 = new Mutex();
    let wasmCache$4 = null;
    /**
     * Calculates MD5 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function md5(data) {
        if (wasmCache$4 === null) {
            return lockedCreate(mutex$4, wasmJson$5, 16)
                .then((wasm) => {
                wasmCache$4 = wasm;
                return wasmCache$4.calculate(data);
            });
        }
        try {
            const hash = wasmCache$4.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new MD5 hash instance
     */
    function createMD5() {
        return WASMInterface(wasmJson$5, 16).then((wasm) => {
            wasm.init();
            const obj = {
                init: () => { wasm.init(); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 64,
                digestSize: 16,
            };
            return obj;
        });
    }

    var name$6 = "sha1.wasm";
    var data$6 = "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";
    var wasmJson$6 = {
    	name: name$6,
    	data: data$6
    };

    const mutex$5 = new Mutex();
    let wasmCache$5 = null;
    /**
     * Calculates SHA-1 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function sha1(data) {
        if (wasmCache$5 === null) {
            return lockedCreate(mutex$5, wasmJson$6, 20)
                .then((wasm) => {
                wasmCache$5 = wasm;
                return wasmCache$5.calculate(data);
            });
        }
        try {
            const hash = wasmCache$5.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new SHA-1 hash instance
     */
    function createSHA1() {
        return WASMInterface(wasmJson$6, 20).then((wasm) => {
            wasm.init();
            const obj = {
                init: () => { wasm.init(); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 64,
                digestSize: 20,
            };
            return obj;
        });
    }

    var name$7 = "sha3.wasm";
    var data$7 = "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";
    var wasmJson$7 = {
    	name: name$7,
    	data: data$7
    };

    const mutex$6 = new Mutex();
    let wasmCache$6 = null;
    function validateBits$2(bits) {
        if (![224, 256, 384, 512].includes(bits)) {
            return new Error('Invalid variant! Valid values: 224, 256, 384, 512');
        }
        return null;
    }
    /**
     * Calculates SHA-3 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @param bits Number of output bits. Valid values: 224, 256, 384, 512
     * @returns Computed hash as a hexadecimal string
     */
    function sha3(data, bits = 512) {
        if (validateBits$2(bits)) {
            return Promise.reject(validateBits$2(bits));
        }
        const hashLength = bits / 8;
        if (wasmCache$6 === null || wasmCache$6.hashLength !== hashLength) {
            return lockedCreate(mutex$6, wasmJson$7, hashLength)
                .then((wasm) => {
                wasmCache$6 = wasm;
                return wasmCache$6.calculate(data, bits, 0x06);
            });
        }
        try {
            const hash = wasmCache$6.calculate(data, bits, 0x06);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new SHA-3 hash instance
     * @param bits Number of output bits. Valid values: 224, 256, 384, 512
     */
    function createSHA3(bits = 512) {
        if (validateBits$2(bits)) {
            return Promise.reject(validateBits$2(bits));
        }
        const outputSize = bits / 8;
        return WASMInterface(wasmJson$7, outputSize).then((wasm) => {
            wasm.init(bits);
            const obj = {
                init: () => { wasm.init(bits); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType, 0x06),
                blockSize: 200 - 2 * outputSize,
                digestSize: outputSize,
            };
            return obj;
        });
    }

    const mutex$7 = new Mutex();
    let wasmCache$7 = null;
    function validateBits$3(bits) {
        if (![224, 256, 384, 512].includes(bits)) {
            return new Error('Invalid variant! Valid values: 224, 256, 384, 512');
        }
        return null;
    }
    /**
     * Calculates Keccak hash
     * @param data Input data (string, Buffer or TypedArray)
     * @param bits Number of output bits. Valid values: 224, 256, 384, 512
     * @returns Computed hash as a hexadecimal string
     */
    function keccak(data, bits = 512) {
        if (validateBits$3(bits)) {
            return Promise.reject(validateBits$3(bits));
        }
        const hashLength = bits / 8;
        if (wasmCache$7 === null || wasmCache$7.hashLength !== hashLength) {
            return lockedCreate(mutex$7, wasmJson$7, hashLength)
                .then((wasm) => {
                wasmCache$7 = wasm;
                return wasmCache$7.calculate(data, bits, 0x01);
            });
        }
        try {
            const hash = wasmCache$7.calculate(data, bits, 0x01);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new Keccak hash instance
     * @param bits Number of output bits. Valid values: 224, 256, 384, 512
     */
    function createKeccak(bits = 512) {
        if (validateBits$3(bits)) {
            return Promise.reject(validateBits$3(bits));
        }
        const outputSize = bits / 8;
        return WASMInterface(wasmJson$7, outputSize).then((wasm) => {
            wasm.init(bits);
            const obj = {
                init: () => { wasm.init(bits); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType, 0x01),
                blockSize: 200 - 2 * outputSize,
                digestSize: outputSize,
            };
            return obj;
        });
    }

    var name$8 = "sha256.wasm";
    var data$8 = "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cSAKc2ogE0EadyATQRV3cyATQQd3c2pB59KkoQFqIhUgAkEedyACQRN3cyACQQp3cyACIARzIANxIAIgBHFzaiAZaiIDaiIUaiAjIBNqICYgEmogFCATIBJzcSAScyAKaiAiaiAUQRp3IBRBFXdzIBRBB3dzakGFldy9AmoiGSADQR53IANBE3dzIANBCndzIAMgAnMgBHEgAyACcXNqIBtqIgRqIgogFCATc3EgE3NqIApBGncgCkEVd3MgCkEHd3NqQbjC7PACaiIbIARBHncgBEETd3MgBEEKd3MgBCADcyACcSAEIANxc2ogGmoiAmoiEiAKIBRzcSAUc2ogEkEadyASQRV3cyASQQd3c2pB/Nux6QRqIhogAkEedyACQRN3cyACQQp3cyACIARzIANxIAIgBHFzaiAYaiIDaiITIBIgCnNxIApzaiATQRp3IBNBFXdzIBNBB3dzakGTmuCZBWoiGCADQR53IANBE3dzIANBCndzIAMgAnMgBHEgAyACcXNqIBVqIgRqIhRqICUgE2ogKCASaiAKICRqIBQgEyASc3EgEnNqIBRBGncgFEEVd3MgFEEHd3NqQdTmqagGaiIVIARBHncgBEETd3MgBEEKd3MgBCADcyACcSAEIANxc2ogGWoiAmoiCiAUIBNzcSATc2ogCkEadyAKQRV3cyAKQQd3c2pBu5WoswdqIhkgAkEedyACQRN3cyACQQp3cyACIARzIANxIAIgBHFzaiAbaiIDaiISIAogFHNxIBRzaiASQRp3IBJBFXdzIBJBB3dzakGukouOeGoiGyADQR53IANBE3dzIANBCndzIAMgAnMgBHEgAyACcXNqIBpqIgRqIhMgEiAKc3EgCnNqIBNBGncgE0EVd3MgE0EHd3NqQYXZyJN5aiIaIARBHncgBEETd3MgBEEKd3MgBCADcyACcSAEIANxc2ogGGoiAmoiFGogLiATaiAqIBJqIC0gCmogFCATIBJzcSASc2ogFEEadyAUQRV3cyAUQQd3c2pBodH/lXpqIhggAkEedyACQRN3cyACQQp3cyACIARzIANxIAIgBHFzaiAVaiIDaiIKIBQgE3NxIBNzaiAKQRp3IApBFXdzIApBB3dzakHLzOnAemoiFSADQR53IANBE3dzIANBCndzIAMgAnMgBHEgAyACcXNqIBlqIgRqIhIgCiAU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";
    var wasmJson$8 = {
    	name: name$8,
    	data: data$8
    };

    const mutex$8 = new Mutex();
    let wasmCache$8 = null;
    /**
     * Calculates SHA-2 (SHA-224) hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function sha224(data) {
        if (wasmCache$8 === null) {
            return lockedCreate(mutex$8, wasmJson$8, 28)
                .then((wasm) => {
                wasmCache$8 = wasm;
                return wasmCache$8.calculate(data, 224);
            });
        }
        try {
            const hash = wasmCache$8.calculate(data, 224);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new SHA-2 (SHA-224) hash instance
     */
    function createSHA224() {
        return WASMInterface(wasmJson$8, 28).then((wasm) => {
            wasm.init(224);
            const obj = {
                init: () => { wasm.init(224); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 64,
                digestSize: 28,
            };
            return obj;
        });
    }

    const mutex$9 = new Mutex();
    let wasmCache$9 = null;
    /**
     * Calculates SHA-2 (SHA-256) hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function sha256(data) {
        if (wasmCache$9 === null) {
            return lockedCreate(mutex$9, wasmJson$8, 32)
                .then((wasm) => {
                wasmCache$9 = wasm;
                return wasmCache$9.calculate(data, 256);
            });
        }
        try {
            const hash = wasmCache$9.calculate(data, 256);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new SHA-2 (SHA-256) hash instance
     */
    function createSHA256() {
        return WASMInterface(wasmJson$8, 32).then((wasm) => {
            wasm.init(256);
            const obj = {
                init: () => { wasm.init(256); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 64,
                digestSize: 32,
            };
            return obj;
        });
    }

    var name$9 = "sha512.wasm";
    var data$9 = "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";
    var wasmJson$9 = {
    	name: name$9,
    	data: data$9
    };

    const mutex$a = new Mutex();
    let wasmCache$a = null;
    /**
     * Calculates SHA-2 (SHA-384) hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function sha384(data) {
        if (wasmCache$a === null) {
            return lockedCreate(mutex$a, wasmJson$9, 48)
                .then((wasm) => {
                wasmCache$a = wasm;
                return wasmCache$a.calculate(data, 384);
            });
        }
        try {
            const hash = wasmCache$a.calculate(data, 384);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new SHA-2 (SHA-384) hash instance
     */
    function createSHA384() {
        return WASMInterface(wasmJson$9, 48).then((wasm) => {
            wasm.init(384);
            const obj = {
                init: () => { wasm.init(384); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 128,
                digestSize: 48,
            };
            return obj;
        });
    }

    const mutex$b = new Mutex();
    let wasmCache$b = null;
    /**
     * Calculates SHA-2 (SHA-512) hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function sha512(data) {
        if (wasmCache$b === null) {
            return lockedCreate(mutex$b, wasmJson$9, 64)
                .then((wasm) => {
                wasmCache$b = wasm;
                return wasmCache$b.calculate(data, 512);
            });
        }
        try {
            const hash = wasmCache$b.calculate(data, 512);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new SHA-2 (SHA-512) hash instance
     */
    function createSHA512() {
        return WASMInterface(wasmJson$9, 64).then((wasm) => {
            wasm.init(512);
            const obj = {
                init: () => { wasm.init(512); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 128,
                digestSize: 64,
            };
            return obj;
        });
    }

    var name$a = "xxhash32.wasm";
    var data$a = "AGFzbQEAAAABEQRgAAF/YAF/AGAAAGACf38AAwYFAAEBAgMEBQFwAQEBBQQBAQQEBggBfwFB0IgFCwdTBgZtZW1vcnkCAA5IYXNoX0dldEJ1ZmZlcgAACUhhc2hfSW5pdAABC0hhc2hfVXBkYXRlAAIKSGFzaF9GaW5hbAADDkhhc2hfQ2FsY3VsYXRlAAQK/QgFBQBBgAgLTQBBACAANgK4iAFBAEIANwOIiAFBACAAQfeUr694ajYCsIgBQQAgAEGoiI2hAmo2AqCIAUEAIABBz4yijgZqNgLAiAFBAEEANgKAiAELhQUBB38CQCAARQ0AQQAhAUEAQQApA4iIASAArXw3A4iIAQJAQQAoAoCIASICIABqQQ9LDQADQCACIAFqQZCIAWogAUGACGotAAA6AAAgACABQQFqIgFHDQALQQAgAiABajYCgIgBDwsgAEHwB2ohAwJAAkAgAg0AQQAoAsCIASEEQQAoAriIASEFQQAoArCIASEGQQAoAqCIASEHQYAIIQEMAQtBgAghAQJAIAJBD0sNAEGACCEBA0AgAkGQiAFqIAEtAAA6AAAgAUEBaiEBIAJBD0khBCACQQFqIgUhAiAEDQALQQAgBTYCgIgBC0EAQQAoApCIAUH3lK+veGxBACgCoIgBakENd0Gx893xeWwiBzYCoIgBQQBBACgClIgBQfeUr694bEEAKAKwiAFqQQ13QbHz3fF5bCIGNgKwiAFBAEEAKAKYiAFB95Svr3hsQQAoAriIAWpBDXdBsfPd8XlsIgU2AriIAUEAQQAoApyIAUH3lK+veGxBACgCwIgBakENd0Gx893xeWwiBDYCwIgBCyAAQYAIaiEAAkAgASADSw0AA0AgASgCAEH3lK+veGwgB2pBDXdBsfPd8XlsIQcgAUEMaigCAEH3lK+veGwgBGpBDXdBsfPd8XlsIQQgAUEIaigCAEH3lK+veGwgBWpBDXdBsfPd8XlsIQUgAUEEaigCAEH3lK+veGwgBmpBDXdBsfPd8XlsIQYgAUEQaiIBIANNDQALC0EAIQJBACAGNgKwiAFBACAHNgKgiAFBACAFNgK4iAFBACAENgLAiAFBACAAIAFrIgA2AoCIASAARQ0AA0AgAkGQiAFqIAEgAmotAAA6AAAgACACQQFqIgJHDQALCwvLAgIBfgZ/QQApA4iIASIApyEBAkACQCAAQhBUDQBBACgCsIgBQQd3QQAoAqCIAUEBd2pBACgCuIgBQQx3akEAKALAiAFBEndqIQIMAQtBACgCuIgBQbHP2bIBaiECCyACIAFqIQJBkIgBIQFBACgCgIgBIgNBkIgBaiEEAkAgA0EESA0AQZCIASEFA0AgBSgCAEG93MqVfGwgAmpBEXdBr9bTvgJsIQIgBUEIaiEGIAVBBGoiASEFIAYgBE0NAAsLAkAgASAERg0AIANBkIgBaiEFA0AgAS0AAEGxz9myAWwgAmpBC3dBsfPd8XlsIQIgBSABQQFqIgFHDQALC0EAIAJBD3YgAnNB95Svr3hsIgFBDXYgAXNBvdzKlXxsIgFBEHYiAjoAgQhBACABQRh2OgCACEEAIAIgAXMiAToAgwhBACABQQh2OgCCCAtTAEEAIAE2AriIAUEAQgA3A4iIAUEAIAFB95Svr3hqNgKwiAFBACABQaiIjaECajYCoIgBQQAgAUHPjKKOBmo2AsCIAUEAQQA2AoCIASAAEAIQAws=";
    var wasmJson$a = {
    	name: name$a,
    	data: data$a
    };

    const mutex$c = new Mutex();
    let wasmCache$c = null;
    function validateSeed(seed) {
        if (!Number.isInteger(seed) || seed < 0 || seed > 0xFFFFFFFF) {
            return new Error('Seed must be a valid 32-bit long unsigned integer.');
        }
        return null;
    }
    /**
     * Calculates xxHash32 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @param seed Number used to initialize the internal state of the algorithm (defaults to 0)
     * @returns Computed hash as a hexadecimal string
     */
    function xxhash32(data, seed = 0) {
        if (validateSeed(seed)) {
            return Promise.reject(validateSeed(seed));
        }
        if (wasmCache$c === null) {
            return lockedCreate(mutex$c, wasmJson$a, 4)
                .then((wasm) => {
                wasmCache$c = wasm;
                return wasmCache$c.calculate(data, seed);
            });
        }
        try {
            const hash = wasmCache$c.calculate(data, seed);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new xxHash32 hash instance
     * @param data Input data (string, Buffer or TypedArray)
     * @param seed Number used to initialize the internal state of the algorithm (defaults to 0)
     */
    function createXXHash32(seed = 0) {
        if (validateSeed(seed)) {
            return Promise.reject(validateSeed(seed));
        }
        return WASMInterface(wasmJson$a, 4).then((wasm) => {
            wasm.init(seed);
            const obj = {
                init: () => { wasm.init(seed); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 16,
                digestSize: 4,
            };
            return obj;
        });
    }

    var name$b = "xxhash64.wasm";
    var data$b = "AGFzbQEAAAABDANgAAF/YAAAYAF/AAMGBQABAgEBBAUBcAEBAQUEAQEEBAYIAX8BQfCIBQsHUwYGbWVtb3J5AgAOSGFzaF9HZXRCdWZmZXIAAAlIYXNoX0luaXQAAQtIYXNoX1VwZGF0ZQACCkhhc2hfRmluYWwAAw5IYXNoX0NhbGN1bGF0ZQAECuEMBQUAQYAIC2MBAX5BAEIANwOIiAFBAEEAKQOACCIANwPQiAFBACAAQtbrgu7q/Yn14AB8NwOwiAFBACAAQs/W077Sx6vZQnw3A8CIAUEAIABC+erQ0OfJoeThAHw3A+CIAUEAQQA2AoCIAQvRBQMDfwR+An8CQCAARQ0AQQAhAUEAQQApA4iIASAArXw3A4iIAQJAQQAoAoCIASICIABqQR9LDQADQCACIAFqQZCIAWogAUGACGotAAA6AAAgACABQQFqIgFHDQALQQAgAiABajYCgIgBDwsgAEHgB2ohAwJAAkAgAg0AQQApA+CIASEEQQApA9CIASEFQQApA8CIASEGQQApA7CIASEHQYAIIQEMAQtBgAghAQJAIAJBH0sNAEGACCEBA0AgAkGQiAFqIAEtAAA6AAAgAUEBaiEBIAJBH0khCCACQQFqIgkhAiAIDQALQQAgCTYCgIgBC0EAQQApA5CIAULP1tO+0ser2UJ+QQApA7CIAXxCH4lCh5Wvr5i23puef34iBzcDsIgBQQBBACkDmIgBQs/W077Sx6vZQn5BACkDwIgBfEIfiUKHla+vmLbem55/fiIGNwPAiAFBAEEAKQOgiAFCz9bTvtLHq9lCfkEAKQPQiAF8Qh+JQoeVr6+Ytt6bnn9+IgU3A9CIAUEAQQApA6iIAULP1tO+0ser2UJ+QQApA+CIAXxCH4lCh5Wvr5i23puef34iBDcD4IgBCyAAQYAIaiEAAkAgASADSw0AA0AgASkDAELP1tO+0ser2UJ+IAd8Qh+JQoeVr6+Ytt6bnn9+IQcgAUEYaikDAELP1tO+0ser2UJ+IAR8Qh+JQoeVr6+Ytt6bnn9+IQQgAUEQaikDAELP1tO+0ser2UJ+IAV8Qh+JQoeVr6+Ytt6bnn9+IQUgAUEIaikDAELP1tO+0ser2UJ+IAZ8Qh+JQoeVr6+Ytt6bnn9+IQYgAUEgaiIBIANNDQALC0EAIQJBACAGNwPAiAFBACAHNwOwiAFBACAFNwPQiAFBACAENwPgiAFBACAAIAFrIgA2AoCIASAARQ0AA0AgAkGQiAFqIAEgAmotAAA6AAAgACACQQFqIgJHDQALCwueBgIFfgV/AkACQEEAKQOIiAEiAEIgVA0AQQApA8CIASIBQgeJQQApA7CIASICQgGJfEEAKQPQiAEiA0IMiXxBACkD4IgBIgRCEol8IAJCz9bTvtLHq9lCfkIhiCACQoCAgID4tJ31k39+hEKHla+vmLbem55/foVCh5Wvr5i23puef35C49zKlfzO8vWFf3wgAULP1tO+0ser2UJ+QiGIIAFCgICAgPi0nfWTf36EQoeVr6+Ytt6bnn9+hUKHla+vmLbem55/fkLj3MqV/M7y9YV/fCADQs/W077Sx6vZQn5CIYggA0KAgICA+LSd9ZN/foRCh5Wvr5i23puef36FQoeVr6+Ytt6bnn9+QuPcypX8zvL1hX98IARCz9bTvtLHq9lCfkIhiCAEQoCAgID4tJ31k39+hEKHla+vmLbem55/foVCh5Wvr5i23puef35C49zKlfzO8vWFf3whAQwBC0EAKQPQiAFCxc/ZsvHluuonfCEBCyABIAB8IQBBkIgBIQVBACgCgIgBIgZBkIgBaiEHAkAgBkEISA0AQZCIASEIA0AgCCkDACIBQs/W077Sx6vZQn5CIYggAUKAgICA+LSd9ZN/foRCh5Wvr5i23puef34gAIVCG4lCh5Wvr5i23puef35C49zKlfzO8vWFf3whACAIQRBqIQkgCEEIaiIFIQggCSAHTQ0ACwsCQAJAIAVBBGoiCCAHTQ0AIAUhCAwBCyAFNQIAQoeVr6+Ytt6bnn9+IACFQheJQs/W077Sx6vZQn5C+fPd8Zn2masWfCEACwJAIAggB0YNACAGQZCIAWohCQNAIAgxAABCxc/ZsvHluuonfiAAhUILiUKHla+vmLbem55/fiEAIAkgCEEBaiIIRw0ACwtBACAAQiGIIACFQs/W077Sx6vZQn4iAEIdiCAAhUL5893xmfaZqxZ+IgBCIIgiATwAgwhBACAAQiiIPACCCEEAIABCMIg8AIEIQQAgAEI4iDwAgAhBACABIACFIgA8AIcIQQAgAKciCEEIdjoAhghBACAIQRB2OgCFCEEAIAhBGHY6AIQICwIACw==";
    var wasmJson$b = {
    	name: name$b,
    	data: data$b
    };

    const mutex$d = new Mutex();
    let wasmCache$d = null;
    const seedBuffer = new ArrayBuffer(8);
    function validateSeed$1(seed) {
        if (!Number.isInteger(seed) || seed < 0 || seed > 0xFFFFFFFF) {
            return new Error('Seed must be given as two valid 32-bit long unsigned integer (lo + high).');
        }
        return null;
    }
    function writeSeed(arr, low, high) {
        // write in little-endian format
        const buffer = new DataView(arr);
        buffer.setUint32(0, low, true);
        buffer.setUint32(4, high, true);
    }
    /**
     * Calculates xxHash64 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @param seedLow Lower 32 bits of the number used to
     *  initialize the internal state of the algorithm (defaults to 0)
     * @param seedHigh Higher 32 bits of the number used to
     *  initialize the internal state of the algorithm (defaults to 0)
     * @returns Computed hash as a hexadecimal string
     */
    function xxhash64(data, seedLow = 0, seedHigh = 0) {
        if (validateSeed$1(seedLow)) {
            return Promise.reject(validateSeed$1(seedLow));
        }
        if (validateSeed$1(seedHigh)) {
            return Promise.reject(validateSeed$1(seedHigh));
        }
        if (wasmCache$d === null) {
            return lockedCreate(mutex$d, wasmJson$b, 8)
                .then((wasm) => {
                wasmCache$d = wasm;
                writeSeed(seedBuffer, seedLow, seedHigh);
                wasmCache$d.writeMemory(new Uint8Array(seedBuffer));
                return wasmCache$d.calculate(data);
            });
        }
        try {
            writeSeed(seedBuffer, seedLow, seedHigh);
            wasmCache$d.writeMemory(new Uint8Array(seedBuffer));
            const hash = wasmCache$d.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new xxHash64 hash instance
     * @param seedLow Lower 32 bits of the number used to
     *  initialize the internal state of the algorithm (defaults to 0)
     * @param seedHigh Higher 32 bits of the number used to
     *  initialize the internal state of the algorithm (defaults to 0)
     */
    function createXXHash64(seedLow = 0, seedHigh = 0) {
        if (validateSeed$1(seedLow)) {
            return Promise.reject(validateSeed$1(seedLow));
        }
        if (validateSeed$1(seedHigh)) {
            return Promise.reject(validateSeed$1(seedHigh));
        }
        return WASMInterface(wasmJson$b, 8).then((wasm) => {
            const instanceBuffer = new ArrayBuffer(8);
            writeSeed(instanceBuffer, seedLow, seedHigh);
            wasm.writeMemory(new Uint8Array(instanceBuffer));
            wasm.init();
            const obj = {
                init: () => {
                    wasm.writeMemory(new Uint8Array(instanceBuffer));
                    wasm.init();
                    return obj;
                },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 32,
                digestSize: 8,
            };
            return obj;
        });
    }

    var name$c = "ripemd160.wasm";
    var data$c = "AGFzbQEAAAABEQRgAAF/YAAAYAF/AGACf38AAwgHAAECAwIBAgQFAXABAQEFBAEBBAQGCAF/AUGgiQULB2YHBm1lbW9yeQIADkhhc2hfR2V0QnVmZmVyAAAJSGFzaF9Jbml0AAEQcmlwZW1kMTYwX3VwZGF0ZQADC0hhc2hfVXBkYXRlAAQKSGFzaF9GaW5hbAAFDkhhc2hfQ2FsY3VsYXRlAAYK1DEHBQBBwAgLOgBBAEHww8uefDYC2IgBQQBC/rnrxemOlZkQNwLQiAFBAEKBxpS6lvHq5m83AsiIAUEAQgA3AsCIAQumLAEef0EAIAAoAiQiASAAKAIAIgIgACgCECIDIAIgACgCLCIEIAAoAgwiBSAAKAIEIgYgACgCPCIHIAIgACgCMCIIIAcgACgCCCIJQQAoAsiIASIKQQAoAtCIASILQQAoAtSIASIMQX9zckEAKALMiAEiDXNqIAAoAhQiDmpB5peKhQVqQQh3QQAoAtiIASIPaiIQQQp3IhFqIAEgDUEKdyISaiACIAtBCnciE2ogDCAAKAIcIhRqIA8gACgCOCIVaiAQIA0gE0F/c3JzakHml4qFBWpBCXcgDGoiFiAQIBJBf3Nyc2pB5peKhQVqQQl3IBNqIhAgFiARQX9zcnNqQeaXioUFakELdyASaiIXIBAgFkEKdyIWQX9zcnNqQeaXioUFakENdyARaiIYIBcgEEEKdyIZQX9zcnNqQeaXioUFakEPdyAWaiIaQQp3IhtqIAAoAhgiECAYQQp3IhxqIAAoAjQiESAXQQp3IhdqIAMgGWogBCAWaiAaIBggF0F/c3JzakHml4qFBWpBD3cgGWoiFiAaIBxBf3Nyc2pB5peKhQVqQQV3IBdqIhcgFiAbQX9zcnNqQeaXioUFakEHdyAcaiIYIBcgFkEKdyIZQX9zcnNqQeaXioUFakEHdyAbaiIaIBggF0EKdyIXQX9zcnNqQeaXioUFakEIdyAZaiIbQQp3IhxqIAUgGkEKdyIdaiAAKAIoIhYgGEEKdyIYaiAGIBdqIAAoAiAiACAZaiAbIBogGEF/c3JzakHml4qFBWpBC3cgF2oiFyAbIB1Bf3Nyc2pB5peKhQVqQQ53IBhqIhggFyAcQX9zcnNqQeaXioUFakEOdyAdaiIZIBggF0EKdyIaQX9zcnNqQeaXioUFakEMdyAcaiIbIBkgGEEKdyIcQX9zcnNqQeaXioUFakEGdyAaaiIdQQp3IhdqIBQgG0EKdyIYaiAFIBlBCnciGWogBCAcaiAQIBpqIB0gGXEgGyAZQX9zcXJqQaSit+IFakEJdyAcaiIaIBhxIB0gGEF/c3FyakGkorfiBWpBDXcgGWoiGSAXcSAaIBdBf3NxcmpBpKK34gVqQQ93IBhqIhsgGkEKdyIYcSAZIBhBf3NxcmpBpKK34gVqQQd3IBdqIhwgGUEKdyIXcSAbIBdBf3NxcmpBpKK34gVqQQx3IBhqIh1BCnciGWogFSAcQQp3IhpqIBYgG0EKdyIbaiAOIBdqIBEgGGogHSAbcSAcIBtBf3NxcmpBpKK34gVqQQh3IBdqIhcgGnEgHSAaQX9zcXJqQaSit+IFakEJdyAbaiIYIBlxIBcgGUF/c3FyakGkorfiBWpBC3cgGmoiGyAXQQp3IhdxIBggF0F/c3FyakGkorfiBWpBB3cgGWoiHCAYQQp3IhhxIBsgGEF/c3FyakGkorfiBWpBB3cgF2oiHUEKdyIZaiABIBxBCnciGmogAyAbQQp3IhtqIAggGGogACAXaiAdIBtxIBwgG0F/c3FyakGkorfiBWpBDHcgGGoiFyAacSAdIBpBf3NxcmpBpKK34gVqQQd3IBtqIhggGXEgFyAZQX9zcXJqQaSit+IFakEGdyAaaiIaIBdBCnciF3EgGCAXQX9zcXJqQaSit+IFakEPdyAZaiIbIBhBCnciGHEgGiAYQX9zcXJqQaSit+IFakENdyAXaiIcQQp3Ih1qIAYgG0EKdyIeaiAOIBpBCnciGWogByAYaiAJIBdqIBwgGXEgGyAZQX9zcXJqQaSit+IFakELdyAYaiIXIBxBf3NyIB5zakHz/cDrBmpBCXcgGWoiGCAXQX9zciAdc2pB8/3A6wZqQQd3IB5qIhkgGEF/c3IgF0EKdyIXc2pB8/3A6wZqQQ93IB1qIhogGUF/c3IgGEEKdyIYc2pB8/3A6wZqQQt3IBdqIhtBCnciHGogASAaQQp3Ih1qIBAgGUEKdyIZaiAVIBhqIBQgF2ogGyAaQX9zciAZc2pB8/3A6wZqQQh3IBhqIhcgG0F/c3IgHXNqQfP9wOsGakEGdyAZaiIYIBdBf3NyIBxzakHz/cDrBmpBBncgHWoiGSAYQX9zciAXQQp3IhdzakHz/cDrBmpBDncgHGoiGiAZQX9zciAYQQp3IhhzakHz/cDrBmpBDHcgF2oiG0EKdyIcaiAWIBpBCnciHWogCSAZQQp3IhlqIAggGGogACAXaiAbIBpBf3NyIBlzakHz/cDrBmpBDXcgGGoiFyAbQX9zciAdc2pB8/3A6wZqQQV3IBlqIhggF0F/c3IgHHNqQfP9wOsGakEOdyAdaiIZIBhBf3NyIBdBCnciF3NqQfP9wOsGakENdyAcaiIaIBlBf3NyIBhBCnciGHNqQfP9wOsGakENdyAXaiIbQQp3IhxqIBAgGkEKdyIdaiAAIBlBCnciGWogESAYaiADIBdqIBsgGkF/c3IgGXNqQfP9wOsGakEHdyAYaiIaIBtBf3NyIB1zakHz/cDrBmpBBXcgGWoiFyAacSAcIBdBf3NxcmpB6e210wdqQQ93IB1qIhggF3EgGkEKdyIaIBhBf3NxcmpB6e210wdqQQV3IBxqIhkgGHEgF0EKdyIbIBlBf3NxcmpB6e210wdqQQh3IBpqIhdBCnciHGogByAZQQp3Ih1qIAQgGEEKdyIeaiAFIBtqIAYgGmogFyAZcSAeIBdBf3NxcmpB6e210wdqQQt3IBtqIhggF3EgHSAYQX9zcXJqQenttdMHakEOdyAeaiIXIBhxIBwgF0F/c3FyakHp7bXTB2pBDncgHWoiGSAXcSAYQQp3IhogGUF/c3FyakHp7bXTB2pBBncgHGoiGCAZcSAXQQp3IhsgGEF/c3FyakHp7bXTB2pBDncgGmoiF0EKdyIcaiARIBhBCnciHWogCSAZQQp3IhlqIAggG2ogDiAaaiAXIBhxIBkgF0F/c3FyakHp7bXTB2pBBncgG2oiGCAXcSAdIBhBf3NxcmpB6e210wdqQQl3IBlqIhcgGHEgHCAXQX9zcXJqQenttdMHakEMdyAdaiIZIBdxIBhBCnciGiAZQX9zcXJqQenttdMHakEJdyAcaiIYIBlxIBdBCnciGyAYQX9zcXJqQenttdMHakEMdyAaaiIXQQp3IhwgB2ogFSAZQQp3Ih1qIBYgG2ogFCAaaiAXIBhxIB0gF0F/c3FyakHp7bXTB2pBBXcgG2oiGSAXcSAYQQp3IhggGUF/c3FyakHp7bXTB2pBD3cgHWoiFyAZcSAcIBdBf3NxcmpB6e210wdqQQh3IBhqIhogF0EKdyIbcyAYIAhqIBcgGUEKdyIYcyAac2pBCHcgHGoiF3NqQQV3IBhqIhlBCnciHCAAaiAaQQp3IhogBmogGCAWaiAXIBpzIBlzakEMdyAbaiIYIBxzIBsgA2ogGSAXQQp3IhdzIBhzakEJdyAaaiIZc2pBDHcgF2oiGiAZQQp3IhtzIBcgDmogGSAYQQp3IhdzIBpzakEFdyAcaiIYc2pBDncgF2oiGUEKdyIcIBVqIBpBCnciGiAJaiAXIBRqIBggGnMgGXNqQQZ3IBtqIhcgHHMgGyAQaiAZIBhBCnciGHMgF3NqQQh3IBpqIhlzakENdyAYaiIaIBlBCnciG3MgGCARaiAZIBdBCnciGHMgGnNqQQZ3IBxqIhlzakEFdyAYaiIcQQp3Ih1BACgC1IgBaiAEIBYgDiAOIBEgFiAOIBQgASAAIAEgECAUIAQgECAGIA9qIBMgDXMgCyANcyAMcyAKaiACakELdyAPaiIPc2pBDncgDGoiF0EKdyIeaiADIBJqIAkgDGogDyAScyAXc2pBD3cgE2oiDCAecyAFIBNqIBcgD0EKdyITcyAMc2pBDHcgEmoiEnNqQQV3IBNqIg8gEkEKdyIXcyATIA5qIBIgDEEKdyIMcyAPc2pBCHcgHmoiEnNqQQd3IAxqIhNBCnciHmogASAPQQp3Ig9qIAwgFGogEiAPcyATc2pBCXcgF2oiDCAecyAXIABqIBMgEkEKdyIScyAMc2pBC3cgD2oiE3NqQQ13IBJqIg8gE0EKdyIXcyASIBZqIBMgDEEKdyIMcyAPc2pBDncgHmoiEnNqQQ93IAxqIhNBCnciHmogEkEKdyIKIAdqIBcgEWogEyAKcyAMIAhqIBIgD0EKdyIMcyATc2pBBncgF2oiEnNqQQd3IAxqIhMgEkEKdyIPcyAMIBVqIBIgHnMgE3NqQQl3IApqIhdzakEIdyAeaiIMIBdxIBNBCnciEyAMQX9zcXJqQZnzidQFakEHdyAPaiISQQp3Ih5qIBYgDEEKdyIKaiAGIBdBCnciF2ogESATaiADIA9qIBIgDHEgFyASQX9zcXJqQZnzidQFakEGdyATaiIMIBJxIAogDEF/c3FyakGZ84nUBWpBCHcgF2oiEiAMcSAeIBJBf3NxcmpBmfOJ1AVqQQ13IApqIhMgEnEgDEEKdyIPIBNBf3NxcmpBmfOJ1AVqQQt3IB5qIgwgE3EgEkEKdyIXIAxBf3NxcmpBmfOJ1AVqQQl3IA9qIhJBCnciHmogAiAMQQp3IgpqIAggE0EKdyITaiAFIBdqIAcgD2ogEiAMcSATIBJBf3NxcmpBmfOJ1AVqQQd3IBdqIgwgEnEgCiAMQX9zcXJqQZnzidQFakEPdyATaiISIAxxIB4gEkF/c3FyakGZ84nUBWpBB3cgCmoiEyAScSAMQQp3Ig8gE0F/c3FyakGZ84nUBWpBDHcgHmoiDCATcSASQQp3IhcgDEF/c3FyakGZ84nUBWpBD3cgD2oiEkEKdyIeaiAEIAxBCnciCmogFSATQQp3IhNqIAkgF2ogDiAPaiASIAxxIBMgEkF/c3FyakGZ84nUBWpBCXcgF2oiDCAScSAKIAxBf3NxcmpBmfOJ1AVqQQt3IBNqIhIgDHEgHiASQX9zcXJqQZnzidQFakEHdyAKaiITIBJxIAxBCnciDCATQX9zcXJqQZnzidQFakENdyAeaiIPIBNxIBJBCnciEiAPQX9zIgpxcmpBmfOJ1AVqQQx3IAxqIhdBCnciHmogAyAPQQp3Ig9qIBUgE0EKdyITaiAWIBJqIAUgDGogFyAKciATc2pBodfn9gZqQQt3IBJqIgwgF0F/c3IgD3NqQaHX5/YGakENdyATaiISIAxBf3NyIB5zakGh1+f2BmpBBncgD2oiEyASQX9zciAMQQp3IgxzakGh1+f2BmpBB3cgHmoiDyATQX9zciASQQp3IhJzakGh1+f2BmpBDncgDGoiF0EKdyIeaiAJIA9BCnciCmogBiATQQp3IhNqIAAgEmogByAMaiAXIA9Bf3NyIBNzakGh1+f2BmpBCXcgEmoiDCAXQX9zciAKc2pBodfn9gZqQQ13IBNqIhIgDEF/c3IgHnNqQaHX5/YGakEPdyAKaiITIBJBf3NyIAxBCnciDHNqQaHX5/YGakEOdyAeaiIPIBNBf3NyIBJBCnciEnNqQaHX5/YGakEIdyAMaiIXQQp3Ih5qIAQgD0EKdyIKaiARIBNBCnciE2ogECASaiACIAxqIBcgD0F/c3IgE3NqQaHX5/YGakENdyASaiIMIBdBf3NyIApzakGh1+f2BmpBBncgE2oiEiAMQX9zciAec2pBodfn9gZqQQV3IApqIhMgEkF/c3IgDEEKdyIPc2pBodfn9gZqQQx3IB5qIhcgE0F/c3IgEkEKdyIec2pBodfn9gZqQQd3IA9qIgpBCnciDGogBCAXQQp3IhJqIAEgE0EKdyITaiAGIB5qIAggD2ogCiAXQX9zciATc2pBodfn9gZqQQV3IB5qIg8gEnEgCiASQX9zcXJqQdz57vh4akELdyATaiITIAxxIA8gDEF/c3FyakHc+e74eGpBDHcgEmoiFyAPQQp3IhJxIBMgEkF/c3FyakHc+e74eGpBDncgDGoiHiATQQp3IgxxIBcgDEF/c3FyakHc+e74eGpBD3cgEmoiCkEKdyITaiADIB5BCnciD2ogCCAXQQp3IhdqIAAgDGogAiASaiAKIBdxIB4gF0F/c3FyakHc+e74eGpBDncgDGoiDCAPcSAKIA9Bf3NxcmpB3Pnu+HhqQQ93IBdqIhIgE3EgDCATQX9zcXJqQdz57vh4akEJdyAPaiIXIAxBCnciDHEgEiAMQX9zcXJqQdz57vh4akEIdyATaiIeIBJBCnciEnEgFyASQX9zcXJqQdz57vh4akEJdyAMaiIKQQp3IhNqIBUgHkEKdyIPaiAHIBdBCnciF2ogFCASaiAFIAxqIAogF3EgHiAXQX9zcXJqQdz57vh4akEOdyASaiIMIA9xIAogD0F/c3FyakHc+e74eGpBBXcgF2oiEiATcSAMIBNBf3NxcmpB3Pnu+HhqQQZ3IA9qIg8gDEEKdyIMcSASIAxBf3NxcmpB3Pnu+HhqQQh3IBNqIhcgEkEKdyIScSAPIBJBf3NxcmpB3Pnu+HhqQQZ3IAxqIh5BCnciCmogAiAXQQp3Ig5qIAMgD0EKdyITaiAJIBJqIBAgDGogHiATcSAXIBNBf3NxcmpB3Pnu+HhqQQV3IBJqIgMgDnEgHiAOQX9zcXJqQdz57vh4akEMdyATaiIMIAMgCkF/c3JzakHO+s/KempBCXcgDmoiDiAMIANBCnciA0F/c3JzakHO+s/KempBD3cgCmoiEiAOIAxBCnciDEF/c3JzakHO+s/KempBBXcgA2oiE0EKdyIPaiAJIBJBCnciFmogCCAOQQp3IglqIBQgDGogASADaiATIBIgCUF/c3JzakHO+s/KempBC3cgDGoiAyATIBZBf3Nyc2pBzvrPynpqQQZ3IAlqIgggAyAPQX9zcnNqQc76z8p6akEIdyAWaiIJIAggA0EKdyIDQX9zcnNqQc76z8p6akENdyAPaiIOIAkgCEEKdyIIQX9zcnNqQc76z8p6akEMdyADaiIUQQp3IhZqIAAgDkEKdyIMaiAFIAlBCnciAGogBiAIaiAVIANqIBQgDiAAQX9zcnNqQc76z8p6akEFdyAIaiIDIBQgDEF/c3JzakHO+s/KempBDHcgAGoiACADIBZBf3Nyc2pBzvrPynpqQQ13IAxqIgYgACADQQp3IgNBf3Nyc2pBzvrPynpqQQ53IBZqIgggBiAAQQp3IgBBf3Nyc2pBzvrPynpqQQt3IANqIglBCnciFWo2AtCIAUEAIAsgGCACaiAZIBpBCnciAnMgHHNqQQ93IBtqIg5BCnciFmogECADaiAJIAggBkEKdyIDQX9zcnNqQc76z8p6akEIdyAAaiIGQQp3ajYCzIgBQQAoAsiIASEQQQAgDSAbIAVqIBwgGUEKdyIFcyAOc2pBDXcgAmoiFEEKd2ogByAAaiAGIAkgCEEKdyIAQX9zcnNqQc76z8p6akEFdyADaiIHajYCyIgBQQAoAtiIASEIQQAgACAQaiACIAFqIA4gHXMgFHNqQQt3IAVqIgFqIBEgA2ogByAGIBVBf3Nyc2pBzvrPynpqQQZ3ajYC2IgBQQAgACAIaiAdaiAFIARqIBQgFnMgAXNqQQt3ajYC1IgBC5cCAQR/AkAgAUUNAEEAIQJBAEEAKALAiAEiAyABaiIENgLAiAEgA0E/cSEFAkAgBCADTw0AQQBBACgCxIgBQQFqNgLEiAELAkAgBUUNAAJAQcAAIAVrIgIgAU0NACAFIQIMAQtBACEDQQAhBANAIAMgBWpB3IgBaiAAIANqLQAAOgAAIAIgBEEBaiIEQf8BcSIDSw0AC0HciAEQAiABIAJrIQEgACACaiEAQQAhAgsCQCABQcAASQ0AIAEhAwNAIAAQAiAAQcAAaiEAIANBQGoiA0E/Sw0ACyABQT9xIQELIAFFDQBBACEDQQAhBANAIAMgAmpB3IgBaiAAIANqLQAAOgAAIAEgBEEBaiIEQf8BcSIDSw0ACwsLCQBBwAggABADC4IBAQJ/IwBBEGsiACQAIABBACgCwIgBIgFBA3Q2AgggAEEAKALEiAFBA3QgAUEddnI2AgxBgAhBOEH4ACABQT9xIgFBOEkbIAFrEAMgAEEIakEIEANBAEEAKALIiAE2AsAIQQBBACkCzIgBNwLECEEAQQApAtSIATcCzAggAEEQaiQAC8EBAQF/IwBBEGsiASQAQQBB8MPLnnw2AtiIAUEAQv6568XpjpWZEDcC0IgBQQBCgcaUupbx6uZvNwLIiAFBAEIANwLAiAFBwAggABADIAFBACgCwIgBIgBBA3Q2AgggAUEAKALEiAFBA3QgAEEddnI2AgxBgAhBOEH4ACAAQT9xIgBBOEkbIABrEAMgAUEIakEIEANBAEEAKALIiAE2AsAIQQBBACkCzIgBNwLECEEAQQApAtSIATcCzAggAUEQaiQACwtHAQBBgAgLQIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
    var wasmJson$c = {
    	name: name$c,
    	data: data$c
    };

    const mutex$e = new Mutex();
    let wasmCache$e = null;
    /**
     * Calculates RIPEMD-160 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function ripemd160(data) {
        if (wasmCache$e === null) {
            return lockedCreate(mutex$e, wasmJson$c, 20)
                .then((wasm) => {
                wasmCache$e = wasm;
                return wasmCache$e.calculate(data);
            });
        }
        try {
            const hash = wasmCache$e.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new RIPEMD-160 hash instance
     */
    function createRIPEMD160() {
        return WASMInterface(wasmJson$c, 20).then((wasm) => {
            wasm.init();
            const obj = {
                init: () => { wasm.init(); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 64,
                digestSize: 20,
            };
            return obj;
        });
    }

    function calculateKeyBuffer(hasher, key) {
        const { blockSize } = hasher;
        const buf = getUInt8Buffer(key);
        if (buf.length > blockSize) {
            hasher.update(buf);
            const uintArr = hasher.digest('binary');
            hasher.init();
            return uintArr;
        }
        return new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
    }
    function calculateHmac(hasher, key) {
        hasher.init();
        const { blockSize } = hasher;
        const keyBuf = calculateKeyBuffer(hasher, key);
        const keyBuffer = new Uint8Array(blockSize);
        keyBuffer.set(keyBuf);
        const opad = new Uint8Array(blockSize);
        for (let i = 0; i < blockSize; i++) {
            const v = keyBuffer[i];
            opad[i] = v ^ 0x5C;
            keyBuffer[i] = v ^ 0x36;
        }
        hasher.update(keyBuffer);
        const obj = {
            init: () => {
                hasher.init();
                hasher.update(keyBuffer);
                return obj;
            },
            update: (data) => {
                hasher.update(data);
                return obj;
            },
            digest: ((outputType) => {
                const uintArr = hasher.digest('binary');
                hasher.init();
                hasher.update(opad);
                hasher.update(uintArr);
                return hasher.digest(outputType);
            }),
            blockSize: hasher.blockSize,
            digestSize: hasher.digestSize,
        };
        return obj;
    }
    /**
     * Calculates HMAC hash
     * @param hash Hash algorithm to use. It has to be the return value of a function like createSHA1()
     * @param key Key (string, Buffer or TypedArray)
     */
    function createHMAC(hash, key) {
        if (!hash || !hash.then) {
            throw new Error('Invalid hash function is provided! Usage: createHMAC(createMD5(), "key").');
        }
        return hash.then((hasher) => calculateHmac(hasher, key));
    }

    function calculatePBKDF2(digest, salt, iterations, hashLength, outputType) {
        return __awaiter(this, void 0, void 0, function* () {
            const DK = new Uint8Array(hashLength);
            const block1 = new Uint8Array(salt.length + 4);
            const block1View = new DataView(block1.buffer);
            const saltBuffer = getUInt8Buffer(salt);
            const saltUIntBuffer = new Uint8Array(saltBuffer.buffer, saltBuffer.byteOffset, saltBuffer.length);
            block1.set(saltUIntBuffer);
            let destPos = 0;
            const hLen = digest.digestSize;
            const l = Math.ceil(hashLength / hLen);
            let T = null;
            let U = null;
            for (let i = 1; i <= l; i++) {
                block1View.setUint32(salt.length, i);
                digest.init();
                digest.update(block1);
                T = digest.digest('binary');
                U = T.slice();
                for (let j = 1; j < iterations; j++) {
                    digest.init();
                    digest.update(U);
                    U = digest.digest('binary');
                    for (let k = 0; k < hLen; k++) {
                        T[k] ^= U[k];
                    }
                }
                DK.set(T.subarray(0, hashLength - destPos), destPos);
                destPos += hLen;
            }
            if (outputType === 'binary') {
                return DK;
            }
            const digestChars = new Uint8Array(hashLength * 2);
            return getDigestHex(digestChars, DK, hashLength);
        });
    }
    const validateOptions$1 = (options) => {
        if (!options || typeof options !== 'object') {
            throw new Error('Invalid options parameter. It requires an object.');
        }
        if (!options.hashFunction || !options.hashFunction.then) {
            throw new Error('Invalid hash function is provided! Usage: pbkdf2("password", "salt", 1000, 32, createSHA1()).');
        }
        if (!Number.isInteger(options.iterations) || options.iterations < 1) {
            throw new Error('Iterations should be a positive number');
        }
        if (!Number.isInteger(options.hashLength) || options.hashLength < 1) {
            throw new Error('Hash length should be a positive number');
        }
        if (options.outputType === undefined) {
            options.outputType = 'hex';
        }
        if (!['hex', 'binary'].includes(options.outputType)) {
            throw new Error(`Insupported output type ${options.outputType}. Valid values: ['hex', 'binary']`);
        }
    };
    /**
     * Generates a new PBKDF2 hash for the supplied password
     */
    function pbkdf2(options) {
        return __awaiter(this, void 0, void 0, function* () {
            validateOptions$1(options);
            const hmac = yield createHMAC(options.hashFunction, options.password);
            return calculatePBKDF2(hmac, options.salt, options.iterations, options.hashLength, options.outputType);
        });
    }

    var name$d = "scrypt.wasm";
    var data$d = "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hTcDKCACIAsgBEG4f2opAwCFNwMwIAIgDCAEQUBqKQMAhTcDOCACEAQgASACKQMANwMAIAFBCGogAikDCDcDACABQRBqIAIpAxA3AwAgAUEYaiACKQMYNwMAIAFBIGogAikDIDcDACABQShqIAIpAyg3AwAgAUEwaiACKQMwNwMAIAFBOGogAikDODcDACACIAIpAwAgBEFIaikDAIU3AwAgAiACKQMIIARBUGopAwCFNwMIIAIgAikDECAEQVhqKQMAhTcDECACIAIpAxggBEFgaikDAIU3AxggAiACKQMgIARBaGopAwCFNwMgIAIgAikDKCAEQXBqKQMAhTcDKCACIAIpAzAgBEF4aikDAIU3AzAgAiACKQM4IAQpAwCFNwM4IAIQBCABIA5qIgMgAikDADcDACADQQhqIAIpAwg3AwAgA0EQaiACKQMQNwMAIANBGGogAikDGDcDACADQSBqIAIpAyA3AwAgA0EoaiACKQMoNwMAIANBMGogAikDMDcDACADQThqIAIpAzg3AwAgACANTw0BIARBgAFqIQQgAUHAAGohASAAQQJqIQAgAikDOCEMIAIpAzAhCyACKQMoIQogAikDICEJIAIpAxghCCACKQMQIQcgAikDCCEGIAIpAwAhBQwACwsLug0IAX4BfwF+AX8BfgF/AX4SfyAAIAAoAgQgACkDKCIBQiCIpyICIAApAzgiA0IgiKciBGpBB3cgACkDCCIFQiCIp3MiBiAEakEJdyAAKQMYIgdCIIincyIIIAZqQQ13IAJzIgkgB6ciCiABpyILakEHdyADp3MiAiALakEJdyAFp3MiDCACakENdyAKcyINIAxqQRJ3IAtzIg4gACkDACIBQiCIpyIPIAApAxAiA0IgiKciEGpBB3cgACkDICIFQiCIp3MiC2pBB3dzIgogCSAIakESdyAEcyIRIAJqQQd3IAApAzAiB6ciCSABpyISakEHdyADp3MiBCASakEJdyAFp3MiEyAEakENdyAJcyIUcyIJIBFqQQl3IAsgEGpBCXcgB0IgiKdzIhVzIhYgCWpBDXcgAnMiFyAWakESdyARcyIRakEHdyAGIBQgE2pBEncgEnMiEmpBB3cgFSALakENdyAPcyIUcyICIBJqQQl3IAxzIg8gAmpBDXcgBnMiGHMiBiARakEJdyAIIA0gFCAVakESdyAQcyIQIARqQQd3cyIMIBBqQQl3cyIIcyIVIAZqQQ13IApzIhQgDCAKIA5qQQl3IBNzIhMgCmpBDXcgC3MiGSATakESdyAOcyIKakEHdyAXcyILIApqQQl3IA9zIg4gC2pBDXcgDHMiFyAOakESdyAKcyINIAIgCCAMakENdyAEcyIMIAhqQRJ3IBBzIghqQQd3IBlzIgpqQQd3cyIEIBQgFWpBEncgEXMiECALakEHdyAJIBggD2pBEncgEnMiEWpBB3cgDHMiDCARakEJdyATcyISIAxqQQ13IAlzIg9zIgkgEGpBCXcgCiAIakEJdyAWcyITcyIWIAlqQQ13IAtzIhQgFmpBEncgEHMiEGpBB3cgBiAPIBJqQRJ3IBFzIhFqQQd3IBMgCmpBDXcgAnMiC3MiAiARakEJdyAOcyIOIAJqQQ13IAZzIhhzIgYgEGpBCXcgFSAXIAsgE2pBEncgCHMiCCAMakEHd3MiCyAIakEJd3MiE3MiFSAGakENdyAEcyIXIAsgBCANakEJdyAScyISIARqQQ13IApzIhkgEmpBEncgDXMiBGpBB3cgFHMiCiAEakEJdyAOcyIPIApqQQ13IAtzIhQgD2pBEncgBHMiDSACIBMgC2pBDXcgDHMiDCATakESdyAIcyIIakEHdyAZcyILakEHd3MiBCAXIBVqQRJ3IBBzIhAgCmpBB3cgCSAYIA5qQRJ3IBFzIg5qQQd3IAxzIgwgDmpBCXcgEnMiESAMakENdyAJcyIXcyIJIBBqQQl3IAsgCGpBCXcgFnMiEnMiEyAJakENdyAKcyIYIBNqQRJ3IBBzIhBqQQd3IAYgFyARakESdyAOcyIKakEHdyASIAtqQQ13IAJzIhdzIgIgCmpBCXcgD3MiDiACakENdyAGcyIWcyIGIAkgFiAOakESdyAKcyIWakEHdyAVIBQgFyASakESdyAIcyIIIAxqQQd3cyIKIAhqQQl3cyISIApqQQ13IAxzIg9zIgwgFmpBCXcgBCANakEJdyARcyIRcyIVIAxqQQ13IAlzIhQgFWpBEncgFnMiCWpBB3cgAiAPIBJqQRJ3IAhzIghqQQd3IBEgBGpBDXcgC3MiD3MiCyAIakEJdyATcyITIAtqQQ13IAJzIhdzIhZqNgIEIAAgACgCCCAWIAlqQQl3IAogDyARakESdyANcyIRakEHdyAYcyICIBFqQQl3IA5zIg5zIg9qNgIIIAAgACgCDCAPIBZqQQ13IAZzIg1qNgIMIAAgACgCECAGIBBqQQl3IBJzIhIgDiACakENdyAKcyIYIBcgE2pBEncgCHMiCiAMakEHd3MiCCAKakEJd3MiFiAIakENdyAMcyIMajYCECAAIAAoAgAgDSAPakESdyAJc2o2AgAgACAAKAIUIAwgFmpBEncgCnNqNgIUIAAgACgCGCAIajYCGCAAIAAoAhwgFmo2AhwgACAAKAIgIBIgBmpBDXcgBHMiCSAYIA5qQRJ3IBFzIgYgC2pBB3dzIgogBmpBCXcgFXMiBGo2AiAgACAAKAIkIAQgCmpBDXcgC3MiC2o2AiQgACAAKAIoIAsgBGpBEncgBnNqNgIoIAAgACgCLCAKajYCLCAAIAAoAjAgCSASakESdyAQcyIGIAJqQQd3IBRzIgtqNgIwIAAgACgCNCALIAZqQQl3IBNzIgpqNgI0IAAgACgCOCAKIAtqQQ13IAJzIgJqNgI4IAAgACgCPCACIApqQRJ3IAZzajYCPAtyAwF/AX4CfwJAIAJFDQBBACgCiAgiAyAAIAGtIgQgAyAAQQd0IgUgAmxqIgMgAyAFIAFsaiIGEAIgAkEBRg0AIAJBf2ohASAFIQIDQEEAKAKICCACaiAAIAQgAyAGEAIgAiAFaiECIAFBf2oiAQ0ACwsL";
    var wasmJson$d = {
    	name: name$d,
    	data: data$d
    };

    function scryptInternal(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { costFactor, blockSize, parallelism, hashLength, } = options;
            const SHA256Hasher = createSHA256();
            const blockData = yield pbkdf2({
                password: options.password,
                salt: options.salt,
                iterations: 1,
                hashLength: 128 * blockSize * parallelism,
                hashFunction: SHA256Hasher,
                outputType: 'binary',
            });
            const scryptInterface = yield WASMInterface(wasmJson$d, 0);
            // last block is for storing the temporary vectors
            const VSize = 128 * blockSize * costFactor;
            const XYSize = 256 * blockSize;
            scryptInterface.setMemorySize(blockData.length + VSize + XYSize);
            scryptInterface.writeMemory(blockData, 0);
            // mix blocks
            scryptInterface.getExports().scrypt(blockSize, costFactor, parallelism);
            const expensiveSalt = scryptInterface
                .getMemory()
                .subarray(0, 128 * blockSize * parallelism);
            const outputData = yield pbkdf2({
                password: options.password,
                salt: expensiveSalt,
                iterations: 1,
                hashLength,
                hashFunction: SHA256Hasher,
                outputType: 'binary',
            });
            if (options.outputType === 'hex') {
                const digestChars = new Uint8Array(hashLength * 2);
                return getDigestHex(digestChars, outputData, hashLength);
            }
            // return binary format
            return outputData;
        });
    }
    // eslint-disable-next-line no-bitwise
    const isPowerOfTwo = (v) => v && !(v & (v - 1));
    const validateOptions$2 = (options) => {
        if (!options || typeof options !== 'object') {
            throw new Error('Invalid options parameter. It requires an object.');
        }
        if (!Number.isInteger(options.blockSize) || options.blockSize < 1) {
            throw new Error('Block size should be a positive number');
        }
        if (!Number.isInteger(options.costFactor)
            || options.costFactor < 2
            || !isPowerOfTwo(options.costFactor)) {
            throw new Error('Cost factor should be a power of 2, greater than 1');
        }
        if (!Number.isInteger(options.parallelism) || options.parallelism < 1) {
            throw new Error('Parallelism should be a positive number');
        }
        if (!Number.isInteger(options.hashLength) || options.hashLength < 1) {
            throw new Error('Hash length should be a positive number.');
        }
        if (options.outputType === undefined) {
            options.outputType = 'hex';
        }
        if (!['hex', 'binary'].includes(options.outputType)) {
            throw new Error(`Insupported output type ${options.outputType}. Valid values: ['hex', 'binary']`);
        }
    };
    /**
     * Calculates hash using the scrypt password-based key derivation function
     * @returns Computed hash as a hexadecimal string or as
     *          Uint8Array depending on the outputType option
     */
    function scrypt(options) {
        return __awaiter(this, void 0, void 0, function* () {
            validateOptions$2(options);
            return scryptInternal(options);
        });
    }

    var name$e = "bcrypt.wasm";
    var data$e = "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";
    var wasmJson$e = {
    	name: name$e,
    	data: data$e
    };

    function bcryptInternal(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { costFactor, password, salt } = options;
            const bcryptInterface = yield WASMInterface(wasmJson$e, 0);
            bcryptInterface.writeMemory(getUInt8Buffer(salt), 0);
            const passwordBuffer = getUInt8Buffer(password);
            bcryptInterface.writeMemory(passwordBuffer, 16);
            const shouldEncode = options.outputType === 'encoded' ? 1 : 0;
            bcryptInterface.getExports().bcrypt(passwordBuffer.length, costFactor, shouldEncode);
            const memory = bcryptInterface.getMemory();
            if (options.outputType === 'encoded') {
                return intArrayToString(memory, 60);
            }
            if (options.outputType === 'hex') {
                const digestChars = new Uint8Array(24 * 2);
                return getDigestHex(digestChars, memory, 24);
            }
            // return binary format
            // the data is copied to allow GC of the original memory buffer
            return memory.slice(0, 24);
        });
    }
    const validateOptions$3 = (options) => {
        if (!options || typeof options !== 'object') {
            throw new Error('Invalid options parameter. It requires an object.');
        }
        if (!Number.isInteger(options.costFactor) || options.costFactor < 4 || options.costFactor > 31) {
            throw new Error('Cost factor should be a number between 4 and 31');
        }
        options.password = getUInt8Buffer(options.password);
        if (options.password.length < 1) {
            throw new Error('Password should be at least 1 byte long');
        }
        if (options.password.length > 72) {
            throw new Error('Password should be at most 72 bytes long');
        }
        options.salt = getUInt8Buffer(options.salt);
        if (options.salt.length !== 16) {
            throw new Error('Salt should be 16 bytes long');
        }
        if (options.outputType === undefined) {
            options.outputType = 'encoded';
        }
        if (!['hex', 'binary', 'encoded'].includes(options.outputType)) {
            throw new Error(`Insupported output type ${options.outputType}. Valid values: ['hex', 'binary', 'encoded']`);
        }
    };
    /**
     * Calculates hash using the bcrypt password-hashing function
     * @returns Computed hash
     */
    function bcrypt(options) {
        return __awaiter(this, void 0, void 0, function* () {
            validateOptions$3(options);
            return bcryptInternal(options);
        });
    }
    const validateHashCharacters = (hash) => {
        if (!/^\$2[axyb]\$[0-3][0-9]\$[./A-Za-z0-9]{53}$/.test(hash)) {
            return false;
        }
        if (hash[4] === '0' && parseInt(hash[5], 10) < 4) {
            return false;
        }
        if (hash[4] === '3' && parseInt(hash[5], 10) > 1) {
            return false;
        }
        return true;
    };
    const validateVerifyOptions$1 = (options) => {
        if (!options || typeof options !== 'object') {
            throw new Error('Invalid options parameter. It requires an object.');
        }
        if (options.hash === undefined || typeof options.hash !== 'string') {
            throw new Error('Hash should be specified');
        }
        if (options.hash.length !== 60) {
            throw new Error('Hash should be 60 bytes long');
        }
        if (!validateHashCharacters(options.hash)) {
            throw new Error('Invalid hash');
        }
        options.password = getUInt8Buffer(options.password);
        if (options.password.length < 1) {
            throw new Error('Password should be at least 1 byte long');
        }
        if (options.password.length > 72) {
            throw new Error('Password should be at most 72 bytes long');
        }
    };
    /**
     * Verifies password using bcrypt password-hashing function
     * @returns True if the encoded hash matches the password
     */
    function bcryptVerify(options) {
        return __awaiter(this, void 0, void 0, function* () {
            validateVerifyOptions$1(options);
            const { hash, password } = options;
            const bcryptInterface = yield WASMInterface(wasmJson$e, 0);
            bcryptInterface.writeMemory(getUInt8Buffer(hash), 0);
            const passwordBuffer = getUInt8Buffer(password);
            bcryptInterface.writeMemory(passwordBuffer, 60);
            return !!bcryptInterface.getExports().bcrypt_verify(passwordBuffer.length);
        });
    }

    var name$f = "whirlpool.wasm";
    var data$f = "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";
    var wasmJson$f = {
    	name: name$f,
    	data: data$f
    };

    const mutex$f = new Mutex();
    let wasmCache$f = null;
    /**
     * Calculates Whirlpool hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function whirlpool(data) {
        if (wasmCache$f === null) {
            return lockedCreate(mutex$f, wasmJson$f, 64)
                .then((wasm) => {
                wasmCache$f = wasm;
                return wasmCache$f.calculate(data);
            });
        }
        try {
            const hash = wasmCache$f.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new Whirlpool hash instance
     */
    function createWhirlpool() {
        return WASMInterface(wasmJson$f, 64).then((wasm) => {
            wasm.init();
            const obj = {
                init: () => { wasm.init(); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 64,
                digestSize: 64,
            };
            return obj;
        });
    }

    var name$g = "sm3.wasm";
    var data$g = "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";
    var wasmJson$g = {
    	name: name$g,
    	data: data$g
    };

    const mutex$g = new Mutex();
    let wasmCache$g = null;
    /**
     * Calculates SM3 hash
     * @param data Input data (string, Buffer or TypedArray)
     * @returns Computed hash as a hexadecimal string
     */
    function sm3(data) {
        if (wasmCache$g === null) {
            return lockedCreate(mutex$g, wasmJson$g, 32)
                .then((wasm) => {
                wasmCache$g = wasm;
                return wasmCache$g.calculate(data);
            });
        }
        try {
            const hash = wasmCache$g.calculate(data);
            return Promise.resolve(hash);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Creates a new SM3 hash instance
     */
    function createSM3() {
        return WASMInterface(wasmJson$g, 32).then((wasm) => {
            wasm.init();
            const obj = {
                init: () => { wasm.init(); return obj; },
                update: (data) => { wasm.update(data); return obj; },
                digest: (outputType) => wasm.digest(outputType),
                blockSize: 64,
                digestSize: 32,
            };
            return obj;
        });
    }

    exports.argon2Verify = argon2Verify;
    exports.argon2d = argon2d;
    exports.argon2i = argon2i;
    exports.argon2id = argon2id;
    exports.bcrypt = bcrypt;
    exports.bcryptVerify = bcryptVerify;
    exports.blake2b = blake2b;
    exports.blake2s = blake2s;
    exports.crc32 = crc32;
    exports.createBLAKE2b = createBLAKE2b;
    exports.createBLAKE2s = createBLAKE2s;
    exports.createCRC32 = createCRC32;
    exports.createHMAC = createHMAC;
    exports.createKeccak = createKeccak;
    exports.createMD4 = createMD4;
    exports.createMD5 = createMD5;
    exports.createRIPEMD160 = createRIPEMD160;
    exports.createSHA1 = createSHA1;
    exports.createSHA224 = createSHA224;
    exports.createSHA256 = createSHA256;
    exports.createSHA3 = createSHA3;
    exports.createSHA384 = createSHA384;
    exports.createSHA512 = createSHA512;
    exports.createSM3 = createSM3;
    exports.createWhirlpool = createWhirlpool;
    exports.createXXHash32 = createXXHash32;
    exports.createXXHash64 = createXXHash64;
    exports.keccak = keccak;
    exports.md4 = md4;
    exports.md5 = md5;
    exports.pbkdf2 = pbkdf2;
    exports.ripemd160 = ripemd160;
    exports.scrypt = scrypt;
    exports.sha1 = sha1;
    exports.sha224 = sha224;
    exports.sha256 = sha256;
    exports.sha3 = sha3;
    exports.sha384 = sha384;
    exports.sha512 = sha512;
    exports.sm3 = sm3;
    exports.whirlpool = whirlpool;
    exports.xxhash32 = xxhash32;
    exports.xxhash64 = xxhash64;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
(function(nacl) {
'use strict';

// Ported in 2014 by Dmitry Chestnykh and Devi Mandiri.
// Public domain.
//
// Implementation derived from TweetNaCl version 20140427.
// See for details: http://tweetnacl.cr.yp.to/

var gf = function(init) {
  var i, r = new Float64Array(16);
  if (init) for (i = 0; i < init.length; i++) r[i] = init[i];
  return r;
};

//  Pluggable, initialized in high-level API below.
var randombytes = function(/* x, n */) { throw new Error('no PRNG'); };

var _0 = new Uint8Array(16);
var _9 = new Uint8Array(32); _9[0] = 9;

var gf0 = gf(),
    gf1 = gf([1]),
    _121665 = gf([0xdb41, 1]),
    D = gf([0x78a3, 0x1359, 0x4dca, 0x75eb, 0xd8ab, 0x4141, 0x0a4d, 0x0070, 0xe898, 0x7779, 0x4079, 0x8cc7, 0xfe73, 0x2b6f, 0x6cee, 0x5203]),
    D2 = gf([0xf159, 0x26b2, 0x9b94, 0xebd6, 0xb156, 0x8283, 0x149a, 0x00e0, 0xd130, 0xeef3, 0x80f2, 0x198e, 0xfce7, 0x56df, 0xd9dc, 0x2406]),
    X = gf([0xd51a, 0x8f25, 0x2d60, 0xc956, 0xa7b2, 0x9525, 0xc760, 0x692c, 0xdc5c, 0xfdd6, 0xe231, 0xc0a4, 0x53fe, 0xcd6e, 0x36d3, 0x2169]),
    Y = gf([0x6658, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666]),
    I = gf([0xa0b0, 0x4a0e, 0x1b27, 0xc4ee, 0xe478, 0xad2f, 0x1806, 0x2f43, 0xd7a7, 0x3dfb, 0x0099, 0x2b4d, 0xdf0b, 0x4fc1, 0x2480, 0x2b83]);

function ts64(x, i, h, l) {
  x[i]   = (h >> 24) & 0xff;
  x[i+1] = (h >> 16) & 0xff;
  x[i+2] = (h >>  8) & 0xff;
  x[i+3] = h & 0xff;
  x[i+4] = (l >> 24)  & 0xff;
  x[i+5] = (l >> 16)  & 0xff;
  x[i+6] = (l >>  8)  & 0xff;
  x[i+7] = l & 0xff;
}

function vn(x, xi, y, yi, n) {
  var i,d = 0;
  for (i = 0; i < n; i++) d |= x[xi+i]^y[yi+i];
  return (1 & ((d - 1) >>> 8)) - 1;
}

function crypto_verify_16(x, xi, y, yi) {
  return vn(x,xi,y,yi,16);
}

function crypto_verify_32(x, xi, y, yi) {
  return vn(x,xi,y,yi,32);
}

function core_salsa20(o, p, k, c) {
  var j0  = c[ 0] & 0xff | (c[ 1] & 0xff)<<8 | (c[ 2] & 0xff)<<16 | (c[ 3] & 0xff)<<24,
      j1  = k[ 0] & 0xff | (k[ 1] & 0xff)<<8 | (k[ 2] & 0xff)<<16 | (k[ 3] & 0xff)<<24,
      j2  = k[ 4] & 0xff | (k[ 5] & 0xff)<<8 | (k[ 6] & 0xff)<<16 | (k[ 7] & 0xff)<<24,
      j3  = k[ 8] & 0xff | (k[ 9] & 0xff)<<8 | (k[10] & 0xff)<<16 | (k[11] & 0xff)<<24,
      j4  = k[12] & 0xff | (k[13] & 0xff)<<8 | (k[14] & 0xff)<<16 | (k[15] & 0xff)<<24,
      j5  = c[ 4] & 0xff | (c[ 5] & 0xff)<<8 | (c[ 6] & 0xff)<<16 | (c[ 7] & 0xff)<<24,
      j6  = p[ 0] & 0xff | (p[ 1] & 0xff)<<8 | (p[ 2] & 0xff)<<16 | (p[ 3] & 0xff)<<24,
      j7  = p[ 4] & 0xff | (p[ 5] & 0xff)<<8 | (p[ 6] & 0xff)<<16 | (p[ 7] & 0xff)<<24,
      j8  = p[ 8] & 0xff | (p[ 9] & 0xff)<<8 | (p[10] & 0xff)<<16 | (p[11] & 0xff)<<24,
      j9  = p[12] & 0xff | (p[13] & 0xff)<<8 | (p[14] & 0xff)<<16 | (p[15] & 0xff)<<24,
      j10 = c[ 8] & 0xff | (c[ 9] & 0xff)<<8 | (c[10] & 0xff)<<16 | (c[11] & 0xff)<<24,
      j11 = k[16] & 0xff | (k[17] & 0xff)<<8 | (k[18] & 0xff)<<16 | (k[19] & 0xff)<<24,
      j12 = k[20] & 0xff | (k[21] & 0xff)<<8 | (k[22] & 0xff)<<16 | (k[23] & 0xff)<<24,
      j13 = k[24] & 0xff | (k[25] & 0xff)<<8 | (k[26] & 0xff)<<16 | (k[27] & 0xff)<<24,
      j14 = k[28] & 0xff | (k[29] & 0xff)<<8 | (k[30] & 0xff)<<16 | (k[31] & 0xff)<<24,
      j15 = c[12] & 0xff | (c[13] & 0xff)<<8 | (c[14] & 0xff)<<16 | (c[15] & 0xff)<<24;

  var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
      x15 = j15, u;

  for (var i = 0; i < 20; i += 2) {
    u = x0 + x12 | 0;
    x4 ^= u<<7 | u>>>(32-7);
    u = x4 + x0 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x4 | 0;
    x12 ^= u<<13 | u>>>(32-13);
    u = x12 + x8 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x1 | 0;
    x9 ^= u<<7 | u>>>(32-7);
    u = x9 + x5 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x9 | 0;
    x1 ^= u<<13 | u>>>(32-13);
    u = x1 + x13 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x6 | 0;
    x14 ^= u<<7 | u>>>(32-7);
    u = x14 + x10 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x14 | 0;
    x6 ^= u<<13 | u>>>(32-13);
    u = x6 + x2 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x11 | 0;
    x3 ^= u<<7 | u>>>(32-7);
    u = x3 + x15 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x3 | 0;
    x11 ^= u<<13 | u>>>(32-13);
    u = x11 + x7 | 0;
    x15 ^= u<<18 | u>>>(32-18);

    u = x0 + x3 | 0;
    x1 ^= u<<7 | u>>>(32-7);
    u = x1 + x0 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x1 | 0;
    x3 ^= u<<13 | u>>>(32-13);
    u = x3 + x2 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x4 | 0;
    x6 ^= u<<7 | u>>>(32-7);
    u = x6 + x5 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x6 | 0;
    x4 ^= u<<13 | u>>>(32-13);
    u = x4 + x7 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x9 | 0;
    x11 ^= u<<7 | u>>>(32-7);
    u = x11 + x10 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x11 | 0;
    x9 ^= u<<13 | u>>>(32-13);
    u = x9 + x8 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x14 | 0;
    x12 ^= u<<7 | u>>>(32-7);
    u = x12 + x15 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x12 | 0;
    x14 ^= u<<13 | u>>>(32-13);
    u = x14 + x13 | 0;
    x15 ^= u<<18 | u>>>(32-18);
  }
   x0 =  x0 +  j0 | 0;
   x1 =  x1 +  j1 | 0;
   x2 =  x2 +  j2 | 0;
   x3 =  x3 +  j3 | 0;
   x4 =  x4 +  j4 | 0;
   x5 =  x5 +  j5 | 0;
   x6 =  x6 +  j6 | 0;
   x7 =  x7 +  j7 | 0;
   x8 =  x8 +  j8 | 0;
   x9 =  x9 +  j9 | 0;
  x10 = x10 + j10 | 0;
  x11 = x11 + j11 | 0;
  x12 = x12 + j12 | 0;
  x13 = x13 + j13 | 0;
  x14 = x14 + j14 | 0;
  x15 = x15 + j15 | 0;

  o[ 0] = x0 >>>  0 & 0xff;
  o[ 1] = x0 >>>  8 & 0xff;
  o[ 2] = x0 >>> 16 & 0xff;
  o[ 3] = x0 >>> 24 & 0xff;

  o[ 4] = x1 >>>  0 & 0xff;
  o[ 5] = x1 >>>  8 & 0xff;
  o[ 6] = x1 >>> 16 & 0xff;
  o[ 7] = x1 >>> 24 & 0xff;

  o[ 8] = x2 >>>  0 & 0xff;
  o[ 9] = x2 >>>  8 & 0xff;
  o[10] = x2 >>> 16 & 0xff;
  o[11] = x2 >>> 24 & 0xff;

  o[12] = x3 >>>  0 & 0xff;
  o[13] = x3 >>>  8 & 0xff;
  o[14] = x3 >>> 16 & 0xff;
  o[15] = x3 >>> 24 & 0xff;

  o[16] = x4 >>>  0 & 0xff;
  o[17] = x4 >>>  8 & 0xff;
  o[18] = x4 >>> 16 & 0xff;
  o[19] = x4 >>> 24 & 0xff;

  o[20] = x5 >>>  0 & 0xff;
  o[21] = x5 >>>  8 & 0xff;
  o[22] = x5 >>> 16 & 0xff;
  o[23] = x5 >>> 24 & 0xff;

  o[24] = x6 >>>  0 & 0xff;
  o[25] = x6 >>>  8 & 0xff;
  o[26] = x6 >>> 16 & 0xff;
  o[27] = x6 >>> 24 & 0xff;

  o[28] = x7 >>>  0 & 0xff;
  o[29] = x7 >>>  8 & 0xff;
  o[30] = x7 >>> 16 & 0xff;
  o[31] = x7 >>> 24 & 0xff;

  o[32] = x8 >>>  0 & 0xff;
  o[33] = x8 >>>  8 & 0xff;
  o[34] = x8 >>> 16 & 0xff;
  o[35] = x8 >>> 24 & 0xff;

  o[36] = x9 >>>  0 & 0xff;
  o[37] = x9 >>>  8 & 0xff;
  o[38] = x9 >>> 16 & 0xff;
  o[39] = x9 >>> 24 & 0xff;

  o[40] = x10 >>>  0 & 0xff;
  o[41] = x10 >>>  8 & 0xff;
  o[42] = x10 >>> 16 & 0xff;
  o[43] = x10 >>> 24 & 0xff;

  o[44] = x11 >>>  0 & 0xff;
  o[45] = x11 >>>  8 & 0xff;
  o[46] = x11 >>> 16 & 0xff;
  o[47] = x11 >>> 24 & 0xff;

  o[48] = x12 >>>  0 & 0xff;
  o[49] = x12 >>>  8 & 0xff;
  o[50] = x12 >>> 16 & 0xff;
  o[51] = x12 >>> 24 & 0xff;

  o[52] = x13 >>>  0 & 0xff;
  o[53] = x13 >>>  8 & 0xff;
  o[54] = x13 >>> 16 & 0xff;
  o[55] = x13 >>> 24 & 0xff;

  o[56] = x14 >>>  0 & 0xff;
  o[57] = x14 >>>  8 & 0xff;
  o[58] = x14 >>> 16 & 0xff;
  o[59] = x14 >>> 24 & 0xff;

  o[60] = x15 >>>  0 & 0xff;
  o[61] = x15 >>>  8 & 0xff;
  o[62] = x15 >>> 16 & 0xff;
  o[63] = x15 >>> 24 & 0xff;
}

function core_hsalsa20(o,p,k,c) {
  var j0  = c[ 0] & 0xff | (c[ 1] & 0xff)<<8 | (c[ 2] & 0xff)<<16 | (c[ 3] & 0xff)<<24,
      j1  = k[ 0] & 0xff | (k[ 1] & 0xff)<<8 | (k[ 2] & 0xff)<<16 | (k[ 3] & 0xff)<<24,
      j2  = k[ 4] & 0xff | (k[ 5] & 0xff)<<8 | (k[ 6] & 0xff)<<16 | (k[ 7] & 0xff)<<24,
      j3  = k[ 8] & 0xff | (k[ 9] & 0xff)<<8 | (k[10] & 0xff)<<16 | (k[11] & 0xff)<<24,
      j4  = k[12] & 0xff | (k[13] & 0xff)<<8 | (k[14] & 0xff)<<16 | (k[15] & 0xff)<<24,
      j5  = c[ 4] & 0xff | (c[ 5] & 0xff)<<8 | (c[ 6] & 0xff)<<16 | (c[ 7] & 0xff)<<24,
      j6  = p[ 0] & 0xff | (p[ 1] & 0xff)<<8 | (p[ 2] & 0xff)<<16 | (p[ 3] & 0xff)<<24,
      j7  = p[ 4] & 0xff | (p[ 5] & 0xff)<<8 | (p[ 6] & 0xff)<<16 | (p[ 7] & 0xff)<<24,
      j8  = p[ 8] & 0xff | (p[ 9] & 0xff)<<8 | (p[10] & 0xff)<<16 | (p[11] & 0xff)<<24,
      j9  = p[12] & 0xff | (p[13] & 0xff)<<8 | (p[14] & 0xff)<<16 | (p[15] & 0xff)<<24,
      j10 = c[ 8] & 0xff | (c[ 9] & 0xff)<<8 | (c[10] & 0xff)<<16 | (c[11] & 0xff)<<24,
      j11 = k[16] & 0xff | (k[17] & 0xff)<<8 | (k[18] & 0xff)<<16 | (k[19] & 0xff)<<24,
      j12 = k[20] & 0xff | (k[21] & 0xff)<<8 | (k[22] & 0xff)<<16 | (k[23] & 0xff)<<24,
      j13 = k[24] & 0xff | (k[25] & 0xff)<<8 | (k[26] & 0xff)<<16 | (k[27] & 0xff)<<24,
      j14 = k[28] & 0xff | (k[29] & 0xff)<<8 | (k[30] & 0xff)<<16 | (k[31] & 0xff)<<24,
      j15 = c[12] & 0xff | (c[13] & 0xff)<<8 | (c[14] & 0xff)<<16 | (c[15] & 0xff)<<24;

  var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
      x15 = j15, u;

  for (var i = 0; i < 20; i += 2) {
    u = x0 + x12 | 0;
    x4 ^= u<<7 | u>>>(32-7);
    u = x4 + x0 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x4 | 0;
    x12 ^= u<<13 | u>>>(32-13);
    u = x12 + x8 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x1 | 0;
    x9 ^= u<<7 | u>>>(32-7);
    u = x9 + x5 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x9 | 0;
    x1 ^= u<<13 | u>>>(32-13);
    u = x1 + x13 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x6 | 0;
    x14 ^= u<<7 | u>>>(32-7);
    u = x14 + x10 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x14 | 0;
    x6 ^= u<<13 | u>>>(32-13);
    u = x6 + x2 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x11 | 0;
    x3 ^= u<<7 | u>>>(32-7);
    u = x3 + x15 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x3 | 0;
    x11 ^= u<<13 | u>>>(32-13);
    u = x11 + x7 | 0;
    x15 ^= u<<18 | u>>>(32-18);

    u = x0 + x3 | 0;
    x1 ^= u<<7 | u>>>(32-7);
    u = x1 + x0 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x1 | 0;
    x3 ^= u<<13 | u>>>(32-13);
    u = x3 + x2 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x4 | 0;
    x6 ^= u<<7 | u>>>(32-7);
    u = x6 + x5 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x6 | 0;
    x4 ^= u<<13 | u>>>(32-13);
    u = x4 + x7 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x9 | 0;
    x11 ^= u<<7 | u>>>(32-7);
    u = x11 + x10 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x11 | 0;
    x9 ^= u<<13 | u>>>(32-13);
    u = x9 + x8 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x14 | 0;
    x12 ^= u<<7 | u>>>(32-7);
    u = x12 + x15 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x12 | 0;
    x14 ^= u<<13 | u>>>(32-13);
    u = x14 + x13 | 0;
    x15 ^= u<<18 | u>>>(32-18);
  }

  o[ 0] = x0 >>>  0 & 0xff;
  o[ 1] = x0 >>>  8 & 0xff;
  o[ 2] = x0 >>> 16 & 0xff;
  o[ 3] = x0 >>> 24 & 0xff;

  o[ 4] = x5 >>>  0 & 0xff;
  o[ 5] = x5 >>>  8 & 0xff;
  o[ 6] = x5 >>> 16 & 0xff;
  o[ 7] = x5 >>> 24 & 0xff;

  o[ 8] = x10 >>>  0 & 0xff;
  o[ 9] = x10 >>>  8 & 0xff;
  o[10] = x10 >>> 16 & 0xff;
  o[11] = x10 >>> 24 & 0xff;

  o[12] = x15 >>>  0 & 0xff;
  o[13] = x15 >>>  8 & 0xff;
  o[14] = x15 >>> 16 & 0xff;
  o[15] = x15 >>> 24 & 0xff;

  o[16] = x6 >>>  0 & 0xff;
  o[17] = x6 >>>  8 & 0xff;
  o[18] = x6 >>> 16 & 0xff;
  o[19] = x6 >>> 24 & 0xff;

  o[20] = x7 >>>  0 & 0xff;
  o[21] = x7 >>>  8 & 0xff;
  o[22] = x7 >>> 16 & 0xff;
  o[23] = x7 >>> 24 & 0xff;

  o[24] = x8 >>>  0 & 0xff;
  o[25] = x8 >>>  8 & 0xff;
  o[26] = x8 >>> 16 & 0xff;
  o[27] = x8 >>> 24 & 0xff;

  o[28] = x9 >>>  0 & 0xff;
  o[29] = x9 >>>  8 & 0xff;
  o[30] = x9 >>> 16 & 0xff;
  o[31] = x9 >>> 24 & 0xff;
}

function crypto_core_salsa20(out,inp,k,c) {
  core_salsa20(out,inp,k,c);
}

function crypto_core_hsalsa20(out,inp,k,c) {
  core_hsalsa20(out,inp,k,c);
}

var sigma = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
            // "expand 32-byte k"

function crypto_stream_salsa20_xor(c,cpos,m,mpos,b,n,k) {
  var z = new Uint8Array(16), x = new Uint8Array(64);
  var u, i;
  for (i = 0; i < 16; i++) z[i] = 0;
  for (i = 0; i < 8; i++) z[i] = n[i];
  while (b >= 64) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < 64; i++) c[cpos+i] = m[mpos+i] ^ x[i];
    u = 1;
    for (i = 8; i < 16; i++) {
      u = u + (z[i] & 0xff) | 0;
      z[i] = u & 0xff;
      u >>>= 8;
    }
    b -= 64;
    cpos += 64;
    mpos += 64;
  }
  if (b > 0) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < b; i++) c[cpos+i] = m[mpos+i] ^ x[i];
  }
  return 0;
}

function crypto_stream_salsa20(c,cpos,b,n,k) {
  var z = new Uint8Array(16), x = new Uint8Array(64);
  var u, i;
  for (i = 0; i < 16; i++) z[i] = 0;
  for (i = 0; i < 8; i++) z[i] = n[i];
  while (b >= 64) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < 64; i++) c[cpos+i] = x[i];
    u = 1;
    for (i = 8; i < 16; i++) {
      u = u + (z[i] & 0xff) | 0;
      z[i] = u & 0xff;
      u >>>= 8;
    }
    b -= 64;
    cpos += 64;
  }
  if (b > 0) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < b; i++) c[cpos+i] = x[i];
  }
  return 0;
}

function crypto_stream(c,cpos,d,n,k) {
  var s = new Uint8Array(32);
  crypto_core_hsalsa20(s,n,k,sigma);
  var sn = new Uint8Array(8);
  for (var i = 0; i < 8; i++) sn[i] = n[i+16];
  return crypto_stream_salsa20(c,cpos,d,sn,s);
}

function crypto_stream_xor(c,cpos,m,mpos,d,n,k) {
  var s = new Uint8Array(32);
  crypto_core_hsalsa20(s,n,k,sigma);
  var sn = new Uint8Array(8);
  for (var i = 0; i < 8; i++) sn[i] = n[i+16];
  return crypto_stream_salsa20_xor(c,cpos,m,mpos,d,sn,s);
}

/*
* Port of Andrew Moon's Poly1305-donna-16. Public domain.
* https://github.com/floodyberry/poly1305-donna
*/

var poly1305 = function(key) {
  this.buffer = new Uint8Array(16);
  this.r = new Uint16Array(10);
  this.h = new Uint16Array(10);
  this.pad = new Uint16Array(8);
  this.leftover = 0;
  this.fin = 0;

  var t0, t1, t2, t3, t4, t5, t6, t7;

  t0 = key[ 0] & 0xff | (key[ 1] & 0xff) << 8; this.r[0] = ( t0                     ) & 0x1fff;
  t1 = key[ 2] & 0xff | (key[ 3] & 0xff) << 8; this.r[1] = ((t0 >>> 13) | (t1 <<  3)) & 0x1fff;
  t2 = key[ 4] & 0xff | (key[ 5] & 0xff) << 8; this.r[2] = ((t1 >>> 10) | (t2 <<  6)) & 0x1f03;
  t3 = key[ 6] & 0xff | (key[ 7] & 0xff) << 8; this.r[3] = ((t2 >>>  7) | (t3 <<  9)) & 0x1fff;
  t4 = key[ 8] & 0xff | (key[ 9] & 0xff) << 8; this.r[4] = ((t3 >>>  4) | (t4 << 12)) & 0x00ff;
  this.r[5] = ((t4 >>>  1)) & 0x1ffe;
  t5 = key[10] & 0xff | (key[11] & 0xff) << 8; this.r[6] = ((t4 >>> 14) | (t5 <<  2)) & 0x1fff;
  t6 = key[12] & 0xff | (key[13] & 0xff) << 8; this.r[7] = ((t5 >>> 11) | (t6 <<  5)) & 0x1f81;
  t7 = key[14] & 0xff | (key[15] & 0xff) << 8; this.r[8] = ((t6 >>>  8) | (t7 <<  8)) & 0x1fff;
  this.r[9] = ((t7 >>>  5)) & 0x007f;

  this.pad[0] = key[16] & 0xff | (key[17] & 0xff) << 8;
  this.pad[1] = key[18] & 0xff | (key[19] & 0xff) << 8;
  this.pad[2] = key[20] & 0xff | (key[21] & 0xff) << 8;
  this.pad[3] = key[22] & 0xff | (key[23] & 0xff) << 8;
  this.pad[4] = key[24] & 0xff | (key[25] & 0xff) << 8;
  this.pad[5] = key[26] & 0xff | (key[27] & 0xff) << 8;
  this.pad[6] = key[28] & 0xff | (key[29] & 0xff) << 8;
  this.pad[7] = key[30] & 0xff | (key[31] & 0xff) << 8;
};

poly1305.prototype.blocks = function(m, mpos, bytes) {
  var hibit = this.fin ? 0 : (1 << 11);
  var t0, t1, t2, t3, t4, t5, t6, t7, c;
  var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;

  var h0 = this.h[0],
      h1 = this.h[1],
      h2 = this.h[2],
      h3 = this.h[3],
      h4 = this.h[4],
      h5 = this.h[5],
      h6 = this.h[6],
      h7 = this.h[7],
      h8 = this.h[8],
      h9 = this.h[9];

  var r0 = this.r[0],
      r1 = this.r[1],
      r2 = this.r[2],
      r3 = this.r[3],
      r4 = this.r[4],
      r5 = this.r[5],
      r6 = this.r[6],
      r7 = this.r[7],
      r8 = this.r[8],
      r9 = this.r[9];

  while (bytes >= 16) {
    t0 = m[mpos+ 0] & 0xff | (m[mpos+ 1] & 0xff) << 8; h0 += ( t0                     ) & 0x1fff;
    t1 = m[mpos+ 2] & 0xff | (m[mpos+ 3] & 0xff) << 8; h1 += ((t0 >>> 13) | (t1 <<  3)) & 0x1fff;
    t2 = m[mpos+ 4] & 0xff | (m[mpos+ 5] & 0xff) << 8; h2 += ((t1 >>> 10) | (t2 <<  6)) & 0x1fff;
    t3 = m[mpos+ 6] & 0xff | (m[mpos+ 7] & 0xff) << 8; h3 += ((t2 >>>  7) | (t3 <<  9)) & 0x1fff;
    t4 = m[mpos+ 8] & 0xff | (m[mpos+ 9] & 0xff) << 8; h4 += ((t3 >>>  4) | (t4 << 12)) & 0x1fff;
    h5 += ((t4 >>>  1)) & 0x1fff;
    t5 = m[mpos+10] & 0xff | (m[mpos+11] & 0xff) << 8; h6 += ((t4 >>> 14) | (t5 <<  2)) & 0x1fff;
    t6 = m[mpos+12] & 0xff | (m[mpos+13] & 0xff) << 8; h7 += ((t5 >>> 11) | (t6 <<  5)) & 0x1fff;
    t7 = m[mpos+14] & 0xff | (m[mpos+15] & 0xff) << 8; h8 += ((t6 >>>  8) | (t7 <<  8)) & 0x1fff;
    h9 += ((t7 >>> 5)) | hibit;

    c = 0;

    d0 = c;
    d0 += h0 * r0;
    d0 += h1 * (5 * r9);
    d0 += h2 * (5 * r8);
    d0 += h3 * (5 * r7);
    d0 += h4 * (5 * r6);
    c = (d0 >>> 13); d0 &= 0x1fff;
    d0 += h5 * (5 * r5);
    d0 += h6 * (5 * r4);
    d0 += h7 * (5 * r3);
    d0 += h8 * (5 * r2);
    d0 += h9 * (5 * r1);
    c += (d0 >>> 13); d0 &= 0x1fff;

    d1 = c;
    d1 += h0 * r1;
    d1 += h1 * r0;
    d1 += h2 * (5 * r9);
    d1 += h3 * (5 * r8);
    d1 += h4 * (5 * r7);
    c = (d1 >>> 13); d1 &= 0x1fff;
    d1 += h5 * (5 * r6);
    d1 += h6 * (5 * r5);
    d1 += h7 * (5 * r4);
    d1 += h8 * (5 * r3);
    d1 += h9 * (5 * r2);
    c += (d1 >>> 13); d1 &= 0x1fff;

    d2 = c;
    d2 += h0 * r2;
    d2 += h1 * r1;
    d2 += h2 * r0;
    d2 += h3 * (5 * r9);
    d2 += h4 * (5 * r8);
    c = (d2 >>> 13); d2 &= 0x1fff;
    d2 += h5 * (5 * r7);
    d2 += h6 * (5 * r6);
    d2 += h7 * (5 * r5);
    d2 += h8 * (5 * r4);
    d2 += h9 * (5 * r3);
    c += (d2 >>> 13); d2 &= 0x1fff;

    d3 = c;
    d3 += h0 * r3;
    d3 += h1 * r2;
    d3 += h2 * r1;
    d3 += h3 * r0;
    d3 += h4 * (5 * r9);
    c = (d3 >>> 13); d3 &= 0x1fff;
    d3 += h5 * (5 * r8);
    d3 += h6 * (5 * r7);
    d3 += h7 * (5 * r6);
    d3 += h8 * (5 * r5);
    d3 += h9 * (5 * r4);
    c += (d3 >>> 13); d3 &= 0x1fff;

    d4 = c;
    d4 += h0 * r4;
    d4 += h1 * r3;
    d4 += h2 * r2;
    d4 += h3 * r1;
    d4 += h4 * r0;
    c = (d4 >>> 13); d4 &= 0x1fff;
    d4 += h5 * (5 * r9);
    d4 += h6 * (5 * r8);
    d4 += h7 * (5 * r7);
    d4 += h8 * (5 * r6);
    d4 += h9 * (5 * r5);
    c += (d4 >>> 13); d4 &= 0x1fff;

    d5 = c;
    d5 += h0 * r5;
    d5 += h1 * r4;
    d5 += h2 * r3;
    d5 += h3 * r2;
    d5 += h4 * r1;
    c = (d5 >>> 13); d5 &= 0x1fff;
    d5 += h5 * r0;
    d5 += h6 * (5 * r9);
    d5 += h7 * (5 * r8);
    d5 += h8 * (5 * r7);
    d5 += h9 * (5 * r6);
    c += (d5 >>> 13); d5 &= 0x1fff;

    d6 = c;
    d6 += h0 * r6;
    d6 += h1 * r5;
    d6 += h2 * r4;
    d6 += h3 * r3;
    d6 += h4 * r2;
    c = (d6 >>> 13); d6 &= 0x1fff;
    d6 += h5 * r1;
    d6 += h6 * r0;
    d6 += h7 * (5 * r9);
    d6 += h8 * (5 * r8);
    d6 += h9 * (5 * r7);
    c += (d6 >>> 13); d6 &= 0x1fff;

    d7 = c;
    d7 += h0 * r7;
    d7 += h1 * r6;
    d7 += h2 * r5;
    d7 += h3 * r4;
    d7 += h4 * r3;
    c = (d7 >>> 13); d7 &= 0x1fff;
    d7 += h5 * r2;
    d7 += h6 * r1;
    d7 += h7 * r0;
    d7 += h8 * (5 * r9);
    d7 += h9 * (5 * r8);
    c += (d7 >>> 13); d7 &= 0x1fff;

    d8 = c;
    d8 += h0 * r8;
    d8 += h1 * r7;
    d8 += h2 * r6;
    d8 += h3 * r5;
    d8 += h4 * r4;
    c = (d8 >>> 13); d8 &= 0x1fff;
    d8 += h5 * r3;
    d8 += h6 * r2;
    d8 += h7 * r1;
    d8 += h8 * r0;
    d8 += h9 * (5 * r9);
    c += (d8 >>> 13); d8 &= 0x1fff;

    d9 = c;
    d9 += h0 * r9;
    d9 += h1 * r8;
    d9 += h2 * r7;
    d9 += h3 * r6;
    d9 += h4 * r5;
    c = (d9 >>> 13); d9 &= 0x1fff;
    d9 += h5 * r4;
    d9 += h6 * r3;
    d9 += h7 * r2;
    d9 += h8 * r1;
    d9 += h9 * r0;
    c += (d9 >>> 13); d9 &= 0x1fff;

    c = (((c << 2) + c)) | 0;
    c = (c + d0) | 0;
    d0 = c & 0x1fff;
    c = (c >>> 13);
    d1 += c;

    h0 = d0;
    h1 = d1;
    h2 = d2;
    h3 = d3;
    h4 = d4;
    h5 = d5;
    h6 = d6;
    h7 = d7;
    h8 = d8;
    h9 = d9;

    mpos += 16;
    bytes -= 16;
  }
  this.h[0] = h0;
  this.h[1] = h1;
  this.h[2] = h2;
  this.h[3] = h3;
  this.h[4] = h4;
  this.h[5] = h5;
  this.h[6] = h6;
  this.h[7] = h7;
  this.h[8] = h8;
  this.h[9] = h9;
};

poly1305.prototype.finish = function(mac, macpos) {
  var g = new Uint16Array(10);
  var c, mask, f, i;

  if (this.leftover) {
    i = this.leftover;
    this.buffer[i++] = 1;
    for (; i < 16; i++) this.buffer[i] = 0;
    this.fin = 1;
    this.blocks(this.buffer, 0, 16);
  }

  c = this.h[1] >>> 13;
  this.h[1] &= 0x1fff;
  for (i = 2; i < 10; i++) {
    this.h[i] += c;
    c = this.h[i] >>> 13;
    this.h[i] &= 0x1fff;
  }
  this.h[0] += (c * 5);
  c = this.h[0] >>> 13;
  this.h[0] &= 0x1fff;
  this.h[1] += c;
  c = this.h[1] >>> 13;
  this.h[1] &= 0x1fff;
  this.h[2] += c;

  g[0] = this.h[0] + 5;
  c = g[0] >>> 13;
  g[0] &= 0x1fff;
  for (i = 1; i < 10; i++) {
    g[i] = this.h[i] + c;
    c = g[i] >>> 13;
    g[i] &= 0x1fff;
  }
  g[9] -= (1 << 13);

  mask = (c ^ 1) - 1;
  for (i = 0; i < 10; i++) g[i] &= mask;
  mask = ~mask;
  for (i = 0; i < 10; i++) this.h[i] = (this.h[i] & mask) | g[i];

  this.h[0] = ((this.h[0]       ) | (this.h[1] << 13)                    ) & 0xffff;
  this.h[1] = ((this.h[1] >>>  3) | (this.h[2] << 10)                    ) & 0xffff;
  this.h[2] = ((this.h[2] >>>  6) | (this.h[3] <<  7)                    ) & 0xffff;
  this.h[3] = ((this.h[3] >>>  9) | (this.h[4] <<  4)                    ) & 0xffff;
  this.h[4] = ((this.h[4] >>> 12) | (this.h[5] <<  1) | (this.h[6] << 14)) & 0xffff;
  this.h[5] = ((this.h[6] >>>  2) | (this.h[7] << 11)                    ) & 0xffff;
  this.h[6] = ((this.h[7] >>>  5) | (this.h[8] <<  8)                    ) & 0xffff;
  this.h[7] = ((this.h[8] >>>  8) | (this.h[9] <<  5)                    ) & 0xffff;

  f = this.h[0] + this.pad[0];
  this.h[0] = f & 0xffff;
  for (i = 1; i < 8; i++) {
    f = (((this.h[i] + this.pad[i]) | 0) + (f >>> 16)) | 0;
    this.h[i] = f & 0xffff;
  }

  mac[macpos+ 0] = (this.h[0] >>> 0) & 0xff;
  mac[macpos+ 1] = (this.h[0] >>> 8) & 0xff;
  mac[macpos+ 2] = (this.h[1] >>> 0) & 0xff;
  mac[macpos+ 3] = (this.h[1] >>> 8) & 0xff;
  mac[macpos+ 4] = (this.h[2] >>> 0) & 0xff;
  mac[macpos+ 5] = (this.h[2] >>> 8) & 0xff;
  mac[macpos+ 6] = (this.h[3] >>> 0) & 0xff;
  mac[macpos+ 7] = (this.h[3] >>> 8) & 0xff;
  mac[macpos+ 8] = (this.h[4] >>> 0) & 0xff;
  mac[macpos+ 9] = (this.h[4] >>> 8) & 0xff;
  mac[macpos+10] = (this.h[5] >>> 0) & 0xff;
  mac[macpos+11] = (this.h[5] >>> 8) & 0xff;
  mac[macpos+12] = (this.h[6] >>> 0) & 0xff;
  mac[macpos+13] = (this.h[6] >>> 8) & 0xff;
  mac[macpos+14] = (this.h[7] >>> 0) & 0xff;
  mac[macpos+15] = (this.h[7] >>> 8) & 0xff;
};

poly1305.prototype.update = function(m, mpos, bytes) {
  var i, want;

  if (this.leftover) {
    want = (16 - this.leftover);
    if (want > bytes)
      want = bytes;
    for (i = 0; i < want; i++)
      this.buffer[this.leftover + i] = m[mpos+i];
    bytes -= want;
    mpos += want;
    this.leftover += want;
    if (this.leftover < 16)
      return;
    this.blocks(this.buffer, 0, 16);
    this.leftover = 0;
  }

  if (bytes >= 16) {
    want = bytes - (bytes % 16);
    this.blocks(m, mpos, want);
    mpos += want;
    bytes -= want;
  }

  if (bytes) {
    for (i = 0; i < bytes; i++)
      this.buffer[this.leftover + i] = m[mpos+i];
    this.leftover += bytes;
  }
};

function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
  var s = new poly1305(k);
  s.update(m, mpos, n);
  s.finish(out, outpos);
  return 0;
}

function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
  var x = new Uint8Array(16);
  crypto_onetimeauth(x,0,m,mpos,n,k);
  return crypto_verify_16(h,hpos,x,0);
}

function crypto_secretbox(c,m,d,n,k) {
  var i;
  if (d < 32) return -1;
  crypto_stream_xor(c,0,m,0,d,n,k);
  crypto_onetimeauth(c, 16, c, 32, d - 32, c);
  for (i = 0; i < 16; i++) c[i] = 0;
  return 0;
}

function crypto_secretbox_open(m,c,d,n,k) {
  var i;
  var x = new Uint8Array(32);
  if (d < 32) return -1;
  crypto_stream(x,0,32,n,k);
  if (crypto_onetimeauth_verify(c, 16,c, 32,d - 32,x) !== 0) return -1;
  crypto_stream_xor(m,0,c,0,d,n,k);
  for (i = 0; i < 32; i++) m[i] = 0;
  return 0;
}

function set25519(r, a) {
  var i;
  for (i = 0; i < 16; i++) r[i] = a[i]|0;
}

function car25519(o) {
  var i, v, c = 1;
  for (i = 0; i < 16; i++) {
    v = o[i] + c + 65535;
    c = Math.floor(v / 65536);
    o[i] = v - c * 65536;
  }
  o[0] += c-1 + 37 * (c-1);
}

function sel25519(p, q, b) {
  var t, c = ~(b-1);
  for (var i = 0; i < 16; i++) {
    t = c & (p[i] ^ q[i]);
    p[i] ^= t;
    q[i] ^= t;
  }
}

function pack25519(o, n) {
  var i, j, b;
  var m = gf(), t = gf();
  for (i = 0; i < 16; i++) t[i] = n[i];
  car25519(t);
  car25519(t);
  car25519(t);
  for (j = 0; j < 2; j++) {
    m[0] = t[0] - 0xffed;
    for (i = 1; i < 15; i++) {
      m[i] = t[i] - 0xffff - ((m[i-1]>>16) & 1);
      m[i-1] &= 0xffff;
    }
    m[15] = t[15] - 0x7fff - ((m[14]>>16) & 1);
    b = (m[15]>>16) & 1;
    m[14] &= 0xffff;
    sel25519(t, m, 1-b);
  }
  for (i = 0; i < 16; i++) {
    o[2*i] = t[i] & 0xff;
    o[2*i+1] = t[i]>>8;
  }
}

function neq25519(a, b) {
  var c = new Uint8Array(32), d = new Uint8Array(32);
  pack25519(c, a);
  pack25519(d, b);
  return crypto_verify_32(c, 0, d, 0);
}

function par25519(a) {
  var d = new Uint8Array(32);
  pack25519(d, a);
  return d[0] & 1;
}

function unpack25519(o, n) {
  var i;
  for (i = 0; i < 16; i++) o[i] = n[2*i] + (n[2*i+1] << 8);
  o[15] &= 0x7fff;
}

function A(o, a, b) {
  for (var i = 0; i < 16; i++) o[i] = a[i] + b[i];
}

function Z(o, a, b) {
  for (var i = 0; i < 16; i++) o[i] = a[i] - b[i];
}

function M(o, a, b) {
  var v, c,
     t0 = 0,  t1 = 0,  t2 = 0,  t3 = 0,  t4 = 0,  t5 = 0,  t6 = 0,  t7 = 0,
     t8 = 0,  t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0,
    t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0,
    t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0,
    b0 = b[0],
    b1 = b[1],
    b2 = b[2],
    b3 = b[3],
    b4 = b[4],
    b5 = b[5],
    b6 = b[6],
    b7 = b[7],
    b8 = b[8],
    b9 = b[9],
    b10 = b[10],
    b11 = b[11],
    b12 = b[12],
    b13 = b[13],
    b14 = b[14],
    b15 = b[15];

  v = a[0];
  t0 += v * b0;
  t1 += v * b1;
  t2 += v * b2;
  t3 += v * b3;
  t4 += v * b4;
  t5 += v * b5;
  t6 += v * b6;
  t7 += v * b7;
  t8 += v * b8;
  t9 += v * b9;
  t10 += v * b10;
  t11 += v * b11;
  t12 += v * b12;
  t13 += v * b13;
  t14 += v * b14;
  t15 += v * b15;
  v = a[1];
  t1 += v * b0;
  t2 += v * b1;
  t3 += v * b2;
  t4 += v * b3;
  t5 += v * b4;
  t6 += v * b5;
  t7 += v * b6;
  t8 += v * b7;
  t9 += v * b8;
  t10 += v * b9;
  t11 += v * b10;
  t12 += v * b11;
  t13 += v * b12;
  t14 += v * b13;
  t15 += v * b14;
  t16 += v * b15;
  v = a[2];
  t2 += v * b0;
  t3 += v * b1;
  t4 += v * b2;
  t5 += v * b3;
  t6 += v * b4;
  t7 += v * b5;
  t8 += v * b6;
  t9 += v * b7;
  t10 += v * b8;
  t11 += v * b9;
  t12 += v * b10;
  t13 += v * b11;
  t14 += v * b12;
  t15 += v * b13;
  t16 += v * b14;
  t17 += v * b15;
  v = a[3];
  t3 += v * b0;
  t4 += v * b1;
  t5 += v * b2;
  t6 += v * b3;
  t7 += v * b4;
  t8 += v * b5;
  t9 += v * b6;
  t10 += v * b7;
  t11 += v * b8;
  t12 += v * b9;
  t13 += v * b10;
  t14 += v * b11;
  t15 += v * b12;
  t16 += v * b13;
  t17 += v * b14;
  t18 += v * b15;
  v = a[4];
  t4 += v * b0;
  t5 += v * b1;
  t6 += v * b2;
  t7 += v * b3;
  t8 += v * b4;
  t9 += v * b5;
  t10 += v * b6;
  t11 += v * b7;
  t12 += v * b8;
  t13 += v * b9;
  t14 += v * b10;
  t15 += v * b11;
  t16 += v * b12;
  t17 += v * b13;
  t18 += v * b14;
  t19 += v * b15;
  v = a[5];
  t5 += v * b0;
  t6 += v * b1;
  t7 += v * b2;
  t8 += v * b3;
  t9 += v * b4;
  t10 += v * b5;
  t11 += v * b6;
  t12 += v * b7;
  t13 += v * b8;
  t14 += v * b9;
  t15 += v * b10;
  t16 += v * b11;
  t17 += v * b12;
  t18 += v * b13;
  t19 += v * b14;
  t20 += v * b15;
  v = a[6];
  t6 += v * b0;
  t7 += v * b1;
  t8 += v * b2;
  t9 += v * b3;
  t10 += v * b4;
  t11 += v * b5;
  t12 += v * b6;
  t13 += v * b7;
  t14 += v * b8;
  t15 += v * b9;
  t16 += v * b10;
  t17 += v * b11;
  t18 += v * b12;
  t19 += v * b13;
  t20 += v * b14;
  t21 += v * b15;
  v = a[7];
  t7 += v * b0;
  t8 += v * b1;
  t9 += v * b2;
  t10 += v * b3;
  t11 += v * b4;
  t12 += v * b5;
  t13 += v * b6;
  t14 += v * b7;
  t15 += v * b8;
  t16 += v * b9;
  t17 += v * b10;
  t18 += v * b11;
  t19 += v * b12;
  t20 += v * b13;
  t21 += v * b14;
  t22 += v * b15;
  v = a[8];
  t8 += v * b0;
  t9 += v * b1;
  t10 += v * b2;
  t11 += v * b3;
  t12 += v * b4;
  t13 += v * b5;
  t14 += v * b6;
  t15 += v * b7;
  t16 += v * b8;
  t17 += v * b9;
  t18 += v * b10;
  t19 += v * b11;
  t20 += v * b12;
  t21 += v * b13;
  t22 += v * b14;
  t23 += v * b15;
  v = a[9];
  t9 += v * b0;
  t10 += v * b1;
  t11 += v * b2;
  t12 += v * b3;
  t13 += v * b4;
  t14 += v * b5;
  t15 += v * b6;
  t16 += v * b7;
  t17 += v * b8;
  t18 += v * b9;
  t19 += v * b10;
  t20 += v * b11;
  t21 += v * b12;
  t22 += v * b13;
  t23 += v * b14;
  t24 += v * b15;
  v = a[10];
  t10 += v * b0;
  t11 += v * b1;
  t12 += v * b2;
  t13 += v * b3;
  t14 += v * b4;
  t15 += v * b5;
  t16 += v * b6;
  t17 += v * b7;
  t18 += v * b8;
  t19 += v * b9;
  t20 += v * b10;
  t21 += v * b11;
  t22 += v * b12;
  t23 += v * b13;
  t24 += v * b14;
  t25 += v * b15;
  v = a[11];
  t11 += v * b0;
  t12 += v * b1;
  t13 += v * b2;
  t14 += v * b3;
  t15 += v * b4;
  t16 += v * b5;
  t17 += v * b6;
  t18 += v * b7;
  t19 += v * b8;
  t20 += v * b9;
  t21 += v * b10;
  t22 += v * b11;
  t23 += v * b12;
  t24 += v * b13;
  t25 += v * b14;
  t26 += v * b15;
  v = a[12];
  t12 += v * b0;
  t13 += v * b1;
  t14 += v * b2;
  t15 += v * b3;
  t16 += v * b4;
  t17 += v * b5;
  t18 += v * b6;
  t19 += v * b7;
  t20 += v * b8;
  t21 += v * b9;
  t22 += v * b10;
  t23 += v * b11;
  t24 += v * b12;
  t25 += v * b13;
  t26 += v * b14;
  t27 += v * b15;
  v = a[13];
  t13 += v * b0;
  t14 += v * b1;
  t15 += v * b2;
  t16 += v * b3;
  t17 += v * b4;
  t18 += v * b5;
  t19 += v * b6;
  t20 += v * b7;
  t21 += v * b8;
  t22 += v * b9;
  t23 += v * b10;
  t24 += v * b11;
  t25 += v * b12;
  t26 += v * b13;
  t27 += v * b14;
  t28 += v * b15;
  v = a[14];
  t14 += v * b0;
  t15 += v * b1;
  t16 += v * b2;
  t17 += v * b3;
  t18 += v * b4;
  t19 += v * b5;
  t20 += v * b6;
  t21 += v * b7;
  t22 += v * b8;
  t23 += v * b9;
  t24 += v * b10;
  t25 += v * b11;
  t26 += v * b12;
  t27 += v * b13;
  t28 += v * b14;
  t29 += v * b15;
  v = a[15];
  t15 += v * b0;
  t16 += v * b1;
  t17 += v * b2;
  t18 += v * b3;
  t19 += v * b4;
  t20 += v * b5;
  t21 += v * b6;
  t22 += v * b7;
  t23 += v * b8;
  t24 += v * b9;
  t25 += v * b10;
  t26 += v * b11;
  t27 += v * b12;
  t28 += v * b13;
  t29 += v * b14;
  t30 += v * b15;

  t0  += 38 * t16;
  t1  += 38 * t17;
  t2  += 38 * t18;
  t3  += 38 * t19;
  t4  += 38 * t20;
  t5  += 38 * t21;
  t6  += 38 * t22;
  t7  += 38 * t23;
  t8  += 38 * t24;
  t9  += 38 * t25;
  t10 += 38 * t26;
  t11 += 38 * t27;
  t12 += 38 * t28;
  t13 += 38 * t29;
  t14 += 38 * t30;
  // t15 left as is

  // first car
  c = 1;
  v =  t0 + c + 65535; c = Math.floor(v / 65536);  t0 = v - c * 65536;
  v =  t1 + c + 65535; c = Math.floor(v / 65536);  t1 = v - c * 65536;
  v =  t2 + c + 65535; c = Math.floor(v / 65536);  t2 = v - c * 65536;
  v =  t3 + c + 65535; c = Math.floor(v / 65536);  t3 = v - c * 65536;
  v =  t4 + c + 65535; c = Math.floor(v / 65536);  t4 = v - c * 65536;
  v =  t5 + c + 65535; c = Math.floor(v / 65536);  t5 = v - c * 65536;
  v =  t6 + c + 65535; c = Math.floor(v / 65536);  t6 = v - c * 65536;
  v =  t7 + c + 65535; c = Math.floor(v / 65536);  t7 = v - c * 65536;
  v =  t8 + c + 65535; c = Math.floor(v / 65536);  t8 = v - c * 65536;
  v =  t9 + c + 65535; c = Math.floor(v / 65536);  t9 = v - c * 65536;
  v = t10 + c + 65535; c = Math.floor(v / 65536); t10 = v - c * 65536;
  v = t11 + c + 65535; c = Math.floor(v / 65536); t11 = v - c * 65536;
  v = t12 + c + 65535; c = Math.floor(v / 65536); t12 = v - c * 65536;
  v = t13 + c + 65535; c = Math.floor(v / 65536); t13 = v - c * 65536;
  v = t14 + c + 65535; c = Math.floor(v / 65536); t14 = v - c * 65536;
  v = t15 + c + 65535; c = Math.floor(v / 65536); t15 = v - c * 65536;
  t0 += c-1 + 37 * (c-1);

  // second car
  c = 1;
  v =  t0 + c + 65535; c = Math.floor(v / 65536);  t0 = v - c * 65536;
  v =  t1 + c + 65535; c = Math.floor(v / 65536);  t1 = v - c * 65536;
  v =  t2 + c + 65535; c = Math.floor(v / 65536);  t2 = v - c * 65536;
  v =  t3 + c + 65535; c = Math.floor(v / 65536);  t3 = v - c * 65536;
  v =  t4 + c + 65535; c = Math.floor(v / 65536);  t4 = v - c * 65536;
  v =  t5 + c + 65535; c = Math.floor(v / 65536);  t5 = v - c * 65536;
  v =  t6 + c + 65535; c = Math.floor(v / 65536);  t6 = v - c * 65536;
  v =  t7 + c + 65535; c = Math.floor(v / 65536);  t7 = v - c * 65536;
  v =  t8 + c + 65535; c = Math.floor(v / 65536);  t8 = v - c * 65536;
  v =  t9 + c + 65535; c = Math.floor(v / 65536);  t9 = v - c * 65536;
  v = t10 + c + 65535; c = Math.floor(v / 65536); t10 = v - c * 65536;
  v = t11 + c + 65535; c = Math.floor(v / 65536); t11 = v - c * 65536;
  v = t12 + c + 65535; c = Math.floor(v / 65536); t12 = v - c * 65536;
  v = t13 + c + 65535; c = Math.floor(v / 65536); t13 = v - c * 65536;
  v = t14 + c + 65535; c = Math.floor(v / 65536); t14 = v - c * 65536;
  v = t15 + c + 65535; c = Math.floor(v / 65536); t15 = v - c * 65536;
  t0 += c-1 + 37 * (c-1);

  o[ 0] = t0;
  o[ 1] = t1;
  o[ 2] = t2;
  o[ 3] = t3;
  o[ 4] = t4;
  o[ 5] = t5;
  o[ 6] = t6;
  o[ 7] = t7;
  o[ 8] = t8;
  o[ 9] = t9;
  o[10] = t10;
  o[11] = t11;
  o[12] = t12;
  o[13] = t13;
  o[14] = t14;
  o[15] = t15;
}

function S(o, a) {
  M(o, a, a);
}

function inv25519(o, i) {
  var c = gf();
  var a;
  for (a = 0; a < 16; a++) c[a] = i[a];
  for (a = 253; a >= 0; a--) {
    S(c, c);
    if(a !== 2 && a !== 4) M(c, c, i);
  }
  for (a = 0; a < 16; a++) o[a] = c[a];
}

function pow2523(o, i) {
  var c = gf();
  var a;
  for (a = 0; a < 16; a++) c[a] = i[a];
  for (a = 250; a >= 0; a--) {
      S(c, c);
      if(a !== 1) M(c, c, i);
  }
  for (a = 0; a < 16; a++) o[a] = c[a];
}

function crypto_scalarmult(q, n, p) {
  var z = new Uint8Array(32);
  var x = new Float64Array(80), r, i;
  var a = gf(), b = gf(), c = gf(),
      d = gf(), e = gf(), f = gf();
  for (i = 0; i < 31; i++) z[i] = n[i];
  z[31]=(n[31]&127)|64;
  z[0]&=248;
  unpack25519(x,p);
  for (i = 0; i < 16; i++) {
    b[i]=x[i];
    d[i]=a[i]=c[i]=0;
  }
  a[0]=d[0]=1;
  for (i=254; i>=0; --i) {
    r=(z[i>>>3]>>>(i&7))&1;
    sel25519(a,b,r);
    sel25519(c,d,r);
    A(e,a,c);
    Z(a,a,c);
    A(c,b,d);
    Z(b,b,d);
    S(d,e);
    S(f,a);
    M(a,c,a);
    M(c,b,e);
    A(e,a,c);
    Z(a,a,c);
    S(b,a);
    Z(c,d,f);
    M(a,c,_121665);
    A(a,a,d);
    M(c,c,a);
    M(a,d,f);
    M(d,b,x);
    S(b,e);
    sel25519(a,b,r);
    sel25519(c,d,r);
  }
  for (i = 0; i < 16; i++) {
    x[i+16]=a[i];
    x[i+32]=c[i];
    x[i+48]=b[i];
    x[i+64]=d[i];
  }
  var x32 = x.subarray(32);
  var x16 = x.subarray(16);
  inv25519(x32,x32);
  M(x16,x16,x32);
  pack25519(q,x16);
  return 0;
}

function crypto_scalarmult_base(q, n) {
  return crypto_scalarmult(q, n, _9);
}

function crypto_box_keypair(y, x) {
  randombytes(x, 32);
  return crypto_scalarmult_base(y, x);
}

function crypto_box_beforenm(k, y, x) {
  var s = new Uint8Array(32);
  crypto_scalarmult(s, x, y);
  return crypto_core_hsalsa20(k, _0, s, sigma);
}

var crypto_box_afternm = crypto_secretbox;
var crypto_box_open_afternm = crypto_secretbox_open;

function crypto_box(c, m, d, n, y, x) {
  var k = new Uint8Array(32);
  crypto_box_beforenm(k, y, x);
  return crypto_box_afternm(c, m, d, n, k);
}

function crypto_box_open(m, c, d, n, y, x) {
  var k = new Uint8Array(32);
  crypto_box_beforenm(k, y, x);
  return crypto_box_open_afternm(m, c, d, n, k);
}

var K = [
  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
];

function crypto_hashblocks_hl(hh, hl, m, n) {
  var wh = new Int32Array(16), wl = new Int32Array(16),
      bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7,
      bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7,
      th, tl, i, j, h, l, a, b, c, d;

  var ah0 = hh[0],
      ah1 = hh[1],
      ah2 = hh[2],
      ah3 = hh[3],
      ah4 = hh[4],
      ah5 = hh[5],
      ah6 = hh[6],
      ah7 = hh[7],

      al0 = hl[0],
      al1 = hl[1],
      al2 = hl[2],
      al3 = hl[3],
      al4 = hl[4],
      al5 = hl[5],
      al6 = hl[6],
      al7 = hl[7];

  var pos = 0;
  while (n >= 128) {
    for (i = 0; i < 16; i++) {
      j = 8 * i + pos;
      wh[i] = (m[j+0] << 24) | (m[j+1] << 16) | (m[j+2] << 8) | m[j+3];
      wl[i] = (m[j+4] << 24) | (m[j+5] << 16) | (m[j+6] << 8) | m[j+7];
    }
    for (i = 0; i < 80; i++) {
      bh0 = ah0;
      bh1 = ah1;
      bh2 = ah2;
      bh3 = ah3;
      bh4 = ah4;
      bh5 = ah5;
      bh6 = ah6;
      bh7 = ah7;

      bl0 = al0;
      bl1 = al1;
      bl2 = al2;
      bl3 = al3;
      bl4 = al4;
      bl5 = al5;
      bl6 = al6;
      bl7 = al7;

      // add
      h = ah7;
      l = al7;

      a = l & 0xffff; b = l >>> 16;
      c = h & 0xffff; d = h >>> 16;

      // Sigma1
      h = ((ah4 >>> 14) | (al4 << (32-14))) ^ ((ah4 >>> 18) | (al4 << (32-18))) ^ ((al4 >>> (41-32)) | (ah4 << (32-(41-32))));
      l = ((al4 >>> 14) | (ah4 << (32-14))) ^ ((al4 >>> 18) | (ah4 << (32-18))) ^ ((ah4 >>> (41-32)) | (al4 << (32-(41-32))));

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // Ch
      h = (ah4 & ah5) ^ (~ah4 & ah6);
      l = (al4 & al5) ^ (~al4 & al6);

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // K
      h = K[i*2];
      l = K[i*2+1];

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // w
      h = wh[i%16];
      l = wl[i%16];

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;

      th = c & 0xffff | d << 16;
      tl = a & 0xffff | b << 16;

      // add
      h = th;
      l = tl;

      a = l & 0xffff; b = l >>> 16;
      c = h & 0xffff; d = h >>> 16;

      // Sigma0
      h = ((ah0 >>> 28) | (al0 << (32-28))) ^ ((al0 >>> (34-32)) | (ah0 << (32-(34-32)))) ^ ((al0 >>> (39-32)) | (ah0 << (32-(39-32))));
      l = ((al0 >>> 28) | (ah0 << (32-28))) ^ ((ah0 >>> (34-32)) | (al0 << (32-(34-32)))) ^ ((ah0 >>> (39-32)) | (al0 << (32-(39-32))));

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // Maj
      h = (ah0 & ah1) ^ (ah0 & ah2) ^ (ah1 & ah2);
      l = (al0 & al1) ^ (al0 & al2) ^ (al1 & al2);

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;

      bh7 = (c & 0xffff) | (d << 16);
      bl7 = (a & 0xffff) | (b << 16);

      // add
      h = bh3;
      l = bl3;

      a = l & 0xffff; b = l >>> 16;
      c = h & 0xffff; d = h >>> 16;

      h = th;
      l = tl;

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;

      bh3 = (c & 0xffff) | (d << 16);
      bl3 = (a & 0xffff) | (b << 16);

      ah1 = bh0;
      ah2 = bh1;
      ah3 = bh2;
      ah4 = bh3;
      ah5 = bh4;
      ah6 = bh5;
      ah7 = bh6;
      ah0 = bh7;

      al1 = bl0;
      al2 = bl1;
      al3 = bl2;
      al4 = bl3;
      al5 = bl4;
      al6 = bl5;
      al7 = bl6;
      al0 = bl7;

      if (i%16 === 15) {
        for (j = 0; j < 16; j++) {
          // add
          h = wh[j];
          l = wl[j];

          a = l & 0xffff; b = l >>> 16;
          c = h & 0xffff; d = h >>> 16;

          h = wh[(j+9)%16];
          l = wl[(j+9)%16];

          a += l & 0xffff; b += l >>> 16;
          c += h & 0xffff; d += h >>> 16;

          // sigma0
          th = wh[(j+1)%16];
          tl = wl[(j+1)%16];
          h = ((th >>> 1) | (tl << (32-1))) ^ ((th >>> 8) | (tl << (32-8))) ^ (th >>> 7);
          l = ((tl >>> 1) | (th << (32-1))) ^ ((tl >>> 8) | (th << (32-8))) ^ ((tl >>> 7) | (th << (32-7)));

          a += l & 0xffff; b += l >>> 16;
          c += h & 0xffff; d += h >>> 16;

          // sigma1
          th = wh[(j+14)%16];
          tl = wl[(j+14)%16];
          h = ((th >>> 19) | (tl << (32-19))) ^ ((tl >>> (61-32)) | (th << (32-(61-32)))) ^ (th >>> 6);
          l = ((tl >>> 19) | (th << (32-19))) ^ ((th >>> (61-32)) | (tl << (32-(61-32)))) ^ ((tl >>> 6) | (th << (32-6)));

          a += l & 0xffff; b += l >>> 16;
          c += h & 0xffff; d += h >>> 16;

          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;

          wh[j] = (c & 0xffff) | (d << 16);
          wl[j] = (a & 0xffff) | (b << 16);
        }
      }
    }

    // add
    h = ah0;
    l = al0;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[0];
    l = hl[0];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[0] = ah0 = (c & 0xffff) | (d << 16);
    hl[0] = al0 = (a & 0xffff) | (b << 16);

    h = ah1;
    l = al1;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[1];
    l = hl[1];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[1] = ah1 = (c & 0xffff) | (d << 16);
    hl[1] = al1 = (a & 0xffff) | (b << 16);

    h = ah2;
    l = al2;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[2];
    l = hl[2];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[2] = ah2 = (c & 0xffff) | (d << 16);
    hl[2] = al2 = (a & 0xffff) | (b << 16);

    h = ah3;
    l = al3;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[3];
    l = hl[3];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[3] = ah3 = (c & 0xffff) | (d << 16);
    hl[3] = al3 = (a & 0xffff) | (b << 16);

    h = ah4;
    l = al4;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[4];
    l = hl[4];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[4] = ah4 = (c & 0xffff) | (d << 16);
    hl[4] = al4 = (a & 0xffff) | (b << 16);

    h = ah5;
    l = al5;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[5];
    l = hl[5];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[5] = ah5 = (c & 0xffff) | (d << 16);
    hl[5] = al5 = (a & 0xffff) | (b << 16);

    h = ah6;
    l = al6;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[6];
    l = hl[6];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[6] = ah6 = (c & 0xffff) | (d << 16);
    hl[6] = al6 = (a & 0xffff) | (b << 16);

    h = ah7;
    l = al7;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[7];
    l = hl[7];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[7] = ah7 = (c & 0xffff) | (d << 16);
    hl[7] = al7 = (a & 0xffff) | (b << 16);

    pos += 128;
    n -= 128;
  }

  return n;
}

function crypto_hash(out, m, n) {
  var hh = new Int32Array(8),
      hl = new Int32Array(8),
      x = new Uint8Array(256),
      i, b = n;

  hh[0] = 0x6a09e667;
  hh[1] = 0xbb67ae85;
  hh[2] = 0x3c6ef372;
  hh[3] = 0xa54ff53a;
  hh[4] = 0x510e527f;
  hh[5] = 0x9b05688c;
  hh[6] = 0x1f83d9ab;
  hh[7] = 0x5be0cd19;

  hl[0] = 0xf3bcc908;
  hl[1] = 0x84caa73b;
  hl[2] = 0xfe94f82b;
  hl[3] = 0x5f1d36f1;
  hl[4] = 0xade682d1;
  hl[5] = 0x2b3e6c1f;
  hl[6] = 0xfb41bd6b;
  hl[7] = 0x137e2179;

  crypto_hashblocks_hl(hh, hl, m, n);
  n %= 128;

  for (i = 0; i < n; i++) x[i] = m[b-n+i];
  x[n] = 128;

  n = 256-128*(n<112?1:0);
  x[n-9] = 0;
  ts64(x, n-8,  (b / 0x20000000) | 0, b << 3);
  crypto_hashblocks_hl(hh, hl, x, n);

  for (i = 0; i < 8; i++) ts64(out, 8*i, hh[i], hl[i]);

  return 0;
}

function add(p, q) {
  var a = gf(), b = gf(), c = gf(),
      d = gf(), e = gf(), f = gf(),
      g = gf(), h = gf(), t = gf();

  Z(a, p[1], p[0]);
  Z(t, q[1], q[0]);
  M(a, a, t);
  A(b, p[0], p[1]);
  A(t, q[0], q[1]);
  M(b, b, t);
  M(c, p[3], q[3]);
  M(c, c, D2);
  M(d, p[2], q[2]);
  A(d, d, d);
  Z(e, b, a);
  Z(f, d, c);
  A(g, d, c);
  A(h, b, a);

  M(p[0], e, f);
  M(p[1], h, g);
  M(p[2], g, f);
  M(p[3], e, h);
}

function cswap(p, q, b) {
  var i;
  for (i = 0; i < 4; i++) {
    sel25519(p[i], q[i], b);
  }
}

function pack(r, p) {
  var tx = gf(), ty = gf(), zi = gf();
  inv25519(zi, p[2]);
  M(tx, p[0], zi);
  M(ty, p[1], zi);
  pack25519(r, ty);
  r[31] ^= par25519(tx) << 7;
}

function scalarmult(p, q, s) {
  var b, i;
  set25519(p[0], gf0);
  set25519(p[1], gf1);
  set25519(p[2], gf1);
  set25519(p[3], gf0);
  for (i = 255; i >= 0; --i) {
    b = (s[(i/8)|0] >> (i&7)) & 1;
    cswap(p, q, b);
    add(q, p);
    add(p, p);
    cswap(p, q, b);
  }
}

function scalarbase(p, s) {
  var q = [gf(), gf(), gf(), gf()];
  set25519(q[0], X);
  set25519(q[1], Y);
  set25519(q[2], gf1);
  M(q[3], X, Y);
  scalarmult(p, q, s);
}

function crypto_sign_keypair(pk, sk, seeded) {
  var d = new Uint8Array(64);
  var p = [gf(), gf(), gf(), gf()];
  var i;

  if (!seeded) randombytes(sk, 32);
  crypto_hash(d, sk, 32);
  d[0] &= 248;
  d[31] &= 127;
  d[31] |= 64;

  scalarbase(p, d);
  pack(pk, p);

  for (i = 0; i < 32; i++) sk[i+32] = pk[i];
  return 0;
}

var L = new Float64Array([0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x10]);

function modL(r, x) {
  var carry, i, j, k;
  for (i = 63; i >= 32; --i) {
    carry = 0;
    for (j = i - 32, k = i - 12; j < k; ++j) {
      x[j] += carry - 16 * x[i] * L[j - (i - 32)];
      carry = Math.floor((x[j] + 128) / 256);
      x[j] -= carry * 256;
    }
    x[j] += carry;
    x[i] = 0;
  }
  carry = 0;
  for (j = 0; j < 32; j++) {
    x[j] += carry - (x[31] >> 4) * L[j];
    carry = x[j] >> 8;
    x[j] &= 255;
  }
  for (j = 0; j < 32; j++) x[j] -= carry * L[j];
  for (i = 0; i < 32; i++) {
    x[i+1] += x[i] >> 8;
    r[i] = x[i] & 255;
  }
}

function reduce(r) {
  var x = new Float64Array(64), i;
  for (i = 0; i < 64; i++) x[i] = r[i];
  for (i = 0; i < 64; i++) r[i] = 0;
  modL(r, x);
}

// Note: difference from C - smlen returned, not passed as argument.
function crypto_sign(sm, m, n, sk) {
  var d = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
  var i, j, x = new Float64Array(64);
  var p = [gf(), gf(), gf(), gf()];

  crypto_hash(d, sk, 32);
  d[0] &= 248;
  d[31] &= 127;
  d[31] |= 64;

  var smlen = n + 64;
  for (i = 0; i < n; i++) sm[64 + i] = m[i];
  for (i = 0; i < 32; i++) sm[32 + i] = d[32 + i];

  crypto_hash(r, sm.subarray(32), n+32);
  reduce(r);
  scalarbase(p, r);
  pack(sm, p);

  for (i = 32; i < 64; i++) sm[i] = sk[i];
  crypto_hash(h, sm, n + 64);
  reduce(h);

  for (i = 0; i < 64; i++) x[i] = 0;
  for (i = 0; i < 32; i++) x[i] = r[i];
  for (i = 0; i < 32; i++) {
    for (j = 0; j < 32; j++) {
      x[i+j] += h[i] * d[j];
    }
  }

  modL(sm.subarray(32), x);
  return smlen;
}

function unpackneg(r, p) {
  var t = gf(), chk = gf(), num = gf(),
      den = gf(), den2 = gf(), den4 = gf(),
      den6 = gf();

  set25519(r[2], gf1);
  unpack25519(r[1], p);
  S(num, r[1]);
  M(den, num, D);
  Z(num, num, r[2]);
  A(den, r[2], den);

  S(den2, den);
  S(den4, den2);
  M(den6, den4, den2);
  M(t, den6, num);
  M(t, t, den);

  pow2523(t, t);
  M(t, t, num);
  M(t, t, den);
  M(t, t, den);
  M(r[0], t, den);

  S(chk, r[0]);
  M(chk, chk, den);
  if (neq25519(chk, num)) M(r[0], r[0], I);

  S(chk, r[0]);
  M(chk, chk, den);
  if (neq25519(chk, num)) return -1;

  if (par25519(r[0]) === (p[31]>>7)) Z(r[0], gf0, r[0]);

  M(r[3], r[0], r[1]);
  return 0;
}

function crypto_sign_open(m, sm, n, pk) {
  var i;
  var t = new Uint8Array(32), h = new Uint8Array(64);
  var p = [gf(), gf(), gf(), gf()],
      q = [gf(), gf(), gf(), gf()];

  if (n < 64) return -1;

  if (unpackneg(q, pk)) return -1;

  for (i = 0; i < n; i++) m[i] = sm[i];
  for (i = 0; i < 32; i++) m[i+32] = pk[i];
  crypto_hash(h, m, n);
  reduce(h);
  scalarmult(p, q, h);

  scalarbase(q, sm.subarray(32));
  add(p, q);
  pack(t, p);

  n -= 64;
  if (crypto_verify_32(sm, 0, t, 0)) {
    for (i = 0; i < n; i++) m[i] = 0;
    return -1;
  }

  for (i = 0; i < n; i++) m[i] = sm[i + 64];
  return n;
}

var crypto_secretbox_KEYBYTES = 32,
    crypto_secretbox_NONCEBYTES = 24,
    crypto_secretbox_ZEROBYTES = 32,
    crypto_secretbox_BOXZEROBYTES = 16,
    crypto_scalarmult_BYTES = 32,
    crypto_scalarmult_SCALARBYTES = 32,
    crypto_box_PUBLICKEYBYTES = 32,
    crypto_box_SECRETKEYBYTES = 32,
    crypto_box_BEFORENMBYTES = 32,
    crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES,
    crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES,
    crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES,
    crypto_sign_BYTES = 64,
    crypto_sign_PUBLICKEYBYTES = 32,
    crypto_sign_SECRETKEYBYTES = 64,
    crypto_sign_SEEDBYTES = 32,
    crypto_hash_BYTES = 64;

nacl.lowlevel = {
  crypto_core_hsalsa20: crypto_core_hsalsa20,
  crypto_stream_xor: crypto_stream_xor,
  crypto_stream: crypto_stream,
  crypto_stream_salsa20_xor: crypto_stream_salsa20_xor,
  crypto_stream_salsa20: crypto_stream_salsa20,
  crypto_onetimeauth: crypto_onetimeauth,
  crypto_onetimeauth_verify: crypto_onetimeauth_verify,
  crypto_verify_16: crypto_verify_16,
  crypto_verify_32: crypto_verify_32,
  crypto_secretbox: crypto_secretbox,
  crypto_secretbox_open: crypto_secretbox_open,
  crypto_scalarmult: crypto_scalarmult,
  crypto_scalarmult_base: crypto_scalarmult_base,
  crypto_box_beforenm: crypto_box_beforenm,
  crypto_box_afternm: crypto_box_afternm,
  crypto_box: crypto_box,
  crypto_box_open: crypto_box_open,
  crypto_box_keypair: crypto_box_keypair,
  crypto_hash: crypto_hash,
  crypto_sign: crypto_sign,
  crypto_sign_keypair: crypto_sign_keypair,
  crypto_sign_open: crypto_sign_open,

  crypto_secretbox_KEYBYTES: crypto_secretbox_KEYBYTES,
  crypto_secretbox_NONCEBYTES: crypto_secretbox_NONCEBYTES,
  crypto_secretbox_ZEROBYTES: crypto_secretbox_ZEROBYTES,
  crypto_secretbox_BOXZEROBYTES: crypto_secretbox_BOXZEROBYTES,
  crypto_scalarmult_BYTES: crypto_scalarmult_BYTES,
  crypto_scalarmult_SCALARBYTES: crypto_scalarmult_SCALARBYTES,
  crypto_box_PUBLICKEYBYTES: crypto_box_PUBLICKEYBYTES,
  crypto_box_SECRETKEYBYTES: crypto_box_SECRETKEYBYTES,
  crypto_box_BEFORENMBYTES: crypto_box_BEFORENMBYTES,
  crypto_box_NONCEBYTES: crypto_box_NONCEBYTES,
  crypto_box_ZEROBYTES: crypto_box_ZEROBYTES,
  crypto_box_BOXZEROBYTES: crypto_box_BOXZEROBYTES,
  crypto_sign_BYTES: crypto_sign_BYTES,
  crypto_sign_PUBLICKEYBYTES: crypto_sign_PUBLICKEYBYTES,
  crypto_sign_SECRETKEYBYTES: crypto_sign_SECRETKEYBYTES,
  crypto_sign_SEEDBYTES: crypto_sign_SEEDBYTES,
  crypto_hash_BYTES: crypto_hash_BYTES,

  gf: gf,
  D: D,
  L: L,
  pack25519: pack25519,
  unpack25519: unpack25519,
  M: M,
  A: A,
  S: S,
  Z: Z,
  pow2523: pow2523,
  add: add,
  set25519: set25519,
  modL: modL,
  scalarmult: scalarmult,
  scalarbase: scalarbase,
};

/* High-level API */

function checkLengths(k, n) {
  if (k.length !== crypto_secretbox_KEYBYTES) throw new Error('bad key size');
  if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error('bad nonce size');
}

function checkBoxLengths(pk, sk) {
  if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error('bad public key size');
  if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error('bad secret key size');
}

function checkArrayTypes() {
  for (var i = 0; i < arguments.length; i++) {
    if (!(arguments[i] instanceof Uint8Array))
      throw new TypeError('unexpected type, use Uint8Array');
  }
}

function cleanup(arr) {
  for (var i = 0; i < arr.length; i++) arr[i] = 0;
}

nacl.randomBytes = function(n) {
  var b = new Uint8Array(n);
  randombytes(b, n);
  return b;
};

nacl.secretbox = function(msg, nonce, key) {
  checkArrayTypes(msg, nonce, key);
  checkLengths(key, nonce);
  var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
  var c = new Uint8Array(m.length);
  for (var i = 0; i < msg.length; i++) m[i+crypto_secretbox_ZEROBYTES] = msg[i];
  crypto_secretbox(c, m, m.length, nonce, key);
  return c.subarray(crypto_secretbox_BOXZEROBYTES);
};

nacl.secretbox.open = function(box, nonce, key) {
  checkArrayTypes(box, nonce, key);
  checkLengths(key, nonce);
  var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
  var m = new Uint8Array(c.length);
  for (var i = 0; i < box.length; i++) c[i+crypto_secretbox_BOXZEROBYTES] = box[i];
  if (c.length < 32) return null;
  if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return null;
  return m.subarray(crypto_secretbox_ZEROBYTES);
};

nacl.secretbox.keyLength = crypto_secretbox_KEYBYTES;
nacl.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
nacl.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;

nacl.scalarMult = function(n, p) {
  checkArrayTypes(n, p);
  if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
  if (p.length !== crypto_scalarmult_BYTES) throw new Error('bad p size');
  var q = new Uint8Array(crypto_scalarmult_BYTES);
  crypto_scalarmult(q, n, p);
  return q;
};

nacl.scalarMult.base = function(n) {
  checkArrayTypes(n);
  if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
  var q = new Uint8Array(crypto_scalarmult_BYTES);
  crypto_scalarmult_base(q, n);
  return q;
};

nacl.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
nacl.scalarMult.groupElementLength = crypto_scalarmult_BYTES;

nacl.box = function(msg, nonce, publicKey, secretKey) {
  var k = nacl.box.before(publicKey, secretKey);
  return nacl.secretbox(msg, nonce, k);
};

nacl.box.before = function(publicKey, secretKey) {
  checkArrayTypes(publicKey, secretKey);
  checkBoxLengths(publicKey, secretKey);
  var k = new Uint8Array(crypto_box_BEFORENMBYTES);
  crypto_box_beforenm(k, publicKey, secretKey);
  return k;
};

nacl.box.after = nacl.secretbox;

nacl.box.open = function(msg, nonce, publicKey, secretKey) {
  var k = nacl.box.before(publicKey, secretKey);
  return nacl.secretbox.open(msg, nonce, k);
};

nacl.box.open.after = nacl.secretbox.open;

nacl.box.keyPair = function() {
  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
  crypto_box_keypair(pk, sk);
  return {publicKey: pk, secretKey: sk};
};

nacl.box.keyPair.fromSecretKey = function(secretKey) {
  checkArrayTypes(secretKey);
  if (secretKey.length !== crypto_box_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
  crypto_scalarmult_base(pk, secretKey);
  return {publicKey: pk, secretKey: new Uint8Array(secretKey)};
};

nacl.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
nacl.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
nacl.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
nacl.box.nonceLength = crypto_box_NONCEBYTES;
nacl.box.overheadLength = nacl.secretbox.overheadLength;

nacl.sign = function(msg, secretKey) {
  checkArrayTypes(msg, secretKey);
  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var signedMsg = new Uint8Array(crypto_sign_BYTES+msg.length);
  crypto_sign(signedMsg, msg, msg.length, secretKey);
  return signedMsg;
};

nacl.sign.open = function(signedMsg, publicKey) {
  checkArrayTypes(signedMsg, publicKey);
  if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
    throw new Error('bad public key size');
  var tmp = new Uint8Array(signedMsg.length);
  var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
  if (mlen < 0) return null;
  var m = new Uint8Array(mlen);
  for (var i = 0; i < m.length; i++) m[i] = tmp[i];
  return m;
};

nacl.sign.detached = function(msg, secretKey) {
  var signedMsg = nacl.sign(msg, secretKey);
  var sig = new Uint8Array(crypto_sign_BYTES);
  for (var i = 0; i < sig.length; i++) sig[i] = signedMsg[i];
  return sig;
};

nacl.sign.detached.verify = function(msg, sig, publicKey) {
  checkArrayTypes(msg, sig, publicKey);
  if (sig.length !== crypto_sign_BYTES)
    throw new Error('bad signature size');
  if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
    throw new Error('bad public key size');
  var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
  var m = new Uint8Array(crypto_sign_BYTES + msg.length);
  var i;
  for (i = 0; i < crypto_sign_BYTES; i++) sm[i] = sig[i];
  for (i = 0; i < msg.length; i++) sm[i+crypto_sign_BYTES] = msg[i];
  return (crypto_sign_open(m, sm, sm.length, publicKey) >= 0);
};

nacl.sign.keyPair = function() {
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
  crypto_sign_keypair(pk, sk);
  return {publicKey: pk, secretKey: sk};
};

nacl.sign.keyPair.fromSecretKey = function(secretKey) {
  checkArrayTypes(secretKey);
  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  for (var i = 0; i < pk.length; i++) pk[i] = secretKey[32+i];
  return {publicKey: pk, secretKey: new Uint8Array(secretKey)};
};

nacl.sign.keyPair.fromSeed = function(seed) {
  checkArrayTypes(seed);
  if (seed.length !== crypto_sign_SEEDBYTES)
    throw new Error('bad seed size');
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
  for (var i = 0; i < 32; i++) sk[i] = seed[i];
  crypto_sign_keypair(pk, sk, true);
  return {publicKey: pk, secretKey: sk};
};

nacl.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
nacl.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
nacl.sign.seedLength = crypto_sign_SEEDBYTES;
nacl.sign.signatureLength = crypto_sign_BYTES;

nacl.hash = function(msg) {
  checkArrayTypes(msg);
  var h = new Uint8Array(crypto_hash_BYTES);
  crypto_hash(h, msg, msg.length);
  return h;
};

nacl.hash.hashLength = crypto_hash_BYTES;

nacl.verify = function(x, y) {
  checkArrayTypes(x, y);
  // Zero length arguments are considered not equal.
  if (x.length === 0 || y.length === 0) return false;
  if (x.length !== y.length) return false;
  return (vn(x, 0, y, 0, x.length) === 0) ? true : false;
};

nacl.setPRNG = function(fn) {
  randombytes = fn;
};

(function() {
  // Initialize PRNG if environment provides CSPRNG.
  // If not, methods calling randombytes will throw.
  var crypto = typeof self !== 'undefined' ? (self.crypto || self.msCrypto) : null;
  if (crypto && crypto.getRandomValues) {
    // Browsers.
    var QUOTA = 65536;
    nacl.setPRNG(function(x, n) {
      var i, v = new Uint8Array(n);
      for (i = 0; i < n; i += QUOTA) {
        crypto.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
      }
      for (i = 0; i < n; i++) x[i] = v[i];
      cleanup(v);
    });
  } else if (typeof require !== 'undefined') {
    // Node.js.
    crypto = require('crypto');
    if (crypto && crypto.randomBytes) {
      nacl.setPRNG(function(x, n) {
        var i, v = crypto.randomBytes(n);
        for (i = 0; i < n; i++) x[i] = v[i];
        cleanup(v);
      });
    }
  }
})();

})(typeof module !== 'undefined' && module.exports ? module.exports : (self.nacl = self.nacl || {}));

},{"crypto":3}],6:[function(require,module,exports){
const { endian, parseNodeVersion, dec2hex8 } = require('./utils/independence')
const { getTransactionHash, publicKeyToHexAddress } = require('./utils/hash')
const Nem2 = require('./utils/nem2')
const MessageElm = require('./utils/messageElm')
const TxHistoryElm = require('./utils/txHistoryElm')
const BalanceTable = require('./utils/balanceTable')
const { getBase32DecodeAddress, getBase32EncodeAddress } = require('./utils/base32')

async function getAccountInfo(privateKey, endpoint, callback) {
    const n = new Nem2(privateKey)
    const pubkey = n.getPublicKey()
    const address = getBase32EncodeAddress(await publicKeyToHexAddress(pubkey))
    const { error, mosaics } = await fetch(`${endpoint}/accounts/${address}`)
        .then(res => {
            if (res.ok) return res.json()
            throw new Error(`${res.status} ${res.statusText}`)
        })
        .then(res => { return { mosaics: res.account.mosaics } })
        .catch((error) => {
            console.error(error)
            return { error }
        })
    callback(error, { mosaics, pubkey, address })
}
async function getEndpointInfo(endpoint, callback) {
    // eslint-disable-next-line no-unused-vars
    const nodePromise = fetch(`${endpoint}/node/info`)
        .then(res => res.json())
    const networkPromise = fetch(`${endpoint}/network/properties`)
        .then(res => res.json())
        .then(info => info.network)
    const chainPromise = fetch(`${endpoint}/chain/info`)
        .then(res => res.json())
    const { error, result } = await Promise
        .all([nodePromise, networkPromise, chainPromise])
        .then(([node, network, chain]) => {
            return { result: { node, network, chain } }
        })
        .catch((error) => {
            console.error(error)
            return { error }
        })
    callback(error, result)
}
async function sendTransferTransaction(signedTxPayload, signedTxHash, endpoint, callback) {
    const request = new Request(
        `${endpoint}/transactions`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ payload: signedTxPayload }),
            mode: 'cors'
        }
    )
    fetch(request)
        .then(res => res.json())
        .then((res) => {
            callback(
                null,
                JSON.stringify(res),
                signedTxHash
            )
        })
        .catch((e) => {
            console.error(e)
            callback(e)
        })
}

async function makeTransferTransaction(privateKey, endpoint, recipientPlainAddress, fee, mosaicId, amount, callback) {
    // eslint-disable-next-line no-unused-vars
    const { network, generationHash } = await fetch(`${endpoint}/node/info`)
        .then(res => res.json())
        .then((nodeInfo) => {
            return {
                network: nodeInfo.networkIdentifier,
                generationHash: nodeInfo.networkGenerationHashSeed
            }
        })
    const n = new Nem2(privateKey)
    const pubkey = n.getPublicKey()
    const serverTime = await fetch(`${endpoint}/node/time`)
        .then(res => res.json())
        .then((nodeTime) => {
            return Number(nodeTime.communicationTimestamps.sendTimestamp)
        })
    const deadline = n.createDeadline(serverTime + 2 * 3600 * 1000)
    const recipient = getBase32DecodeAddress(recipientPlainAddress)
    const txPayload =
        "B000000000000000" +
        "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" +
        pubkey +
        "0000000001985441" +
        endian(fee) +
        endian(deadline) +
        recipient +
        "0000010000000000" +
        endian(mosaicId) +
        endian(amount)
    const signature = n.sign(txPayload, generationHash)
    const signedTxPayload =
        txPayload.substr(0,8 * 2) +
        signature +
        txPayload.substr((8 + 64) * 2)

    const signedTxHash = await getTransactionHash(signedTxPayload, generationHash)
    console.log(signedTxPayload)

    callback(null, signedTxPayload, signedTxHash)
}

const acForm = document.getElementById('account-input')
const eiForm = document.getElementById('endpoint-info')
const aiForm = document.getElementById('account-info')
const txForm = document.getElementById('transaction')
txForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const messageElm = new MessageElm('tx-message')
    const isValid = txForm.checkValidity() && acForm.checkValidity()
    if (isValid) {
        messageElm.startLoading()
        const privateKey = acForm["privKey"].value.toUpperCase()
        const endpoint = acForm["endpoint"].value
        const recipient = txForm["recipient"].value.toUpperCase().replace(/-/g, '')
        const mosaicId = txForm["mosaicId"].value.toUpperCase()
        const amount = dec2hex8(txForm["amount"].value)
        const fee = dec2hex8(txForm["fee"].value)
        const isDryRun = txForm["txIsDryRn"].checked
        makeTransferTransaction(
            privateKey,
            endpoint,
            recipient,
            fee,
            mosaicId,
            amount,
            function(error, signedTxPayload, signedTxHash) {
                if (error) {
                    messageElm.setError(error)
                    return;
                }
                document.getElementById('tx-hash').innerText = signedTxHash
                document.getElementById('tx-payload').innerText = signedTxPayload
                if (isDryRun) {
                    messageElm.finishLoading()
                    document.getElementById("txOutput").innerText = ""
                    return
                }
                sendTransferTransaction(signedTxPayload, signedTxHash, endpoint,
                    function (error, status, hash) {
                        messageElm.finishLoading()
                        if (error) {
                            messageElm.setError(error)
                            return;
                        }
                        const elm = new TxHistoryElm('txHistory', endpoint)
                        elm.append(hash)
                        document.getElementById("txOutput").innerText = status;
                    }
                )
            }
        )
    } else {
        txForm.reportValidity()
        acForm.reportValidity()
    }
})
aiForm.addEventListener('submit', (e) =>{
    e.preventDefault()
    const messageElm = new MessageElm('ai-message')
    const isValid = aiForm.checkValidity() && acForm.checkValidity()
    if (isValid) {
        messageElm.startLoading()
        const privateKey = acForm["privKey"].value.toUpperCase()
        const endpoint = acForm["endpoint"].value
        getAccountInfo(privateKey, endpoint, function(error, result) {
            messageElm.finishLoading()
            const { mosaics, pubkey, address } = result
            document.getElementById('pubKey').value = pubkey
            document.getElementById('addr').value = address
            if (error) {
                messageElm.setError(error)
                return;
            }
            const elm = new BalanceTable('balanceOutput')
            mosaics.forEach(m => elm.append(m.id, m.amount))
            document.getElementById('balanceOutput').value = mosaics
        })
    } else {
        aiForm.reportValidity()
        acForm.reportValidity()
    }
})
eiForm.addEventListener('submit', (e) =>{
    e.preventDefault()
    const messageElm = new MessageElm('ei-message')
    const isValid = eiForm.checkValidity() && acForm.checkValidity()
    if (isValid) {
        messageElm.startLoading()
        const endpoint = acForm["endpoint"].value
        getEndpointInfo(endpoint, function(error, result) {
            messageElm.finishLoading()
            if (error) {
                messageElm.setError(error)
                return;
            }
            const { node, network, chain } = result
            document.getElementById('ei-node-version').innerText = parseNodeVersion(node.version)
            document.getElementById('ei-node-generation-hash').innerText = node.networkGenerationHashSeed
            document.getElementById('ei-chain-height').innerText = chain.height
            document.getElementById('ei-network-identifier').innerText = network.identifier
        })
    } else {
        eiForm.reportValidity()
        acForm.reportValidity()
    }
})

},{"./utils/balanceTable":7,"./utils/base32":8,"./utils/hash":9,"./utils/independence":10,"./utils/messageElm":11,"./utils/nem2":12,"./utils/txHistoryElm":13}],7:[function(require,module,exports){
class BalanceTable {
    constructor(id) {
        this.tableElm = document.getElementById(id)
        const oldTbodys = this.tableElm.getElementsByTagName('tbody')
        for (let i = 0; i < oldTbodys.length; i++) {
            oldTbodys[i].remove()
        }
        const tbody = document.createElement('tbody')
        this.tableElm.appendChild(tbody)
        this.tbodyElm = tbody
    }

    append(mosaicId, amount) {
        const mosaicTd = document.createElement('td')
        mosaicTd.innerText = mosaicId
        const amountTd = document.createElement('td')
        amountTd.innerText = amount
        const tr = document.createElement('tr')
        tr.appendChild(mosaicTd)
        tr.appendChild(amountTd)
        this.tbodyElm.appendChild(tr)
    }
}

module.exports = BalanceTable;

},{}],8:[function(require,module,exports){
const base32Decode = require('base32-decode');
const base32Encode = require('base32-encode');
const { uint8ArrayToHex, hexToUint8Array } = require('./independence');

function getBase32DecodeAddress(plainOrPrettyAddress) {
    const plainAddress = plainOrPrettyAddress.replace(/-/g, '')
    return uint8ArrayToHex(base32Decode(plainAddress, 'RFC4648'))
}

function getBase32EncodeAddress(hexAddress) {
    const a = hexAddress + "00"
    const b = base32Encode(hexToUint8Array(a), 'RFC4648')
    return b.substr(0, 39)
}

module.exports = {
    getBase32DecodeAddress,
    getBase32EncodeAddress
}

},{"./independence":10,"base32-decode":1,"base32-encode":2}],9:[function(require,module,exports){
const { hexToUint8Array } = require('./independence')
const hash = require('hash-wasm')

/**
 *
 * @param {string} signedTxPayload
 * @param {string} generationHash
 * @return {string}
 */
async function getTransactionHash(signedTxPayload, generationHash) {
    const hashInputPayload =
        signedTxPayload.substr(8 * 2,64 * 2) +
        signedTxPayload.substr((8 + 64) * 2,32 * 2) +
        generationHash +
        signedTxPayload.substr((8 + 64 + 32 + 4) * 2);
    const hashed = await hash.sha3(hexToUint8Array(hashInputPayload), 256);
    return hashed.toUpperCase();
}

/**
 *
 * @param {string} publicKey
 * @param prefix
 * @return {Promise<string>}
 */
async function publicKeyToHexAddress(publicKey, prefix = "98") {
    const a = await hash.sha3(hexToUint8Array(publicKey), 256)
        .then((sha3ed) => {
            return hash.ripemd160(hexToUint8Array(sha3ed))
        });
    const b = prefix + a;
    const check = await hash.sha3(hexToUint8Array(b), 256);
    const c = b + check.substr(0, 6);
    return c.toUpperCase();
}

module.exports = {
    getTransactionHash,
    publicKeyToHexAddress
}

},{"./independence":10,"hash-wasm":4}],10:[function(require,module,exports){
function endian(hex) {
    const result = [];
    let len = hex.length - 2;
    while (len >= 0) {
        result.push(hex.substr(len, 2));
        len -= 2;
    }
    return result.join('');
}

function uint8ArrayToHex (arrayBuffer) {
    return [...new Uint8Array(arrayBuffer)]
        .map (b => b.toString(16).padStart(2, "0"))
        .join ("")
        .toUpperCase();
}

function hexToUint8Array(hex) {
    return new Uint8Array(hex.toLowerCase().match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
    }))
}

function parseNodeVersion(num) {
    const hex = `00000000${Number(num).toString(16)}`.substr(-8)
    const strArray = []
    for (let i = 0; i < 8; i += 2) {
        const octet = Number(`0x${hex[i]}${hex[i + 1]}`).toString(10)
        strArray.push(octet)
    }

    return strArray.join('.')
}

function dec2hex8(num) {
    return `0000000000000000${Number(num).toString(16)}`.substr(-16).toUpperCase()
}

module.exports = {
    endian,
    uint8ArrayToHex,
    hexToUint8Array,
    parseNodeVersion,
    dec2hex8
}

},{}],11:[function(require,module,exports){
class MessageElm {
    constructor(id) {
        this.elm = document.getElementById(id)
        this.elm.innerText = ''
    }

    startLoading() {
        this.elm.innerText = 'wait...'
    }

    finishLoading() {
        this.elm.innerText = ''
    }

    setString(str) {
        this.elm.innerText = str
    }

    setError(err) {
        this.elm.innerText = err.toString()
    }
}

module.exports = MessageElm;

},{}],12:[function(require,module,exports){
const { uint8ArrayToHex, hexToUint8Array } = require('./independence');
const tweetnacl = require('tweetnacl');

class Nem2 {
    constructor(hexPrivateKey) {
        const privateKey = hexToUint8Array(hexPrivateKey);
        const { publicKey } = tweetnacl.sign.keyPair.fromSeed(privateKey);
        this.keyPair = { privateKey, publicKey };
    }

    getPublicKey() {
        return uint8ArrayToHex(this.keyPair.publicKey).toUpperCase();
    }

    createDeadline(catapultTime) {
        return Number(catapultTime).toString(16).padStart(16, "0").toUpperCase()
    }

    sign(txPayload, generationHash) {
        const txPayloadSigningBytes =
            hexToUint8Array(generationHash + txPayload.substr((4 + 64 + 32 + 8) * 2));
        const secretKey = new Uint8Array(64);
        secretKey.set(this.keyPair.privateKey);
        secretKey.set(this.keyPair.publicKey, 32);
        const signature = tweetnacl.sign.detached(txPayloadSigningBytes, secretKey);
        return uint8ArrayToHex(signature);
    }
}

module.exports = Nem2;

},{"./independence":10,"tweetnacl":5}],13:[function(require,module,exports){
class TxHistoryElm {
    constructor(elementId, endpoint) {
        this.elm = document.getElementById(elementId)
        this.endpoint = endpoint
    }

    append(hash) {
        const a = document.createElement("a")
        a.setAttribute("href", this.endpoint + "/transactionStatus/" + hash)
        a.setAttribute("target", "_blank")
        a.setAttribute('style', 'word-break: break-all;')
        a.appendChild(document.createTextNode(hash))
        const li = document.createElement("li")
        li.appendChild(a);
        this.elm.appendChild(li)
    }
}

module.exports = TxHistoryElm;

},{}]},{},[6]);
