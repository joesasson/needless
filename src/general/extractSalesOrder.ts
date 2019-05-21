import { getSheetData, reduceHeaders, createNewSheetWithData, lookupBarcode } from '../utils'
import { SheetData } from '../Needless'

function extractSalesOrder() {
  let { ss, sheetData } = getSheetData(); 
  // Logger.log({ sheetData })
  const extractorWrapper = new SalesOrderExtractor(sheetData); 
  
  const newData = generateSalesOrder(extractorWrapper);
  // Logger.log({ newData })

  createNewSheetWithData(ss, newData, "Quickbooks Import");
}

const generateSalesOrder = sourceData => {
  // get Source Data
  let customer = sourceData.customer;
  
  const { ship_date, cancel_date, carrier, date } = sourceData.getSourceMetadata()
  
  let newData = sourceData.data
  .map((row, i) => {
    
    // headers
    if (i === 0)
      return [
        "sku",
        "upc",
        "qty",
        "rate",
        "po",
        "date",
        "ship_date",
        "cancel_date",
        "customer",
        "carrier",
        "Ship To 1",
        "Ship To 2",
        "City",
        "State",
        "Zip",
        "Tracking",
        "Invoice"
      ];

    // get line details
      let lineDetails = sourceData.getSourceLineDetails(row, i)
      if(!lineDetails){
        return null
      }
      let { style, size, upc, sku, qty, 
        rate, store, po, shipTo1, shipTo2,
        address, city, state, zip, tracking, invoice
      } = lineDetails


      
      // compose rows with variables from getSourceLineDetails
      return [  
        sku,
        upc || '',
        qty,
        rate || '',
        po,
        date,
        ship_date,
        cancel_date,
        customer,
        carrier || '',
        shipTo1 || '',
        shipTo2 || '',
        city || '',
        state || '',
        zip || '',
        tracking || '',
        invoice || ''
      ];
    })
    .filter(x => x);

  return newData;
};

class SalesOrderExtractor extends SheetData {
  metadata: any
  globalStyle: string
  globalRate: string
  color: string
  styleName: string

  constructor(sourceData){
    super(sourceData)

    this.getSourceMetadata()
    this.globalStyle = ''
    this.globalRate = ''
  }

  getSourceMetadata(){
    let masterPo, ship_date, cancel_date, carrier
    let date = "=TODAY()"
    let topDataRow = this.data[1]
    let metadata = { masterPo, ship_date, cancel_date, carrier, date }
    switch (this.customer) {
      case 'Bloomingdales Outlet':
        metadata.masterPo = topDataRow[this.indices.poNo]
        metadata.ship_date = topDataRow[this.indices.doNotDeliverBeforeIndcDate]
        metadata.cancel_date = topDataRow[this.indices.cancelAfter]
        metadata.carrier = 'UPS'
        this.metadata = metadata
        break
      case 'BLOOMINGDALES':
        metadata.masterPo = this.data[1][this.indices.po]
        metadata.ship_date = this.data[1][this.indices.requestShipDate]
        metadata.cancel_date = this.data[1][this.indices.cancelAfter]
        metadata.carrier = 'UPS'
        this.metadata = metadata
        break
      case "Nordstrom Rack":
        metadata.masterPo = this.data[1][this.indices.po];
        metadata.ship_date = this.data[1][this.indices.shipNotBefore];
        metadata.cancel_date = this.data[1][this.indices.cancelAfter];
        metadata.carrier = "Gilbert East";
        this.metadata = metadata
        break;
      case "Nordstromrack.com/Hautelook":
        masterPo = this.data[16][2];
        ship_date = this.data[13][2];
        cancel_date = this.data[14][2];
        carrier = "XPOLOGISTICS";
        date = ship_date;
        this.metadata = { masterPo, ship_date, cancel_date, carrier, date }
        break;
      case 'Von Maur':
        masterPo = this.data[1][this.indices.poNumber]
        ship_date = this.data[1][this.indices.shipNotBefore]
        cancel_date = this.data[1][this.indices.cancelAfter];
        carrier = 'TGIR'
        date = ship_date
        this.metadata = { masterPo, ship_date, cancel_date, carrier, date }
        break;
      default:
        return { error: new Error("Customer Not Found") }
    } 
    return this.metadata 
  }

  getSourceLineDetails(row, i){
    // get line details
    let currentRow = i + 1
    let previousRow = i
    let style, size, upc, sku, qty,
        rate, store, po, shipTo1,
        shipTo2, address, city, state, zip,
        title, productCode2, lineDetails, tracking, invoice
    switch (this.customer) {
      case "BLOOMINGDALES":
        po = row[this.indices.po]
        upc = row[this.indices.productCode]
        sku = lookupBarcode(upc)
        qty = row[this.indices.qty]
        rate = row[this.indices.unitPrice]
        shipTo1 = row[this.indices.partyName]
        shipTo2 = row[this.indices.partyAddress1]
        city = row[this.indices.partyCity]
        state = row[this.indices.partyState]
        zip = row[this.indices.partyZipcode]
        tracking = `=INDEX(Tracking!E:E, MATCH(E${currentRow}, Tracking!AL:AL, 0))`
        invoice = `=IF(E${currentRow}=E${previousRow}, Q${previousRow}, Q${previousRow}+1)`
        lineDetails = { style, size, upc, sku, qty,
          rate, store, po, shipTo1,
          shipTo2, address, city, state, zip, title, tracking, invoice } 
        break
      case "Nordstrom Rack":
        style = row[this.indices.vendorStyle];
        size = row[this.indices.vendorSizeDescription];
        upc = row[this.indices.productId];
        sku = `${style}_${size}`;
        title = row[this.indices.productDescription]
        qty = row[this.indices.orderedQty];
        rate = row[this.indices.unitPrice];
        store = row[this.indices.store];
        po = `${this.metadata.masterPo}-${store}`;
        shipTo1 = row[this.indices.shipToLocation];
        shipTo2 = row[this.indices.shipToAddress];
        // shipping address
        city = row[this.indices.shipToCity];
        state = row[this.indices.shipToState];
        zip = row[this.indices.shipToZipcode];
        lineDetails = { style, size, upc, sku, qty,
          rate, store, po, shipTo1,
          shipTo2, address, city, state, zip, title }
        break;
      case "Nordstromrack.com/Hautelook":
        // skip rows before 27
        const headerRow = 26;
        if (i <= headerRow) return;
        let styleVal = row[this.indices.vpn];
        let color = row[this.indices.color]
        let styleName = row[this.indices.vpnDescription]
        size = row[this.indices.size1];
        // return if
        // style contains total
        // style and size are both empty
        const isTotalRow = styleVal.toLowerCase().indexOf("total") > -1 ||
        (styleVal === "" && size === "")
        if (isTotalRow) {
          return;
        }
        // find row with a style
        // set the style and rate until the next style is found
        if (styleVal !== "") {
          this.globalStyle = styleVal;
          this.globalRate = row[this.indices.unitCost];
          this.styleName = styleName
          this.color = color
          return;
        }
        styleName = this.styleName
        color = this.color
        style = this.globalStyle;
        sku = `${style}_${size}`;
        qty = row[this.indices.ttlUnits];
        store = row[this.indices.store];
        po = this.metadata.masterPo;
        rate = this.globalRate;
        lineDetails = { style, size, upc, sku, qty,
          rate, store, po, shipTo1,
          shipTo2, address, city, state, zip, styleName, color }
        break;
      case 'Von Maur':
        store = row[this.indices.buyerStoreNo]
        po = `${this.metadata.masterPo}-${store}`
        qty = row[this.indices.qtyOrdered]
        upc = row[this.indices.productCode]
        rate = row[this.indices.unitPrice]
        sku = lookupBarcode(upc) || row[this.indices.productCode2]
        lineDetails = { style, size, upc, sku, qty,
          rate, store, po, shipTo1,
          shipTo2, address, city, state, zip }
        break;
      default:
        // Logger.log("Customer not found");
    }
    return lineDetails
  }
}


export { generateSalesOrder, SalesOrderExtractor };
