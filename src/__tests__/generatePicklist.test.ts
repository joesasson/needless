import {
  hautelookData,
  vonMaurData,
  nordstromData,
  multiStoreVonMaurData
} from './testHelpers'

import { PicklistGenerator } from '../general/generatePicklist'


describe("generatePicklist", () => {
  let wrappedHautelook = new PicklistGenerator(hautelookData)
  let wrappedVonMaur = new PicklistGenerator(vonMaurData)
  let wrappedNordstrom = new PicklistGenerator(nordstromData)
  let wrappedMultiStoreVonMaur = new PicklistGenerator(multiStoreVonMaurData)
  it("Detects template", () => {
    expect(wrappedHautelook.customer).toBe('Nordstromrack.com/Hautelook')
    expect(wrappedVonMaur.customer).toBe("Von Maur")
    expect(wrappedNordstrom.customer).toBe("Nordstrom Rack")
  })

  it("Extracts metadata", () => {
    wrappedHautelook.getSourceMetadata()
    expect(wrappedHautelook.metadata.masterPo).toBe('N204743')
  })

  fit("getUniqueStores", () => {
    let uniqueStores = wrappedHautelook.getUniqueStores()
    expect(uniqueStores).toEqual([])
    uniqueStores = wrappedNordstrom.getUniqueStores()
    expect(uniqueStores).toHaveLength(1)
    uniqueStores = wrappedMultiStoreVonMaur.getUniqueStores()
    expect(uniqueStores).toHaveLength(2)
  })

  it("detects whether there are multiple stores", () => {
    
  })

  it("Extracts tabular data", () => {
    
  })

  it("Applies Transformations", () => {

  })

  it("Generates New Data", () => {

  })
})