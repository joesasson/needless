import { getSheetData, reduceHeaders, createNewSheetWithData, lookupBarcode } from '../utils'
import { SheetData } from '../Amodels'

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
  cachedSkus: {}

  constructor(sourceData){
    super(sourceData)

    this.getSourceMetadata()
    this.globalStyle = ''
    this.globalRate = ''
    this.cachedSkus = {}
  }

  getSourceMetadata(){
    let masterPo, ship_date, cancel_date, carrier
    let date = "=TODAY()"
    let topDataRow = this.data[1]
    let metadata = { masterPo, ship_date, cancel_date, carrier, date }
    const ind = this.indices
    switch (this.customer) {
      case 'Bloomingdales Outlet':
        metadata.masterPo = topDataRow[ind.poNo]
        metadata.ship_date = topDataRow[ind.doNotDeliverBeforeIndcDate]
        metadata.cancel_date = topDataRow[ind.cancelAfter]
        metadata.carrier = 'UPS'
        this.metadata = metadata
        break
      case 'BLOOMINGDALES':
        metadata.masterPo = this.data[1][ind.po]
        metadata.ship_date = this.data[1][ind.requestShipDate]
        metadata.cancel_date = this.data[1][ind.cancelAfter]
        metadata.carrier = 'UPS'
        this.metadata = metadata
        break
      case "Nordstrom Rack":
        metadata.masterPo = this.data[1][ind.po];
        metadata.ship_date = this.data[1][ind.shipNotBefore];
        metadata.cancel_date = this.data[1][ind.cancelAfter];
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
        masterPo = this.data[1][ind.poNumber]
        ship_date = this.data[1][ind.shipNotBefore]
        cancel_date = this.data[1][ind.cancelAfter];
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
    let ind = this.indices
    switch (this.customer) {
      case "Bloomingdales Outlet":
        store = row[ind.storeNo]
        po = `${this.metadata.masterPo}-${store}`
        upc = row[ind.productCode]
        sku = lookupBarcode(upc, this.cachedSkus)
        qty = row[ind.qty]
        rate = row[ind.unitPrice]
        title = 'not available'
        lineDetails = {
          upc, sku, qty, rate, title, po
        }
        break;
      case "BLOOMINGDALES":
        po = row[ind.po]
        upc = row[ind.productCode]
        sku = lookupBarcode(upc, this.cachedSkus)
        qty = row[ind.qty]
        rate = row[ind.unitPrice]
        shipTo1 = row[ind.partyName]
        shipTo2 = row[ind.partyAddress1]
        city = row[ind.partyCity]
        state = row[ind.partyState]
        zip = row[ind.partyZipcode]
        tracking = `=INDEX(Tracking!E:E, MATCH(E${currentRow}, Tracking!AL:AL, 0))`
        invoice = `=IF(E${currentRow}=E${previousRow}, Q${previousRow}, Q${previousRow}+1)`
        lineDetails = { style, size, upc, sku, qty,
          rate, store, po, shipTo1,
          shipTo2, address, city, state, zip, title, tracking, invoice } 
        break
      case "Nordstrom Rack":
        style = row[ind.vendorStyle];
        size = row[ind.vendorSizeDescription];
        upc = row[ind.productId];
        sku = `${style}_${size}`;
        title = row[ind.productDescription]
        qty = row[ind.orderedQty];
        rate = row[ind.unitPrice];
        store = row[ind.store];
        po = `${this.metadata.masterPo}-${store}`;
        shipTo1 = row[ind.shipToLocation];
        shipTo2 = row[ind.shipToAddress];
        // shipping address
        city = row[ind.shipToCity];
        state = row[ind.shipToState];
        zip = row[ind.shipToZipcode];
        lineDetails = { style, size, upc, sku, qty,
          rate, store, po, shipTo1,
          shipTo2, address, city, state, zip, title }
        break;
      case "Nordstromrack.com/Hautelook":
        // skip rows before 27
        const headerRow = 26;
        if (i <= headerRow) return;
        let styleVal = row[ind.vpn];
        let color = row[ind.color]
        let styleName = row[ind.vpnDescription]
        size = row[ind.size1];
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
          this.globalRate = row[ind.unitCost];
          this.styleName = styleName
          this.color = color
          return;
        }
        styleName = this.styleName
        color = this.color
        style = this.globalStyle;
        sku = `${style}_${size}`;
        qty = row[ind.ttlUnits];
        store = row[ind.store];
        po = this.metadata.masterPo;
        rate = this.globalRate;
        lineDetails = { style, size, upc, sku, qty,
          rate, store, po, shipTo1,
          shipTo2, address, city, state, zip, styleName, color }
        break;
      case 'Von Maur':
        store = row[ind.buyerStoreNo]
        po = `${this.metadata.masterPo}-${store}`
        qty = row[ind.qtyOrdered]
        upc = row[ind.productCode]
        rate = row[ind.unitPrice]
        sku = lookupBarcode(upc, this.cachedSkus) || row[ind.productCode2]
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
