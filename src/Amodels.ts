import { reduceHeaders, lookupBarcode, getSheetData, camelize, splitSku } from './utils'

// Domain Model

// SheetData
// Order
// LineItem
// Transformer
// FieldMap
// MetaData
// Customer
// Generator
// Template

// Flow

// SheetData ingests a Google sheet object
// Order ingests SheetData and provides useful handles based on transformations provided by Transformers
// Customer contains FieldMap that can be used as a reference to pull a column
// Order consists of LineItems, Customer, Metadata
// Generator picks and transforms fields and outputs them in a consistent format

const customerProfiles = {
	"Von Maur": {
    name: "Von Maur",
    id: "recGuzh7SlePGyO9B",
    fieldMap: {
      sku: null,
      upc: 'productCode',
      po: 'poNumber',
      qty: 'qtyOrdered',
      rate: 'unitPrice',
      shipTo1: null,
      shipTo2: null,
      city: null,
      state: null,
      zip: null
    }
	},
	"BLOOMINGDALES": {
		name: "BLOOMINGDALES",
    fieldMap: {
      sku: null,
      upc: 'productCode',
      po: 'po',
      qty: 'qty',
      rate: 'unitPrice',
      shipToName: "shipToName",
      shipTo1: "shipToAddress1",
      shipTo2: "shipToAddress2",
      shipToCity: "shipToCity",
      shipToState: "shipToState",
      shipToZip: "shipToZipcode",
      shipToPhone: "contactTel"
    }
  },
  "Bloomingdales Outlet": {
    name: "Bloomingdales Outlet",
    id: "recpPF4dxZRbnqiNL",
    fieldMap: {
      sku: null,
      upc: 'productCode',
      po: 'poNumber',
      qty: 'qtyOrdered',
      rate: 'unitPrice',
      shipToName: null,
      shipTo1: null,
      shipTo2: null,
      city: null,
      state: null,
      zip: null
    }
  },
  "Nordstrom Rack": {
    name: "Nordstrom Rack",
    id: "rec1gxrD5ycD8hHXW",
    fieldMap: {
      sku: null,
      upc: 'productId',
      po: 'po',
      qty: 'orderedQty',
      rate: 'unitPrice',
      shipTo1: null,
      shipTo2: null,
      city: null,
      state: null,
      zip: null,
      store: 'store'
    }
  },
  "Nordstromrack.com/Hautelook": {
    name: "Nordstromrack.com/Hautelook",
    id: "recpfsYl1i7X7C5tO",
    fieldMap: {
      sku: null,
      upc: 'productCode',
      po: 'poNumber',
      qty: 'qtyOrdered',
      rate: 'unitPrice',
      shipTo1: null,
      shipTo2: null,
      city: null,
      state: null,
      zip: null
    }
  },
  "Macy's": {
    name: "Macy's",
    fieldMap: {
      sku: null,
      upc: 'productCode',
      po: 'po',
      qty: 'qty',
      rate: 'unitPrice',
      shipToName: "shipToName",
      shipTo1: "shipToAddress1",
      shipTo2: "shipToAddress2",
      shipToCity: "shipToCity",
      shipToState: "shipToState",
      shipToZip: "shipToZipcode",
      shipToPhone: "contactTel"
    }
  }
}

class Order {
  raw: any;
  metadata: OrderMetadata;
  lines: any;
  lineItems: [LineItem];
  shippingData: ShippingData;
  fulfillmentData: FulfillmentData;
  customer: Customer;
  indices: any;
  summary: OrderSummary;
  cachedSkus: {}

  constructor(wrapper) {
		this.customer = createCustomer(wrapper.customer, customerProfiles)
    this.raw = wrapper.data;
    this.indices = wrapper.headerMap;
    // const metadata = this.extractMetadata()
    this.metadata = new OrderMetadata(wrapper.metadata);
    this.cachedSkus = {}
    // Get raw tabular data by using header and then
    // pulling all lines after that in
    this.lines = wrapper.content;
    this.lineItems = this.extractLineItems();
  }

  // This is specific to Bloomingdales, I need to abstract it

  extractLineItems() {
    const ind = this.indices;
    const fieldMap = this.customer.fieldMap
    return this.lines.map((row, i) => {
      const upc = row[ind[fieldMap['upc']]];
      const masterPo = row[ind[fieldMap['po']]]
      const store = row[ind[fieldMap['store']]]
      let itemDetails
      if(this.customer.name == "BLOOMINGDALES"){
        itemDetails = {
          po: store ? `${masterPo}-${store}` : masterPo, 
          upc,
          sku: lookupBarcode(upc, this.cachedSkus),
          qty: row[ind.qty],
          rate: row[ind[fieldMap['rate']]],
          shipTo1: row[ind.partyName],
          shipTo2: row[ind.partyAddress1],
          city: row[ind.partyCity],
          state: row[ind.partyState],
          zip: row[ind.partyZipcode]
        } 
      } else if(this.customer.name == "Macy's"){
          itemDetails = {
            po: row[ind[fieldMap['po']]], 
            upc,
            sku: lookupBarcode(upc, this.cachedSkus),
            qty: row[ind[fieldMap['qty']]],
            rate: row[ind[fieldMap['rate']]],
            shipTo1: row[ind[fieldMap['shipToAddress1']]],
            shipTo2: row[ind[fieldMap['shipToAddress2']]],
            city: row[ind[fieldMap['shipToCity']]],
            state: row[ind[fieldMap['shipToState']]],
            zip: row[ind[fieldMap['shipToZip']]]
          }
        }
      
      return new LineItem(itemDetails);
    });
  }

  summarize(link){
    this.summary = new OrderSummary(this)
    this.summary.poLink = link
  }

  addFulfillmentData() {
    const { sheetData: fulfillmentSheetData } = getSheetData(
      this.customer.name + " - Picklist"
    );
    this.fulfillmentData = new FulfillmentData(
      this.lineItems,
      fulfillmentSheetData
    );
  }
}

class OrderMetadata {
  masterPo: String;
  shipDate: any;
  cancelDate: any;
  carrier: String;
  poDate: any;
  constructor(metaDetails) {
    Object.keys(metaDetails).forEach(key => {
      this[key] = metaDetails[key]
    })
  }
}

class LineItem {
  sku: String;
  upc: Number;
  title: String;
  size: Number;
  stylePrefix: String;
  color: String;
  qty: Number;
  storeNumber: Number;
  unitPrice: Number;
  retailPrice: Number;
  styleName: String;
  po: String;
  rate: any
  shipTo2: String
  shipTo1: String
  city: String
  state: String
  zip: String

  constructor(lineDetails) {
    const {
      sku,
      upc,
      po,
      qty,
      rate,
      shipTo1,
      shipTo2,
      city,
      state,
      zip
    } = lineDetails;
    this.sku = sku;
    this.styleName = splitSku(sku)[0]
    this.size = splitSku(sku)[1]
    this.upc = upc;
    this.po = po;
    this.qty = qty;
    (this.rate = rate), (this.shipTo1 = shipTo1);
    this.shipTo2 = shipTo2;
    this.city = city;
    this.state = state;
    this.zip = zip;
  }
}

class Customer {
  name: String;
  billingName: String;
  billingAddress1: String;
  billingAddress2: String;
  billingCity: String;
  billingState: String;
  billingZip: String;
  billingPhone: String;
  shippingName: String;
  shippingAddress1: String;
  shippingAddress2: String;
  shippingCity: String;
  shippingState: String;
  shippingZip: String;
  shippingPhone: String;
  fieldMap: {}

  constructor(customerData){
		Object.keys(customerData).forEach(key => {
			this[key] = customerData[key]
		})
  }
}

class FulfillmentData {
  items: any

  constructor(lineItems, fulfillmentInput) {
    const { inStock } = reduceHeaders(fulfillmentInput);
    fulfillmentInput = fulfillmentInput.slice(1);
    this.items = lineItems.map((item, i) => {
      const qtyFulfilled = fulfillmentInput[i][inStock];
      return { ...item, qtyFulfilled };
    });
  }
}

class OrderSummary {
  customerName: String
  po: String
  poLink: String
  shipDate: String
  cancelDate: String
  totalPairs: Number
  value: Number
  category: String
  styles: []
  storeCount: Number
  constructor(order){
    this.customerName = order.customer.name
    this.po = order.metadata.masterPo
    this.shipDate = order.metadata.ship_date
    this.cancelDate = order.metadata.cancel_date
    let { totalPairs, value, styles } = this.calculateTotals(order)
    this.styles = styles
    this.totalPairs = totalPairs
    this.value = value
    this.category = this.detectCategory(order)
  }

  detectCategory(order){
    if(order.lineItems.some(lineItem => lineItem.size == 1)){
      return 'kids'
    }
    if(order.lineItems.some(lineItem => lineItem.size == 13)){
      return 'men'
    }
    return 'women'
  }

  calculateTotals(order){
    return order.lineItems.reduce((acc, lineItem) => {
      const qty = lineItem.qty
      const value = lineItem.rate * qty
      const style = lineItem.styleName
      acc.totalPairs += qty
      acc.value += value
      if(acc.styles.indexOf(style) === -1){ acc.styles.push(style) }
      return acc
    }, { 
      totalPairs: 0,
      value: 0,
      styles: []
    })
  }
} // TODO
class ShippingData {} // TODO

function createCustomer(customerName, customerProfiles){
	let customerDetails = customerProfiles[customerName]
	return new Customer(customerDetails)
}

// This will be the actual config data, I will work on moving it 
// outside the code

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

class SheetData {
  data: any[][]
  content: any[][]
  headers: any[]
  headerMap: any
  dataWidth: Number
  dataHeight: Number
  customer: String
  indices: any
  headerRow: any

  constructor(data, headerRow=0){
    // remove first row if there is a 'sep=' in the first cell
    if(data[0][0] === 'sep='){
      this.data = data.slice(1)
    } else {
      this.data = data
    }
    this.headerRow = headerRow
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

  // this should be in a lower level class - Amazon Order 
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

  // this should be in the order class
  detectCustomer(){
    const firstCell: String = this.data[0][0]
		if(this.data[1][50] === "Bloomingdales Outlet"){
			return this.customer = "Bloomingdales Outlet"
    }
    if(this.data[0][1] == "Column 2"){
      return this.customer = "Macy's"
    }
    switch(firstCell){
      case "Trans Control #":
        this.customer = "BLOOMINGDALES"
        break
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

  // This should be passed in to the constructor
  setHeaders(){
    switch(this.customer){
      case 'Nordstromrack.com/Hautelook':
        this.headerRow = 26
        break
      default:
        this.headerRow = 0
    }
    this.headers = this.data[this.headerRow]
  }

  // This is amazon specific, doesn't need to be here
  dateFilter(filterDate) {
    let { shipStartDate } = reduceHeaders(this.data)
    return this.data.filter(row => row[shipStartDate] === filterDate) 
  }


  // This is amazon specific, doesn't need to be here
  monthFilter(filterMonth){
    let { shipStartDate } = reduceHeaders(this.data)
    return this.data.filter((row, i) => {
      if(i === 0) return true
      let date: string = row[shipStartDate]
      let month = date.split("/")[0]
      return month === filterMonth
    })
  }

  // This is amazon specific, doesn't need to be here
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

export {
  Order, Customer, SheetData, Extractor
}