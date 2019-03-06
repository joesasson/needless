import { getSheetData, createNewSheetWithData } from "../utils";
import { SheetData } from '../Needless'

function goldDigger(){
  
  // open sidebar
  let html = HtmlService.createTemplateFromFile('src/other/gold-digger')
  .evaluate()
  .setTitle("Gold Digger")
  SpreadsheetApp.getUi().showSidebar(html)

}



function getHeaders(){
  let { sheetData } = getSheetData()
  let wrapped = new SheetData(sheetData)
  return wrapped.headers
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function processHeadersForm(formParams){
  let { ss, sheetData } = getSheetData()
  let wrapped = new SheetData(sheetData)
  let indices = formParams.map(inputId => Number(inputId.split("-")[1]))
  let extracted = wrapped.extractColumnsByIndex(indices)
  let newSheet = createNewSheetWithData(ss, extracted, `${indices.length} Extracted Columns`)
  return newSheet.getName()
}