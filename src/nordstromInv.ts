import { reduceHeaders } from "./utils";

function nordstromInv() {
  // remove the rows that have no stock in the in stock column
  // combine the first and last name columns into a new column with the title "name"
  const { ss, sheetData } = getSheetData()
  createNewSheetWithData(ss, [['']], "Tracking")
  const wrapped = new SheetData(sheetData)
  const { retailer_create_date, po_number, ship_first_name, ship_last_name, ship_address_1, ship_address_2
  ship_city, ship_region, ship_postal, ship_country, ship_method, line_item_sku, line_item_expected_cost
  line_item_quantity, in_stock, ship_phone, dsco_order_id } = wrapped.reduceHeaders()

  let invData = wrapped.data.map((row, i) => {
    // transforms/ headers only
      // name
      // skus that are mismatched
    const name = i > 0 ? `${row[ship_first_name]} ${row[ship_last_name]}`.replace("  ", " ") : "name"
    const sku = row[line_item_sku].replace("50567-CHR", "50567-CHRN")
    // formulas
    const rowNumber = i + 1 // to offset 0 index in formulas
    const nextRowNumber = rowNumber + 1
    const previousRowNumber = i
    const trackingFormula = `=INDEX(Tracking!E:E, MATCH(C${rowNumber}, Tracking!AN:AN, 0))`
    const invoiceFormula = `=IF(B${rowNumber}=B${previousRowNumber},O${previousRowNumber}, O${previousRowNumber}+1)`

    if(i === 0){
      const tracking = "Tracking"
      const invoice = "Invoice" 
    } else {
      const tracking = trackingFormula
      const invoice = i === 1 ? "Enter first invoice number here" : invoiceFormula
    }

    return [
      row[retailer_create_date],
      row[po_number],
      name,
      row[ship_address_1],
      row[ship_address_2],
      row[ship_city], 
      row[ship_region],
      row[ship_postal],
      row[ship_method],
      row[line_item_expected_cost],
      sku,
      row[line_item_quantity],
      row[dsco_order_id],
      tracking,
      invoice
    ]
  })

  // Summarize item quantities, then calculate weight
  let shipData = summarizeQtys(wrapped, po_number, line_item_quantity)

  
  shipData = shipData.map(row => {
    // constants
    let packagingType = "2" // "other" per ups - https://www.ups.com/us/en/shipping/create/shipping/create/batch-file.page # packaging type codes
    // extracts
    // transforms
      // name - combine first and last names
      // weight - summarize multilines
      // method - convert to code
    // filters
      // multilines - if a po is the same as previous line, remove it
    let name = `${row[ship_first_name]} ${row[ship_last_name]}`.replace("  ", " ")
    let weight = calculateWeight(row[line_item_quantity])
    let shipMethod = row[ship_method] === "2nd Day Air" ? "2" : "3" // if method is not 2nd day air, assume it's ground
    let phone = row[ship_phone] === 0 ? '' : row[ship_phone]
    return [
      " ", // empty space for company
      name,
      row[ship_country],
      row[ship_address_1],
      row[ship_address_2],
      "",
      row[ship_city],
      row[ship_region],
      row[ship_postal],
      phone,
      ...addSpaces(3),
      packagingType,
      "",
      weight,
      ...addSpaces(8),
      shipMethod, // row 25
      ...addSpaces(7),
      row[po_number]
    ]
  })
  
  // create a new sheet
  createNewSheetWithData(ss, invData, "Invoice Import")
  createNewSheetWithData(ss, shipData, "ups")
}

const addSpaces = numSpaces => {
  let a = []
  for(let i = 0; i < numSpaces; i++){
    a.push("")
  }
  return a
}

const calculateWeight = qty => Math.ceil(qty * 1.2 + 1)

const summarizeQtys = (shipData: SheetData, poIndex: Number, qtyIndex: Number) => {
  const qtyMap = mapQtys(shipData)
  // remove all rows with duplicate po#
  let filtered = filterByUniqueColumn(shipData.content, poIndex)
  // set qty based on qtyMap
  let newData = setQtys(filtered, qtyMap, poIndex, qtyIndex)
  return filtered
}

const setQtys = (data, qtyMap, poIndex, qtyIndex) => {
  return data.map(row => {
    const po = row[poIndex]
    const newQty = qtyMap[po]
    // set the row's quantity index to the new qty and return the row
    if(po == "78020677"){ Logger.log({before: row[qtyIndex]}) }
    row[qtyIndex] = newQty
    if(po == "78020677"){ Logger.log({ after: row[qtyIndex] }) }
    return row
  })
}  

const mapQtys = sheetData => {
  let { po_number, line_item_quantity } = sheetData.reduceHeaders()
  let qtyMap = {}
  sheetData.content.forEach((row, i) => {
    let po = row[po_number]
    let qty = Number(row[line_item_quantity])
    if(qtyMap[po]){
      qtyMap[po] += qty
    } else {
      qtyMap[po] = qty
    }
  })
  return qtyMap
}

const filterByUniqueColumn = (data: [][], columnIndex) => {
  let vals = []
  return data.filter((row, i, self) => {
    const rowVal = row[columnIndex]
    if(vals.indexOf(rowVal) > -1){
      return false
    } else {
      vals.push(rowVal)
      return true
    }
  })
}