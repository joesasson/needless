function commitmentToSkuSheet(){
  let ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1NbnknGTdgOJ-8MjmtKwIE8A-ZsP75nIMgSBwAcOzZn8/edit');
  let sheet = ss.getSheets()[1];
  let sheetData = sheet.getDataRange().getValues();

  // extract all the columns that are readily available from the commitment plan
  let newData = new CommitmentPlanData(sheetData)
  // extracted column indices
  let {
    color: colorI,
    upcEanGtin: upcI,
    modelNumber: style,
    sizeName: size,
    modelName // same as styleName
  } = newData.headerMap

  // transformations
  const makeSku = (row: []) => `${row[style]}_${row[size]}`.replace(" M US", "")
  const extractStyleName = (row: []) => row[modelName].split(" Brazil ")[1]
  const extractCategory = (row: []) => row[modelName].split(" " + extractStyleName(row) + " ")[1]
  const makeSalesDescription = (row: []) => `${row[colorI]} ${extractCategory(row)}`

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
        "Ratail",
        "Wholesale",
        "MPN",
        "Account",
        "Style Name",
        "Sales Description",
        "Tax",
        "Purchase Description"
      ]
    }
    const sku = makeSku(row)
    const color = row[colorI]
    const upc = row[upcI]
    const category = extractCategory(row)
    // 3 blank columns Cost, Retail, Wholesale
    // mpn == sku
    // account is constant
    const styleName = extractStyleName(row)
    // salesDEscription is color + category
    const salesDescription = `${color} ${category}`
    // tax is constant
    // purchase description is manual
    const size = sku.split("_")[1]
    const purchaseDescription = size === "5" ? "here" : ""
    // const paddedSku = makePaddedSku()

    return [
      sku, 
      color, 
      upc,
      "",
      "",
      "",
      sku,
      account,
      styleName,
      salesDescription,
      tax,
      ""
    ]
  })

  // remove duplicates
  // sort by alphanumeric

  createNewSheetWithData(ss, newData, "Sku Worksheet")

}