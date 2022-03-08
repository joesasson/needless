import { SalesOrderExtractor } from "./extractSalesOrder";
import { getSheetData, lookupBarcode, getPaddedSku, createNewSheetWithData, padAllRows, reduceHeaders } from "../utils";
import { Order } from '../Amodels'

function generatePicklist() {
  const { ss, sheetData } = getSheetData();

  let newData;

  const wrapped = new PicklistGenerator(sheetData);

  const customer = wrapped.detectCustomer();

  // Source Transformations
  let stores = wrapped.getUniqueStores();
  if (stores.length > 1) {
    newData = generateMultistorePicklist(wrapped, customer, stores);
  } else {
    newData = generateSimplePicklist(wrapped);
    // let total = wrapped.getTotalQty(newData);
    // newData[7][1] = total;
  }

  let newSheet = createNewSheetWithData(ss, newData, `${customer} - Picklist`);
  newSheet.getDataRange().applyRowBanding();
  newSheet.autoResizeColumns(1, 3);
}

// Target
function generateMultistorePicklist(wrapped, customer, stores) {
  // let metadata = [['Customer'], ['PO #'], ['Start Ship Date'], ["Cancel Date"]]
  // map sku@store - qty pairs
  let qtys = collectQtys(wrapped, customer);

  // set up columns
  let doneSkus = [];
  let cachedSkus = {};
  // loop through rows and set sku in first column and qty based on sku + column name
  let newData = wrapped.data
    .map((row, i) => {
      if (i === 0) {
        // header row
        return ["Sku", "Upc", ...stores];
      }
      let style = "";
      let size = "";
      let sku = "";
      let upc = "";
      let indices = wrapped.reduceHeaders();
      // variables for nordstrom rack
      if (customer === "Nordstrom Rack") {
        const { vendorStyle, vendorSizeDescription } = wrapped.reduceHeaders();
        style = row[vendorStyle];
        size = row[vendorSizeDescription];
        upc = row[indices.productId];
        sku = `${style}_${size}`;
      } else if (customer === "Von Maur") {
        const upcI = indices.productCode;
        upc = row[upcI];
        sku = lookupBarcode(upc, cachedSkus) 
      } else if(customer === 'Bloomingdales Outlet'){
        const { productCode } = wrapped.reduceHeaders()
        upc = row[productCode]
        sku = lookupBarcode(upc, cachedSkus)
      }
      // variables for von maur
      if (doneSkus.indexOf(sku) > -1) {
        return null;
      }
      doneSkus.push(sku);
      const storeQtys = stores.map(store => qtys[`${sku}@${store}`] || "");
      return [sku, upc, ...storeQtys];
    })
    .filter(row => row);
  // sort by upc
  let [headers, ...content] = newData;
  content.sort((a, b) => {
    if (a[0] === "sku") return 0;
    // get both skus, pad them and do a numerical compare
    return getPaddedSku(a[0]).localeCompare(getPaddedSku(b[0]), "en", {
      numeric: true
    });
  });
  newData = [headers, ...content];
  // rows = skus, columns = store #, values = qtys
  // sku        store1 store2 total
  // 14598-b_5  5       2     7
  // 14598-b_9  3       6     9
  // total      8       8
  // const formulaArray = Array.apply(null, Array(stores.length)).map((x, i) => {
  //   const column = i + 3
  //   return `=SUM(C2:C${newData.length})`
  // })

  // const totalRow = ["Store Totals", "", ...formulaArray]
  // newData.push(totalRow)
  return newData;
}

function generateSimplePicklist(wrapped) {
  let order = new Order(wrapped);
  let { customer } = order
  let metadata = wrapped.addMetaDetails();
  
  if (customer.name === "BLOOMINGDALES" || customer.name == "Macy's") {
    let selectedFields = ["po", "sku", "upc", "qty"];
    let addedFields = ["In Stock"];
    let headers = [...selectedFields, ...addedFields];
    let picklist = order.lineItems.map((row, i) =>{
      return selectedFields.map(field => row[field])
    }
      
    );
    picklist = [headers, ...picklist];
    return picklist
  }
  // we have metadata in the wrapper
  // we just need to get the line details
  // and add the title

  let tabularData = wrapped.data
    .map((row, i) => {
      if (i === 0) {
        return ["Sku", "Title", "Qty", "In QB", "Boxes"];
      }
      let lineDetails = wrapped.getSourceLineDetails(row, i);
      if (!lineDetails) {
        return null;
      }
      let { sku, qty, styleName, color, title } = lineDetails;

      title = title || `${styleName} - ${color}`;
      let currentRow = i - wrapped.headerRow + metadata.length;
      const inQbFormula = currentRow === 13 ? `=countif(IMPORTRANGE("${QB_REF_SHEET}", "items!D:D"), A${currentRow}) >0` : ''

      return [sku, title, qty, inQbFormula];
    })
    .filter(x => x);
  return padAllRows(metadata.concat(tabularData));
}

const collectQtys = (sheetData, customer) => {
  // get headers norstrom rack specific
  if (customer === "Nordstrom Rack") {
    const {
      store: storeI, // store number
      vendorStyle, // style
      vendorSizeDescription, // size
      orderedQty // qty
    } = sheetData.reduceHeaders();
    return sheetData.data.reduce((qtys, row) => {
      const store = row[storeI];
      const sku = `${row[vendorStyle]}_${row[vendorSizeDescription]}`;
      const qty = row[orderedQty];
      const rowKey = `${sku}@${store}`;
      return { ...qtys, [rowKey]: qty };
    }, {});
  } else if (customer === "Von Maur") {
    const {
      buyerStoreNo: storeI, // store number
      productCode: upcI, // upc
      qtyOrdered, // qty
    } = sheetData.reduceHeaders();
    let cachedSkus = {};
    return sheetData.data.reduce((qtys, row, i) => {
      if (i === 0) return qtys;
      const store = row[storeI];
      const upc = row[upcI];
      let sku = lookupBarcode(upc, cachedSkus) 
      const qty = row[qtyOrdered];
      const rowKey = `${sku}@${store}`;
      return { ...qtys, [rowKey]: qty }; // add the key value pair to the object
    }, {});
  } else if(customer === "Bloomingdales Outlet") {
    const {
      storeNo, 
      productCode,
      qty: qtyI
    } = sheetData.reduceHeaders()
    let cachedSkus = {};
    return sheetData.content.reduce((qtys, row, i) => {
      const store = row[storeNo]
      const upc = row[productCode]
      let sku = lookupBarcode(upc, cachedSkus)
      if(!sku){
        throw("Sku not found")
      }
      const qty = row[qtyI]
      const rowKey = `${sku}@${store}`
      return {...qtys, [rowKey]: qty }
    }, {})
  }
};

export class PicklistGenerator extends SalesOrderExtractor {
  constructor(sheetData) {
    super(sheetData);
  }

  getTotalQty(newData) {
    // sum total qty here
    return newData.reduce((total, row, i) => {
      // skip meta
      let headerRow = 11;
      let qtyColumn = 2;
      if (i < headerRow) return total;
      // add qty to total
      return total + Number(row[qtyColumn]);
    }, 0);
  }

  addMetaDetails() {
    const { masterPo, ship_date, cancel_date } = this.metadata;
    const approveSheet = `=IMPORTRANGE("${QB_REF_SHEET}", "items!A1")`;

    return [
      ["PREPACKED", "", approveSheet],
      ["PO", masterPo],
      ["Customer", this.customer],
      ["Ship Date", ship_date],
      ["Cancel Date", cancel_date],
      ["MJNY PO"],
      ["Ship To"],
      ["Total Pairs"],
      ["Total Boxes"],
      ["Total Pallets"],
      ["Total Weight", "=B8 * 1.2"]
    ];
  }

  getUniqueStores() {
    return this.data
      .reduce((stores, row, i) => {
        if (i === 0) return stores;
        let store = "";
        if (this.customer === "Von Maur") {
          store = this.indices.buyerStoreNo;
        } else if (this.customer === "Nordstrom Rack") {
          store = this.indices.store;
        } else if(this.customer === "Bloomingdales Outlet"){
          store = this.indices.storeNo
        } else {
          return stores;
        }

        if (stores.indexOf(row[store]) > -1) {
          return stores;
        }
        return [...stores, row[store]];
      }, [])
      .sort((a, b) => a - b);
  }
}

// Template Generator
function generateTemplate(template, sourceData) {
  // template is an array of headers, and an array
  // representing the values that the array should hold
  // the values will be keys that will pull from an object
}

// Models for Order Extraction


