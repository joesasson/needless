function onOpen(e){
  SpreadsheetApp.getUi().createMenu("Needless")
    .addSubMenu(SpreadsheetApp.getUi().createMenu("Amazon PO")
      .addItem('Commitment Plan to QB PO', 'commitmentToPo')
      .addItem('Commitment Plan to Sku Worksheet', 'commitmentToSkuSheet')
    )
    .addSubMenu(SpreadsheetApp.getUi().createMenu("Nordstrom Dropship")
      .addItem("Generate Picklist", "nordstromPicklist")
      .addItem("Generate Invoice and Shipping Upload", "nordstromInv")
      .addItem("Update Data in dsco", "sendDataToDsco")
    )
    .addSubMenu(SpreadsheetApp.getUi().createMenu('General Tasks')
      .addItem("Remove Empty Columns", "removeEmptyColumns")
      .addItem("Extract Sales Order/Invoice Details", "extractSalesOrder")
    )
      .addSubMenu(SpreadsheetApp.getUi().createMenu('General Shipping')
      .addItem("Generate Picklist", "generatePicklist")
    )
    .addToUi();
}

class SheetData {
  data: [][]
  content: [][]
  headers: []
  headerMap: {}

  constructor(data){
    // remove first row if there is a 'sep=' in the first cell
    if(data[0][0] === 'sep='){
      this.data = data.slice(1)
    } else {
      this.data = data
    }
    this.content = this.data.slice(1)
    this.headers = this.data[0]
    this.headerMap = this.reduceHeaders()
  }

  extractColumnsByIndex(indices: Number[]){
    return this.data.map(row => {
      return row.filter((cell, i) => indices.indexOf(i) > -1)      
    })
  }

  reduceHeaders(){
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


