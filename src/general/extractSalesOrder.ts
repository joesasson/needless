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
  let indices = sourceData.reduceHeaders();
  let customer = sourceData.detectCustomer()

  const { masterPo, ship_date, cancel_date, carrier, date } = sourceData.getSourceMetadata()

  let globalStyle;
  let globalRate;

  let newData = sourceData.data
    .map((row, i) => {
      let style;
      let size;
      let upc = "";
      let sku;
      let qty;
      let rate;
      let store;
      let po;
      let shipTo1 = "";
      let shipTo2 = "";
      let address;
      let city = "";
      let state = "";
      let zip = "";

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
          "Ship To Name",
          "Ship To 2",
          "City",
          "State",
          "Zip"
        ];

      // get line details
      switch (customer) {
        case "Nordstrom Rack":
          style = row[indices.vendorStyle];
          size = row[indices.vendorSizeDescription];
          upc = row[indices.productId];
          sku = `${style}_${size}`;
          qty = row[indices.orderedQty];
          rate = row[indices.unitPrice];
          store = row[indices.store];
          po = `${masterPo}-${store}`;
          shipTo1 = row[indices.shipToLocation];
          // shipping address
          address = row[indices.shipToAddress];
          city = row[indices.shipToCity];
          state = row[indices.shipToState];
          zip = row[indices.shipToZipcode];
          shipTo2 = `${address} ${city}, ${state} ${zip}`;
          break;
        case "Nordstromrack.com/Hautelook":
          // skip rows before 27
          const newIndices = reduceHeaders(sourceData.data, 26);
          const firstRowOfDetails = 27;
          if (i < firstRowOfDetails) return null;
          let styleVal = row[newIndices.vpn];
          size = row[newIndices.size1];
          // return if
          // style contains total
          // style and size are both empty
          if (
            styleVal.toLowerCase().indexOf("total") > -1 ||
            (styleVal === "" && size === "")
          ) {
            return null;
          }
          // find row with a style
          // set the style and rate until the next style is found
          if (styleVal !== "") {
            globalStyle = styleVal;
            globalRate = row[newIndices.unitCost];
            return null;
          }

          style = globalStyle;
          sku = `${style}_${size}`;
          qty = row[newIndices.ttlUnits];
          store = row[newIndices.store];
          po = masterPo;
          rate = globalRate;
          break;
        case 'Von Maur':
          store = row[indices.buyerStoreNo]
          po = `${masterPo}-${store}`
          qty = row[indices.qtyOrdered]
          upc = row[indices.productCode]
          rate = row[indices.unitPrice]
          sku = lookupBarcode(upc)
          break;
        default:
          // Logger.log("Customer not found");
      }

      return [  
        sku,
        upc,
        qty,
        rate,
        po,
        date,
        ship_date,
        cancel_date,
        customer,
        carrier,
        shipTo1,
        shipTo2,
        city,
        state,
        zip
      ];
    })
    .filter(x => x);

  return newData;
};

class SalesOrderExtractor extends SheetData {
  constructor(sourceData){
    super(sourceData)
  }
  
  getSourceMetadata(){
    let masterPo, ship_date, cancel_date, carrier, date
    switch (this.customer) {
      case "Nordstrom Rack":
        masterPo = this.data[1][this.indices.po];
        ship_date = this.data[1][this.indices.shipNotBefore];
        cancel_date = this.data[1][this.indices.cancelAfter];
        carrier = "Gilbert East";
        date = ship_date;     
        return { masterPo, ship_date, cancel_date, carrier, date }
      case "Nordstromrack.com/Hautelook":
        masterPo = this.data[16][2];
        ship_date = this.data[13][2];
        cancel_date = this.data[14][2];
        carrier = "XPOLOGISTICS";
        date = ship_date;
        return { masterPo, ship_date, cancel_date, carrier, date }
      case 'Von Maur':
        masterPo = this.data[1][this.indices.poNumber]
        ship_date = this.data[1][this.indices.shipNotBefore]
        cancel_date = this.data[1][this.indices.cancelAfter];
        carrier = 'TGIR'
        date = ship_date
        return { masterPo, ship_date, cancel_date, carrier, date }
      default:
        return { error: new Error("Customer Not Found") }
    }
    
  }
}


export { generateSalesOrder, SalesOrderExtractor };
