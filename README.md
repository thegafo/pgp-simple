
# pgp-simple

> Simplified wrapper around OpenPGP.js for secure encrypting and decrypting.


### Installation

```bash
npm install pgp-simple
```

### Usage

```javascript
const PGP = require('./pgp-simple');

(async () => {
    
    let key1 = await PGP.generateKey("pa$$phrase1");
    let key2 = await PGP.generateKey("pa$$phrase2");
    
    let pgp1 = new PGP(key1);
    let pgp2 = new PGP(key2);

    let message = 'Hello world; this is a very simple way of using PGP';
    let encrypted = await pgp1.encrypt(key2.publicKey, message);
    let decrypted = await pgp2.decrypt(key1.publicKey, encrypted);

    console.log(encrypted);
    console.log(decrypted);

})();
```