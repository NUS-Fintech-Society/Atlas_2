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
import { Spinner } from '@chakra-ui/react'

type User = {
  name: string | null
  roles: string | null
  department: string | null
  email: string
  id: string
}

const useColumns = () => {
  return useMemo<ColumnDef<User>[]>(
    () => [
      {
        header: 'Manage Users',
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
            accessorKey: 'roles',
            cell: (info) => info.getValue(),
            header: 'Role',
            footer: (props) => props.column.id,
          },
        ],
      },
    ],
    []
  )
}

const TableHeader = ({ table }: { table: ReactTable<User> }) => {
  return (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
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
    <tbody className="text-center">
      {table.getRowModel().rows.map((row) => {
        return (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => {
              return (
                <td key={cell.id}>
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

const NavigationButton = ({ table }: { table: ReactTable<User> }) => {
  return (
    <div className="flex items-center gap-2">
      {table.getCanPreviousPage() ? (
        <>
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
        </>
      ) : null}
      {table.getCanNextPage() ? (
        <>
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
        </>
      ) : null}
    </div>
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
    <Spinner />
  ) : (
    <table>
      <TableHeader table={table} />
      <TableBody table={table} />
      <NavigationButton table={table} />

      {/* ------- Select Page Size ------- */}
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          console.log(e.target.value)
          table.setPageSize(Number(e.target.value))
        }}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
      {/* ------- Select Page Size ------- */}

      <div>{table.getRowModel().rows.length} Users</div>
    </table>
  )
}
