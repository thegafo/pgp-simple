'use strict';

const openpgp = require('openpgp');

class PGP {

    constructor({ privateKey, publicKey, passphrase }) {
        this.privateKey = privateKey;
        this.publicKey = publicKey;
        this.passphrase = passphrase;
    }

    /**
     * 
     * @param {*} passphrase 
     * @param {*} numBits 
     */
    static async generateKey(passphrase, numBits = 2048) {
        let { privateKeyArmored, publicKeyArmored } = await openpgp.generateKey({
            userIds: [{ name: '', email: '' }],
            passphrase: passphrase || undefined,
            numBits
        });
        return { privateKey: privateKeyArmored, publicKey: publicKeyArmored, passphrase };
    }

    /**
     * 
     * @param {*} publicKey 
     * @param {*} text 
     */
    async encrypt(publicKey, text) {
        let key = (await openpgp.key.readArmored(this.privateKey)).keys[0];
        if (this.passphrase) await key.decrypt(this.passphrase);
        let encrypted = await openpgp.encrypt({
            message: openpgp.message.fromText(text),
            publicKeys: (await openpgp.key.readArmored(publicKey)).keys,
            privateKeys: [key]
        });
        return encrypted.data;
    }

    /**
     * 
     * @param {*} publicKey 
     * @param {*} message 
     */
    async decrypt(publicKey, message) {
        let key = (await openpgp.key.readArmored(this.privateKey)).keys[0];
        if (this.passphrase) await key.decrypt(this.passphrase);
        const decrypted = await openpgp.decrypt({
            message: await openpgp.message.readArmored(message),
            publicKeys: (await openpgp.key.readArmored(publicKey)).keys,
            privateKeys: [key]
        });
        if (!decrypted.signatures || decrypted.signatures.length == 0) {
            throw new Error('Signature not found');
        }
        for (var signature of decrypted.signatures) {
            if (!signature.valid) throw new Error('Invalid signature');
        }
        return decrypted.data;
    }

}

module.exports = PGP;
