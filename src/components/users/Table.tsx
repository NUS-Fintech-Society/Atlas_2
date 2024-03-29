import { trpc } from '~/utils/trpc'
import {
  type Table as ReactTable,
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
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
        <tr key={headerGroup.id} className="prose bg-[#01003D] text-white">
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              colSpan={header.colSpan}
              className="prose text-white"
            >
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
                <td
                  key={cell.id}
                  className="border-x border-[#01003D] py-2 px-2"
                >
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

  const { isLoading, data } = trpc.user.getAllUsersForTable.useQuery()

  const table = useReactTable<User>({
    columns,
    data: data ?? [],
    getCoreRowModel: getCoreRowModel(),
  })

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <div className="mx-auto my-10 w-3/4">
      <h1 className="prose mb-5 py-3 text-4xl font-semibold">Manage Users</h1>
      <Link href="/users/create">
        <Button bgColor="#97AEFF" width={215} className="mb-10 text-black">
          Create User(s)
        </Button>
      </Link>

      <table className="min-w-full">
        <TableHeader table={table} />
        <TableBody table={table} />
      </table>
    </div>
  )
}
