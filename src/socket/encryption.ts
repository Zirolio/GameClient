import CryptoJS from 'crypto-js';

/* static encrypt(data: string, key: string) {
    return CryptoJS.AES.encrypt(data, CryptoJS.enc.Base64.parse(key), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    }).toString();
}

static decrypt(data: string, key: string) {
    return CryptoJS.AES.decrypt(data, CryptoJS.enc.Base64.parse(key), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
} */
export default class Encryption {
    static encrypt(data: string) {
        const key = 1000 + Math.floor(Math.random() * 10000);
        let result = "";

        for (const w of [...data].map(w => w.charCodeAt(0))) result += String.fromCharCode(w + key);

        return result + String.fromCharCode(key + 1234);
    }
    
    static decrypt(data: string) {
        const key = data.charCodeAt(data.length - 1) - 1234;
        let result = "";

        for (const w of [...data.slice(0, -1)].map(w => w.charCodeAt(0))) result += String.fromCharCode(w - key);

        return result;
    }
}

(window as any).Enc = Encryption;