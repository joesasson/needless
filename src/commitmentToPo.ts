function commitmentToPo() {
  let ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1NbnknGTdgOJ-8MjmtKwIE8A-ZsP75nIMgSBwAcOzZn8/edit');
  let sheet = ss.getSheets()[1];
  let sheetData = sheet.getDataRange().getValues();

  let { 
    asin,
    upcEanGtin,
    modelNumber,
    sizeName,
    orderQuantity,
    shipStartDate
  } = reduceHeaders(sheetData)
  let amazonSheetData = new CommitmentPlanData(sheetData)
  let allMonths = amazonSheetData.getAllMonths()
  allMonths.forEach(month => {
    let newData: any[][] = amazonSheetData.monthFilter(month)
    newData = newData.map((row, i) => {
      let shipDate = row[shipStartDate]
      let fnsku = row[asin]
      let upc = row[upcEanGtin]
      let qty = row[orderQuantity]
      let style = row[modelNumber]
      let size = cleanSize(row[sizeName])
      
      let sku = style + "_" + size
      let paddedSize = size < 10 ? 0 + size : size
      let paddedSku = style + "_" + paddedSize
      if(i === 0){
        return ["Sku", "Quantity", "FNSKU", "UPC", "Ship Date", "Vendor", "PO(AVC-MMDD)", "Ex-Factory", "padded"]
      }
      return [sku, qty, fnsku, upc, shipDate, "", "", "", paddedSku]
    })

    let [headers, ...rest] = newData
    let { padded } = reduceHeaders(newData)
    rest.sort((a: any[], b) => a[padded].localeCompare(b[padded], 'en', { numeric: true }))
    newData = [headers, ...rest]
    createNewSheetWithData(ss, newData, month)
  }) 
}