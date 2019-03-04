import { getSheetData, createNewSheetWithData } from '../utils'

function extractShopifyInvoice() {
  const { ss, sheetData, sheetName } = getSheetData()

  const wrapped = new SheetData(sheetData)
  let { invoiceNumber, invoiceDateString } = getInvoiceMetadata(sheetName)
  const {
    day, customerName, orderName,
    variantSku, customerEmail, gross_sales,
    discounts, taxes, returns, netQuantity,
    netSales, shipping
  } = wrapped.reduceHeaders()
  // get invoice details from sheet name and use them later

  let invoiceTotals = {
    discounts: 0,
    shipping: 0,
    taxes: 0,
    positiveReturns: 0
  }

  let creditTotals = {
    taxes: 0
  }
  let invoiceData = []
  let creditData = []

  // iterate through the rows
  wrapped.data.forEach((row, i) => {
    if(i === 0){
      row = [...row, "Inv", "Inv Date"]
      invoiceData.push(row)
      creditData.push(row)
    }

    row = [...row, invoiceNumber, invoiceDateString]
    // First detect if an item is a sale or refund
    const saleAmount = row[netSales]
    const qty = row[netQuantity]
    const shippingAmount = row[shipping]
    const taxAmount =  row[taxes]
    const discountAmount = row[discounts]
    if(saleAmount < 0){
      // if the net sales is less than 0, it's a return from a sale that was made in a previous month
      row.splice(netSales, 1, Math.abs(saleAmount)) // sale amount must be a positive number
      let newQty = qty === 0 ? 1 : Math.abs(qty) // if qty is less negative, convert to positive, if it's zero convert to 1
      row.splice(netQuantity, 1, newQty)
      if(row[variantSku] === ""){
        row.splice(variantSku, 1, "Refund")
      }
      creditData.push(row)
      // also tally up the tax, while I'm at it
      creditTotals.taxes += Math.abs(row[taxes])
      return 
    }
    if(saleAmount === 0 &&  qty === 0){
      // if net sales is 0, it's an order that was returned the same month, we don't need to import it
      // either this shoe did not ship
      // or it is a line for shipping and tax only
      invoiceTotals.shipping += shippingAmount
      invoiceTotals.taxes += taxAmount
      return // Skip this line
    }
    // if the net sales is a positive number
    if(saleAmount > 0){
      if(qty === 0){
        // this is a positive return (customer gave us back money from a refund)
        // I should total them up and add them as a line on the bottom
        // and skip the row
        invoiceTotals.positiveReturns += row[returns]
        return
      }
      // add it to invoice sheet
      invoiceData.push(row)
      // also add the totals
      invoiceTotals.shipping += shippingAmount
      invoiceTotals.taxes += taxAmount
      invoiceTotals.discounts += discountAmount
    }
    if(saleAmount === 0 && qty > 0){
      // this is a shoe that was discounted to 0
      // I need to treat it like a regular order
      // in order to remove from stock
      invoiceData.push(row)
      // also add the totals
      invoiceTotals.shipping += shippingAmount
      invoiceTotals.taxes += taxAmount
      invoiceTotals.discounts += discountAmount
    }
  })

  // add totals here
  // for invoice 
    // discounts (positive)
    const discountRow = [...addSpaces(3), "Discounts", ...addSpaces(8), Math.abs(invoiceTotals.discounts), invoiceNumber, invoiceDateString]
    const shippingRow = [...addSpaces(3), "Shipping", ...addSpaces(7), 1, invoiceTotals.shipping, invoiceNumber, invoiceDateString]
    const taxRow = [...addSpaces(3), "NYS Tax", ...addSpaces(7), 1, invoiceTotals.taxes, invoiceNumber, invoiceDateString]

  // for credit
    // tax
    let taxRowCredit = [...addSpaces(3), "NYS Tax", ...addSpaces(7), 1, creditTotals.taxes, invoiceNumber, invoiceDateString]

  invoiceData.push(discountRow)
  invoiceData.push(shippingRow)
  invoiceData.push(taxRow)
  creditData.push(taxRowCredit)

  createNewSheetWithData(ss, invoiceData, "Shopify Invoice Import")
  createNewSheetWithData(ss, creditData, "Shopify Credit Memo Import")

  function getInvoiceMetadata(sheetName) {
    let invoiceDateString = sheetName.split("_")[2].split(".")[0]
    let invoiceDate = new Date(invoiceDateString)
    let invoiceNumber = `SI${invoiceDate.getMonth() + 1}${String(invoiceDate.getFullYear()).substr(2)}` 
    return { invoiceDateString, invoiceNumber }
  }
}