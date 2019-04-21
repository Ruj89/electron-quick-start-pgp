// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
delete global.TransformStream
const openpgp = require('openpgp') // use as CommonJS, AMD, ES6 module or via window.openpgp
openpgp.initWorker({ path:'openpgp.worker.js' }) // set the relative web worker path
// put keys in backtick (``) to avoid errors caused by spaces or tabs
const pubkey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: BCPG C# v1.6.1.0

mQENBFy7JRQBCACUunBskVvgUy2dzITf7oWkSIhwBcQBv6fESb2E/64Pi2T4deJv
msw3oALCynWEG+Em2fabFCk3UjRVvxPHSCgpMCIZ2S74E6xYHbk1aOcesytyrv4n
phciJh73Jqeph1vPjCsIOqWA2TSOiAose4w00DKpII0iOUfnFef9lWkAkCmaE2Ky
+ndvYT6xIAZXEhYX3H9D40csrX9WXCYrA+Eg0P5TUza2+lNjHLcM0e2sjosrTY8t
hq35Hr76Z1EWh56XUfMH82x+Tado4uAuN/9M2g6uPoIxn86+Pq3RKIn5zd2rQ2Ah
weD1rWo9oUMeXf7mXXUTKSqNb+sWdskPDxqbABEBAAG0AIkBHAQQAQIABgUCXLsl
FAAKCRDcoTbQC2DHX4tJB/9AgI5fjAemjxl+QS8r8tDtRPuJDiOGCbGLrK5AQ/aN
hrnYNABQqlHVd/6MGYKoCeFtiVeJ6740utdyqEPGEPN4Svg6+4esl3CmqFVWencY
leqz6ByTuRwWYqRoWF7r1Y9uKy1NYmC5yllX0XQfQY2k4V1DQ6lbDABxllY2SbaQ
SWKgxq/SDMvBHjiCydLSb1xzZ+m/Wcyf7BIreVSpVQaNRgiQmZ3vW/2COLZ6Y67R
fiGlBymXb+v5jE00ee8mFz1VcDcIu/Nm6X2n+ZH0WVUXE1oOGUOul3ETDW7AWi4e
s4+aI2bXL8D+tLXl59KrSk9ACfi8FSKx+CkNyy1L9kU/
=afxf
-----END PGP PUBLIC KEY BLOCK-----`
const privkey = `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: BCPG C# v1.6.1.0

lQOsBFy7JRQBCACUunBskVvgUy2dzITf7oWkSIhwBcQBv6fESb2E/64Pi2T4deJv
msw3oALCynWEG+Em2fabFCk3UjRVvxPHSCgpMCIZ2S74E6xYHbk1aOcesytyrv4n
phciJh73Jqeph1vPjCsIOqWA2TSOiAose4w00DKpII0iOUfnFef9lWkAkCmaE2Ky
+ndvYT6xIAZXEhYX3H9D40csrX9WXCYrA+Eg0P5TUza2+lNjHLcM0e2sjosrTY8t
hq35Hr76Z1EWh56XUfMH82x+Tado4uAuN/9M2g6uPoIxn86+Pq3RKIn5zd2rQ2Ah
weD1rWo9oUMeXf7mXXUTKSqNb+sWdskPDxqbABEBAAH/AwMCprp49iX4TT1gC0MG
AGxM+uDP5mNgTkPBi5whyFrk37NwNBZoM+ILZHV1QGDyek0kygJm3o3LPyNf2TOo
gPUm636jDAwE5VVsvSu7Pv15zQF3Zw2M0EeMeLg+0xFRJN5DEySD0PqwH4ovFrr8
EvF+9S6fz+GZJ/+qKj+VF2OyvT1mc2LlU3aLejBZqSHMEeZ+gptrVWTZI4aqBlRt
ByivjDaXnMjsHbozP9eUrr8y3nDo5xa043oJYXFFZ+gRPH9lCqaeESgF1tdFfSbs
VyweA3DTfXQpCKJcQxeND9p5oKRYf3lpznP4RAfYLKGSJoP4h3WJCx+0SW7c8Fqp
R2xh4+WknoR95miE1TTL/qiJbP4ulqVC9bRx+9999CDEl244b9rHWZCvKEb5SbOa
p676GVYb9RVs5FE3QcHt/sXdtL0SDC5x8D8XmtPyrukfQ/Fg/g5SaksXVsF5TjfR
rxnKIbbBONQ4T5aqr0flrGXllDAkqdlqhoemFSmfk0XOpT3z2QL34/Z1aW7uo4Pu
EgG3HULyCDZkxzaZYlkl+fe223hkm+SgP6Q+BjvcClP/qM+B86K1+F6y5mK1pJFb
m0ITF1cXTjfvQJ07/eV9Dida/ma8fGuPcP2X5BwjJ7pV0uVF9JY8P4m2+k/OB+Ng
VEuC8PN1RIZwXgmYAXiTqTz2oHW9cIF/ovb005YroDXDsotDBXSG6JX+fdYSoVhm
/EKUCKLZ5riRQOszjBvn0JCYCTyDLadFG5/z4emGp4zl6+115xFH9S0kDonxjDL7
W8oV1rBEjA/BAYkVQ7tndtoziwd1Qig6IFXfMvwjottaYrIztaHROBt7G8JQKErX
ZkCRsOkxCDdcHnfTVt08LDb4p9icVa2eAAcvppRnV7QAiQEcBBABAgAGBQJcuyUU
AAoJENyhNtALYMdfi0kH/0CAjl+MB6aPGX5BLyvy0O1E+4kOI4YJsYusrkBD9o2G
udg0AFCqUdV3/owZgqgJ4W2JV4nrvjS613KoQ8YQ83hK+Dr7h6yXcKaoVVZ6dxiV
6rPoHJO5HBZipGhYXuvVj24rLU1iYLnKWVfRdB9BjaThXUNDqVsMAHGWVjZJtpBJ
YqDGr9IMy8EeOILJ0tJvXHNn6b9ZzJ/sEit5VKlVBo1GCJCZne9b/YI4tnpjrtF+
IaUHKZdv6/mMTTR57yYXPVVwNwi782bpfaf5kfRZVRcTWg4ZQ66XcRMNbsBaLh6z
j5ojZtcvwP60teXn0qtKT0AJ+LwVIrH4KQ3LLUv2RT8=
=ib2s
-----END PGP PRIVATE KEY BLOCK-----` //encrypted private key

const passphrase=``

const encryptDecryptFunction = () => {
  openpgp.key.readArmored(privkey).then((privKeyResults) => {
    const privKeyObj = privKeyResults.keys[0]

    privKeyObj.decrypt(passphrase)

    openpgp.key.readArmored(pubkey).then((pubKeyResults) => {
      const options = {
          message: openpgp.message.fromText('Hello, World!'),       // input as Message object
          publicKeys: pubKeyResults.keys, // for encryption
          privateKeys: [privKeyObj]                                 // for signing (optional)
      }

      openpgp.encrypt(options).then(ciphertext => {
          encrypted = ciphertext.data // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
          return encrypted
      })
      .then(async encrypted => {
          const options = {
              message: await openpgp.message.readArmored(encrypted),    // parse armored message
              publicKeys: (await openpgp.key.readArmored(pubkey)).keys, // for verification (optional)
              privateKeys: [privKeyObj]                                 // for decryption
          }

          openpgp.decrypt(options).then(plaintext => {
              console.log(plaintext.data)
              return plaintext.data // 'Hello, World!'
          })

      })
    })
  });
 /*
  var options = {
    userIds: [{ name:'Jon Smith', email:'jon@example.com' }], // multiple user IDs
    curve: "ed25519",                                         // ECC curve name
    passphrase: 'super long and hard to guess secret'         // protects the private key
  };
  openpgp.generateKey(options).then(function(key) {
    var privkey = key.privateKeyArmored; // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
    var pubkey = key.publicKeyArmored;   // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
    var revocationCertificate = key.revocationCertificate; // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
  });*/
}
encryptDecryptFunction();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
