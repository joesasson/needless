import { getSheetData, addSpaces, createNewSheetWithData, padAllRows } from '../utils'
import { SalesOrderExtractor } from './extractSalesOrder'
function generateUpsBatch(){
  // I want to map it, but condense multiple line orders
  // this is only for bloomingdales now
  // but I should eventually include other customers as well
  let totalQty = 0
  const { ss, sheetData } = getSheetData()
  let extractor = new SalesOrderExtractor(sheetData)
	let order = new Order(extractor)
	order.addFulfillmentData()
  let newData = extractor.content.map((row, i, self) => {
		const ind = extractor.indices
		const qty = order.fulfillmentData.items[i].qtyFulfilled
    const firstCol = " "
    const fullName = row[ind.partyName]
    const country = "US"
    const shipTo1 = row[ind.partyAddress1]
    const shipTo2 = row[ind.partyAddress2] || ""
    const city = row[ind.partyCity]
    const state = row[ind.partyState]
    const zip = row[ind.partyZipcode]
    const phone = row[ind.contactTel]
    const po = row[ind.po]
    // if we're on the last line return undefined, otherwise po at next index
    const nextPo = self.length === (i + 1) ? undefined : self[i + 1][ind.po]
    const packagingType = 2
    const serviceCode = 3
    if(nextPo && po === nextPo){
      // if we're at a multiline order
      // but not at the bottom line
			// return null if this row's item is not in stock 
			if(qty === 0){
				return null
			}
			// if there is some qty, add it to the total
      totalQty += qty
      return null
    }
		totalQty += qty
		if(totalQty == 0){
			return null
		}
    // if we are not in a multiline order, or we're at the bottom
		// We'll add the qty to the baseweight
		// add the qty to totalQty, then if that's 0, skip
		if(totalQty === 0) return null
		const baseWeight = 3
		// return baseWeight if there is only one peice, otherwise add the totalQty
		let orderWeight = totalQty === 1 ? baseWeight : baseWeight + (totalQty - 1)
    // Then we'll reset the total qty to 0
    totalQty = 0
  
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
  createNewSheetWithData(ss, [['']], "Tracking")
}
