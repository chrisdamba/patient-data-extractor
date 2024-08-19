// src/__tests__/patientDataController.test.ts

import {Request, Response} from 'express'
import {PatientDataController} from '../controllers/patientData'
import {PatientDataService} from '../services/patientData'

describe('PatientDataController', () => {
  let controller: PatientDataController
  let mockPatientDataService: jest.Mocked<PatientDataService>
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: jest.Mock

  beforeEach(() => {
    mockPatientDataService = {
      extractAndSavePatientData: jest.fn(),
    } as any
    controller = new PatientDataController(mockPatientDataService)

    mockRequest = {}
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    nextFunction = jest.fn()
  })

  it('processes valid patient data and correctly returns 200', async () => {
    const mockPatientData = {
      fullName: {lastName: 'Doe', firstName: 'John'},
      dateOfBirth: '1990-01-01',
      primaryCondition: 'Healthy',
    }
    mockRequest.body = {message: 'valid message'}
    mockPatientDataService.extractAndSavePatientData.mockResolvedValue(
      mockPatientData
    )

    await controller.processPatientData(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )

    expect(
      mockPatientDataService.extractAndSavePatientData
    ).toHaveBeenCalledWith('valid message')
    expect(mockResponse.status).toHaveBeenCalledWith(200)
    expect(mockResponse.json).toHaveBeenCalledWith(mockPatientData)
  })

  it('returns 400 for invalid message format', async () => {
    mockRequest.body = {message: 123} // Invalid message (not a string)

    await controller.processPatientData(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Invalid message format',
    })
  })

  it('calls next function with error if processing fails', async () => {
    mockRequest.body = {message: 'valid message'}
    const mockError = new Error('Processing failed')
    mockPatientDataService.extractAndSavePatientData.mockRejectedValue(
      mockError
    )

    await controller.processPatientData(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )

    expect(nextFunction).toHaveBeenCalledWith(mockError)
  })
})
