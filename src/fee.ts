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
import { QuantConstants } from "./constants"

export class Fee {
  public static DEFAULT = (QuantConstants.ONE_OTC / 100).toString()
  public static ASSET_ISSUANCE_FEE = (QuantConstants.ONE_OTC * 0).toString()
  public static ASSET_ISSUE_MORE_FEE = Fee.DEFAULT
  public static ASSET_TRANSFER_FEE = Fee.DEFAULT
  public static ATOMIC_MULTI_TRANSFER_FEE = Fee.DEFAULT
  public static ORDER_PLACEMENT_FEE = Fee.DEFAULT
  public static ORDER_CANCELLATION_FEE = Fee.DEFAULT
  public static WHITELIST_ACCOUNT_FEE = Fee.DEFAULT
  public static WHITELIST_MARKET_FEE = (QuantConstants.ONE_OTC * 0).toString()
  public static EFFECTIVE_BALANCE_LEASING_FEE = Fee.DEFAULT

  public static MESSAGE_APPENDIX_FEE = "0"
  public static ENCRYPTED_MESSAGE_APPENDIX_FEE = "0"
  public static PUBLICKEY_ANNOUNCEMENT_APPENDIX_FEE = "0"
  public static PRIVATE_NAME_ANNOUNCEMENT_APPENDIX_FEE = "0"
  public static PRIVATE_NAME_ASSIGNEMENT_APPENDIX_FEE = "0"
  public static PUBLIC_NAME_ANNOUNCEMENT_APPENDIX_FEE = "0"
  public static PUBLIC_NAME_ASSIGNEMENT_APPENDIX_FEE = "0"
}
