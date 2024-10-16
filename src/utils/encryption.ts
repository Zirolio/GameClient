// import CryptoJS from 'crypto-js';

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

		for(let i = 0; i < data.length; i++) result += String.fromCharCode(data.charCodeAt(i) + key);

        return result + String.fromCharCode(key + 1234);
    }
    
    static decrypt(data: string) {
        const key = data.charCodeAt(data.length - 1) - 1234;
        let result = "";

		for(let i = 0; i < data.length-1; i++) result += String.fromCharCode(data.charCodeAt(i) - key);

        return result;
    }
}

(window as any).Enc = Encryption;
