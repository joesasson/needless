import { camelize, reduceHeaders } from './utils'
function onOpen(e){
  // set constants on top level
  SpreadsheetApp.getUi().createMenu("Needless")
    .addSubMenu(SpreadsheetApp.getUi().createMenu("Amazon PO")
      .addItem('Commitment Plan to QB PO', 'commitmentToPo')
      .addItem('Commitment Plan to Sku Worksheet', 'commitmentToSkuSheet')
    )
    .addSubMenu(SpreadsheetApp.getUi().createMenu("Nordstrom Dropship")
      .addItem("Generate Picklist", "nordstromPicklist")
      .addItem("Generate Invoice and Shipping Upload", "nordstromInv")
      .addItem("Update Data in dsco", "sendDataToDsco")
    )
    .addSubMenu(SpreadsheetApp.getUi().createMenu('General Tasks')
      .addItem("Remove Empty Columns", "removeEmptyColumns")
      .addItem("Extract Sales Order/Invoice Details", "extractSalesOrder")
      .addItem("Generate UPS Batch File", 'generateUpsBatch')
      .addItem("Generate Packing Slip", "generatePackingSlip")
      .addItem("Generate Picklist", "generatePicklist")
      .addItem("Extract Selected Columns", "extractSelectedColumns")
      .addItem("Add To Shipping Control", 'addToShippingControl')
    )
    .addSubMenu(SpreadsheetApp.getUi().createMenu('Shopify')
      .addItem("Extract Shopify Invoice and Credit Details", "extractShopifyInvoice")
    )
    .addSubMenu(SpreadsheetApp.getUi().createMenu("Other")
      .addItem("Prepare Hautelook Shipment (Packing Slip + Labels)", "prepareHautelookShipment")
      .addItem("Open Gold Digger", "goldDigger")
      .addItem("Log Sheet", 'logSheet')
			.addItem('Noodle', 'noodle')
    )
    .addToUi();
}

