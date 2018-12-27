function onOpen(e){
  SpreadsheetApp.getUi().createMenu("Needless")
    .addSubMenu(SpreadsheetApp.getUi().createMenu("Amazon PO")
      .addItem('Commitment Plan to QB PO', 'commitmentToPo')
      .addItem('Commitment Plan to Sku Worksheet', 'commitmentToSkuSheet'))
    .addSubMenu(SpreadsheetApp.getUi().createMenu('General Tasks')
      .addItem("Remove Empty Columns", "removeEmptyColumns"))
    .addToUi();
}

function removeEmptyColumns(){
  // so I want to get the data into the SheetData object 
  let sheetData = new SheetData(getSheetData())
  // concatenate each column's values
  let smushedColumns = []
  // add an index key for each column index
  // each element represents combined values of values in the column at it's index + 1 
  // ["11111", "tiraginabobalex",  "","aaaaa"]
  sheetData.content.forEach(row => {
    row.forEach((val, colI) => {
      smushedColumns[colI] += val
    })
  })
  // if it's just undefined, add the index to a list
  let emptyIndices = smushedColumns.reduce((prev, column, i) => {
    if(column === "undefined"){
      prev.push(i)
    }
    return prev
  }, [])
  // map through the whole data and compose with indexes that are not on that list 
  let newData = sheetData.data.map(row =>
    row.filter((cell, i) => 
    emptyIndices.indexOf(i) === -1)
  )
  let ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/10ovW3AM7slqVe-brCvxJznO5w_q4h2tAI9zozHTkSXQ/edit');
  createNewSheetWithData(ss, newData, "Trimmed")
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

const getIndexByHeader = (camelizedName, headerMap) => headerMap.find(column => column.headerName === camelizedName).headerIndex

function getSheetData() {
  let ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/10ovW3AM7slqVe-brCvxJznO5w_q4h2tAI9zozHTkSXQ/edit');
  let sheet = ss.getSheets()[0];
  let sheetData = sheet.getDataRange().getValues();
  return sheetData
}

class SheetData {
  data: [][]
  content: [][]
  headers: []
  headerMap: {}

  constructor(data){
    this.data = data
    this.content = this.data.slice(1)
    this.headers = this.data[0]
    this.headerMap = this.reduceHeaders()
  }

  reduceHeaders() {
    return this.headers.reduce((columns, header, i) => {
      let camelizedHeader = camelize(header)
      columns[camelizedHeader] = i
      return columns
    }, {})
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
    return this.data.filter((row, i) => {
      if(i === 0) return true
      let date: string = row[shipStartDate]
      let month = date.split("/")[0]
      return month === filterMonth
    })
  }

  removeDuplicatesByUpc() {
    const listOfUpcs = []
    const { upcEanGtin: upcI } = reduceHeaders(this.data)
    this.data = this.data.reduce((filtered: [][], row: []) => {
      const upc = row[upcI]
      if(listOfUpcs.indexOf(upc) > -1){
        return filtered
      }
      listOfUpcs.push(upc)
      filtered.push(row)
      return filtered
    }, [])
  }
}


