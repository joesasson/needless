function generatePicklist(){
  const { ss, sheetData } = getSheetData()
  const wrapped = new SheetData(sheetData)
  // let metadata = [['Customer'], ['PO #'], ['Start Ship Date'], ["Cancel Date"]]
  // map sku@store - qty pairs
  let qtys = collectQtys(newData)
  // set up columns
  let stores = getUniqueStores(wrapped)
  let doneSkus = []
  // loop through rows and set sku in first column and qty based on sku + column name
  let newData = wrapped.data.map((row, i) => {
    if(i === 0){
      // header row
      return ["sku", ...stores]
    } 
    const { vendorStyle, vendorSizeDescription } = wrapped.reduceHeaders()
    const style = row[vendorStyle]
    const size = row[vendorSizeDescription]
    const sku = `${style}_${size}`
    if(doneSkus.indexOf(sku) > -1){
      return null
    }
    doneSkus.push(sku)
    const storeQtys = stores.map(store => qtys[`${sku}@${store}`] || "")
    return [sku, ...storeQtys] 
  }).filter(row => row)
  // rows = skus, columns = store #, values = qtys
  // sku        store1 store2 total
  // 14598-b_5  5       3     8
  // 14598-b_9  3       1     4
  createNewSheetWithData(ss, newData, "Nordstrom Rack - Picklist")
}

const collectQtys = data => {
  // get headers
  const { 
    store : storeI, // store number
    vendorStyle,// style
    vendorSizeDescription,// size
    orderedQty // qty
  } = reduceHeaders(data)
  return data.reduce((qtys, row) => {
    const store = row[storeI]
    const sku = `${row[vendorStyle]}_${row[vendorSizeDescription]}`
    const qty = row[orderedQty]
    const rowKey = `${sku}@${store}`
    return {...qtys, [rowKey]: qty }
  }, {})
}

const getUniqueStores = sheetData => sheetData.data.reduce((stores, row, i) => {
  if(i === 0) return stores
  const { store } = sheetData.reduceHeaders()
  if(stores.indexOf(row[store]) > -1){
    return stores
  }
  return [...stores, row[store]]
}, [])