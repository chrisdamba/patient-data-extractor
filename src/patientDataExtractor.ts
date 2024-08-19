interface PatientData {
  fullName: {
    lastName: string
    firstName: string
    middleName?: string
  }
  dateOfBirth: string
  primaryCondition: string
}

class PatientDataExtractor {
  private readonly DATE_REGEX = /^\d{8}$/

  public extract(message: string): PatientData {
    const segments = message.split('\n')
    const prsSegment = segments.find((seg) => seg.startsWith('PRS'))
    const detSegment = segments.find((seg) => seg.startsWith('DET'))

    if (!prsSegment || !detSegment) {
      throw new Error('Invalid message format: Missing required segments')
    }

    const prsFields = prsSegment.split('|')
    const detFields = detSegment.split('|')

    const fullName = this.extractFullName(prsFields[5])
    const dateOfBirth = this.extractDateOfBirth(prsFields[8])
    const primaryCondition = this.extractPrimaryCondition(detFields[4])

    return {
      fullName,
      dateOfBirth,
      primaryCondition,
    }
  }

  private extractFullName(nameField: string): PatientData['fullName'] {
    return {
      lastName: '',
      firstName: '',
      middleName: '',
    }
  }

  private extractDateOfBirth(dobField: string): string {
    return ''
  }

  private extractPrimaryCondition(conditionField: string): string {
    return ''
  }
}

export {PatientDataExtractor, PatientData}
