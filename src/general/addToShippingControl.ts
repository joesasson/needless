import { Order, customerProfiles } from '../Amodels'
import { SalesOrderExtractor } from './extractSalesOrder'
import { getSheetData } from '../utils';
function addToShippingControl(){
  // parse order per customer
  const { ss, sheetData } = getSheetData()
  let wrapper = new SalesOrderExtractor(sheetData)
  let order = new Order(wrapper)
  const link = ss.getUrl()
  order.summarize(link)
  // post to airtable
  const res = postToAirTable(order.summary)
  var htmlOutput = HtmlService
    .createHtmlOutput(`<p>PO# ${order.metadata.masterPo} Posted to Shipping Control</p> <br/> <a target="_blank" href="https://airtable.com/tblXmtktzGleEXMxl/viwDmP3VLAcqefour?blocks=hide">View in Airtable</a>`)
    .setWidth(250)
    .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, "Added to Shipping Control")
}

function postToAirTable(orderSummary){
  let { customerName, po, poLink, shipDate, 
   cancelDate, totalPairs, value, styles, category } = orderSummary
  let payload = {
    fields: {
      "PO#": String(po),
      "PO Link": poLink,
      "Customer": [customerProfiles[customerName].id],
      "Ship Date": shipDate,
      "Cancel Date": cancelDate,
      "Pairs": totalPairs,
      "Order Value": value,
      "Category": category,
      "Next Step": "Import Sales Order",
      "Styles": styles
    },
    typecast: true
  }
  Logger.log(makeAirtableRequests(AIRTABLE_ENDPOINT, payload))
}


const makeAirtableRequests = (endpoint, payload) => {
  const key = AIRTABLE_KEY
  let options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': { Authorization: `Bearer ${key}` },
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  }
   // Make requests
  let preview = UrlFetchApp.getRequest(endpoint, options)
  Logger.log({preview})
  let res = UrlFetchApp.fetch(endpoint, options)
  return res
}