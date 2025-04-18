'use client'

import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { formatKeyLabel, formatObjValue } from "@/lib/helpers"
type ChangeSnapshot = Record<string, any>

interface Props {
  changesJson: string
}

export default function ChangeDiffTable({ changesJson }: Props) {
  let before: ChangeSnapshot | undefined
  let after: ChangeSnapshot | undefined

  try {
    const parsed = JSON.parse(changesJson)
    before = parsed.before || {}
    after = parsed.after || {}
  } catch (error) {
    return <div className="text-red-500">Invalid change JSON</div>
  }

  const allKeys = Array.from(new Set([
    ...Object.keys(before || {}),
    ...Object.keys(after || {})
  ]))

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-[100px] whitespace-normal break-words">
                Field
              </TableHead>
              <TableHead className="max-w-[100px] whitespace-normal break-words">
                Before
              </TableHead>
              <TableHead className="max-w-[100px] whitespace-normal break-words">
                After
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allKeys.map((key) => (
              <TableRow key={key}>
                <TableCell className="align-top max-w-[100px] whitespace-normal break-words font-medium">
                  {formatKeyLabel(key)}
                </TableCell>
                <TableCell className="align-top max-w-[100px] whitespace-normal break-words">
                  {formatObjValue(before?.[key], key)}
                </TableCell>
                <TableCell className="align-top max-w-[100px] whitespace-normal break-words">
                  {formatObjValue(after?.[key], key)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function formatValue(value: any): string {
  if (value === undefined || value === null) return "—"
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}
