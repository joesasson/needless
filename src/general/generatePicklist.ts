function generatePicklist() {
  const { ss, sheetData } = getSheetData();
  const wrapped = new SheetData(sheetData);
  // von maur uses buyerStoreNo as header for store
  const customer = wrapped.detectCustomer()
  // Source Transformations

  // Target

  // let metadata = [['Customer'], ['PO #'], ['Start Ship Date'], ["Cancel Date"]]
  // map sku@store - qty pairs
  let qtys = collectQtys(wrapped, customer);

  // set up columns
  let stores = getUniqueStores(wrapped, customer);
  let doneSkus = [];
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
        sku = lookupBarcode(upc)
      }
      // variables for von maur
      if (doneSkus.indexOf(sku) > -1) {
        return null;
      }
      doneSkus.push(sku);
      const storeQtys = stores.map(store => qtys[`${sku}@${store}`] || "");
      return [sku, ...storeQtys];
    })
    .filter(row => row);
  // rows = skus, columns = store #, values = qtys
  // sku        store1 store2 total
  // 14598-b_5  5       3     8
  // 14598-b_9  3       1     4
  createNewSheetWithData(ss, newData, "Nordstrom Rack - Picklist");
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
    return sheetData.data.reduce((qtys, row, i) => {
      if(i === 0) return qtys
      const store = row[storeI];
      const upc = row[upcI]
      const sku = lookupBarcode(upc)
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
      }

      if (stores.indexOf(row[store]) > -1) {
        return stores;
      }
      return [...stores, row[store]];
    }, [])
    .sort((a, b) => a - b);
