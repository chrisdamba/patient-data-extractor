import {PatientDataExtractor} from '../patientDataExtractor'

describe('PatientDataExtractor', () => {
  const extractor = new PatientDataExtractor()
  const validMessage = `
MSG|^~\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
EVT|TYPE|20230502112233
PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19700101|
DET|1|I|^^MainDepartment^101^Room 1|Common Cold
  `.trim()

  it('extracts patient data correctly from a valid message', () => {
    // arrange
    const result = extractor.extract(validMessage)

    // assert
    expect(result).toEqual({
      fullName: {
        lastName: 'Smith',
        firstName: 'John',
        middleName: 'A',
      },
      dateOfBirth: '1970-01-01',
      primaryCondition: 'Common Cold',
    })
  })

  it('handles missing middle name', () => {
    // arrange
    const messageWithoutMiddleName = validMessage.replace(
      'Smith^John^A',
      'Smith^John'
    )
    // act
    const result = extractor.extract(messageWithoutMiddleName)

    // assert
    expect(result.fullName.middleName).toBeUndefined()
  })

  it('throws when missing required segments', () => {
    // arrange
    const invalidMessage = 'EVT|TYPE|20230502112233'

    // assert
    expect(() => extractor.extract(invalidMessage)).toThrow(
      'Invalid message format: Missing required segments'
    )
  })

  it('throws when invalid name format', () => {
    // arrange
    const messageWithInvalidName = validMessage.replace('Smith^John^A', 'Smith')

    // assert
    expect(() => extractor.extract(messageWithInvalidName)).toThrow(
      'Invalid name format'
    )
  })

  it('throws when invalid date of birth format', () => {
    // arrange
    const messageWithInvalidDOB = validMessage.replace('19700101', '1970-01-01')

    // assert
    expect(() => extractor.extract(messageWithInvalidDOB)).toThrow(
      'Invalid date of birth format'
    )
  })

  it('throws when missing primary condition', () => {
    // arrange
    const messageWithMissingCondition = validMessage.replace('Common Cold', '')

    // assert
    expect(() => extractor.extract(messageWithMissingCondition)).toThrow(
      'Missing primary condition'
    )
  })

  describe('handles trailing identifiers', () => {
    it('extracts data correctly when segments end without a pipe', () => {
      // arrange
      const messageWithoutTrailingPipe = validMessage.replace(
        '19700101|',
        '19700101'
      )

      // act
      const result = extractor.extract(messageWithoutTrailingPipe)

      // assert
      expect(result.dateOfBirth).toBe('1970-01-01')
    })

    it('extracts name correctly when name field ends without a pipe', () => {
      // arrange
      const messageWithoutNamePipe = validMessage.replace(
        'Smith^John^A|',
        'Smith^John^A'
      )

      // act
      const result = extractor.extract(messageWithoutNamePipe)

      // assert
      expect(result.fullName).toEqual({
        lastName: 'Smith',
        firstName: 'John',
        middleName: 'A',
      })
      expect(result.dateOfBirth).toBe('1970-01-01') 
    })

    it('handles missing middle name without trailing caret', () => {
      // arrange
      const messageWithoutMiddleNameCaret = validMessage.replace(
        'Smith^John^A',
        'Smith^John'
      )

      // act
      const result = extractor.extract(messageWithoutMiddleNameCaret)

      // assert
      expect(result.fullName).toEqual({
        lastName: 'Smith',
        firstName: 'John',
        middleName: undefined,
      })
    })

    it('handles missing middle name with trailing caret', () => {
      // arrange
      const messageWithMiddleNameCaret = validMessage.replace(
        'Smith^John^A',
        'Smith^John^'
      )

      // act
      const result = extractor.extract(messageWithMiddleNameCaret)

      // assert
      expect(result.fullName).toEqual({
        lastName: 'Smith',
        firstName: 'John',
        middleName: undefined,
      })
    })

    it('extracts primary condition correctly when DET segment ends without a pipe', () => {
      // arrange
      const messageWithoutConditionPipe = validMessage.replace(
        'Common Cold\n',
        'Common Cold'
      )

      // act
      const result = extractor.extract(messageWithoutConditionPipe)

      // assert
      expect(result.primaryCondition).toBe('Common Cold')
    })
  })
})
