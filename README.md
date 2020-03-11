# Quantower Nodejs / Browser libraries

Quantower support libraries for Node.js and the browser

### Links

[**GITHUB**](https://github.com/ychaim/quantower-sdk) ychaim/quantower-sdk

### Functionality

With Quantower-SDK you get full client-side/offline functionality of everything involving OTC cryptocurrency. 
This includes but is not limited to:

- Full Quantower API wrapper
- Support for real-time updates through Quantower websocket API
- Complete client side support for both constructing and parsing binary transaction data
- Full client side encryption/decryption support for transaction attachments
- Support for all other low-level Quantower functionality. But all client side, no server needed! (publickeys, accountids, transaction signatures etc.)

### Samples

All samples open in https://runkit.com/ which gives you a live Nodejs environment, feel free to play around change the code samples, click RUN and see the output.

[![NODEJS | API ACCESS](https://img.shields.io/badge/NODEJS-API%20ACCESS-orange.svg)](https://runkit.com/epagani/quantower-sdk-api-access)

[![NODEJS | GENERATE ACCOUNT](https://img.shields.io/badge/NODEJS-GENERATE%20ACCOUNT-orange.svg)](https://runkit.com/epagani/quantower-sdk-generate-account)

[![BROWSER | GENERATE ACCOUNT](https://img.shields.io/badge/BROWSER-GENERATE%20ACCOUNT-orange.svg)](https://embed.plnkr.co/ySpyekW/)

[![NODEJS | DEX USD to OTC  ](https://img.shields.io/badge/NODEJS-DEX%20USD%20to%20quantower-orange.svg)](https://runkit.com/epagani/quantower-sdk-live-dex-usd-to-OTC)

[![BROWSER | DEX USD to OTC  ](https://img.shields.io/badge/BROWSER-DEX%20USD%20to%20quantower-orange.svg)](https://embed.plnkr.co/rsVVrcU/)

[![BROWSER | BLOCK WHEN?  ](https://img.shields.io/badge/BROWSER-BLOCK%20WHEN-orange.svg)](https://embed.plnkr.co/gVZVrlH/)

[![BROWSER | WEBSOCKETS  ](https://img.shields.io/badge/BROWSER-WEBSOCKETS-orange.svg)](https://embed.plnkr.co/h57qe7NRprjB409Vrhb6f/)

### Usage

#### Node

Install quantower-sdk

```bash
npm install quantower-sdk --save
```

When using TypeScript install @typings with

```bash
npm install @types/quantower-sdk --save
```

Require quantower-sdk and use it in your project

```javascript
var {QuantSDK} = require('quantower-sdk')
var sdk = new QuantSDK()
sdk.payment("sender@quantower.online","99.95")
   .publicMessage("Happy birthday!")
   .sign("my secret phrase")
   .broadcast()
```

#### Browser

quantower-sdk comes as an UMD module which means you could either `require` or `import {quantsdk} from 'quantower-sdk'` or simply load as `<script src="">` and access it through `window.quantsdk`

```html
<html>
  <head>
    <script src="quantower-sdk.js"></script>
    <script>
      var sdk = new quantsdk.QuantSDK()
      sdk.payment("sender@quantower.online","99.95")
         .publicMessage("Happy birthday!")
         .sign("my secret phrase")
         .broadcast()
    </script>
  </head>
</html>
```
