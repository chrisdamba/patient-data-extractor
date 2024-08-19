import express from 'express'
import {processPatientData} from '../controllers/patientData'

const router = express.Router()

router.post('/process', processPatientData)

export {router as patientDataRouter}
