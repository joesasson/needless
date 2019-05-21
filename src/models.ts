import { reduceHeaders, lookupBarcode, getSheetData, camelize } from './utils'

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
    return this.lines.map((row, i) => {
      const upc = row[ind.productCode];
      const itemDetails = {
        po: row[ind.po],
        upc,
        sku: lookupBarcode(upc, this.cachedSkus),
        qty: row[ind.qty],
        rate: row[ind.unitPrice],
        shipTo1: row[ind.partyName],
        shipTo2: row[ind.partyAddress1],
        city: row[ind.partyCity],
        state: row[ind.partyState],
        zip: row[ind.partyZipcode]
      };
      return new LineItem(itemDetails);
    });
  }

  addFulfillmentData() {
    const { sheetData: fulfillmentSheetData } = getSheetData(
      this.customer + " - Picklist"
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

class OrderSummary {} // TODO
class ShippingData {} // TODO

function createCustomer(customerName, customerProfiles){
	let customerDetails = customerProfiles[customerName]
	return new Customer(customerDetails)
}

// This will be the actual config data, I will work on moving it 
// outside the code

const customerProfiles = {
	"Von Maur": {
		name: "Von Maur",
	
	},
	"BLOOMINGDALES": {
		name: "BLOOMINGDALES",
		
  },
  "Bloomingdales Outlet": {
    name: "Bloomingdales Outlet",

  },
  "Nordstrom Rack": {
    name: "Nordstrom Rack",
  },
  "Nordstromrack.com/Hautelook": {
    name: "Nordstromrack.com/Hautelook",
  },
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