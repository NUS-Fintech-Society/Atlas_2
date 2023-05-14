import {
  createColumnHelper,
  type ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
} from '@tanstack/react-table'
import type { AddUsersType } from '~/types/admin.type'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'

interface DataTableProps {
  data: AddUsersType[]
}

const columnHelper = createColumnHelper<AddUsersType>()
const columns: ColumnDef<AddUsersType>[] = [
  columnHelper.group({
    header: 'Users',
    columns: [
      columnHelper.accessor('name', {
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('nus_email', {
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('personal_email', {
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('telegram', {
        cell: (info) => info.getValue(),
      }),
    ],
  }),
]

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <TableContainer>
      <Table>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default DataTable
