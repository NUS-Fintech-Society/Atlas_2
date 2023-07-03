import { trpc } from '~/utils/trpc'
import {
  type Table as ReactTable,
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  type PaginationState,
  flexRender,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import LoadingScreen from '../common/LoadingScreen'
import Link from 'next/link'
import { Button, useDisclosure } from '@chakra-ui/react'
import EditModal from './EditModal'
import { ModalContext } from '~/context/ModalContext'

type User = {
  name: string | null
  role: string | null
  department: string | null
  email: string
  isAdmin: boolean
  id: string
}

const useColumns = () => {
  const {
    isOpen: editIsOpen,
    onOpen: editOnOpen,
    onClose: editOnClose,
  } = useDisclosure()
  const [id, setId] = useState('')

  return useMemo<ColumnDef<User>[]>(
    () => [
      {
        header: 'Users',
        columns: [
          {
            accessorKey: 'id',
            cell: (info) => info.getValue(),
            header: 'No.',
            footer: (props) => props.column.id,
          },
          {
            accessorKey: 'name',
            cell: (info) => info.getValue(),
            header: 'Name',
            footer: (props) => props.column.id,
          },
          {
            accessorKey: 'email',
            cell: (info) => info.getValue(),
            header: 'Email',
            footer: (props) => props.column.id,
          },
          {
            accessorKey: 'department',
            cell: (info) => info.getValue(),
            header: 'Department',
            footer: (props) => props.column.id,
          },
          {
            accessorKey: 'role',
            cell: (info) => info.getValue(),
            header: 'Role',
            footer: (props) => props.column.id,
          },
          {
            accessorKey: 'isAdmin',
            cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            header: 'Admin',
            footer: (props) => props.column.id,
          },
          {
            title: 'Edit',
            accessorKey: 'Users',
            cell: (info) => {
              return (
                <>
                  <Button
                    onClick={() => {
                      setId(info.row.original.id)
                      editOnOpen()
                    }}
                  >
                    Edit
                  </Button>
                  <ModalContext.Provider
                    value={{
                      id,
                      isOpen: editIsOpen,
                      onClose: editOnClose,
                    }}
                  >
                    <EditModal />
                  </ModalContext.Provider>
                </>
              )
            },
            footer: (props) => props.column.id,
          },
        ],
      },
    ],
    [editIsOpen, editOnClose, editOnOpen, id]
  )
}

const TableHeader = ({ table }: { table: ReactTable<User> }) => {
  return (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} className="bg-[#01003D] text-xl text-white">
          {headerGroup.headers.map((header) => (
            <th key={header.id} colSpan={header.colSpan}>
              {header.isPlaceholder ? null : (
                <div>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </div>
              )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  )
}

const TableBody = ({ table }: { table: ReactTable<User> }) => {
  return (
    <tbody className="border border-[#01003D] text-center text-[15px]">
      {table.getRowModel().rows.map((row) => {
        return (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => {
              return (
                <td key={cell.id} className="border-x border-[#01003D]">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              )
            })}
          </tr>
        )
      })}
    </tbody>
  )
}

export default function DataTable() {
  const columns = useColumns()
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const fetchDataOption = { pageIndex, pageSize }
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const { isLoading, data } = trpc.user.getAllUsersForTable.useQuery(
    fetchDataOption,
    {
      keepPreviousData: true,
      staleTime: 5000,
    }
  )

  const table = useReactTable<User>({
    columns,
    data: data?.users || [],
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onPaginationChange: setPagination,
    pageCount: data?.pageCount || -1,
    state: { pagination },
  })

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <div className="mx-auto w-3/4">
      <h1 className="mb-12 flex w-full justify-center text-4xl font-normal">
        Manage Users
      </h1>

      <div>
        <Link href="/users/create">
          <Button bgColor="#97AEFF" width={215} className="mb-10 text-black">
            Create User(s)
          </Button>
        </Link>
      </div>

      <table className="min-w-full font-[inter]">
        <TableHeader table={table} />
        <TableBody table={table} />
      </table>
      <div className="mt-5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="rounded border p-1"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            className="rounded border p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>

          <button
            className="rounded border p-1"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
            className="rounded border p-1"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>
        </div>
      </div>
    </div>
  )
}
