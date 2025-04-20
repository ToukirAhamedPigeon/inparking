'use client'
import React, { useMemo } from 'react'
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, ColumnDef, SortingState, OnChangeFn} from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'
import { useAuth } from '@/contexts/AuthContext'
import { IZone } from '@/types'
import { useTable } from '@/hooks/useTable'
import { useDetailModal } from '@/hooks/useDetailModal'
import { useEditModal } from '@/hooks/useEditModal'
import { useDeleteWithConfirm } from '@/hooks/useDeleteWithConfirm'
import Modal from '@/components/custom/Modal'
import ConfirmDialog from '@/components/custom/ConfirmDialog'
import ZoneDetail from './ZoneDetail'
import {RowActions,IndexCell,TableHeaderActions,TablePaginationFooter,TableLoader} from '@/components/custom/Table'
import { formatDateTime } from '@/lib/formatDate'
import { exportExcel } from '@/lib/helpers'
import { Badge } from '@/components/ui/badge'
import api from '@/lib/axios'
import EditZoneForm from './Edit'

export default function ZoneListTable() {
  //Router Hook
  const router = useRouter()
  //Auth Hook
  const { user } = useAuth()
  const authUser = localStorage.getItem('authUser')
  const token = JSON.parse(authUser || '{}').token

  //Table Hook
  const { data, totalCount, loading, globalFilter, setGlobalFilter, sorting, setSorting, pageIndex, setPageIndex, pageSize, setPageSize, fetchData,} =
   useTable<IZone>({
    fetcher: async ({ q, page, limit, sortBy, sortOrder }) => {
      const res = await api.get('/zones', {
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
  
      return {
        data: res.data.zones as IZone[],
        total: res.data.totalCount,
      }
    },
  })

  //Detail Modal Hook
  const {isModalOpen,selectedItem,fetchDetail,closeModal: closeDetailModal} = useDetailModal<IZone>('/zones')

  //Edit Modal Hook
  const {isOpen: isEditModalOpen,itemToEdit: zoneToEdit,openEdit: handleEditClick,closeEdit: closeEditModal} = useEditModal<IZone>()

  //Delete Modal Hook
  const {dialogOpen,confirmDelete,cancelDelete,handleDelete} = useDeleteWithConfirm({
    endpoint: '/zones',
    onSuccess: fetchData,
  })

  //Columns
  const columns = useMemo<ColumnDef<IZone>[]>(() => [
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
          onEdit={() => handleEditClick(row.original)}
          onDelete={() => confirmDelete(row.original._id.toString())}
        />
      ),
    },
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Address',
      accessorKey: 'address',
    },
    {
      header: 'Contact Name',
      accessorKey: 'contactName',
    },
    {
      header: 'Contact No',
      accessorKey: 'contactNo',
    },
    {
      header: 'Latitude',
      accessorKey: 'latitude',
    },
    {
      header: 'Longitude',
      accessorKey: 'longitude',
    },
    {
      header: 'Status',
      accessorKey: 'isActive',
      cell: ({ getValue }) => (
        <Badge variant={getValue() ? 'success' : 'destructive'}>
          {getValue() ? 'Active' : 'Inactive'}
        </Badge>
      ),
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
    },
    {
      header: 'Updated By',
      accessorKey: 'updatedBy.name',
      cell: ({ row }) => {
        const updater = row.original.updatedBy;
        return typeof updater === 'object' ? updater.name : 'Unknown';
      },
    },
    {
      header: 'Updated At',
      accessorKey: 'updatedAt',
      cell: ({ getValue }) => formatDateTime(getValue() as string),
    },
  ], [pageIndex, user?.role])

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
        onAddNew={() => router.push('/admin/zones/add')}
        onPrint={() => window.print()}
        onExport={() => exportExcel({ data, fileName: 'Zones', sheetName: 'Zones' })}
        addButtonLabel="Add New Zone"
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
      <Modal isOpen={isModalOpen} onClose={closeDetailModal} title="Zone Details">
        {selectedItem && (
          <ZoneDetail zone={selectedItem} />
        )}
      </Modal>

      {/* Edit Modal */}  
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Edit Zone"
        titleClassName="text-2xl font-bold text-gray-700 text-center"
      >
        {zoneToEdit && (
          <EditZoneForm
            zoneData={zoneToEdit}
            onClose={closeEditModal}
            onSuccess={() => {
              closeEditModal()
              fetchData()
            }}
          />
        )}
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={dialogOpen}
        onCancel={cancelDelete}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        description="Are you sure you want to delete this zone?"
        confirmLabel="Delete"
      />
    </motion.div>
  )
}
