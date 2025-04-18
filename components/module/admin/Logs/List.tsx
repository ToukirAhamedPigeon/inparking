'use client'
import React, { useMemo } from 'react'
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, ColumnDef, SortingState, OnChangeFn} from '@tanstack/react-table'
import { motion } from 'framer-motion'
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'
import { useAuth } from '@/contexts/AuthContext'
import { ILog, EActionType } from '@/types'
import { useTable } from '@/hooks/useTable'
import { useDetailModal } from '@/hooks/useDetailModal'
import Modal from '@/components/custom/Modal'
import {RowActions,IndexCell,TableHeaderActions,TablePaginationFooter,TableLoader} from '@/components/custom/Table'
import { formatDateTime } from '@/lib/formatDate'
import { capitalize, exportExcel } from '@/lib/helpers'
import { Badge } from '@/components/ui/badge'
import api from '@/lib/axios'
import Detail from './Detail'

export default function LogListTable() {
  //Auth Hook
  const authUser = localStorage.getItem('authUser')
  const token = JSON.parse(authUser || '{}').token

  //Table Hook
  const { data, totalCount, loading, globalFilter, setGlobalFilter, sorting, setSorting, pageIndex, setPageIndex, pageSize, setPageSize} =
   useTable<ILog>({
    fetcher: async ({ q, page, limit, sortBy, sortOrder }) => {
      const res = await api.get('/logs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q,
          page,
          limit,
          sortBy: sortBy || 'createdAt',
          sortOrder: sortOrder || 'desc',
        },
      })
      console.log(res.data)
  
      return {
        data: res.data.logs as ILog[],
        total: res.data.totalCount,
      }
    },
  })

  //Detail Modal Hook
  const {isModalOpen,selectedItem,fetchDetail,closeModal: closeDetailModal} = useDetailModal<ILog>('/logs')

  //Columns
  const columns = useMemo<ColumnDef<ILog>[]>(() => [
    {
      header: 'SL',
      cell: ({ row }) => (
        <IndexCell rowIndex={row.index} pageIndex={pageIndex} pageSize={pageSize} />
      ),
      meta: {
        customClassName: 'text-center',
      },
    },
    {
      header: 'Action',
      cell: ({ row }) => (
        <RowActions
          row={row.original}
          onDetail={() => fetchDetail(row.original._id.toString())}
        />
      ),
    },
    {
      header: 'Detail',
      accessorKey: 'detail',
    },
    {
      header: 'Action Type',
      accessorKey: 'actionType',
      cell: ({ getValue }) => capitalize(getValue() as string),
    },
    {
      header: 'Collection Name',
      accessorKey: 'collectionName',
      cell: ({ getValue }) => capitalize(getValue() as string),
    },
    {
      header: 'Object ID',
      accessorKey: 'objectId',
    },
    {
      header: 'Object Name',
      accessorKey: 'changes',
      cell: ({ row }) => {
        const changes = JSON.parse(row.original.changes as string)
        if (row.original.actionType === EActionType.CREATE || row.original.actionType === EActionType.UPDATE) {
          if (row.original.collectionName === 'Allotment') {
            return changes.after.guestName
          }
          else if (row.original.collectionName === 'Image') {
            return changes.after.imageTitle
          }
          else if (row.original.collectionName === 'Route') {
            return changes.after.fromAddress+' to '+changes.after.toAddress
          }
          else if (row.original.collectionName === 'Slot') {
            return changes.after.slotNumber
          }
          else {
            return changes.after.name
          }
        }
        else if (row.original.actionType === EActionType.DELETE) {
          if (row.original.collectionName === 'Allotment') {
            return changes.before.guestName
          }
          else if (row.original.collectionName === 'Image') {
            return changes.before.imageTitle
          }
          else if (row.original.collectionName === 'Route') {
            return changes.before.fromAddress+' to '+changes.before.toAddress
          }
          else if (row.original.collectionName === 'Slot') {
            return changes.before.slotNumber
          }
          else {
            return changes.before.name
          }
        }
        return 'N/A'
      },
    },

    {
      header: 'Created By',
      accessorKey: 'createdBy.name',
      cell: ({ row }) => {
        const creator = row.original.createdBy;
        return typeof creator === 'object' ? creator.name : 'Unknown';
      },
    },
    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: ({ getValue }) => formatDateTime(getValue() as string),
    }
  ], [pageIndex])

  //Table
  const table = useReactTable({
    data,
    columns: columns as ColumnDef<any>[],
    state: { sorting, pagination: { pageIndex, pageSize } },
    onSortingChange: setSorting as OnChangeFn<SortingState>,
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.ceil(totalCount / pageSize),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    //Main Container
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Header Actions */}
      <TableHeaderActions
        searchValue={globalFilter}
        onSearchChange={setGlobalFilter}
        onPrint={() => window.print()}
        onExport={() => exportExcel({ data, fileName: 'Logs', sheetName: 'Logs' })}
      />

      {/* Table */}
      <TableLoader loading={loading} />
      <div className="relative overflow-auto rounded-xl shadow">
        <table className="table-auto w-full text-left border">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="bg-gray-100">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className={`p-2 border ${
                      (header.column.columnDef.meta as { customClassName?: string })?.customClassName || ''
                    }`}
                  >
                    <div
                      className="flex justify-between items-center w-full cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                      <span className="ml-2">
                        {header.column.getIsSorted() === 'asc' ? (
                          <FaSortUp size={12} />
                        ) : header.column.getIsSorted() === 'desc' ? (
                          <FaSortDown size={12} />
                        ) : (
                          <FaSort size={12} />
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <TablePaginationFooter
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalCount={totalCount}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
      />

        {/* Detail Modal */}
      <Modal isOpen={isModalOpen} onClose={closeDetailModal} title="Log Details">
        <Detail log={selectedItem} />
      </Modal>

    </motion.div>
  )
}
