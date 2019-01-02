function nordstromInv() {
  // remove the rows that have no stock in the in stock column
  // combine the first and last name columns into a new column with the title "name"
  // headers that I need
  const { ss, sheetData } = getSheetData()
  const wrapped = new SheetData(sheetData)
  const { retailer_create_date, po_number, first_name, last_name, ship_address_1, ship_address_2
  ship_city, ship_region, ship_postal, ship_method, line_item_sku, line_item_expected_cost
  line_item_quantity, in_stock } = wrapped.reduceHeaders()
  
  // columns for invoice import:

  // transforms
    // name
  // extracts
  let newData = wrapped.data.map(row => {
    return [
      
    ]
  })
}
