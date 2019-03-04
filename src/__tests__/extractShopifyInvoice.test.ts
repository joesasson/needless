describe("extractShopifyInvoice", () => {
  it("getInvoiceMetadata", () => {
    // let { invoiceDate, invoiceNumber } = getInvoiceMetadata("sales_2018-11-01_2018-11-30.csv")
  })
})

function getInvoiceMetadata(sheetName) {
  let invoiceDateString = sheetName.split("_")[2].split(".")[0]
  let invoiceDate = new Date(invoiceDateString)
  let invoiceNumber = `SI${invoiceDate.getMonth() + 1}${String(invoiceDate.getFullYear()).substr(2)}` 
  console.log(invoiceDate.getDate())
  return { invoiceDateString, invoiceNumber }
}