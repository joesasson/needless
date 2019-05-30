import { SheetData } from '../Amodels'
import { generateSalesOrder, SalesOrderExtractor } from '../general/extractSalesOrder'
import {
  hautelookData,
  nordstromData,
  vonMaurData
} from './testHelpers'


describe("extractSalesOrder", () => {

  describe('generateSalesOrder', () => {
    it("generates a Sales Order for Hautelook", () => {
      let mock = new SalesOrderExtractor(hautelookData)
      let salesOrder = generateSalesOrder(mock)
      expect(salesOrder.length).toBe(31)
      expect(salesOrder[5][2]).toBe('30.0')
    })
  
    it("generates a Sales Order for Nordstrom Rack", () => {
      let wrapped = new SalesOrderExtractor(nordstromData)
      let salesOrder = generateSalesOrder(wrapped)
      expect(salesOrder.length).toBe(9)
      expect(salesOrder[4][8]).toBe("Nordstrom Rack")
    })

    it("generates a Sales Order for Von Maur", () => {
      let wrapped = new SalesOrderExtractor(vonMaurData)
      let salesOrder = generateSalesOrder(wrapped)
      expect(salesOrder.length).toBe(9)
      // expect(salesOrder[8][4]).toBe('811841.0-6.0') // meta (PO#)
      expect(salesOrder[8][1]).toBe('8.43710177057E11') // detail (upc)
    })
  })

  describe("class SalesOrderExtractor", () => {
    describe("detectCustomer()", () => {
      it("sets this.customer to the correct customer and returns the customer", () => {
        let wrapped = new SalesOrderExtractor(hautelookData)
        expect(wrapped.customer).toBe('Nordstromrack.com/Hautelook')
        wrapped = new SalesOrderExtractor(nordstromData)
        expect(wrapped.customer).toBe('Nordstrom Rack')
        wrapped = new SalesOrderExtractor(vonMaurData)
        expect(wrapped.customer).toBe('Von Maur')
      })
    })
    describe("getSourceMetadata()", () => {
      it("gets Metadata based on this.customer", () => {
        let wrapped = new SalesOrderExtractor(hautelookData)
        wrapped.getSourceMetadata()
        expect(wrapped.metadata.masterPo).toBe("N204743")
      })
    })
    describe("getSourceLineDetails()", () => {
      it("gets Line Details based on this.customer", () => {
        let wrapped = new SalesOrderExtractor(hautelookData)
        wrapped.getSourceMetadata() // necessary for getting line details
        // let { sku } = wrapped.getSourceLineDetails(wrapped.data[27], 27)
        // expect(sku).toBe("24755-BNN_6")
      })
    })
  })

})

