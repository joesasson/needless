function removeEmptyColumns(){
  // so I want to get the data into the SheetData object 
  let sheetData = new SheetData(getSheetData())
  // concatenate each column's values
  let smushedColumns = []
  // add an index key for each column index
  // each element represents combined values of values in the column at it's index + 1 
  // ["11111", "tiraginabobalex",  "","aaaaa"]
  sheetData.content.forEach(row => {
    row.forEach((val, colI) => {
      smushedColumns[colI] += val
    })
  })
  // if it's just undefined, add the index to a list
  let emptyIndices = smushedColumns.reduce((prev, column, i) => {
    if(column === "undefined"){
      prev.push(i)
    }
    return prev
  }, [])
  // map through the whole data and compose with indexes that are not on that list 
  let newData = sheetData.data.map(row =>
    row.filter((cell, i) => 
    emptyIndices.indexOf(i) === -1)
  )
  let ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/10ovW3AM7slqVe-brCvxJznO5w_q4h2tAI9zozHTkSXQ/edit');
  createNewSheetWithData(ss, newData, "Trimmed")
}