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
import "./jasmine"
import { QuantApiError } from "../src/quantower-api"
import { QuantSDK, Configuration } from "../src/quantower-sdk"

describe("quantower-api", () => {
  const quantsdk = new QuantSDK()
  it("can GET stuff", () => {
    return quantsdk.api.get("/blockchain/status").then((data: any) => {
      expect(data.application).toBe("QUANTOWER")
    })
  })
  it("can POST stuff", () => {
    let params = {
      period: "1440",
      fee: "1000000",
      deadline: "1440",
      secretPhrase: "test works as long as no one uses this secretphrase"
    }
    return quantsdk.api.post("/tx/lease", params).catch((data: QuantApiError) => {
      expect(data.errorDescription).toBe("Unknown account")
      expect(data.errorCode).toBe(3)
    })
  })
})
