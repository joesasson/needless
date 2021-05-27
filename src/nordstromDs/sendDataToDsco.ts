// Account number from response - 1000005017
import { reduceHeaders } from "../utils";

function sendDataToDsco() {
  function getRetailerId(){
    const ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openByUrl(testUrl)
    var orderSheet = ss.getSheets()[0];
    const orderData = orderSheet.getDataRange().getValues()
    // Get the column index from header
    const { dsco_retailer_id: dscoRetailerId } = reduceHeaders(orderData)
    return orderData[1][dscoRetailerId]
  }

  var dscoRetailerId = getRetailerId()
  // Retailer ID
  // Nordstrom = 1000003564;
  // nrhl = 1000006153
  var dscoSupplierId = 1000012883
  const makeRequests = (endpoint, payload) => {
    if(dscoRetailerId == 1000006153){
      const key = dscoApiKeyNrhl();
    } else {
      const key = dscoApiKey();
    }
    let options = {
      'method': 'post',
      'contentType': 'application/json',
      'headers': { Authorization: key },
      'payload': JSON.stringify(payload),
      'muteHttpExceptions': true
    }
     // Make requests
    let preview = UrlFetchApp.getRequest(endpoint, options)
    let res = UrlFetchApp.fetch(endpoint, options)
    return res
  }

  // get items in the "Update dsco" sheet
  const testUrl = TEST_URL
  const ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openByUrl(testUrl)
  const sheet = ss.getSheetByName("Invoice Import")
  const sheetData = sheet.getDataRange().getValues()
  // send request for each one to the dsco api using the key and constants
  let responses = [["Shipping Status", "Invoice Status"]]
  // get indices
  const {
    dsco_order_id,
    po_number,
    tracking,	
    ship_method,
    line_item_sku,
    line_item_quantity,
    line_item_expected_cost,
    invoice
  } = reduceHeaders(sheetData)
  // TODO : send in one request
  // TODO : deal with multiple line items
  // Update Shipping

  interface Product {
    sku: String
    quantity: Number
  }

  let items: Product[] = [] // contains array of  { "sku": "14598-B_5", "quantity": "5"}
  
  sheetData.forEach((row, i, self) => {
    if(i === 0) return
    const dsco_id = row[dsco_order_id]
    const po = row[po_number]
    const trackingNum = row[tracking]
    const sku = row[line_item_sku].replace("CHRN", "CHR")
    const qty = row[line_item_quantity]
    const shipMethod = row[ship_method]
    const isLastItem = i === self.length - 1 || row[po_number] !== self[i + 1][po_number] // po number doesn't match next row's po number

    if(!isLastItem){
      // update items
      items.push({ "sku" : sku, "quantity" : qty })
      responses.push(["", ""])
    } else {
      // update items
      items.push({ "sku" : sku, "quantity" : qty })
      // set payload
      // Update Shipping
      let shippingPayload = {
        "dscoRetailerId": dscoRetailerId,
        "dscoSupplierId": dscoSupplierId,
        "poNumber": po,
        "packages": [
          {
            "trackingNumber": trackingNum,
            "shipMethod": shipMethod,
            "shipCarrier": "UPS",
            "items": items,
            "warehouseCode": "WH1"
          }
        ]
      }
      const shippingEndpoint = `https://apis.dsco.io/api/v2/order/${dsco_id}/shipment`
      // Make requests and add responses
      let res = makeRequests(shippingEndpoint, shippingPayload)
      responses.push([res, ""])
      // clear items for next po
      items = []
  }
})

  let lineItems = []
  let lineNumber = 0 // Changed from 1
  let totalAmount = 0
  // Update Invoice
  sheetData.forEach((row, i, self) => {
    if(i === 0) return
    const poNumber = row[po_number]
    const invoiceId = row[invoice]
    const quantity = row[line_item_quantity]
    const sku = row[line_item_sku].replace("CHRN", "CHR")
    const unitPrice = row[line_item_expected_cost]
    const isLastItem = i === self.length - 1 || row[po_number] !== self[i + 1][po_number] // po number doesn't match next row's po number
    
    if(!isLastItem){
      lineItems.push({
        "sku": sku,
        "quantity": quantity,
        "unitPrice": unitPrice,
        "lineNumber": ++lineNumber // changed from incrementing on next line
      })
      totalAmount += unitPrice
      responses.push(["", ""])
    } else {
      lineItems.push({
        "sku": sku,
        "quantity": quantity,
        "unitPrice": unitPrice,
        "lineNumber": ++lineNumber
      })
      totalAmount += unitPrice 
      let invoicePayload = {
        "invoiceId" : invoiceId,
        "poNumber" : poNumber, 
        "totalAmount" : totalAmount,
        "lineItems" : lineItems
      }
      const invoiceEndpoint = `https://apis.dsco.io/api/v2/invoice`
  
      let res = makeRequests(invoiceEndpoint, invoicePayload)
      responses[i][1] = res
      lineNumber = 0  
      totalAmount = 0
      lineItems = []
    }
  }) 
  const target = sheet.getRange(1, 16, responses.length, responses[0].length)
  target.setValues(responses)

  
}
        
