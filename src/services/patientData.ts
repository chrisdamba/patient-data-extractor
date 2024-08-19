import {PatientData, PatientDataExtractor} from '../patientDataExtractor'

export interface PatientDataService {
  extractAndSavePatientData(message: string): Promise<PatientData>
}

export class MongoPatientDataService implements PatientDataService {
  private db: any // This would be the MongoDB client in a real implementation
  private extractor: PatientDataExtractor

  constructor(db: any, extractor: PatientDataExtractor) {
    this.db = db
    this.extractor = extractor
  }

  async extractAndSavePatientData(message: string): Promise<PatientData> {
    const patientData = this.extractor.extract(message)
    await this.savePatientData(patientData)
    return patientData
  }

  private async savePatientData(data: PatientData): Promise<void> {
    // In a real implementation, this would save to MongoDB
    console.log('Saving patient data:', data)
    if (this.db.collection && typeof this.db.collection === 'function') {
      await this.db.collection('patients').insertOne(data);
    } else {
      // Fallback for tests or environments without a real MongoDB
      console.log('Saving patient data to MongoDB:', data);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}
