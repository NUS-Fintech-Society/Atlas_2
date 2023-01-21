import ReactSelect, { components } from 'react-select'
import { BiFilterAlt } from 'react-icons/bi'
import React from 'react'
import { FilterFn } from '@tanstack/react-table'

export const MultiSelectFilterFn: FilterFn<any> = (row, columnId, value) => {
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

const IndicatorsContainer = ({ children, ...props }: any) => {
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

//TODO: fix dropdown not closing when unfocused
export function MultiSelectColumnFilter({
  column,
  table,
}: {
  column: any
  table: any
}) {
  const preFilteredRows = table.getPreFilteredRowModel().rows
  const id = column.id

  const options = React.useMemo(() => {
    const options = new Set<string>()
    preFilteredRows.forEach((row: any) => {
      options.add(row.original[id])
    })
    const arr: OptionType[] = []
    options.forEach((key: string) => {
      arr.push({ value: key, label: key } as OptionType)
    })
    return arr
  }, [id, preFilteredRows])

  const [selectedOptions, setSelectedOptions] = React.useState<OptionType[]>([])

  return (
    <ReactSelect
      options={options}
      isMulti
      closeMenuOnSelect={false}
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
        container: (baseStyles, state) => ({
          ...baseStyles,
          //marginRight: '-8rem',
          width: '2.5rem',
          height: '2.5rem',
        }),
        indicatorsContainer: (baseStyles, state) => ({
          width: '100%',
          height: '100%',
        }),
        menuList: (baseStyles, state) => ({
          backgroundColor: 'white',
          border: '1px solid #3F5DC5',
          color: '#3F5DC5',
          borderRadius: '0.2rem',
          paddingTop: '0.3rem',
          paddingBottom: '0.3rem',
        }),
        menu: (baseStyles, state) => ({
          ...baseStyles,
          width: '10rem',
        }),
        valueContainer: (baseStyles, state) => ({
          ...baseStyles,
          width: '0px',
          height: '0px',
        }),
        placeholder: (baseStyles, state) => ({
          ...baseStyles,
          visibility: 'hidden',
        }),
        option: (baseStyles, state) => ({
          padding: '0.2rem',
        }),
        //   indicatorSeparator: (baseStyles, state) => ({
        //     ...baseStyles,
        //     visibility: 'hidden',
        //   }),
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
