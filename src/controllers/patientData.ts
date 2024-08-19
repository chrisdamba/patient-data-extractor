import {Request, Response, NextFunction} from 'express'
import {PatientDataExtractor} from '../patientDataExtractor'

const extractor = new PatientDataExtractor()

export const processPatientData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {message} = req.body

    if (!message || typeof message !== 'string') {
      return res.status(400).json({error: 'Invalid message format'})
    }

    const patientData = extractor.extract(message)

    // Here we would typically save the data to a database
    // await patientService.save(patientData)
    // For now, we'll just return the processed data

    res.status(200).json(patientData)
  } catch (error) {
    next(error)
  }
}
