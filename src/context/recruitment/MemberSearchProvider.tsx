import { createContext, useState } from 'react'

type MemberSearchContextType = {
  search: string
  setSearch: (s: string) => void
  filter: string
  setFilter: (s: string) => void
}

export const memberSearchContext = createContext<MemberSearchContextType>({
  search: '',
  setSearch: () => {
    return
  },
  filter: '',
  setFilter: () => {
    return
  },
})

const MemberSearchProvider = (props: any) => {
  const [search, setSearch] = useState<string>('')
  const [filter, setFilter] = useState<string>('')
  return (
    <memberSearchContext.Provider
      value={{ search, filter, setFilter, setSearch }}
    >
      {props.children}
    </memberSearchContext.Provider>
  )
}

export default MemberSearchProvider
