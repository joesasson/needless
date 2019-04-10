// https://docs.google.com/spreadsheets/d/1uKiu6CH8AP1UiXRQvm4LWFj03NbK7nD0XZPe6vkmPoI/edit
let hautelookOrderString = `[[NORDSTROM PURCHASE ORDER, , , , , , , , , , , , , , ], [This Purchase Order is subject to Nordstrom Purchase Order Terms and Conditions., , , , , , , , , , , , , , ], [For more information, please access:, , www.nordstromsupplier.com, , , , , , , , , , , , ], [Fulfillment center location information will be provided after this notice when the order is EDI’d., , , , , , , , , , , , , , ], [SUPPLIER:, , MARC JOSEPH NEW YORK FOOTWEAR, , , , , , , , , , , , ], [DEPT:, , 192, , , , , , , , , , , , ], [SEASON:, , 2019, Spring, , , , , , , , , , , , ], [MONTH:, , FEBRUARY, , , , , , , , , , , , ], [BUYER NAME:, , Caitlyn Young , , , , , , , , , , , , ], [CONTACT PHONE #:, , 805-2068/206-3032068, , , , , , , , , , , , ], [ALTERNATE CONTACT (NAME/PHONE):, , Kat Dunn, , , , , , , , , , , , ], [TERMS:, , NET 45 DAYS - *Note: Terms may vary by PO. Terms listed on PO control., , , , , , , , , , , , ], [, , , , , , , , , , , , , , ], [NOT BEFORE DATE:, , Mon Jan 28 03:00:00 GMT-05:00 2019, , , , , , , , , , , , ], [NOT AFTER DATE:, , Mon Feb 04 03:00:00 GMT-05:00 2019, , , , , , , , , , , , ], [PO#, , , , , , , , , , , , , , ], [PO NAME, , N204743, , , , , , , , , , , , ], [PO GROUP, , OFFPRICE ONLINE, , , , , , , , , , , , ], [Comments:, , , , , , , , , , , , , , ], [, , , , , , , , , , , , , , ], [, , , , , , , , , , , , , , ], [, , , , , , , , , , , , , , ], [, , , , , , , , , , , , , , ], [, , , , , , , , , , , , , , ], [, , , , , , , , , , , , , , ], [, , , , , , , , , , , , , , ], [VPN#, VPN Description, Collection, CL, CL Desc, Color, NRF Color Code, Unit Cost / $, Spec Cost / $, Unit Rtl / $, Spec Rtl / $, MSRP, Ttl Units, Size 1, Size 2], [24755-BNN, EAST VILLAGE, , 30.0, FLATS, BLACK NAPA, , 38.0, 0.0, 69.97, 0.0, 155.0, , , ], [, , , , , , , 570.0, 0.0, 1049.55, 0.0, , 15.0, 6, M], [, , , , , , , 608.0, 0.0, 1119.52, 0.0, , 16.0, 6.5, M], [, , , , , , , 874.0, 0.0, 1609.31, 0.0, , 23.0, 7, M], [, , , , , , , 874.0, 0.0, 1609.31, 0.0, , 23.0, 7.5, M], [, , , , , , , 1140.0, 0.0, 2099.1, 0.0, , 30.0, 8, M], [, , , , , , , 950.0, 0.0, 1749.25, 0.0, , 25.0, 8.5, M], [, , , , , , , 988.0, 0.0, 1819.22, 0.0, , 26.0, 9, M], [, , , , , , , 532.0, 0.0, 979.58, 0.0, , 14.0, 9.5, M], [, , , , , , , 722.0, 0.0, 1329.43, 0.0, , 19.0, 10, M], [, , , , , , , 342.0, 0.0, 629.73, 0.0, , 9.0, 11, M], [, , , , , BLACK NAPA Total, , 7600.0, 0.0, 13994.0, 0.0, , 200.0, , ], [24755-BNN Total, EAST VILLAGE, , 30.0, , VPN Total, , 7600.0, 0.0, 13994.0, 0.0, , 200.0, , ], [, , , , , , , , , , , , , , ], [24755-TN2, EAST VILLAGE, , 30.0, FLATS, TAN NAPA, , 38.0, 0.0, 69.97, 0.0, 155.0, , , ], [, , , , , , , 570.0, 0.0, 1049.55, 0.0, , 15.0, 6, M], [, , , , , , , 608.0, 0.0, 1119.52, 0.0, , 16.0, 6.5, M], [, , , , , , , 874.0, 0.0, 1609.31, 0.0, , 23.0, 7, M], [, , , , , , , 874.0, 0.0, 1609.31, 0.0, , 23.0, 7.5, M], [, , , , , , , 1140.0, 0.0, 2099.1, 0.0, , 30.0, 8, M], [, , , , , , , 950.0, 0.0, 1749.25, 0.0, , 25.0, 8.5, M], [, , , , , , , 988.0, 0.0, 1819.22, 0.0, , 26.0, 9, M], [, , , , , , , 532.0, 0.0, 979.58, 0.0, , 14.0, 9.5, M], [, , , , , , , 722.0, 0.0, 1329.43, 0.0, , 19.0, 10, M], [, , , , , , , 342.0, 0.0, 629.73, 0.0, , 9.0, 11, M], [, , , , , TAN NAPA Total, , 7600.0, 0.0, 13994.0, 0.0, , 200.0, , ], [24755-TN2 Total, EAST VILLAGE, , 30.0, , VPN Total, , 7600.0, 0.0, 13994.0, 0.0, , 200.0, , ], [, , , , , , , , , , , , , , ], [25689-WN, EAST VILLAGE, , 30.0, FLATS, WHITE NAPA PERF, , 38.0, 0.0, 69.97, 0.0, 155.0, , , ], [, , , , , , , 228.0, 0.0, 419.82, 0.0, , 6.0, 6, M], [, , , , , , , 228.0, 0.0, 419.82, 0.0, , 6.0, 6.5, M], [, , , , , , , 304.0, 0.0, 559.76, 0.0, , 8.0, 7, M], [, , , , , , , 304.0, 0.0, 559.76, 0.0, , 8.0, 7.5, M], [, , , , , , , 456.0, 0.0, 839.64, 0.0, , 12.0, 8, M], [, , , , , , , 304.0, 0.0, 559.76, 0.0, , 8.0, 8.5, M], [, , , , , , , 342.0, 0.0, 629.73, 0.0, , 9.0, 9, M], [, , , , , , , 190.0, 0.0, 349.85, 0.0, , 5.0, 9.5, M], [, , , , , , , 266.0, 0.0, 489.79, 0.0, , 7.0, 10, M], [, , , , , , , 114.0, 0.0, 209.91, 0.0, , 3.0, 11, M], [, , , , , WHITE NAPA PERF Total, , 2736.0, 0.0, 5037.84, 0.0, , 72.0, , ], [25689-WN Total, EAST VILLAGE, , 30.0, , VPN Total, , 2736.0, 0.0, 5037.84, 0.0, , 72.0, , ], [, , , , , , , , , , , , , , ], [Commitment Total, , , , , , , 17936.0, 0.0, 33025.84, 0.0, , 472.0, , ]]`
// nordstrom rack - https://docs.google.com/spreadsheets/d/1eB6JmJKknl_yKzNjggjS_DQE7GfGqXF0JF7SJxnTdE8/edit#gid=772568515
let nordstromOrderString = `[[Transaction #, Transaction Set Purpose, PO #, PO Date, Currency, Department #, Internal Vendor #, Vendor Terms Type, Vendor Terms Description, Nordstrom Season Code, PO Terms, Buyer Contact Name, FOB Payment Method, FOB Location1, FOB Description1, Terms Type, Terms Disc Percent, Terms Disc Days Due, Terms Description, Cancel After, Ship Not Before, Transportation Method, Vendor #, FOB Location Description, Terms Net Days, PO Ln #, Ordered Qty, Unit Type, Unit Price, Product ID Type, Product ID, Vendor Style #, Class #, Resale Price, Product Description, Vendor Color Description, Vendor Size Description, Ticketing Code, Hanger Type, Extended Ln Amt, Promotional Price, Total PO Amount, Store #, Store Qty, Ship to Location, PO Type, No of Ln Items, Ship to Name, Ship to Address, Ship to City, Ship to State, Ship to Zipcode, Xref Vendor Item, Xref Color, Xref Size, Xref Description, Pre-Mark Indicator, FOB Location2, FOB Description2, Ship to Code, Item Ship to Location, Promotion/Deal #, Promotion/Deal # Description, Terms Date, Terms Day of Month, Xref Weight, Xref UPC], [210001.0, 0.0, 2.2342932E7, Thu Aug 30 03:00:00 GMT-04:00 2018, USD, 192.0, 5086194.0, 1.0, VENDOR PAYS TOTAL FREIGHT, 0.0, ALL NORDSTROM P.O.TERMS & CONDITIONS APPLY SEE WWW.NORDSTROMSUPPLIER.COM, , CC, OA, US Origin (after loading on equipment), 5.0, , , NET 45 DAYS, Wed Feb 06 03:00:00 GMT-05:00 2019, Wed Jan 30 03:00:00 GMT-05:00 2019, M, 5086164.0, US Origin (after loading on equipment), 45.0, 1.0, 1.0, EA, 32.5, UP, 8.4371015609E11, MJW02-BN, 0.0, 145.0, UNION ST:BLACK:6, BLACK, 6.0, RL02, , 32.5, 59.97, 682.5, 28.0, 1.0, 89.0, SA, 21.0, Portland DC, 5703 N. Marine Drive, Portland, OR, 97203.0, , , , , , OA, US Origin (after loading on equipment), , , RO, RACK ORDER, 3.0, , , ], [210001.0, 0.0, 2.2342932E7, Thu Aug 30 03:00:00 GMT-04:00 2018, USD, 192.0, 5086194.0, 1.0, VENDOR PAYS TOTAL FREIGHT, 0.0, ALL NORDSTROM P.O.TERMS & CONDITIONS APPLY SEE WWW.NORDSTROMSUPPLIER.COM, , CC, OA, US Origin (after loading on equipment), 5.0, , , NET 45 DAYS, Wed Feb 06 03:00:00 GMT-05:00 2019, Wed Jan 30 03:00:00 GMT-05:00 2019, M, 5086164.0, US Origin (after loading on equipment), 45.0, 2.0, 1.0, EA, 32.5, UP, 8.43710156106E11, MJW02-BN, 0.0, 145.0, UNION ST:BLACK:6.5, BLACK, 6.5, RL02, , 32.5, 59.97, 682.5, 28.0, 1.0, 89.0, SA, 21.0, Portland DC, 5703 N. Marine Drive, Portland, OR, 97203.0, , , , , , OA, US Origin (after loading on equipment), , , RO, RACK ORDER, 3.0, , , ], [210001.0, 0.0, 2.2342932E7, Thu Aug 30 03:00:00 GMT-04:00 2018, USD, 192.0, 5086194.0, 1.0, VENDOR PAYS TOTAL FREIGHT, 0.0, ALL NORDSTROM P.O.TERMS & CONDITIONS APPLY SEE WWW.NORDSTROMSUPPLIER.COM, , CC, OA, US Origin (after loading on equipment), 5.0, , , NET 45 DAYS, Wed Feb 06 03:00:00 GMT-05:00 2019, Wed Jan 30 03:00:00 GMT-05:00 2019, M, 5086164.0, US Origin (after loading on equipment), 45.0, 3.0, 1.0, EA, 32.5, UP, 8.43710156113E11, MJW02-BN, 0.0, 145.0, UNION ST:BLACK:7, BLACK, 7.0, RL02, , 32.5, 59.97, 682.5, 28.0, 1.0, 89.0, SA, 21.0, Portland DC, 5703 N. Marine Drive, Portland, OR, 97203.0, , , , , , OA, US Origin (after loading on equipment), , , RO, RACK ORDER, 3.0, , , ], [210001.0, 0.0, 2.2342932E7, Thu Aug 30 03:00:00 GMT-04:00 2018, USD, 192.0, 5086194.0, 1.0, VENDOR PAYS TOTAL FREIGHT, 0.0, ALL NORDSTROM P.O.TERMS & CONDITIONS APPLY SEE WWW.NORDSTROMSUPPLIER.COM, , CC, OA, US Origin (after loading on equipment), 5.0, , , NET 45 DAYS, Wed Feb 06 03:00:00 GMT-05:00 2019, Wed Jan 30 03:00:00 GMT-05:00 2019, M, 5086164.0, US Origin (after loading on equipment), 45.0, 4.0, 1.0, EA, 32.5, UP, 8.4371015612E11, MJW02-BN, 0.0, 145.0, UNION ST:BLACK:7.5, BLACK, 7.5, RL02, , 32.5, 59.97, 682.5, 28.0, 1.0, 89.0, SA, 21.0, Portland DC, 5703 N. Marine Drive, Portland, OR, 97203.0, , , , , , OA, US Origin (after loading on equipment), , , RO, RACK ORDER, 3.0, , , ], [210001.0, 0.0, 2.2342932E7, Thu Aug 30 03:00:00 GMT-04:00 2018, USD, 192.0, 5086194.0, 1.0, VENDOR PAYS TOTAL FREIGHT, 0.0, ALL NORDSTROM P.O.TERMS & CONDITIONS APPLY SEE WWW.NORDSTROMSUPPLIER.COM, , CC, OA, US Origin (after loading on equipment), 5.0, , , NET 45 DAYS, Wed Feb 06 03:00:00 GMT-05:00 2019, Wed Jan 30 03:00:00 GMT-05:00 2019, M, 5086164.0, US Origin (after loading on equipment), 45.0, 5.0, 1.0, EA, 32.5, UP, 8.43710156137E11, MJW02-BN, 0.0, 145.0, UNION ST:BLACK:8, BLACK, 8.0, RL02, , 32.5, 59.97, 682.5, 28.0, 1.0, 89.0, SA, 21.0, Portland DC, 5703 N. Marine Drive, Portland, OR, 97203.0, , , , , , OA, US Origin (after loading on equipment), , , RO, RACK ORDER, 3.0, , , ], [210001.0, 0.0, 2.2342932E7, Thu Aug 30 03:00:00 GMT-04:00 2018, USD, 192.0, 5086194.0, 1.0, VENDOR PAYS TOTAL FREIGHT, 0.0, ALL NORDSTROM P.O.TERMS & CONDITIONS APPLY SEE WWW.NORDSTROMSUPPLIER.COM, , CC, OA, US Origin (after loading on equipment), 5.0, , , NET 45 DAYS, Wed Feb 06 03:00:00 GMT-05:00 2019, Wed Jan 30 03:00:00 GMT-05:00 2019, M, 5086164.0, US Origin (after loading on equipment), 45.0, 6.0, 1.0, EA, 32.5, UP, 8.43710156144E11, MJW02-BN, 0.0, 145.0, UNION ST:BLACK:8.5, BLACK, 8.5, RL02, , 32.5, 59.97, 682.5, 28.0, 1.0, 89.0, SA, 21.0, Portland DC, 5703 N. Marine Drive, Portland, OR, 97203.0, , , , , , OA, US Origin (after loading on equipment), , , RO, RACK ORDER, 3.0, , , ], [210001.0, 0.0, 2.2342932E7, Thu Aug 30 03:00:00 GMT-04:00 2018, USD, 192.0, 5086194.0, 1.0, VENDOR PAYS TOTAL FREIGHT, 0.0, ALL NORDSTROM P.O.TERMS & CONDITIONS APPLY SEE WWW.NORDSTROMSUPPLIER.COM, , CC, OA, US Origin (after loading on equipment), 5.0, , , NET 45 DAYS, Wed Feb 06 03:00:00 GMT-05:00 2019, Wed Jan 30 03:00:00 GMT-05:00 2019, M, 5086164.0, US Origin (after loading on equipment), 45.0, 7.0, 1.0, EA, 32.5, UP, 8.43710156151E11, MJW02-BN, 0.0, 145.0, UNION ST:BLACK:9, BLACK, 9.0, RL02, , 32.5, 59.97, 682.5, 28.0, 1.0, 89.0, SA, 21.0, Portland DC, 5703 N. Marine Drive, Portland, OR, 97203.0, , , , , , OA, US Origin (after loading on equipment), , , RO, RACK ORDER, 3.0, , , ], [210001.0, 0.0, 2.2342932E7, Thu Aug 30 03:00:00 GMT-04:00 2018, USD, 192.0, 5086194.0, 1.0, VENDOR PAYS TOTAL FREIGHT, 0.0, ALL NORDSTROM P.O.TERMS & CONDITIONS APPLY SEE WWW.NORDSTROMSUPPLIER.COM, , CC, OA, US Origin (after loading on equipment), 5.0, , , NET 45 DAYS, Wed Feb 06 03:00:00 GMT-05:00 2019, Wed Jan 30 03:00:00 GMT-05:00 2019, M, 5086164.0, US Origin (after loading on equipment), 45.0, 9.0, 1.0, EA, 32.5, UP, 8.43710156175E11, MJW02-BN, 0.0, 145.0, UNION ST:BLACK:10, BLACK, 10.0, RL02, , 32.5, 59.97, 682.5, 28.0, 1.0, 89.0, SA, 21.0, Portland DC, 5703 N. Marine Drive, Portland, OR, 97203.0, , , , , , OA, US Origin (after loading on equipment), , , RO, RACK ORDER, 3.0, , , ]]`
// von maur - https://docs.google.com/spreadsheets/d/10aIJCrgPYG4KqEExbvGQvIi3wI9E9li-a0K7zLd1n3w/edit#gid=1828653029
let vonMaurOrderString = `[[Trans Control No, UserDefined, PO Type, PO Number, PO Date, Department No, UserDefined, UserDefined, UserDefined, Vendor Number, UserDefined, UserDefined, UserDefined, UserDefined, Shipment Method of Payment, FOB Location Type, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, Terms Type, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, Terms Description, Ship Not Before, Cancel After, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, Ship To Addtl Name, UserDefined, UserDefined, UserDefined, UserDefined, Ship To Name, Ship To Code, Ship To Address1, Ship To Address2, Ship To City, Ship To State, Ship To Zipcode, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, No of Line Items, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, Product Code Type, Product Code, Product Code Type2, Product Code2, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, Line No, Qty Ordered, Qty Unit, Unit Price, UserDefined, Retail Price, Qty Ordered, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, Buyer Store No ], [1.1190002E7, 850.0, RE, 811841.0, Tue Dec 11 03:00:00 GMT-05:00 2018, 581.0, , , 2066.0, 155747.0, 11748.0, , , , DF, FA, , , , , , , 14.0, , , , , , , , NET 30, Fri Feb 15 03:00:00 GMT-05:00 2019, Mon Feb 25 03:00:00 GMT-05:00 2019, , , , , , , , , , , Von Maur, , , , , VON MAUR INC, 1.0, 6565 Brady Street, , Davenport, IA, 52806.0, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 9.0, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , UP, 8.43710176982E11, VA, 8416-PATCH, , , , , , , , , , , , , , , , , 1.0, 1.0, EA, 59.0, , 145.0, 1.0, , , , , , , , , , , , 6.0], [1.1190002E7, 850.0, RE, 811841.0, Tue Dec 11 03:00:00 GMT-05:00 2018, 581.0, , , 2066.0, 155747.0, 11748.0, , , , DF, FA, , , , , , , 14.0, , , , , , , , NET 30, Fri Feb 15 03:00:00 GMT-05:00 2019, Mon Feb 25 03:00:00 GMT-05:00 2019, , , , , , , , , , , Von Maur, , , , , VON MAUR INC, 1.0, 6565 Brady Street, , Davenport, IA, 52806.0, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 9.0, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , UP, 8.43710176999E11, VA, 8416-PATCH, , , , , , , , , , , , , , , , , 2.0, 1.0, EA, 59.0, , 145.0, 1.0, , , , , , , , , , , , 6.0], [1.1190002E7, 850.0, RE, 811841.0, Tue Dec 11 03:00:00 GMT-05:00 2018, 581.0, , , 2066.0, 155747.0, 11748.0, , , , DF, FA, , , , , , , 14.0, , , , , , , , NET 30, Fri Feb 15 03:00:00 GMT-05:00 2019, Mon Feb 25 03:00:00 GMT-05:00 2019, , , , , , , , , , , Von Maur, , , , , VON MAUR INC, 1.0, 6565 Brady Street, , Davenport, IA, 52806.0, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 9.0, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , UP, 8.43710177002E11, VA, 8416-PATCH, , , , , , , , , , , , , , , , , 3.0, 1.0, EA, 59.0, , 145.0, 1.0, , , , , , , , , , , , 6.0], [1.1190002E7, 850.0, RE, 811841.0, Tue Dec 11 03:00:00 GMT-05:00 2018, 581.0, , , 2066.0, 155747.0, 11748.0, , , , DF, FA, , , , , , , 14.0, , , , , , , , NET 30, Fri Feb 15 03:00:00 GMT-05:00 2019, Mon Feb 25 03:00:00 GMT-05:00 2019, , , , , , , , , , , Von Maur, , , , , VON MAUR INC, 1.0, 6565 Brady Street, , Davenport, IA, 52806.0, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 9.0, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , UP, 8.43710177019E11, VA, 8416-PATCH, , , , , , , , , , , , , , , , , 4.0, 1.0, EA, 59.0, , 145.0, 1.0, , , , , , , , , , , , 6.0], [1.1190002E7, 850.0, RE, 811841.0, Tue Dec 11 03:00:00 GMT-05:00 2018, 581.0, , , 2066.0, 155747.0, 11748.0, , , , DF, FA, , , , , , , 14.0, , , , , , , , NET 30, Fri Feb 15 03:00:00 GMT-05:00 2019, Mon Feb 25 03:00:00 GMT-05:00 2019, , , , , , , , , , , Von Maur, , , , , VON MAUR INC, 1.0, 6565 Brady Street, , Davenport, IA, 52806.0, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 9.0, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , UP, 8.43710177026E11, VA, 8416-PATCH, , , , , , , , , , , , , , , , , 5.0, 1.0, EA, 59.0, , 145.0, 1.0, , , , , , , , , , , , 6.0], [1.1190002E7, 850.0, RE, 811841.0, Tue Dec 11 03:00:00 GMT-05:00 2018, 581.0, , , 2066.0, 155747.0, 11748.0, , , , DF, FA, , , , , , , 14.0, , , , , , , , NET 30, Fri Feb 15 03:00:00 GMT-05:00 2019, Mon Feb 25 03:00:00 GMT-05:00 2019, , , , , , , , , , , Von Maur, , , , , VON MAUR INC, 1.0, 6565 Brady Street, , Davenport, IA, 52806.0, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 9.0, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , UP, 8.43710177033E11, VA, 8416-PATCH, , , , , , , , , , , , , , , , , 6.0, 1.0, EA, 59.0, , 145.0, 1.0, , , , , , , , , , , , 6.0], [1.1190002E7, 850.0, RE, 811841.0, Tue Dec 11 03:00:00 GMT-05:00 2018, 581.0, , , 2066.0, 155747.0, 11748.0, , , , DF, FA, , , , , , , 14.0, , , , , , , , NET 30, Fri Feb 15 03:00:00 GMT-05:00 2019, Mon Feb 25 03:00:00 GMT-05:00 2019, , , , , , , , , , , Von Maur, , , , , VON MAUR INC, 1.0, 6565 Brady Street, , Davenport, IA, 52806.0, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 9.0, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , UP, 8.4371017704E11, VA, 8416-PATCH, , , , , , , , , , , , , , , , , 7.0, 1.0, EA, 59.0, , 145.0, 1.0, , , , , , , , , , , , 6.0], [1.1190002E7, 850.0, RE, 811841.0, Tue Dec 11 03:00:00 GMT-05:00 2018, 581.0, , , 2066.0, 155747.0, 11748.0, , , , DF, FA, , , , , , , 14.0, , , , , , , , NET 30, Fri Feb 15 03:00:00 GMT-05:00 2019, Mon Feb 25 03:00:00 GMT-05:00 2019, , , , , , , , , , , Von Maur, , , , , VON MAUR INC, 1.0, 6565 Brady Street, , Davenport, IA, 52806.0, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 9.0, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , UP, 8.43710177057E11, VA, 8416-PATCH, , , , , , , , , , , , , , , , , 8.0, 1.0, EA, 59.0, , 145.0, 1.0, , , , , , , , , , , , 6.0]]`
let multiStoreVonMaurString = `[[Trans Control No, UserDefined, PO Type, PO Number, PO Date, Department No, UserDefined, UserDefined, UserDefined, Vendor Number, UserDefined, UserDefined, UserDefined, UserDefined, Shipment Method of Payment, FOB Location Type, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, Terms Type, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, Terms Description, Ship Not Before, Cancel After, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, Ship To Addtl Name, UserDefined, UserDefined, UserDefined, UserDefined, Ship To Name, Ship To Code, Ship To Address1, Ship To Address2, Ship To City, Ship To State, Ship To Zipcode, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, No of Line Items, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, Product Code Type, Product Code, Product Code Type2, Product Code2, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, Line No, Qty Ordered, Qty Unit, Unit Price, UserDefined, Retail Price, Qty Ordered, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, UserDefined, Buyer Store No], [1.1190002E7, 850.0, RE, 811841.0, Tue Dec 11 03:00:00 GMT-05:00 2018, 581.0, , , 2066.0, 155747.0, 11748.0, , , , DF, FA, , , , , , , 14.0, , , , , , , , NET 30, Fri Feb 15 03:00:00 GMT-05:00 2019, Mon Feb 25 03:00:00 GMT-05:00 2019, , , , , , , , , , , Von Maur, , , , , VON MAUR INC, 1.0, 6565 Brady Street, , Davenport, IA, 52806.0, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 9.0, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , UP, 8.43710176982E11, VA, 8416-PATCH, , , , , , , , , , , , , , , , , 1.0, 1.0, EA, 59.0, , 145.0, 1.0, , , , , , , , , , , , 6.0], [1.1190002E7, 850.0, RE, 811841.0, Tue Dec 11 03:00:00 GMT-05:00 2018, 581.0, , , 2066.0, 155747.0, 11748.0, , , , DF, FA, , , , , , , 14.0, , , , , , , , NET 30, Fri Feb 15 03:00:00 GMT-05:00 2019, Mon Feb 25 03:00:00 GMT-05:00 2019, , , , , , , , , , , Von Maur, , , , , VON MAUR INC, 1.0, 6565 Brady Street, , Davenport, IA, 52806.0, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 9.0, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , UP, 8.43710177064E11, VA, 8416-PATCH, , , , , , , , , , , , , , , , , 9.0, 1.0, EA, 59.0, , 145.0, 1.0, , , , , , , , , , , , 6.0], [1.1190002E7, 850.0, RE, 811841.0, Tue Dec 11 03:00:00 GMT-05:00 2018, 581.0, , , 2066.0, 155747.0, 11748.0, , , , DF, FA, , , , , , , 14.0, , , , , , , , NET 30, Fri Feb 15 03:00:00 GMT-05:00 2019, Mon Feb 25 03:00:00 GMT-05:00 2019, , , , , , , , , , , Von Maur, , , , , VON MAUR INC, 1.0, 6565 Brady Street, , Davenport, IA, 52806.0, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 9.0, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , UP, 8.43710176982E11, VA, 8416-PATCH, , , , , , , , , , , , , , , , , 1.0, 1.0, EA, 59.0, , 145.0, 1.0, , , , , , , , , , , , 14.0], [1.1190002E7, 850.0, RE, 811841.0, Tue Dec 11 03:00:00 GMT-05:00 2018, 581.0, , , 2066.0, 155747.0, 11748.0, , , , DF, FA, , , , , , , 14.0, , , , , , , , NET 30, Fri Feb 15 03:00:00 GMT-05:00 2019, Mon Feb 25 03:00:00 GMT-05:00 2019, , , , , , , , , , , Von Maur, , , , , VON MAUR INC, 1.0, 6565 Brady Street, , Davenport, IA, 52806.0, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 9.0, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , UP, 8.43710176999E11, VA, 8416-PATCH, , , , , , , , , , , , , , , , , 2.0, 1.0, EA, 59.0, , 145.0, 1.0, , , , , , , , , , , , 14.0]]`
let shopifyOrderString = `[[Day, Customer name, Order name, Variant SKU, Customer email, Product title, gross_sales, discounts, shipping, taxes, Returns, Net quantity, Net sales], [Thu Jan 17 03:00:00 GMT-05:00 2019, Renee Haladay, S6802, 25790-BWP_7, reneehaladay@gmail.com, Lexington Golf - Black & White Tile, 0.0, 0.0, 0.0, 0.0, -195.0, -1.0, -195.0], [Wed Jan 30 03:00:00 GMT-05:00 2019, Gayle Ice, S6827, 25876-W_6, icegg49@gmail.com, Orchard Street Golf - White Grainy, 0.0, 0.0, 0.0, 0.0, -195.0, -1.0, -195.0], [Thu Jan 03 03:00:00 GMT-05:00 2019, Dennis McDonagh, S6556, 25876-W_8.5, dmcdonagh24@gmail.com, Orchard Street Golf - White Grainy, 0.0, 0.0, 0.0, -16.82, -195.0, -1.0, -195.0], [Thu Jan 31 03:00:00 GMT-05:00 2019, Judith R Shipon, S6844, 18571-Ash_8, judimarion40@gmail.com, West Village - Ash Grainy, 0.0, 0.0, 0.0, 0.0, -195.0, -1.0, -195.0], [Wed Jan 02 03:00:00 GMT-05:00 2019, stacie witkowski, S6471, 176034-BR_12, stacie.witkowski@gmail.com, N.Y.C. 2 - Mocha Brushed Napa, 0.0, 0.0, 0.0, 0.0, -195.0, -1.0, -195.0], [Wed Jan 30 03:00:00 GMT-05:00 2019, Gayle Ice, S6827, 25790-BWP_6, icegg49@gmail.com, Lexington Golf - Black & White Tile, 0.0, 0.0, 0.0, 0.0, -195.0, -1.0, -195.0], [Thu Jan 17 03:00:00 GMT-05:00 2019, lynn Lawless, S6566, 25777-NP_9, lynnzlaw@gmail.com, Cypress Golf - Navy Patent, 0.0, 0.0, 0.0, 0.0, -195.0, -1.0, -195.0], [Wed Jan 02 03:00:00 GMT-05:00 2019, stacie witkowski, S6471, 176035-Whis_13, stacie.witkowski@gmail.com, Manhattan - Whiskey Perf Napa, 0.0, 0.0, 0.0, 0.0, -195.0, -1.0, -195.0], [Wed Jan 23 03:00:00 GMT-05:00 2019, Madeleine Kelly, S6848, 25876-W_8.5, mkelly046@hotmail.com, Orchard Street Golf - White Grainy, 0.0, 0.0, 0.0, 0.0, -195.0, -1.0, -195.0]]`

export let hautelookData = parseDataString(hautelookOrderString)
export let nordstromData = parseDataString(nordstromOrderString)
export let vonMaurData = parseDataString(vonMaurOrderString)
export let multiStoreVonMaurData = parseDataString(multiStoreVonMaurString)
export let shopifyData = parseDataString(shopifyOrderString)


describe('parseDataString converts strings to 2d array', () => {
  it("hautelook", () => {
    expect(nordstromData[0][0]).toBeDefined()
    expect(hautelookData.length).toBe(70)
    expect(hautelookData[0]).toHaveLength(15)
    expect(hautelookData[44][9]).toBe('1609.31')
  })

  it("nordstrom rack", () => {
    expect(nordstromData[0][0]).toBeDefined()
    expect(nordstromData.length).toBe(9)
    expect(nordstromData[4][8]).toBe('VENDOR PAYS TOTAL FREIGHT')
  })
  it('von maur', () => {
    expect(vonMaurData[0][0]).toBeDefined()
    expect(vonMaurData.length).toBe(9)
    expect(vonMaurData[1]).toHaveLength(182)
    expect(vonMaurData[6][3]).toBe('811841.0')
  })
})

function parseDataString(dataString) {
  // I have a string that looks a lot like a 2d array
  // All I want to do is construct an actual array out of the values
  // I think I can safely ignore the outer brackets
  // So I can put the rows by the contents of the inner brackets
  // While I'm doing that I can add quotations and output an empty element if it's empty - I need to research the effect of this
  let newArray: any[][] = []
  let row: any[] = []
  let cell: String = ""
  let emptyCell: Boolean = true
  let afterBracket: Boolean = false

  // `[[NORDSTROM PURCHASE ORDER, , , , , , , , , , , , , , ], 
  // [This Purchase Order is subject to Nordstrom Purchase Order Terms and Conditions., , , , , , , , , , , , , , ], 
  dataString.split("").forEach((char, i) => {
    if(i === 0 || i === (dataString.length - 1)) return
    if(afterBracket && char === ","){
      afterBracket = false
      return

    }
    if(char === "[" || char === '' || char === "\n"){
      // start a new row and a new cell inside it
      cell = ''
    } else if(char === ' ' && emptyCell) {
      cell = ''
    } else if(char === ","){
      // push the previous cell and start a new cell
      row.push(cell)
      cell = ""
      emptyCell = true
    } else if(char === "]"){
      // push and clear the row
      row.push(cell)
      newArray.push(row)
      row = []
      emptyCell = true
      afterBracket = true
      // skip with the comma and space following
    } else {
      emptyCell = false
      cell += char
    }
  })
  return newArray
}