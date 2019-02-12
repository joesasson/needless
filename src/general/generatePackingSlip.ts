function generatePackingSlip(){
  let { ss, sheetData } = getSheetData('Stage Details');
  // let skuWorksheet = ss.getSheetByName('Sku Worksheet')
  // let activeSheet = getSheetData('active')
  const wrapped = new SheetData(sheetData);

  // detect customer
  const customer = wrapped.detectCustomer()

  // get a po number from somewhere (or just leave words "Enter PO number here")
  const { color: colorI, modelNumber } = wrapped.reduceHeaders()

  let titleRow = []
  let colorRow = []
  let qtyRow = []

  // object with style and nested sizes with quantities
  // { '14598-b': { '5' : 2, '5.5' : 4 } }
  createNewSheetWithData(ss, newData, "Packing Slip")
}