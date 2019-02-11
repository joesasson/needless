import { getSheetData, reduceHeaders, createNewSheetWithData } from './utils'
import { SheetData } from './Needless'

function extractSalesOrder() {
  let { ss, sheetData } = getSheetData(); 
  const wrapped = new SheetData(sheetData); 
  Logger.log(sheetData)

  // call a function here that will return the new data and set it in this function
  const newData = generateSalesOrder(wrapped);
  Logger.log(newData)

  createNewSheetWithData(ss, newData, "Quickbooks Import");
}

const generateSalesOrder = sheetData => {
  let indices = sheetData.reduceHeaders();
  let customer;
  const detectNordstrom =
    sheetData.content[0][indices.poTerms] &&
    sheetData.content[0][indices.poTerms].indexOf("NORDSTROM") > -1;
  const detectHautelook = sheetData.data[0][0] === "NORDSTROM PURCHASE ORDER";
  if (detectNordstrom) {
    customer = "Nordstrom Rack";
  } else if (detectHautelook) {
    customer = "Nordstromrack.com/Hautelook";
  }

  let masterPo;
  let ship_date;
  let cancel_date;
  let carrier;
  let date;

  // constants based on customer
  switch (customer) {
    case "Nordstrom Rack":
      masterPo = sheetData.data[1][indices.po];
      ship_date = sheetData.data[1][indices.shipNotBefore];
      cancel_date = sheetData.data[1][indices.cancelAfter];
      carrier = "Gilbert East";
      date = ship_date;
      break;
    case "Nordstromrack.com/Hautelook":
      masterPo = sheetData.data[16][2];
      ship_date = sheetData.data[13][2];
      cancel_date = sheetData.data[14][2];
      carrier = "XPOLOGISTICS";
      date = ship_date;
      break;
    default:
      Logger.log("Customer not found");
  }

  let globalStyle;
  let globalRate;

  // final result
  let newData = sheetData.data
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
      let city;
      let state;
      let zip;

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
          "Ship To 2"
        ];

      // details based on customer
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
          shipTo1 = row[indices.shipToLocation]; // dc #
          // shipping address
          address = row[indices.shipToAddress];
          city = row[indices.shipToCity];
          state = row[indices.shipToState];
          zip = row[indices.shipToZipcode];
          shipTo2 = `${address} ${city}, ${state} ${zip}`;
          break;
        case "Nordstromrack.com/Hautelook":
          // skip rows before 27
          const newIndices = reduceHeaders(sheetData.data, 26);
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
        default:
          Logger.log("Customer not found");
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
        shipTo2
      ];
    })
    .filter(x => x);

  return newData;
};

export { generateSalesOrder };
