'use client'
import React, { useEffect, useState } from 'react'
import api from '@/lib/axios'
import { ColumnDef, OnChangeFn, SortingState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { FaSort, FaSortUp, FaSortDown, FaPrint, FaFileExcel, FaTrash, FaEdit, FaEye, FaPlus } from 'react-icons/fa'
import * as XLSX from 'xlsx'
import { EUserRole } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import Fancybox from '@/components/custom/FancyBox'
import { formatDateTime } from '@/lib/formatDate'
import { useRouter } from 'next/navigation'
import Modal from '@/components/custom/Modal'
import Detail from './Detail'
import { toast } from 'sonner'
import ConfirmDialog from '@/components/custom/ConfirmDialog'

export default function UserListTable() {
  const { user } = useAuth()
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])
  const [pageSize, setPageSize] = useState(10)
  const [pageIndex, setPageIndex] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)  // State to track modal visibility
  const [selectedUser, setSelectedUser] = useState<any>(null)  // State to store selected user details
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const authUser = localStorage.getItem('authUser')
  const token = JSON.parse(authUser || '{}').token

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await api.get('/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          q: globalFilter,
          page: pageIndex + 1,
          limit: pageSize,
        },
      })
      setData(res.data.users)
      setTotalCount(res.data.totalCount)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserDetail = async (id: string) => {
    try {
      const res = await api.get(`/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })
      setSelectedUser(res.data)
      setIsModalOpen(true)  // Open modal when user data is fetched
    } catch (error) {
      console.error('Error fetching user detail:', error)
    }
  }
  const confirmDeleteUser = (id: string) => {
    setUserToDelete(id)
    setConfirmDialogOpen(true)
  }
  const handleDeleteUser = async () => {
    if (!userToDelete) return
    try {
      const res = await api.delete(`/users/${userToDelete}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })
      const { status, message } = res.data

      if (status === 'deleted') {
        toast.success('User deleted successfully')
      } else if (status === 'inactive') {
        toast.warning('User has past activity, made inactive')
      }
      fetchData()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Something went wrong while deleting user')
    } finally {
      setUserToDelete(null)
      setConfirmDialogOpen(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [globalFilter, pageIndex, pageSize])

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  const columns = [
    {
      header: 'SL',
      cell: ({ row }: { row: any }) => row.index + 1 + pageIndex * pageSize,
    },
    {
      header: 'Action',
      cell: ({ row }: { row: any }) => (
        <div className="flex gap-2">
          <Button size="sm" variant="info" onClick={() => fetchUserDetail(row.original._id)}>
            <FaEye /> Detail
          </Button>
          <Button size="sm" variant="warning">
            <FaEdit /> Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={() => confirmDeleteUser(row.original._id)}>
            <FaTrash /> Delete
          </Button>
        </div>
      ),
    },
    {
      header: 'Name',
      accessorKey: 'name',
      meta: {
        customClassName: 'min-w-[250px]',
      },
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    user?.role === EUserRole.DEVELOPER && {
      header: 'Decrypted Password',
      accessorKey: 'decryptedPassword',
    },
    {
      header: 'Profile Picture',
      cell: ({ row }: { row: any }) => (
        <Fancybox src={row.original.profilePictureUrl} alt={row.original.name} className='w-14 h-14 rounded-full' />
      ),
    },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: ({ getValue }: { getValue: () => string }) => capitalize(getValue()),
    },
    {
      header: 'Status',
      accessorKey: 'isActive',
      cell: ({ getValue }: { getValue: () => boolean }) => (
        <Badge variant={getValue() ? 'success' : 'destructive'}>
          {getValue() ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: ({ getValue }: { getValue: () => string }) => formatDateTime(getValue()),
      meta: {
        customClassName: 'min-w-[250px]',
      },
    },
    {
      header: 'Updated At',
      accessorKey: 'updatedAt',
      cell: ({ getValue }: { getValue: () => string }) => formatDateTime(getValue()),
      meta: {
        customClassName: 'min-w-[250px]',
      },
    },
  ].filter(Boolean)

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<any>[],
    state: { sorting, pagination: { pageIndex, pageSize } },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting as OnChangeFn<SortingState>,
    manualPagination: true,
    manualSorting: false,
    pageCount: Math.ceil(totalCount / pageSize),
  })

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Users')
    XLSX.writeFile(wb, 'Users.xlsx')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: 'easeInOut' }}>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search users..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-1/3"
        />
        <div className="flex gap-2">
          <Button variant="success" onClick={() => router.push('/admin/users/register')}><FaPlus /> <span className='hidden md:block'>Register New User</span></Button>
          <Button variant="info" onClick={() => window.print()}><FaPrint /> <span className='hidden md:block'>Print</span></Button>
          <Button variant="success" onClick={exportExcel}><FaFileExcel /> <span className='hidden md:block'>Export Excel</span></Button>
        </div>
      </div>

      <div className="overflow-auto rounded-xl shadow">
      {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
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
        )}
      </div>

      <div className="flex justify-between items-center mt-4 text-sm">
        <span>
          Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, totalCount)} of {totalCount}
        </span>
        <div className="flex gap-2 items-center">
          <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
            {[5, 10, 20, 30, 40, 50].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <Button onClick={() => setPageIndex(old => Math.max(old - 1, 0))} disabled={pageIndex === 0}>
            Previous
          </Button>
          <Button onClick={() => setPageIndex(old => old + 1)} disabled={(pageIndex + 1) * pageSize >= totalCount}>
            Next
          </Button>
        </div>
      </div>
    {/* Modal to display user details */}
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="User Details">
      <Detail user={selectedUser} />
    </Modal>
    <ConfirmDialog
        open={confirmDialogOpen}
        onCancel={() => setConfirmDialogOpen(false)}
        onConfirm={handleDeleteUser}
        title="Confirm Deletion"
        description="Are you sure you want to delete this user?"
        confirmLabel="Delete"
      />
    </motion.div>
  )
}
