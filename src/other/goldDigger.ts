import { getSheetData, createNewSheetWithData } from "../utils";
import { SheetData, Extractor } from '../Needless'

function goldDigger(){ 
  // open sidebar
  let html = HtmlService.createTemplateFromFile('src/other/gold-digger')
  .evaluate()
  .setTitle("Gold Digger")
  SpreadsheetApp.getUi().showSidebar(html)

}

function getHeaders(headerRow){
  let { sheetData } = getSheetData('active')
  let wrapped = new Extractor(sheetData, headerRow)
  return wrapped.headers
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function processHeadersForm(formParams){
  let { ss, sheetData } = getSheetData('active')
  let headerRow = formParams.headerRow
  let indices = formParams.headerIndices.map(inputId => Number(inputId.split("-")[1]))
  let wrapped = new Extractor(sheetData, headerRow)
  let extracted = wrapped.extractColumnsByIndex(indices)
  let newSheet = createNewSheetWithData(ss, extracted, `${indices.length} Extracted Columns`)
  return newSheet.getName()
}