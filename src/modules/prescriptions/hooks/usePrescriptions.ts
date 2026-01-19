import { useState } from 'react'
import type { PrescriptionTableData } from '@/api/prescriptions/types/prescription.types'

export const usePrescriptions = (initialData: PrescriptionTableData[] = []) => {
  const [prescriptions, setPrescriptions] = useState<PrescriptionTableData[]>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = async (fetchFunction: () => Promise<PrescriptionTableData[]>) => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchFunction()
      setPrescriptions(data)
    } catch (err) {
      console.error('Error refetching prescriptions:', err)
      setError(err instanceof Error ? err.message : 'Error al recargar prescripciones')
    } finally {
      setLoading(false)
    }
  }

  return {
    prescriptions,
    loading,
    error,
    refetch,
    setPrescriptions,
  }
}
