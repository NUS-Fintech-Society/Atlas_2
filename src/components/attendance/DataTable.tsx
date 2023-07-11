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
  useDisclosure,
} from '@chakra-ui/react'
import { BsArrowDownUp, BsChevronDown, BsChevronUp } from 'react-icons/bs'
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  type SortingState,
  getSortedRowModel,
} from '@tanstack/react-table'
import { ModalContext } from '~/context/ModalContext'
import DataTableModal from './DataTableModal'
import { type EventInfos } from '~/types/event/event.type'

interface DataTableProps {
  columns: any
  data: EventInfos[]
}

const DataTable: React.FC<DataTableProps> = ({ data, columns }) => {
  const { onOpen, isOpen, onClose } = useDisclosure()
  const [id, setId] = React.useState('')
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
      borderTop="1px solid #002D70"
      borderBottom="1px solid #002D70"
      borderLeft="1px solid #002D70"
      borderRight="1px solid #002D70"
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
                textAlign="center"
                textTransform="none"
                fontWeight={500}
                position="sticky"
                zIndex={1}
                top={0}
              >
                No.
              </Th>
              {headerGroup.headers.map((header) => {
                // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                const meta: any = header.column.columnDef.meta
                return (
                  <Th
                    color="white"
                    bgColor="#01003D"
                    fontFamily={'sans-serif'}
                    textTransform="none"
                    fontWeight={500}
                    fontSize={15}
                    textAlign="center"
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
              <Td textAlign="center">{parseInt(row.id, 10) + 1}</Td>
              {row.getVisibleCells().map((cell) => {
                const meta: any = cell.column.columnDef.meta
                return (
                  <Td
                    className="hover:cursor-pointer hover:underline hover:opacity-80"
                    textAlign="center"
                    key={cell.id}
                    isNumeric={meta?.isNumeric}
                    onClick={() => {
                      setId(cell.row.original.id)
                      onOpen()
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                )
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <ModalContext.Provider
        value={{
          isOpen,
          id,
          onClose,
        }}
      >
        <DataTableModal />
      </ModalContext.Provider>
    </Box>
  )
}

export default DataTable
