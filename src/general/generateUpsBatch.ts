import { getSheetData, addSpaces, createNewSheetWithData, padAllRows } from '../utils'
import { SalesOrderExtractor } from './extractSalesOrder'
function generateUpsBatch(){
  // I want to map it, but condense multiple line orders
  // this is only for bloomingdales now
  // but I should eventually include other customers as well
  let totalWeight = 3
  const { ss, sheetData } = getSheetData()
	createNewSheetWithData(ss, [[]], "Tracking")
  let extractor = new SalesOrderExtractor(sheetData)
  let newData = extractor.content.map((row, i, self) => {
    const firstCol = " "
    const fullName = row[extractor.indices.partyName]
    const country = "US"
    const shipTo1 = row[extractor.indices.partyAddress1]
    const shipTo2 = row[extractor.indices.partyAddress2] || ""
    const city = row[extractor.indices.partyCity]
    const state = row[extractor.indices.partyState]
    const zip = row[extractor.indices.partyZipcode]
    const phone = row[extractor.indices.contactTel]
    let orderWeight
    const po = row[extractor.indices.po]
    // if we're on the last line return undefined, otherwise po at next index
    const nextPo = self.length === (i + 1) ? undefined : self[i + 1][extractor.indices.po]
    const qty = row[extractor.indices.qty]
    const packagingType = 2
    const serviceCode = 3
    if(nextPo && po === nextPo){
      // if we're at a multiline order
      // but not at the bottom line
      // we'll add a pound for each piece in the order
      // to the total weight
      // and return null, because we don't want this line in the batch
      totalWeight += qty
      return null
    }
    // if we are not in a multiline order, or we're at the bottom
    // we'll set the orderWeight to the totalWeight
    // which will either be 3 if there were no lines in between
    // or 3 + the qtys in the multiline order
    // Then we'll reset the total weight to 3
    orderWeight = totalWeight
    totalWeight = 3
  
    // 
    return [
      firstCol,
      fullName,
      country,
      shipTo1,
      shipTo2,
      "",
      city,
      state,
      zip,
      phone,
      ...addSpaces(3),
      packagingType,
      "",
      orderWeight,
      ...addSpaces(8),
      serviceCode,
      ...addSpaces(7),
      po
    ]
  }).filter(x => x)

  createNewSheetWithData(ss, padAllRows(newData), "ups")
  createNewSheetWithData(ss, [[]], "Tracking")
}
