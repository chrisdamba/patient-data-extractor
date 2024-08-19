import express from 'express'
import {PatientDataController} from '../controllers/patientData'
import {PatientDataExtractor} from '../utils/patientDataExtractor'
import {MongoPatientDataService} from '../services/patientData'

const router = express.Router()

// In a real application, initialise MongoDB client here
const mockDb = {}

const patientDataExtractor = new PatientDataExtractor()
const patientDataService = new MongoPatientDataService(
  mockDb,
  patientDataExtractor
)
const patientDataController = new PatientDataController(patientDataService)

router.post('/process', (req, res, next) =>
  patientDataController.processPatientData(req, res, next)
)

export {router as patientDataRouter}
