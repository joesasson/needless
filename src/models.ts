import { reduceHeaders, lookupBarcode, getSheetData } from './utils'

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

  constructor(wrapper) {
		this.customer = createCustomer(wrapper.customer, customerProfiles)
    this.raw = wrapper.data;
    this.indices = wrapper.headerMap;
    // const metadata = this.extractMetadata()
    this.metadata = new OrderMetadata(wrapper.metadata);
    // Get raw tabular data by using header and then
    // pulling all lines after that in
    this.lines = wrapper.content;
    this.lineItems = this.extractLineItems();
  }

  extractLineItems() {
    const ind = this.indices;
    return this.lines.map((row, i) => {
      const upc = row[ind.productCode];
      const itemDetails = {
        po: row[ind.po],
        upc,
        sku: lookupBarcode(upc),
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

class DropShipCustomer extends Customer {}

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

export {
  Order, Customer
}
