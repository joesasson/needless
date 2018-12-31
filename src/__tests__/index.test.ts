import { 
  getIndexByHeader,
  mapHeaders, 
  reduceHeaders, 
  camelize 
} from '../utils';

describe('camelize', () => {
  test('turns a regular string into camelCase', () => {
    let testString = "a bunch of words";
    let camelized = camelize(testString);
    let expected = "aBunchOfWords";
    expect(camelized).toBe(expected);
  });

  test('works with numbers', () => {
    let testString = "2 bunches of words and 3 numbers";
    let camelized = camelize(testString);
    let expected = "2BunchesOfWordsAnd3Numbers" ;
    expect(camelized).toBe(expected);
  });

  test('strips out special characters (excluding underscore)' , () => {
    let testString = "UPC/EAN/GTIN";
    let camelized = camelize(testString);
    let expected = "upcEanGtin" ;
    expect(camelized).toBe(expected);
  })
});

describe('reduceHeaders', () => {
  test("returns a sheet's headers as an object with camelized names as keys and indices as values", () => {
    let sheetData = [['header one', 'header 2', 'a very long header three', 'item inventory', 'quantity ordered']];
    let headerMap = reduceHeaders(sheetData);
    expect(headerMap).toHaveProperty('header2');
    expect(headerMap).toHaveProperty(["itemInventory"], 3);
  });
})

describe('mapHeaders', () => {
  test("returns an array of objects that contain properties for headerName and index", () => {
    let sheetData = [['header one', 'header 2', 'a very long header three', 'item inventory', 'quantity ordered']];
    let headerMap = mapHeaders(sheetData);
    expect(headerMap.length).toBe(sheetData[0].length);
    expect(headerMap[0]).toHaveProperty('headerName');
    expect(headerMap[3]).toHaveProperty('headerIndex');
    expect(headerMap[4]).toHaveProperty(['headerIndex'], 4)
  });
});

describe("getIndexByHeader", () => {
  test("returns the index of a camelized column name", () => {
    let sheetData = [['header one', 'header 2', 'a very long header three', 'item inventory', 'quantity ordered']];
    let headerMap = mapHeaders(sheetData);
    let firstIndex = getIndexByHeader("headerOne", headerMap)
    let itemIndex = getIndexByHeader('itemInventory', headerMap)
    expect(firstIndex).toBe(0)
    expect(itemIndex).toBe(3)
  })
})


describe