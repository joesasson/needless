function nordstromInv() {
  // remove the rows that have no stock in the in stock column
  // combine the first and last name columns into a new column with the title "name"
  const { ss, sheetData } = getSheetData()
  const wrapped = new SheetData(sheetData)
  const { retailer_create_date, po_number, ship_first_name, ship_last_name, ship_address_1, ship_address_2
  ship_city, ship_region, ship_postal, ship_method, line_item_sku, line_item_expected_cost
  line_item_quantity, in_stock } = wrapped.reduceHeaders()

  let newData = wrapped.data.map((row, i) => {
    // transforms
      // name
    let name = i > 0 ? `${row[ship_first_name]} ${row[ship_last_name]}`.replace("  ", " ") : "name"
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
      row[line_item_sku], 
      row[line_item_quantity], 
    ]
  })

  // create a new sheet
  createNewSheetWithData(ss, newData, "Invoice Import")
}