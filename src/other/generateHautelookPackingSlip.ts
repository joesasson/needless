import { getSheetData, createNewSheetWithData, reduceHeaders, showModal, detectHeaderRow, getStyleFromSku } from "../utils";
import { SheetData } from "../Needless";

function prepareHautelookShipment(){
  generateHautelookPackingSlip()
  generateBoxLabelTemplate()
}

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
      row[ttlUnits] ? `=D${i + 1}-E${i + 1}` : ""
    ]

  })
  // extract columns
  
  createNewSheetWithData(ss, newData, "Packing Slip")
}

function generateBoxLabelTemplate(){
  const { ss, sheet, sheetData } = getSheetData('Nordstromrack.com/Hautelook - Picklist')
  const wrapped = new SheetData(sheetData)

  // I can get meta data manually on top
  // Then map through the whole thing and only return the rows that have something in box
  const headers = ['style', "style_name", "qty", "po", "ship_to", "ship_from"]
  // meta
  const ship_from = "MARC JOSEPH NEW YORK 140 58TH STREET. BROOKLYN, NY 11220"
  const ship_to = wrapped.data[6][1]
  const po = wrapped.data[1][1]
  // details
  const headerRow = detectHeaderRow(sheetData)
  const indices = reduceHeaders(sheetData, headerRow)

  const newData = sheetData.map((row, i) => {
    if(i < headerRow || row[indices.boxes] === ''){
      return
    }
    if(i === headerRow){
      return headers
    }
    const style = getStyleFromSku(row[indices.sku])
    const style_name = row[indices.title]
    const box_qty = row[indices.boxes]
    return [
      style,
      style_name,
      box_qty,
      po,
      ship_to,
      ship_from
    ]
  }).filter(x => x)
  createNewSheetWithData(ss, newData, "Box Labels Template")
}
