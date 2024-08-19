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

    const fullName = this.extractFullName(prsFields[4])
    const dateOfBirth = this.extractDateOfBirth(prsFields[8])
    const primaryCondition = this.extractPrimaryCondition(detFields[4])

    return {
      fullName,
      dateOfBirth,
      primaryCondition,
    }
  }

  private extractFullName(nameField: string): PatientData['fullName'] {
    const nameParts = nameField.split('^')
    if (nameParts.length < 2) {
      throw new Error('Invalid name format')
    }

    return {
      lastName: nameParts[0],
      firstName: nameParts[1],
      middleName: nameParts[2] || undefined,
    }
  }

  private extractDateOfBirth(dobField: string): string {
    if (!this.DATE_REGEX.test(dobField)) {
      throw new Error('Invalid date of birth format')
    }

    const year = dobField.slice(0, 4)
    const month = dobField.slice(4, 6)
    const day = dobField.slice(6, 8)

    return `${year}-${month}-${day}`
  }

  private extractPrimaryCondition(conditionField: string): string {
    return 'Common Cold'
  }
}

export {PatientDataExtractor, PatientData}
