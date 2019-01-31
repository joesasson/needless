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

const camelize = string => {
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
  // get dimensions of data
  let dataHeight = data.length;
  let dataWidth = data[0].length;
  // set data on new sheet based on dimensions of data
  let targetRange = newSheet.getRange(1, 1, dataHeight, dataWidth);
  targetRange.setValues(data);
  return newSheet;
};

const cleanSize = size => size.replace(" M US", "");

const capitalize = string =>
  string
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

function getSheetData() {
  let testUrl = TEST_URL;
  let ss =
    SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openByUrl(testUrl);
  let sheet = ss.getSheets()[0];
  let sheetData = sheet.getDataRange().getValues();
  return { ss, sheet, sheetData };
}

export const mapHeaders = data => {
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

const getIndexByHeader = (camelizedName, headerMap) =>
  headerMap.find(column => column.headerName === camelizedName).headerIndex;

export { capitalize, camelize, getIndexByHeader, reduceHeaders };
