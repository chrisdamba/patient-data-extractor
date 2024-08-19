// src/__tests__/patientDataExtractor.test.ts

import {PatientDataExtractor} from '../patientDataExtractor'

describe('PatientDataExtractor', () => {
  const extractor = new PatientDataExtractor()
  const validMessage = `
EVT|TYPE|20230502112233
PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|
DET|1|I|^^MainDepartment^101^Room 1|Common Cold
  `.trim()

  it('should extract patient data correctly from a valid message', () => {
    const result = extractor.extract(validMessage)
    expect(result).toEqual({
      fullName: {
        lastName: 'Smith',
        firstName: 'John',
        middleName: 'A',
      },
      dateOfBirth: '1980-01-01',
      primaryCondition: 'Common Cold',
    })
  })

  it('should handle missing middle name', () => {
    const messageWithoutMiddleName = validMessage.replace(
      'Smith^John^A',
      'Smith^John'
    )
    const result = extractor.extract(messageWithoutMiddleName)
    expect(result.fullName.middleName).toBeUndefined()
  })

  it('should throw an error for missing required segments', () => {
    const invalidMessage = 'EVT|TYPE|20230502112233'
    expect(() => extractor.extract(invalidMessage)).toThrow(
      'Invalid message format: Missing required segments'
    )
  })

  it('should throw an error for invalid name format', () => {
    const messageWithInvalidName = validMessage.replace('Smith^John^A', 'Smith')
    expect(() => extractor.extract(messageWithInvalidName)).toThrow(
      'Invalid name format'
    )
  })

  it('should throw an error for invalid date of birth format', () => {
    const messageWithInvalidDOB = validMessage.replace('19800101', '1980-01-01')
    expect(() => extractor.extract(messageWithInvalidDOB)).toThrow(
      'Invalid date of birth format'
    )
  })

  it('should throw an error for missing primary condition', () => {
    const messageWithMissingCondition = validMessage.replace('Common Cold', '')
    expect(() => extractor.extract(messageWithMissingCondition)).toThrow(
      'Missing primary condition'
    )
  })
})
