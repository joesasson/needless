import { camelize, reduceHeaders } from './utils'

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
      .addItem("Generate Packing Slip", "generatePackingSlip")
      .addItem("Generate Picklist", "generatePicklist")
      .addItem("Extract Selected Columns", "extractSelectedColumns")
    )
    .addSubMenu(SpreadsheetApp.getUi().createMenu('Shopify')
      .addItem("Extract Shopify Invoice and Credit Details", "extractShopifyInvoice")
    )
    .addSubMenu(SpreadsheetApp.getUi().createMenu("Other")
      .addItem("Generate Hautelook Packing Slip", "generateHautelookPackingSlip")
      .addItem("Open Gold Digger", "goldDigger")
      .addItem("Log Sheet", 'logSheet')
    )
    .addToUi();
}

class SheetData {
  data: any[][]
  content: any[][]
  headers: any[]
  headerMap: {}
  transmissionType: String
  dataWidth: Number
  dataHeight: Number
  customer: String
  indices: any
  headerRow: any

  constructor(data){
    // remove first row if there is a 'sep=' in the first cell
    if(data[0][0] === 'sep='){
      this.data = data.slice(1)
      this.transmissionType = "edi"
    } else {
      this.data = data
    }
    this.content = this.data.slice(1)
    this.dataWidth = this.data[0].length
    this.dataHeight = this.data.length
    this.customer = this.detectCustomer()
    this.headerMap = this.reduceHeaders()
  }


  extractColumnsByIndex(indices: Number[]){
    return this.data.map(row => {
      return row.filter((cell, i) => indices.indexOf(i) > -1)      
    })
  }

  reduceHeaders(){
    this.setHeaders()
    return this.indices = this.headers.reduce((columns, header, i) => {
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

  detectCustomer(){
    const firstCell: String = this.data[0][0]
    switch(firstCell){
      case "Trans Control No":
        // Von Maur EDI
        this.customer = 'Von Maur'
        break
      case "Transaction #":
        // Nordstrom Rack EDI
        this.customer = 'Nordstrom Rack'
        break
      case 'Sku':
        // amazon po
        this.customer = 'Amazon'
        break
      case 'NORDSTROM PURCHASE ORDER':
        // Hautelook spreadsheet PO
        this.customer = 'Nordstromrack.com/Hautelook'
        break
      default:
        this.customer = null
    }
    
    return this.customer
  }

  setHeaders(){
    switch(this.customer){
      case 'Von Maur':
      case 'Nordstrom Rack':
      case 'Amazon':
        this.headerRow = 0
        break
      case 'Nordstromrack.com/Hautelook':
        this.headerRow = 26
        break
      default:
        this.headerRow = 0
    }
    this.headers = this.data[this.headerRow]
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



class Extractor {
  data: any[][]
  content: any[][]
  headers: any[]
  headerMap: {}
  dataWidth: Number
  dataHeight: Number
  customer: String
  indices: any
  headerRow: any
  metadata: any[][]
  tabularData: any[][]

  constructor(data, headerRow){
    this.data = data
    this.metadata = this.data.slice(0, headerRow)
    this.tabularData = this.data.slice(headerRow)
    this.headers = this.data[headerRow]
    this.content = this.data.slice(headerRow + 1)
    this.dataWidth = this.content[0].length
    this.dataHeight = this.content.length
    // this.headerMap = this.reduceHeaders()
  }


  extractColumnsByIndex(indices: Number[]){
    return this.tabularData.map(row => {
      return row.filter((cell, i) => indices.indexOf(i) > -1)
    })
  }

  reduceHeaders(){
    return this.indices = this.headers.reduce((columns, header, i) => {
      let camelizedHeader = this.camelize(header)
      columns[camelizedHeader] = i
      return columns
    }, {})
  }

  camelize(s: string) {
    s = s.replace(/[^\w\s]/gi, " ");
    return s
      .split(" ")
      .map((word, i) => {
        word = word.toLowerCase();
        if (i === 0) {
          return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join("");
  };

}


export { SheetData, Extractor }


