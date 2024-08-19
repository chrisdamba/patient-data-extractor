// src/controllers/patientDataController.ts

import {Request, Response, NextFunction} from 'express'
import {PatientDataService} from '../services/patientData'

export class PatientDataController {
  private patientDataService: PatientDataService

  constructor(patientDataService: PatientDataService) {
    this.patientDataService = patientDataService
  }

  async processPatientData(req: Request, res: Response, next: NextFunction) {
    try {
      const {message} = req.body

      if (!message || typeof message !== 'string') {
        return res.status(400).json({error: 'Invalid message format'})
      }

      const patientData =
        await this.patientDataService.extractAndSavePatientData(message)

      res.status(200).json(patientData)
    } catch (error) {
      next(error)
    }
  }
}
