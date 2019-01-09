function sendDataToDsco() {
  // get items in the "Update dsco" sheet
  const testUrl = TEST_URL
  const ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openByUrl(testUrl)
  const sheet = ss.getSheetByName("Invoice Import")
  const sheetData = sheet.getDataRange().getValues()
  // send request for each one to the dsco api using the key and constants
  const dscoRetailerId = 1000003564;
  const dscoSupplierId = 1000005017;
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
  
  sheetData.forEach((row, i) => {
    if(i === 0) return
    const dsco_id = row[dsco_order_id]
    const po = row[po_number]
    const trackingNum = row[tracking]
    const sku = row[line_item_sku]
    const qty = row[line_item_quantity]
    const shipMethod = row[ship_method]
    
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
          "items": [
            {
              "sku": sku,
              "quantity": qty
            }
          ]
        }
      ]
    }
    const shippingEndpoint = `https://apis.dsco.io/api/v2/order/${dsco_id}/shipment`
    // Make requests and add responses
    let res = makeRequests(shippingEndpoint, shippingPayload)
    responses.push([res, ""])
    // Update Invoice
  })
    
  sheetData.forEach((row, i) => {
    if(i === 0) return
    const poNumber = row[po_number]
    const invoiceId = row[invoice]
    const totalAmount = row[line_item_expected_cost]
    const quantity = row[line_item_quantity]
    const skuV = row[line_item_sku]
    const unitPrice = row[line_item_expected_cost]
  
    let invoicePayload = {
        "invoiceId" : invoiceId,
        "poNumber" : poNumber, 
        "totalAmount" : totalAmount,
        "lineItems" : [
            {
                "lineNumber" : 1,
                "quantity" : quantity, 
                "sku": skuV, 
                "unitPrice" : unitPrice 
              }
            ]
        }
    const invoiceEndpoint = `https://apis.dsco.io/api/v2/invoice`

    let res = makeRequests(invoiceEndpoint, invoicePayload)
    responses[i][1] = res
  }) 
  const target = sheet.getRange(1, 16, responses.length, responses[0].length)
  target.setValues(responses)
}
        
const makeRequests = (endpoint, payload) => {
  const key = dscoApiKey()
  let options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': { Authorization: key },
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  }
   // Make requests
  let preview = UrlFetchApp.getRequest(endpoint, options)
  Logger.log({preview})
  let res = UrlFetchApp.fetch(endpoint, options)
  return res
}