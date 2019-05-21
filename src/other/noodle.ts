function noodle() {
	// Get all data from edi file
	const { ss, sheet, sheetData } = getSheetData()
	const quantitiesPerStore = parseQuantityData(sheetData)

	const styles = parseStyleData(sheetData)
	const stores = parseStoreData(sheetData)
	let newData = []

	// Output Style Header for each style 
	styles.forEach(styleDetails => {
		const { styleName, color, style } = styleDetails
		const styleHeader = [
			["", styleName, "35", "35.5", "36", "37", "37.5", "38", 
									"39", "39.5", "40", "40.5", "41", "", "42", ""],
			[style, color, "5", "5.5", "6", "6.5", "7", "7.5", 
							"8", "8.5", "9", "9.5", "10", "10.5", "11", "TOTAL"]
		]
		newData.push(styleHeader[0])
		newData.push(styleHeader[1])
		stores.forEach(storeNum => {
			// Output store name with qty information under size columns
			const storeRow = styleHeader[1].map((size, i) => {
				if(i < 1 || i === 15){ return "" }
				if(i === 1){ return storeNum }
				const key = storeNum + style + size
				return quantitiesPerStore[key] || ""
			})
			const total = storeRow.reduce((sum, qtyCell, i) =>{ 
				if(i < 2){ return sum } 
				return Number(sum) + Number(qtyCell)
			})
			storeRow[15] = total
			newData.push(storeRow)
		}) // -> [["{storeNumber}", "", "", "46", "49", "69", "70", "92", "72", "77", "41", "56", "{total}"],[storenumber2]] length - 16
		newData.push(Array(16).join(".").split("."))

	})

	createNewSheetWithData(ss, newData, "By Store")
}

const parseQuantityData = sheetData => {
	// Turn it into an object. Fields are:
		// key (store + style + size)
		// quantity
	return sheetData.reduce((qtys, row)  => {
		const { storeIndex, styleIndex, sizeIndex, qtyIndex } = getColumnIndexes(sheetData)
		const store = row[storeIndex] 
		const style = row[styleIndex]
		const size = row[sizeIndex]
		const qty = row[qtyIndex]
		const key = store + style + size
		qtys[key] = qty
		return qtys
	}, {})
}

const getColumnIndexes = (sheetData) => {
	const storeIndex = getColumnIndexByHeader("Store #", sheetData)
	const styleIndex = getColumnIndexByHeader("Vendor Style #", sheetData)
	const sizeIndex = getColumnIndexByHeader("Vendor Size Description", sheetData)
	const qtyIndex = getColumnIndexByHeader("Ordered Qty", sheetData)
	const colorIndex = getColumnIndexByHeader("Vendor Color Description", sheetData)
	const styleNameIndex = getColumnIndexByHeader("Product Description", sheetData)
	return { storeIndex, styleIndex, sizeIndex, qtyIndex, colorIndex, styleNameIndex }
}

const getColumnIndexByHeader = (header, sheetData) => {
	const headerRow = sheetData[0]
	const index = headerRow.indexOf(header)
	return index
}

const parseStyleData = sheetData => {
	let styles = []
	let styleData = []
	sheetData.forEach((row, i) => {
		if(i == 0){ return }
		const { styleIndex, colorIndex, styleNameIndex } = getColumnIndexes(sheetData)
		const style = row[styleIndex]
		const color = row[colorIndex]
		const styleName = row[styleNameIndex].split(":")[0]
		const styleDetails = {
			style, color, styleName
		}
		if(styles.indexOf(style) === -1){ 
			styles.push(style)
			styleData.push(styleDetails)
		}
	})
	return styleData
}

const parseStoreData = sheetData => {
	const storeIndex = getColumnIndexByHeader("Store #", sheetData)
	let storeData = []
	sheetData.forEach((row, i) => {
		let storeNum = row[storeIndex]
		if(i == 0){ return }
		if(storeData.indexOf(storeNum) === -1){
			storeData.push(storeNum)
		}
	})
	return storeData.sort((a, b) => a - b)
}
