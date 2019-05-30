import { amazonCommitmentPlanData, amazonPoResult } from "./testHelpers";
import { commitmentToPo } from '../amazonPo/commitmentToPo'


describe('amazonCommitmentPlan', () => {
  describe("amazonCommitmentPlanToPo", () => {
    it("Converts commitment plan to separate po uploads per month", () => {
      const result = commitmentToPo()
    })
  })
})