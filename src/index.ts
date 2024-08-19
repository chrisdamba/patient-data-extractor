import express from 'express'
import {patientDataRouter} from './routes/patientData'
import {errorHandler} from './middleware/errorHandler'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/api/patient-data', patientDataRouter)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
