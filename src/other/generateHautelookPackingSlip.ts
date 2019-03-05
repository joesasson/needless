import { getSheetData, createNewSheetWithData } from "../utils";

function generateHautelookPackingSlip(){
  // get sheet info
  let { sheetData, ss } = getSheetData()
  let wrapped = new SheetData(sheetData)
  let {
    vpn, vpnDescription, color,
    ttlUnits, size1
  } = wrapped.reduceHeaders()
  // I want to keep the meta data / headers, then just bring in the tabular data
  let newHeader = ["VPN #", "VPN Description", "Size", "Qty Ordered", "Qty Ship", "CRTNS", "Backorder"]
  let newData = wrapped.data.map((row, i) => {
    let headerRow = 26
    if(i < headerRow){
      return row.slice(0, newHeader.length)
    }
    if(i === headerRow){
      // header
      return newHeader
    }
    return [
      row[vpn],
      `${row[vpnDescription]} ${row[color]}`,
      row[size1],
      row[ttlUnits],
      row[ttlUnits],
      '',
      row[ttlUnits] ? `=E${i + 1}-F${i + 1}` : ""
    ]

  })
  // extract columns
  
  // I'm going to have to deal with length issues
  createNewSheetWithData(ss, newData, "Packing Slip")
}

const getColumnIndicesFromSelection = () => {

}

const getHeaderRowFromSelection = () => {

}