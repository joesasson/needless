function sendDataToDsco() {
  // get items in the "Update dsco" sheet
  const testUrl = "https://docs.google.com/spreadsheets/d/1R1CBEzWFZo9DyvbP9k9VzCCBdRgfQ5Nhbsyxo_5WQ74/edit#gid=908936496"
  const ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openByUrl(testUrl)
  const sheet = ss.getSheetByName("dsco Update")
  // const sheet = ss.getSheetByName("Invoice Update")
  const sheetData = sheet.getDataRange().getValues()
  // send request for each one to the dsco api using the key and constants
  const key = dscoApiKey()
  let responses = [["status"]]
  const dscoRetailerId = 1000003564;
  const dscoSupplierId = 1000005017;
  const {
    dsco_order_id,
    po_number,
    tracking,	
    ship_method,
    line_item_sku,
    line_item_quantity,
    line_item_expected_cost,
    inv
  } = reduceHeaders(sheetData)
  // Update Shipping

  // sheetData.forEach((row, i) => {
  //   if(i === 0) return
  //   const dsco_id = row[dsco_order_id]
  //   const po = row[po_number]
  //   const trackingNum = row[tracking]
  //   const sku = row[line_item_sku]
  //   const qty = row[line_item_quantity]
  //   const shipMethod = row[ship_method]

  //   let payload = {
  //     "dscoRetailerId": dscoRetailerId,
  //     "dscoSupplierId": dscoSupplierId,
  //     "poNumber": po,
  //     "packages": [
  //       {
  //         "trackingNumber": trackingNum,
  //         "shipMethod": shipMethod,
  //         "shipCarrier": "UPS",
  //         "items": [
  //           {
  //             "sku": sku,
  //             "quantity": qty
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // const endpoint = `https://apis.dsco.io/api/v2/order/${dsco_id}/shipment`

  // Invoice Update

  const endpoint = `https://apis.dsco.io/api/v2/invoice`
  sheetData.forEach((row, i) => {
    if(i === 0) return
    const poNumber = row[po_number]
    const invoiceId = row[inv]
    const totalAmount = row[line_item_expected_cost]
    const quantity = row[line_item_quantity]
    const skuV = row[line_item_sku]
    const unitPrice = row[line_item_expected_cost]

    let payload = {
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

    // Make requests
    let options = {
        'method': 'post',
        'contentType': 'application/json',
        'headers': { Authorization: key },
        'payload': JSON.stringify(payload),
        'muteHttpExceptions': true
    }
    let preview = UrlFetchApp.getRequest(endpoint, options)
    Logger.log({preview})
    let res = UrlFetchApp.fetch(endpoint, options)
    responses.push([res])
  }) 
  const target = sheet.getRange(1, 8, responses.length, 1)
  target.setValues(responses)
}