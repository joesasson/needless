import { SalesOrderExtractor } from './extractSalesOrder'
import { getSheetData, lookupBarcode, getPaddedSku, createNewSheetWithData } from '../utils'

function generatePicklist() {
  const { ss, sheetData } = getSheetData();

  const wrapped = new PicklistGenerator(sheetData);
  // von maur uses buyerStoreNo as header for store
  const customer = wrapped.detectCustomer()
  // Source Transformations
  let stores = wrapped.getUniqueStores();
  let newData
  if(stores.length > 1){
    newData = generateMultistorePicklist(wrapped, customer, stores)
  } else {
    newData = generateSimplePicklist(wrapped)
  }

  let newSheet = createNewSheetWithData(ss, newData,  `${customer} - Picklist`);
  newSheet.getDataRange().applyRowBanding()
  newSheet.autoResizeColumns(1, 3)
}

// Target
function generateMultistorePicklist(wrapped, customer, stores){
    // let metadata = [['Customer'], ['PO #'], ['Start Ship Date'], ["Cancel Date"]]
  // map sku@store - qty pairs
  let qtys = collectQtys(wrapped, customer);

  // set up columns
  let doneSkus = [];
  let cachedSkus = {}
  // loop through rows and set sku in first column and qty based on sku + column name
  let newData = wrapped.data
    .map((row, i) => {
      if (i === 0) {
        // header row
        return ["sku", ...stores];
      }
      let style = ''
      let size = ''
      let sku = ''
      let indices = wrapped.reduceHeaders()
      // variables for nordstrom rack
      if(customer === 'Nordstrom Rack'){
        const { vendorStyle, vendorSizeDescription } = wrapped.reduceHeaders();
        style = row[vendorStyle];
        size = row[vendorSizeDescription];
        sku = `${style}_${size}`; 
      } else if(customer === 'Von Maur'){
        const upcI = indices.productCode
        const upc = row[upcI]
        if(cachedSkus[upc]){
          sku = cachedSkus[upc]
        } else {
          sku = lookupBarcode(upc)
          cachedSkus[upc] = sku
        }
      }
      // variables for von maur
      if (doneSkus.indexOf(sku) > -1) {
        return null;
      }
      doneSkus.push(sku);
      const storeQtys = stores.map(store => qtys[`${sku}@${store}`] || "");
      return [sku, ...storeQtys];
    })
    .filter(row => row)
  // sort by padded sku
  let [headers, ...content] = newData
  content.sort((a, b) => {
    if(a[0] === 'sku') return 0
    // get both skus, pad them and do a numerical compare
    return getPaddedSku(a[0]).localeCompare(getPaddedSku(b[0]), 'en', { numeric: true })
  })
  newData = [headers, ...content]
  // rows = skus, columns = store #, values = qtys
  // sku        store1 store2 total
  // 14598-b_5  5       3     8
  // 14598-b_9  3       1     4
  return newData
}

function generateSimplePicklist(wrapped){
  // we have metadata in the wrapper
  // we just need to get the line details
  // and add the title
  return wrapped.data.map((row, i) => {
    if(i === 0){
      return ["Sku", "Title", "Qty"]
    }
    let lineDetails = wrapped.getSourceLineDetails(row, i)
    if(!lineDetails){
      return null
    }
    let {
      sku, qty, styleName, color, title
    } = lineDetails

    title = title || `${styleName} - ${color}`
  

    return [
      sku,
      title,
      qty,
    ]
  }).filter(x => x)
}

const collectQtys = (sheetData, customer) => {
  // get headers norstrom rack specific
  if(customer === "Nordstrom Rack"){
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

  } else if(customer === 'Von Maur'){
    const {
      buyerStoreNo: storeI, // store number
      productCode: upcI, // upc
      qtyOrdered // qty
    } = sheetData.reduceHeaders();
    let cachedSkus = {}
    return sheetData.data.reduce((qtys, row, i) => {
      if(i === 0) return qtys
      const store = row[storeI];
      const upc = row[upcI]
      let sku = ''
      if(cachedSkus[upc]){
        sku = cachedSkus[upc]
      } else {
        sku = lookupBarcode(upc)
        cachedSkus[upc] = sku
      }
      const qty = row[qtyOrdered];
      const rowKey = `${sku}@${store}`;
      return { ...qtys, [rowKey]: qty }; // add the key value pair to the object
    }, {});
  } else {
    return new Error("Customer not found")
  }
};

const getUniqueStores = (sheetData, customer) =>
  sheetData.data
    .reduce((stores, row, i) => {
      if (i === 0) return stores;
      let store = ''
      const indices = sheetData.reduceHeaders();

      if(customer === 'Von Maur'){
        store = indices.buyerStoreNo 
      } else if(customer === 'Nordstrom Rack') {
        store = indices.store
      } else {
        store = '0'
      }

      if (stores.indexOf(row[store]) > -1) {
        return stores;
      }
      return [...stores, row[store]];
    }, [])
    .sort((a, b) => a - b);

export class PicklistGenerator extends SalesOrderExtractor{
  constructor(sheetData){
    super(sheetData)
  }

  getUniqueStores(){
    return this.data
      .reduce((stores, row, i) => {
        if (i === 0) return stores;
        let store = ''
        if(this.customer === 'Von Maur'){
          store = this.indices.buyerStoreNo 
        } else if(this.customer === 'Nordstrom Rack') {
          store = this.indices.store
        } else {
          return stores 
        }
  
        if (stores.indexOf(row[store]) > -1) {
          return stores;
        }
        return [...stores, row[store]];
      }, [])
      .sort((a, b) => a - b);
  }

}
    