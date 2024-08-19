import {MongoPatientDataService} from '../services/patientData'
import {PatientDataExtractor, PatientData} from '../utils/patientDataExtractor'

describe('MongoPatientDataService', () => {
  let service: MongoPatientDataService
  let mockDb: jest.Mocked<any>
  let mockExtractor: jest.Mocked<PatientDataExtractor>

  beforeEach(() => {
    mockDb = {
      collection: jest.fn().mockReturnThis(),
      insertOne: jest.fn().mockResolvedValue({insertedId: 'some-id'}),
    }

    mockExtractor = {
      extract: jest.fn(),
    } as any

    service = new MongoPatientDataService(mockDb, mockExtractor)
  })

  describe('extractAndSavePatientData', () => {
    it('extracts and saves patient data successfully', async () => {
      const message = 'some patient data message'
      const mockPatientData: PatientData = {
        fullName: {lastName: 'Doe', firstName: 'John', middleName: 'A'},
        dateOfBirth: '1990-01-01',
        primaryCondition: 'Healthy',
      }

      mockExtractor.extract.mockReturnValue(mockPatientData)

      const result = await service.extractAndSavePatientData(message)

      expect(mockExtractor.extract).toHaveBeenCalledWith(message)
      expect(mockDb.collection).toHaveBeenCalledWith('patients')
      expect(mockDb.insertOne).toHaveBeenCalledWith(mockPatientData)
      expect(result).toEqual(mockPatientData)
    })

    it('throws an error if extraction fails', async () => {
      const message = 'invalid message'
      const extractionError = new Error('Extraction failed')

      mockExtractor.extract.mockImplementation(() => {
        throw extractionError
      })

      await expect(service.extractAndSavePatientData(message)).rejects.toThrow(
        extractionError
      )
      expect(mockExtractor.extract).toHaveBeenCalledWith(message)
      expect(mockDb.insertOne).not.toHaveBeenCalled()
    })

    it('throws an error if saving to database fails', async () => {
      const message = 'some patient data message'
      const mockPatientData: PatientData = {
        fullName: {lastName: 'Doe', firstName: 'John', middleName: 'A'},
        dateOfBirth: '1990-01-01',
        primaryCondition: 'Healthy',
      }
      const dbError = new Error('Database error')

      mockExtractor.extract.mockReturnValue(mockPatientData)
      mockDb.insertOne.mockRejectedValue(dbError)

      await expect(service.extractAndSavePatientData(message)).rejects.toThrow(
        dbError
      )
      expect(mockExtractor.extract).toHaveBeenCalledWith(message)
      expect(mockDb.collection).toHaveBeenCalledWith('patients')
      expect(mockDb.insertOne).toHaveBeenCalledWith(mockPatientData)
    })
  })
})
