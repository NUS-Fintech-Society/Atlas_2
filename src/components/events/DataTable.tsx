import {
  MultiSelectColumnFilter,
  MultiSelectFilterFn,
} from './MultiSelectFilter'
import { BsChevronUp, BsChevronDown, BsArrowDownUp } from 'react-icons/bs'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
} from '@tanstack/react-table'
import type {
  SortingState,
  ColumnFiltersState,
  Row,
  RowSelectionState,
} from '@tanstack/react-table'
import {
  Button,
  Box,
  chakra,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import React, { useEffect, useRef, useState, type HTMLProps } from 'react'

export type Attendees = {
  department: string | null
  role: string | null
  name: string | null
  id: string
}

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ref = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate, rest.checked])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  )
}

/**
 * Helper function to create the required row selection object in form of { '0': true, '1': true }
 * where '0' indicates the index of the row which you want to mark as checked
 * @param allAttendees
 * @param existingAttendees
 * @returns rowSelection
 */
const initRowSelection = (
  allAttendees: Attendees[],
  existingAttendees: Attendees[] | undefined
) => {
  if (!existingAttendees) {
    return {}
  }
  const rowSelectionState: RowSelectionState = {}
  // Find out the index of each attendee based on the id
  existingAttendees.forEach((existingAttendee) => {
    const existingAttendeeIndex = allAttendees.findIndex(
      (attendee: Attendees) => attendee.id == existingAttendee.id
    )
    rowSelectionState[existingAttendeeIndex] = true
  })
  return rowSelectionState
}

export type DataTableProps = {
  data: Attendees[]
  existingAttendees?: Attendees[]
  setAttendees: (attendees: string[]) => void
}

// ref https://github.com/chakra-ui/chakra-ui/discussions/4380
export function DataTable({
  data,
  existingAttendees,
  setAttendees,
}: DataTableProps) {
  // Create columns with associated data
  const columnHelper = createColumnHelper<Attendees>()
  const [rowSelection, setRowSelection] = useState(
    initRowSelection(data, existingAttendees)
  )
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const columns = [
    columnHelper.display({
      id: 'select',
      header: 'select',
      cell: ({ row }) => (
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      ),
      enableColumnFilter: false,
    }),
    columnHelper.accessor('department', {
      cell: (info) => info.getValue(),
      header: 'Department',
      enableColumnFilter: true,
      filterFn: MultiSelectFilterFn,
    }),
    columnHelper.accessor('role', {
      cell: (info) => info.getValue(),
      header: 'Role',
      enableColumnFilter: true,
      filterFn: MultiSelectFilterFn,
    }),
    columnHelper.accessor('name', {
      cell: (info) => info.getValue(),
      header: 'Name',
      enableColumnFilter: true,
      filterFn: MultiSelectFilterFn,
    }),
  ]

  // init React Table
  const table = useReactTable({
    columns,
    data,
    state: {
      sorting,
      rowSelection,
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    debugColumns: true,
  })

  // Multi-select functionalities
  const clearSelection = () => {
    setRowSelection({})
  }

  const selectAll = () => {
    if (!table.getIsAllRowsSelected()) {
      table.toggleAllRowsSelected()
    }
  }

  // Helper fn to add/remove attendees before passing resulting array to setAttendees
  const updateAttendees = (row: Row<Attendees>, resultArray: string[]) => {
    const attendeeId = row.original.id
    if (row.getIsSelected()) {
      resultArray.push(attendeeId)
    }
  }

  // Uses parent's setAttendees to maintain state in main page
  useEffect(() => {
    const resultArray: string[] = []
    table
      .getSelectedRowModel()
      .flatRows.forEach((row) => updateAttendees(row, resultArray))
    setAttendees(resultArray)
  }, [rowSelection, table, setAttendees])

  return (
    <div>
      <div className="flex items-center justify-between py-4 ">
        <p className="text-2xl">Attendees</p>
        <div className="flex gap-4 ">
          <Button
            bgColor="#4365DD"
            className="text-white"
            onClick={clearSelection}
          >
            Clear Selection
          </Button>
          <Button bgColor="#4365DD" className="text-white" onClick={selectAll}>
            Select All
          </Button>
        </div>
      </div>
      <Box
        overflowY="auto"
        minHeight="300px"
        maxHeight="400px"
        className="border-2 border-[#97AEFF]"
      >
        <Table variant="unstyled" className="border-collapse">
          <Thead className="sticky top-0 bg-[#01003D]">
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  /* Create each header component with MultiSelect Btns */
                  return (
                    <Th
                      key={header.id}
                      className="border-x-2 border-[#97AEFF] text-white"
                    >
                      <div className="flex items-center justify-between ">
                        {/* Render header filter btn */}
                        {header.column.getCanFilter() ? (
                          <MultiSelectColumnFilter
                            column={header.column}
                            table={table}
                          />
                        ) : null}
                        {/* Render header text */}
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {/* Render header sort btn */}
                        {header.column.getCanSort() ? (
                          <chakra.span
                            onClick={header.column.getToggleSortingHandler()}
                            pl="4"
                            className="hover:cursor-pointer"
                          >
                            {header.column.getIsSorted() ? (
                              header.column.getIsSorted() === 'desc' ? (
                                <BsChevronUp />
                              ) : (
                                <BsChevronDown />
                              )
                            ) : (
                              <BsArrowDownUp />
                            )}
                          </chakra.span>
                        ) : null}
                      </div>
                    </Th>
                  )
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  /* Create each row */
                  return (
                    <Td key={cell.id} className="border-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  )
                })}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </div>
  )
}
