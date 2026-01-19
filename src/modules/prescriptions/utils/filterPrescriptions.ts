import type { PrescriptionTableData } from '@/api/prescriptions/types/prescription.types'

/**
 * Gets the prescription status from prescription data
 */
export const getPrescriptionStatusFromData = (prescription: PrescriptionTableData): string => {
  return prescription.status
}

/**
 * Filters prescriptions by status type
 */
export const filterPrescriptionsByStatus = (
  prescriptions: PrescriptionTableData[],
  statusFilter: string
): PrescriptionTableData[] => {
  if (statusFilter === 'all') {
    return prescriptions
  }

  return prescriptions.filter((prescription) => {
    const status = getPrescriptionStatusFromData(prescription)
    return status === statusFilter
  })
}
