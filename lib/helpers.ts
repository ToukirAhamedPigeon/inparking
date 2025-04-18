import * as XLSX from 'xlsx'
import api from './axios'
import { formatDateTime } from './formatDate'

export const exportExcel = ({data, fileName, sheetName}: {data: any, fileName: string, sheetName: string}) => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
    XLSX.writeFile(wb, `${fileName}.xlsx`)
  }

  export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  export const checkEmailExists = async (
    email: string,
    token: string,
    exceptFieldValue?: string,
    exceptFieldName: string = '_id'
    ): Promise<boolean> => {
    try {
        const res = await api.post(
        `/auth/check-email`,
        {
            email,
            exceptFieldName,
            exceptFieldValue,
        },
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        )

        return res.data.exists
    } catch (error) {
        console.error('Error checking email:', error)
        return false
    }
 }

 export function omitFields<T extends Record<string, any>>(obj: T, fields: string[]): Partial<T> {
    const result = { ...obj }
    for (const field of fields) {
      delete result[field]
    }
    return result
  }

  export function formatKeyLabel(key: string): string {
    // Remove leading underscores
    const cleanKey = key.replace(/^_+/, '')
  
    // Convert camelCase or PascalCase to "Title Case with Spaces"
    const spaced = cleanKey.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  
    // Capitalize first letter
    return spaced.charAt(0).toUpperCase() + spaced.slice(1)
  }

  export function formatObjValue(value: any, key?: string): string {
    if (value === undefined || value === null) return "—"
    if ((key === 'createdAt' || key === 'updatedAt') && (typeof value === 'string' || value instanceof Date)) {
        const dateStr = value instanceof Date ? value.toISOString() : String(value)
        return formatDateTime(dateStr)
    }
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }
