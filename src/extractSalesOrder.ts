function extractSalesOrder(){
  let { ss, sheetData } = getSheetData()
  const wrapped = new SheetData(sheetData)

  // indices
  const indices = wrapped.reduceHeaders()
  
  // constants
  const masterPo = wrapped.data[1][indices.po]
  const ship_date = wrapped.data[1][indices.shipNotBefore]
  const cancel_date = wrapped.data[1][indices.cancelAfter]
  const customer = "Nordstrom Rack"
  const carrier = "XPOLOGISTICS"
  const date = ship_date

  // final result
  let newData = wrapped.data.map((row, i) => {
    // headers
    if(i === 0) return [
      "sku",
      "upc",
      "qty",
      "rate",
      "po",
      "date",
      "ship_date",
      "cancel_date",
      "customer",
      "carrier"
    ]

    
    // details
    const style = row[indices.vendorStyle]
    const size = row[indices.vendorSizeDescription]
    const upc = row[indices.productId]
    const sku = `${style}_${size}`
    const qty = row[indices.orderedQty]
    const rate = row[indices.unitPrice]
    const store = row[indices.store]
    const po = `${masterPo}-${store}`

    return [
      sku,
      upc,
      qty,
      rate,
      po,
      date,
      ship_date,
      cancel_date,
      customer,
      carrier
    ]
  }).filter(x => x)

  createNewSheetWithData(ss, newData, "Quickbooks Import")
}