import { getSheetData } from "../utils";
import { SheetData } from '../Needless'

function goldDigger(){
  
  // open sidebar
  let html = HtmlService.createTemplateFromFile('src/other/gold-digger')
  .evaluate()
  .setTitle("Gold Digger")
  SpreadsheetApp.getUi().showSidebar(html)
}

function getHeaders(){
  let { ss, sheet, sheetData } = getSheetData()
  let wrapped = new SheetData(sheetData)
  return wrapped.headers
}