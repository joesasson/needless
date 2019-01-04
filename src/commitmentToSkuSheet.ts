function commitmentToSkuSheet(){
  let ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1NbnknGTdgOJ-8MjmtKwIE8A-ZsP75nIMgSBwAcOzZn8/edit');
  let sheet = ss.getSheetByName("Stage Details");
  let sheetData = sheet.getDataRange().getValues();

  // extract all the columns that are readily available from the commitment plan
  let newData = new SheetData(sheetData)
  // remove duplicates
  // extracted column indices
  const {
    color: colorI,
    upcEanGtin: upcI,
    modelNumber: style,
    sizeName: size,
    modelName // same as styleName
  } = newData.headerMap

  newData.removeDuplicatesByUpc()

  // transformations
  const makeSku = (row: []) => `${row[style]}_${row[size]}`.replace(" M US", "")
  const extractStyleName = (row: [], i) => {
    let styleName = row[modelName].split(" Brazil ")[1]
    let formulaString = `=REPLACE("${styleName}", FIND(P${i + 1}, "${styleName}"), LEN(P${i + 1}), "")`
    return formulaString 
  }
  // const extractCategory = (row: []) => row[modelName].split(" " + extractStyleName(row) + " ")[1]
  const makeSalesDescription = (row: []) => `${row[colorI]} ${extractCategory(row)}`
  const makePaddedSku = (row: []) => {

    const styleVal = row[style]
    const sizeVal = cleanSize(row[size])
    const paddedSize = sizeVal < 10 ? 0 + sizeVal : sizeVal
    return `${styleVal}_${paddedSize}`
  }

  // static values
  const account = "SALES"
  const tax = "Non"

  newData = newData.data.map((row, i) => {
    if(i === 0){
      return [
        "sku",
        "Color",
        "UPC",
        "Cost",
        "Retail",
        "Wholesale",
        "MPN",
        "Account",
        "COGS Account",
        "Inventory Asset",
        "Style Name",
        "Sales Description",
        "Tax",
        "Purchase Description",
        "Padded Skus",
        "Category"
      ]
    }
    const sku = makeSku(row)
    const color = capitalize(row[colorI])
    const upc = row[upcI]
    // const category = extractCategory(row)
    // 3 blank columns Cost, Retail, Wholesale
    // mpn == sku
    // account is constant
    const styleName = extractStyleName(row, i)
    // salesDescription is color + category
    const salesDescription = `=B${i + 1} & " " & P${i + 1}`
    // tax is constant
    // purchase description is manual
    const size = sku.split("_")[1]
    const purchaseDescription = size === "5" ? "here" : ""
    const paddedSku = makePaddedSku(row)

    return [
      sku, 
      color, 
      upc,
      "",
      "",
      "",
      sku,
      account,
      "Cost of Goods Sold",
      "Inventory Asset",
      styleName,
      salesDescription,
      tax,
      purchaseDescription,
      paddedSku,
      ""
    ]
  })

  
  // sort by alphanumeric

  createNewSheetWithData(ss, newData, "Sku Worksheet")

}



