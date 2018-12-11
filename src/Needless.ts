function onOpen(e){
  SpreadsheetApp.getUi().createAddonMenu()
    .addItem('Menu Item', 'needless')
    .addToUi();
}

function needless() {
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
    let { padded } = reduceHeaders(newData)
    rest.sort((a: any[], b) => a[padded].localeCompare(b[padded], 'en', { numeric: true }))
    newData = [headers, ...rest]
    createNewSheetWithData(ss, newData, month)
  }) 
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
  content: [][]
  headers: []
  headerMap: {}

  constructor(data){
    this.data = data
    this.content = this.data.slice(1)
    this.headers = this.data[0]
    this.headerMap = reduceHeaders(this.data)
  }

  getAllMonths(){
    // get ship date index
    let { shipStartDate } = reduceHeaders(this.data)
    // map all dates into one array
    let dates: any[] = this.content.map(row => row[shipStartDate])
    let months = dates.reduce((uniqueMonths, date, i) => {
      let month = date.split('/')[0]
      if(uniqueMonths.indexOf(month) === -1){
        return [...uniqueMonths, month]
      }
      return uniqueMonths
    }, [])
    return months
  }

  dateFilter(filterDate) {
    let { shipStartDate } = reduceHeaders(this.data)
    return this.data.filter(row => row[shipStartDate] === filterDate) 
  }

  monthFilter(filterMonth){
    let { shipStartDate } = reduceHeaders(this.data)
    return this.data.filter(row => {
      let date: string = row[shipStartDate]
      let month = date.split("/")[0]
      return month === filterMonth
    })
  }
}