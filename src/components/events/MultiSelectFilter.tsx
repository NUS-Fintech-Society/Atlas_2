import ReactSelect, { components } from 'react-select'
import { BiFilterAlt } from 'react-icons/bi'
import React, { useState, useMemo } from 'react'
import type { FilterFn, Table } from '@tanstack/react-table'
import type { Attendees } from '~/components/events/DataTable'

// Function for filter rows via each column header
export const MultiSelectFilterFn: FilterFn<Attendees> = (
  row,
  columnId,
  value
) => {
  if (value.length === 0) return true
  const rowValue = row.getValue(columnId)
  return rowValue !== undefined ? value.includes(rowValue) : true
}

const Control = ({ children, ...innerProps }: any) => (
  <components.Control className="h-full w-full" {...innerProps}>
    {children}
  </components.Control>
)
const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props} className="h-full w-full">
      <BiFilterAlt className="mx-auto my-auto fill-white" />
    </components.DropdownIndicator>
  )
}

const IndicatorsContainer = ({ ...props }: any) => {
  return (
    <components.IndicatorsContainer {...props}>
      <DropdownIndicator {...props} />
    </components.IndicatorsContainer>
  )
}
type OptionType = {
  value: string
  label: string
}

export function MultiSelectColumnFilter({
  column,
  table,
}: {
  column: any
  table: Table<Attendees>
}) {
  const preFilteredRows = table.getPreFilteredRowModel().rows

  const options = useMemo(() => {
    const options = new Set<string>()
    preFilteredRows.forEach((row) => {
      if (column.id !== undefined) {
        const headerName = column.id
        options.add(row.getValue(headerName))
      }
    })
    const arr: OptionType[] = []
    options.forEach((key: string) => {
      arr.push({ value: key, label: key } as OptionType)
    })
    return arr
  }, [column.id, preFilteredRows])

  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([])

  return (
    <ReactSelect
      options={options}
      isMulti
      closeMenuOnSelect={true}
      hideSelectedOptions={false}
      components={{
        Option,
        Control,
        DropdownIndicator,
        IndicatorsContainer,
      }}
      onChange={(options) => {
        setSelectedOptions(options as OptionType[])
        if (Array.isArray(options)) {
          column.setFilterValue(options.map((opt) => opt.value))
        }
      }}
      value={selectedOptions}
      className="w-40 text-black"
      isSearchable={true}
      unstyled={true}
      styles={{
        container: (baseStyles) => ({
          ...baseStyles,
          width: '2.5rem',
          height: '2.5rem',
        }),
        indicatorsContainer: () => ({
          width: '100%',
          height: '100%',
          cursor: 'pointer',
        }),
        menuList: () => ({
          backgroundColor: 'white',
          border: '1px solid #3F5DC5',
          color: '#3F5DC5',
          borderRadius: '0.2rem',
          paddingTop: '0.3rem',
          paddingBottom: '0.3rem',
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          width: '10rem',
        }),
        valueContainer: (baseStyles) => ({
          ...baseStyles,
          width: '0px',
          height: '0px',
        }),
        placeholder: (baseStyles) => ({
          ...baseStyles,
          visibility: 'hidden',
        }),
        option: () => ({
          padding: '0.2rem',
        }),
      }}
    />
  )
}

const Option = (props: any) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{' '}
        <label>{props.label}</label>
      </components.Option>
    </div>
  )
}
