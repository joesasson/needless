function onOpen(e){
  SpreadsheetApp.getUi().createAddonMenu()
    .addItem('Menu Item', 'needless')
    .addToUi();
}

function needless() {
  let ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1NbnknGTdgOJ-8MjmtKwIE8A-ZsP75nIMgSBwAcOzZn8/edit');
  let sheet = ss.getSheets()[1];
  let sheetData = sheet.getDataRange().getValues();

  // define named indexes
  // basically I want to parse header names, and use them as the index variable name
  // let me try to write a function that will map the names to a column name and an index number 
  let { 
    asin,
    upcEanGtin,
    modelNumber,
    sizeName,
    orderQuantity,
    shipStartDate
  } = reduceHeaders(sheetData) //-> { columnName1: index1, ... } 
  // // filter by date (maybe prompt for a date)
  let filterDate = "04/10/2019" // Make this configurable down the road
  let amazonSheetData = new CommitmentPlanData(sheetData)
  let newData = amazonSheetData.dateFilter(filterDate)
  newData = newData.map((row, i) => {
    let shipDate = row[shipStartDate]
    let fnsku = row[asin]
    let upc = row[upcEanGtin]
    let qty = row[orderQuantity]
    let style = row[modelNumber]
    let size = row[sizeName]
    size = size.replace(" M US", "")
    let sku = style + "_" + size
    let paddedSize = size < 10 ? 0 + size : size
    let paddedSku = style + "_" + paddedSize
    if(i === 0){
      return ["Sku", "Quantity", "FNSKU", "UPC", "Ship Date", "Vendor", "PO(AVC-MMDD)", "Ex-Factory", "padded"]
    }
    return [sku, qty, fnsku, upc, shipDate, "", "", "", paddedSku]
  })

  let [headers, ...rest] = newData
  rest.sort((a, b) => a[8].localeCompare(b[8], 'en', { numeric: true }))
  newData = [headers, ...rest]
  // sort by style by size
  createNewSheetWithData(ss, newData, 'Output')
}



export const mapHeaders = data => {
  let headers = data[0];
  let headerMap = headers.map((header, i) => {
    let camelizedHeader = camelize(header)
    return {
      headerName: camelizedHeader,
      headerIndex: i
    };
  });
  
  return headerMap;
}

export const reduceHeaders = data => {
  let headers = data[0];
  return headers.reduce((columns, header, i) => {
    let camelizedHeader = camelize(header)
    columns[camelizedHeader] = i
    return columns
  }, {})
}

export const camelize = string => {
  string = string.replace(/[^\w\s]/gi, ' ')
  return string.split(' ').map((word, i) => {
    word = word.toLowerCase()
    if(i === 0){ return word }
    return word.charAt(0).toUpperCase() + word.slice(1)
  }).join('')
}

export const getIndexByHeader = (camelizedName, headerMap) => headerMap.find(column => column.headerName === camelizedName).headerIndex

class CommitmentPlanData {
  data: [][]
  headers: []
  headerNames: {}

  constructor(data){
    this.data = data
    this.headers = data[0]
    this.headerNames = reduceHeaders(this.data)
  }


  dateFilter(filterDate) {
    let { shipStartDate } = this.headerNames
    return this.data.filter(row => row[shipStartDate] === filterDate) 
  }
}