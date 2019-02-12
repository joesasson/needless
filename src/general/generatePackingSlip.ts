function generatePackingSlip(){
  // let { ss, sheetData } = getSheetData('Stage Details');
  let { ss, sheetData } = getSheetData('active')
  let { sheetData: skuWorksheet } = getSheetData('Sku Worksheet')
  const wrapped = new SheetData(sheetData);
  let newData = []

  // detect customer
  // const customer = wrapped.detectCustomer()

  // get a po number from somewhere (or just leave words "Enter PO number here")
  const { sku, quantity } = wrapped.reduceHeaders()

  // object with style and nested sizes with quantities
  // { '14598-b': { '5' : 2, '5.5' : 4 } }
  let qtys = getQtys(wrapped)
  addStyleDetails(qtys, skuWorksheet)

  newData.push([...addSpaces(6), `PO# ${123}`, ...addSpaces(9)])

  // for each key, create a size breakdown grid
  Object.keys(qtys).forEach(style => {
    // create the size breakdown and push each row
    const stylePrefix = style.split("-")[0]
    // split on hyphen, then join all but the first element
    const color = qtys[style]['color']
    const title = qtys[style]['title']
    let euSizes = generateSizes('eu_women')
    let titleRow = ['', title, ...euSizes, '']
    let usSizes = generateSizes('us_women')
    let colorRow = [style, color, ...usSizes, 'Total']
    let qtyRow = generateQtyRow(qtys, usSizes, style)
    qtyRow = ['', '', ...qtyRow, `=SUM(INDIRECT("C" & ROW() &  ":O" & ROW()))`]
    newData.push(titleRow)
    newData.push(colorRow)
    newData.push(qtyRow)
    newData.push([...addSpaces(16)])
  })

  createNewSheetWithData(ss, newData, "Packing Slip")

  // functions

  function addStyleDetails(qtys: {}, styleData: [][]){
    const { styleName, color: colorI } = reduceHeaders(styleData) 
    Object.keys(qtys).forEach(style => {
      // get the name and color associated with a style
      const rowIndex = getRowIndex(style, styleData)
      qtys[style]['color'] = styleData[rowIndex][colorI]
      qtys[style]['title'] = styleData[rowIndex][styleName]
    })
  }

  function getRowIndex(style, styleData){
    // map all skus into one array without sizes
    // column 0 is sku
    const styles = styleData.map(row => row[0].split("_")[0]) // ['1459-b', 14598-b, 14598-c, etc.]
    return styles.indexOf(style)
  }

  
  function generateQtyRow(qtys, sizes, style){
    return sizes.map(size => qtys[style][size] || '')
  }
  
  function generateSizes(system) {
    let startingSize = 0
    let endingSize = 0
    let skipNextHalf = []
    if(system === 'eu_women'){
      startingSize = 35
      endingSize = 42
      skipNextHalf = [36, 38]
    } else if(system === 'us_women'){
      startingSize = 5
      endingSize = 11
      skipNextHalf = []
    }
    let currentSize = startingSize
    let sizes = []
    while(currentSize <= endingSize){
      sizes.push(currentSize)
      currentSize = skipNextHalf.indexOf(currentSize) > -1 ? currentSize + 1 : currentSize + .5 
    }
    return sizes
  }
 

  function getQtys(sheetData) {
    // sku, size, qty
    const { sku: skuI, quantity } = sheetData.reduceHeaders()
    return sheetData.content.reduce((qtys, row) => {
      // split sku into style and size
      const sku = row[skuI]
      let [style, size] = splitSku(sku)
      let qty = row[quantity]
      // if style is there, add a key for size and value of qty
      if(qtys[style]){
        qtys[style][size] = qty
      } else {
        // if style is not there, add a key for style, a key for size and a value for qty 
        qtys[style] = { [size] : qty }
      }
      return qtys
    }, {})
  }
}

