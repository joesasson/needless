import { shopifyData } from "./testHelpers";
import { SheetData } from "../Needless";

describe("goldDigger", () => {
  it("gets the column header names and indices", () => {
    let wrapped = new SheetData(shopifyData)
    wrapped.headers
  })
})