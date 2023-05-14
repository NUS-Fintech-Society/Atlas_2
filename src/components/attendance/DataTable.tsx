import * as React from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Box,
  Icon,
} from '@chakra-ui/react'
import { BsArrowDownUp, BsChevronDown, BsChevronUp } from 'react-icons/bs'
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  type ColumnDef,
  type SortingState,
  getSortedRowModel,
} from '@tanstack/react-table'

export type DataTableProps<Data extends object> = {
  data: Data[]
  columns: ColumnDef<Data, any>[]
}

export function DataTable<Data extends object>({
  data,
  columns,
}: DataTableProps<Data>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <Box
      overflowY="auto"
      maxHeight="60vh"
      borderTop="3px solid #002D70"
      borderBottom="3px solid #002D70"
      sx={{
        '&::-webkit-scrollbar': {
          width: '15px',
          outline: '3px solid #002D70',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: `#004B90`,
          borderRadius: '20px',
          border: '5px solid transparent',
          backgroundClip: 'content-box',
        },
      }}
    >
      <Table>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              <Th
                color="white"
                bgColor="#01003D"
                fontSize={{ base: '10px', md: '16px', lg: '20px' }}
                py={5}
                px={{ base: '2px', md: '6px', lg: '10px' }}
                textTransform="capitalize"
                textAlign="center"
                borderX="3px solid #002D70"
                borderY="none"
                fontWeight={600}
                position="sticky"
                zIndex={1}
                top={0}
              >
                Number
              </Th>
              {headerGroup.headers.map((header) => {
                // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                const meta: any = header.column.columnDef.meta
                return (
                  <Th
                    color="white"
                    bgColor="#01003D"
                    fontSize={{ base: '10px', md: '16px', lg: '20px' }}
                    py={5}
                    px={{ base: '2px', md: '6px', lg: '10px' }}
                    textTransform="capitalize"
                    textAlign="center"
                    borderX="3px solid #002D70"
                    borderY="none"
                    position="sticky"
                    zIndex={1}
                    top={0}
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    isNumeric={meta?.isNumeric}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}

                    <chakra.span pl="4">
                      {header.column.getIsSorted() ? (
                        header.column.getIsSorted() === 'desc' ? (
                          <Icon
                            className="hover:cursor-pointer"
                            aria-label="sorted descending"
                            color="#F9813E"
                            style={{ strokeWidth: '1.5' }}
                            as={BsChevronDown}
                          />
                        ) : (
                          <Icon
                            className="hover:cursor-pointer"
                            aria-label="sorted descending"
                            color="#F9813E"
                            style={{ strokeWidth: '1.5' }}
                            as={BsChevronUp}
                          />
                        )
                      ) : (
                        <Icon
                          className="hover:cursor-pointer"
                          color="#F9813E"
                          style={{ strokeWidth: '1.5' }}
                          as={BsArrowDownUp}
                        />
                      )}
                    </chakra.span>
                  </Th>
                )
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              <Td
                py={5}
                px={{ base: '2px', md: '6px', lg: '10px' }}
                fontSize={{ base: '10px', md: '16px', lg: '20px' }}
                textAlign="center"
                borderX="3px solid #002D70"
                borderY="none"
                fontWeight={600}
              >
                {parseInt(row.id, 10) + 1}
              </Td>
              {row.getVisibleCells().map((cell) => {
                const meta: any = cell.column.columnDef.meta
                return (
                  <Td
                    py={5}
                    px={{ base: '2px', md: '6px', lg: '10px' }}
                    fontSize={{ base: '10px', md: '16px', lg: '20px' }}
                    textAlign="center"
                    borderX="3px solid #002D70"
                    borderY="none"
                    fontWeight={600}
                    key={cell.id}
                    isNumeric={meta?.isNumeric}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                )
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}
