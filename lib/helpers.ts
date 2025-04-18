import * as XLSX from 'xlsx'
import api from './axios'

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
