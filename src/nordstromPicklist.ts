function nordstromPicklist(){
  // extract columns for po_number, line_item_sku, line_item_title (maybe get the title from somewhere potentially), and line_item_quantity
  let { ss, sheetData } = getSheetData()
  let wrapped = new SheetData(sheetData)
  let {
    po_number: poI,
    line_item_sku: skuI,
    line_item_title: titleI,
    line_item_quantity: qtyI
  } = wrapped.reduceHeaders()
  // write a function that will extract the columns by index
  // takes in a list of indices, and sheet data and returns a new data with only the extracted columns
  let indices = [poI, skuI, titleI, qtyI]
  let extracted = wrapped.extractColumnsByIndex(indices)
  extracted = extracted.map((row, i) => {
    if(i === 0){
      return [...row, "in stock"]
    }
    return [...row, ""]
  })
  createNewSheetWithData(ss, extracted, "Nordstrom Dropship Picklist")
}