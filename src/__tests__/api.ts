import request from 'supertest'
import express from 'express'
import {patientDataRouter} from '../routes/patientData'
import {errorHandler} from '../middleware/errorHandler'

const app = express()
app.use(express.json())
app.use('/api/patient-data', patientDataRouter)
app.use(errorHandler)

describe('Patient Data API', () => {
  const validMessage = `
MSG|^~\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
EVT|TYPE|20230502112233
PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19700101|
DET|1|I|^^MainDepartment^101^Room 1|Common Cold
  `.trim()

  it('should process valid patient data', async () => {
    const response = await request(app)
      .post('/api/patient-data/process')
      .send({message: validMessage})
      .expect('Content-Type', /json/)
      .expect(200)

    expect(response.body).toEqual({
      fullName: {
        lastName: 'Smith',
        firstName: 'John',
        middleName: 'A',
      },
      dateOfBirth: '1970-01-01',
      primaryCondition: 'Common Cold',
    })
  })

  it('should handle invalid message format', async () => {
    const response = await request(app)
      .post('/api/patient-data/process')
      .send({message: 'Invalid message'})
      .expect('Content-Type', /json/)
      .expect(500)

    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Internal Server Error')
  })

  it('should handle missing message', async () => {
    const response = await request(app)
      .post('/api/patient-data/process')
      .send({})
      .expect('Content-Type', /json/)
      .expect(400)

    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Invalid message format')
  })

  it('should handle non-string message', async () => {
    const response = await request(app)
      .post('/api/patient-data/process')
      .send({message: 123})
      .expect('Content-Type', /json/)
      .expect(400)

    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Invalid message format')
  })
})
