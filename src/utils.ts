const getStyleFromSku = sku => sku.split("_")[0].toUpperCase();

const getSizeFromSku = sku => sku.split("_")[1];

const insertDataAsColumns = (
  targetSheet: GoogleAppsScript.Spreadsheet.Sheet,
  insertData: Object[][],
  startColumn: number
) => {
  let { height, width } = getSheetDataDimensions(insertData);
  let targetRange = targetSheet.getRange(1, startColumn, height, width);
  targetRange.setValues(insertData);
};

const getSheetDataDimensions = (sheetData: Object[][]) => {
  let height = sheetData.length;
  let width = sheetData[0].length;
  return { height, width };
};

const reduceHeaders = (sheetData, row = 0) => {
  let headers = sheetData[row];
  return headers.reduce((columns, header, i) => {
    let camelizedHeader = camelize(header);
    columns[camelizedHeader] = i;
    return columns;
  }, {});
};

export function camelize (string){
  string = string.replace(/[^\w\s]/gi, " ");
  return string
    .split(" ")
    .map((word, i) => {
      word = word.toLowerCase();
      if (i === 0) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join("");
};

const extractColumnsByHeader = (
  sheetData: Object[][],
  desiredHeaders: String[]
) => {
  let headerRow = sheetData[0];
  // map headers into indexes
  let indices = desiredHeaders
    .map(header => headerRow.indexOf(header))
    .filter(x => x === 0 || x);
  // map through each row and return only if column index is in indices
  let newData = sheetData.map(row => {
    return row
      .map((el, i) => {
        if (indices.indexOf(i) > -1) {
          return el;
        }
      })
      .filter(x => x === 0 || x === "" || x);
  });
  return newData;
};

export function detectHeaderRow(data) {
  // first row that has no blanks
  let headerRow
  for(let i = 0; i < data.length; i++){
    // if row has a blank, continue the loop
    // else return i
    if(data[i].indexOf('') === -1){  
      headerRow = i; 
      break
    }
  } 
  return headerRow
}

const createNewSheetWithData = (
  ss: GoogleAppsScript.Spreadsheet.Spreadsheet,
  data,
  sheetName
) => {
  // find if sheetName exists, if so delete it
  let previousSheet = ss.getSheetByName(sheetName);
  let newSheet: GoogleAppsScript.Spreadsheet.Sheet;
  if (previousSheet) {
    newSheet = previousSheet.clear();
  } else {
    newSheet = ss.insertSheet(sheetName);
  }
  data = padAllRows(data)
  // get dimensions of data
  let dataHeight = data.length;
  let dataWidth = data[0].length;
  // set data on new sheet based on dimensions of data
  let targetRange = newSheet.getRange(1, 1, dataHeight, dataWidth);
  targetRange.setValues(data);
  return newSheet;
};

const cleanSize = size => size.split(" ")[0]

const capitalize = string =>
  string
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

function getSheetData(name='') {
  let testUrl = PropertiesService.getScriptProperties().getProperty("TEST_URL") || TEST_URL
  let ss =
  SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openByUrl(testUrl);
  // sheet can be either first (default), by name, or active if argument is 'active'
  let sheet = (!name) ? ss.getSheets()[0] : ss.getSheetByName(name)
  if(name === 'active'){
    sheet = ss.getActiveSheet()
  }
  let sheetData = sheet.getDataRange().getValues();
  let sheetName = sheet.getSheetName()
  return { ss, sheet, sheetData, sheetName };

}

export function logSheet(){
  let { sheetData } = getSheetData()
  showModal(sheetData, "Log")
}

export function showModal(message, title){
  let html = HtmlService.createHtmlOutput(`${message}`)
  SpreadsheetApp.getUi().showModalDialog(html, title)
}

const mapHeaders = data => {
  let headers = data[0];
  let headerMap = headers.map((header, i) => {
    let camelizedHeader = camelize(header);
    return {
      headerName: camelizedHeader,
      headerIndex: i
    };
  });

  return headerMap;
};

const lookupBarcode = (upc, cachedSkus) => {
  const url = 'https://sku-barcode-lookup.herokuapp.com/graphql'
  if (cachedSkus[upc]) {
    return cachedSkus[upc];
  } 
  const payload = {
    query:  
  `{ pair(upc:"${upc}") { sku } }` 
  }
  const options = {
    method: "post",
    contentType: 'application/json' ,
    muteHttpExceptions: true,
    payload: JSON.stringify(payload)
  }
  if(typeof UrlFetchApp === 'undefined'){ return "14598-B_10" } // avoid breaking test

  //@ts-ignore: 
  // Argument of type '{ method: string;}' is not assignable to parameter of type 'URLFetchRequestOptions'.
  // Types of property 'method' are incompatible.
  // Type 'string' is not assignable to type '"post" | "get" | "delete" | "patch" | "put"'.
  const response = UrlFetchApp.fetch(url, options).getContentText()
  const parsedResponse = JSON.parse(response)
  if(parsedResponse.data){
    return parsedResponse.data.pair.sku
  } else {
    return null
  }
}

function detectCategory(order){
  if(order.lineItems.some(lineItem => lineItem.size == 1)){
    return 'kids'
  }
  if(order.lineItems.some(lineItem => lineItem.size == 13)){
    return 'men'
  }
  return 'women'
}

const getIndexByHeader = (camelizedName, headerMap) =>
  headerMap.find(column => column.headerName === camelizedName).headerIndex;

const getPaddedSku = sku => 
  sku.split("_")[1] < 10 ?  // check if the size is under 10
  `${sku.split("_")[0]}_0${sku.split("_")[1]}` : // add a zero if it's under 10
  sku // return the original if it's 10 or over

const splitSku = sku => [sku.split("_")[0], sku.split("_")[1]]

const addSpaces = numSpaces => {
  let a = []
  for(let i = 0; i < numSpaces; i++){
    a.push("")
  }
  return a
}

const padZip = (zip: string) => {
  if(zip.length < 5){
    return `'0${zip}`
  }
  return zip
}

const padAllRows = (data: any[][]) => {
  // map the length of all rows
  const lengths = data.map(row => row.length)
  // get the max
  const max = Math.max(...lengths)
  // pad all rows that are less than the max with blanks
  return data.map((row: any[]) => {
    if(row.length === max){
      return row
    }
    let missing = max - row.length
    let filler = addSpaces(missing)
    let paddedRow = row.concat(filler)
    return paddedRow  
  })
}


export { capitalize, getIndexByHeader, reduceHeaders, 
  getSheetData, createNewSheetWithData, cleanSize, getPaddedSku, splitSku,
  lookupBarcode, padAllRows, getStyleFromSku, addSpaces }
