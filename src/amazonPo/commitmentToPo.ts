import { createNewSheetWithData, reduceHeaders, cleanSize } from '../utils'
import { SheetData } from '../Amodels'

export function commitmentToPo() {
  let ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1NbnknGTdgOJ-8MjmtKwIE8A-ZsP75nIMgSBwAcOzZn8/edit');
  let sheet = ss.getSheetByName("Stage Details");
  let sheetData = sheet.getDataRange().getValues();
   
  return generateAmazonPos(sheetData, ss)
}

export function generateAmazonPos(sheetData, ss){
  let { 
    asin,
    upcEanGtin,
    modelNumber,
    sizeName,
    orderQuantity,
    shipStartDate
  } = reduceHeaders(sheetData)
  let amazonSheetData = new SheetData(sheetData)
  let allMonths = amazonSheetData.getAllMonths()

  return allMonths.map(month => {
    let filtered: any[][] = amazonSheetData.monthFilter(month)
    let newData: any[][] = filtered.map((row, i) => {
      if(i === 0){
        return ["Sku", "Quantity", "FNSKU", "UPC", "Ship Date", "Vendor", "PO", "Ex-Factory", "padded"]
      }
      let shipDate = row[shipStartDate]
      let fnsku = row[asin]
      let upc = row[upcEanGtin]
      let qty = row[orderQuantity]
      let style = row[modelNumber]
      let size = cleanSize(row[sizeName])
      
      let sku = style + "_" + size
      let paddedSize = size < 10 ? 0 + size : size
      let paddedSku = style + "_" + paddedSize
      return [sku, qty, fnsku, upc, shipDate, "", "", "", paddedSku]
    })

    let [headers, ...rest] = newData
    let { padded } = reduceHeaders(newData)
    rest.sort((a: any[], b) => a[padded].localeCompare(b[padded], 'en', { numeric: true }))
    newData = [headers, ...rest]
    createNewSheetWithData(ss, newData, month)
    return newData
  })
}

