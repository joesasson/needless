import { shopifyData } from "./testHelpers";
import { SheetData } from "../Amodels";

describe("goldDigger", () => {
  it("gets the column header names and indices", () => {
    let wrapped = new SheetData(shopifyData)
    wrapped.headers
  })
})