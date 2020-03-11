/*
 * The MIT License (MIT)
 * Copyright (c) 2020 Quantower LLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * */

/*
To run tests in the file  test/testnet.ts  must be actual values for Testnet.
The tests passes until the account balance has the money.
 */
import "./jasmine"
import { testnet } from "./testnet"
import { Configuration, QuantSDK } from "../src/quantower-sdk"
import { IBroadcastOutput } from "../src/transaction"
import * as crypto from "../src/crypto"

function handleResult(promise: Promise<any>, done: Function) {
  promise
    .then((data: IBroadcastOutput) => {
      //console.log(data)
      expect(data.fullHash).toBeDefined()
      done()
    })
    .catch(reason => {
      expect(reason).toBeUndefined()
      console.log(reason)
      done()
    })
}

/* the tests passes until the account balance has the money */

describe("Transaction API", () => {
  const quantsdk = new QuantSDK(new Configuration({ isTestnet: true }))

  it("broadcast payment", done => {
    /* the test passes until the account balance has the money */
    let promise = quantsdk
      .payment("4644748344150906433", "0.002")
      .publicMessage("quantower-sdk test")
      .sign(testnet.ACCOUNT_1.SECRET_PHRASE)
      .then(transaction => transaction.broadcast())
    handleResult(promise, done)
  })

  it("broadcast arbitrary message", done => {
    let promise = quantsdk
      .arbitraryMessage("4644748344150906433", "Qwerty Йцукен")
      .sign(testnet.ACCOUNT_1.SECRET_PHRASE)
      .then(transaction => transaction.broadcast())
    handleResult(promise, done)
  })

  it("broadcast private message", done => {
    let promise = quantsdk
      .privateMessage(crypto.secretPhraseToPublicKey("user1"), "Private Info")
      .sign(testnet.ACCOUNT_1.SECRET_PHRASE)
      .then(transaction => transaction.broadcast())
    handleResult(promise, done)
  })

  it("broadcast private message to self", done => {
    let promise = quantsdk
      .privateMessageToSelf("Private message to self")
      .sign(testnet.ACCOUNT_1.SECRET_PHRASE)
      .then(transaction => transaction.broadcast())
    handleResult(promise, done)
  })

  it("Asset Issuance", done => {
    let promise = quantsdk
      .assetIssuance("https://quantsdktest/assetN01", null, "1000", 0, true)
      .publicMessage("quantower-sdk test")
      .sign(testnet.ACCOUNT_2.SECRET_PHRASE)
      .then(transaction => transaction.broadcast())
    handleResult(promise, done)
  })

  // it("Asset Issuance with properties", done => {
  //   let promise = quantsdk
  //     .assetIssuance("https://quantsdktest/assetN02", null, "1000000", 3, false)
  //     /* todo createAssetProperties()
  //     // create a asset properties bundle, pass asset=0 to have the bundle replicator
  //     // take the asset id from the current transaction (since the asset does not exist yet)
  //     .createAssetProperties({
  //       asset: "0",
  //       protocol: 1,
  //       value: {symbol: "GLD", name: "Gold"}
  //     })
  //     */
  //     .sign(testnet.ACCOUNT_1.SECRET_PHRASE)
  //     .then(transaction => transaction.broadcast())
  //   handleResult(promise, done)
  // })

  it("Asset Transfer", done => {
    let promise = quantsdk
      .assetTransfer(testnet.ASSET_2.ISSUER.ID, testnet.ASSET_1.ID, "4")
      .publicMessage("quantower-sdk test")
      .sign(testnet.ASSET_1.ISSUER.SECRET_PHRASE)
      .then(transaction => transaction.broadcast())
    handleResult(promise, done)
    //transfer back
    promise = quantsdk
      .assetTransfer(testnet.ASSET_1.ISSUER.ID, testnet.ASSET_1.ID, "4")
      .publicMessage("quantower-sdk test")
      .sign(testnet.ASSET_2.ISSUER.SECRET_PHRASE)
      .then(transaction => transaction.broadcast())
    handleResult(promise, done)
  })

  // it("Atomic Multi Asset Transfer", done => {
  //   let promise = quantsdk
  //     .atomicMultiTransfer(testnet.ASSET_2.ISSUER.ID, testnet.ASSET_1.ID, "4")
  //     .publicMessage("quantower-sdk test")
  //     .sign(testnet.ASSET_1.ISSUER.SECRET_PHRASE)
  //     .then(transaction => transaction.broadcast())
  //   handleResult(promise, done)
  //   //transfer back
  //   promise = quantsdk
  //     .assetTransfer(testnet.ASSET_1.ISSUER.ID, testnet.ASSET_1.ID, "4")
  //     .publicMessage("quantower-sdk test")
  //     .sign(testnet.ASSET_2.ISSUER.SECRET_PHRASE)
  //     .then(transaction => transaction.broadcast())
  //   handleResult(promise, done)
  // })

  it("place Ask Order", done => {
    let promise = quantsdk
      .placeAskOrder(testnet.ASSET_1.ID, testnet.ASSET_2.ID, "400000", "2000000", 3600)
      .publicMessage("quantower-sdk test")
      .sign(testnet.ACCOUNT_2.SECRET_PHRASE)
      .then(transaction => transaction.broadcast())
    promise = quantsdk
      .placeAskOrder(testnet.ASSET_1.ID, testnet.ASSET_2.ID, "400000", "2000000", 3600)
      .publicMessage("quantower-sdk test")
      .sign(testnet.ACCOUNT_2.SECRET_PHRASE)
      .then(transaction => transaction.broadcast())
    handleResult(promise, done)
  })

  it("place Bid Order", done => {
    let promise = quantsdk
      .placeBidOrder(testnet.ASSET_1.ID, testnet.ASSET_2.ID, "400000", "2000000", 3600)
      .publicMessage("quantower-sdk test")
      .sign(testnet.ACCOUNT_1.SECRET_PHRASE)
      .then(transaction => transaction.broadcast())
    handleResult(promise, done)
  })

  it("cancel Ask Order", done => {
    quantsdk.api.get("/order/asks/0/100").then((data: any) => {
      if (data.length > 0) {
        for (let i in data) {
          let orderData = data[i]
          //search order's account. Need an order for which the account is known,
          // because the order can be cancelled by account that created it
          let account = testnet.OBJECTS_BY_ID[orderData.account]
          if (account) {
            let promise = quantsdk
              .cancelAskOrder(orderData.order)
              .publicMessage("quantower-sdk test")
              .sign(account.SECRET_PHRASE)
              .then(transaction => transaction.broadcast())
            handleResult(promise, done)
            break
          }
        }
      }
      done()
    })
  })

  it("cancel Bid Order", done => {
    quantsdk.api.get("/order/bids/0/100").then((data: any) => {
      if (data.length > 0) {
        for (let i in data) {
          let orderData = data[i]
          //search order's account. Need an order for which the account is known,
          // because the order can be cancelled by account that created it
          let account = testnet.OBJECTS_BY_ID[orderData.account]
          if (account) {
            let promise = quantsdk
              .cancelBidOrder(orderData.order)
              .publicMessage("quantower-sdk test")
              .sign(account.SECRET_PHRASE)
              .then(transaction => transaction.broadcast())
            handleResult(promise, done)
            break
          }
        }
      }
      done()
    })
  })
})
