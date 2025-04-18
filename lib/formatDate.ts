export function formatDateTime(dateStr: string): string {
    const date = new Date(dateStr)
    const day = date.getDate().toString().padStart(2, '0')
    const month = date.getMonth().toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
  
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
  }

  export function getCreatedAtId(createdAt: Date): number {
    const pad = (n: number) => String(n).padStart(2, '0')

    const createdAtId = 
      createdAt.getFullYear().toString() +
      pad(createdAt.getMonth() + 1) +
      pad(createdAt.getDate()) +
      pad(createdAt.getHours()) +
      pad(createdAt.getMinutes()) +
      pad(createdAt.getSeconds())
    return parseInt(createdAtId)
  }
  