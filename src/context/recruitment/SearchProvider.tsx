import { createContext, useState } from 'react'

type SearchContextType = {
  search: string
  setSearch: (s: string) => void
}

type filterContextType = {
  filter: string
  setFilter: (s: string) => void
}

export const searchContext = createContext<SearchContextType>({
  search: '',
  setSearch: () => {
    return
  },
})

export const filterContext = createContext<filterContextType>({
  filter: '',
  setFilter: () => {
    return
  },
})


const SearchProvider = (props: any) => {
  const [search, setSearch] = useState<string>('')
  return (
    <searchContext.Provider value={{ search, setSearch }}>
      {props.children}
    </searchContext.Provider>
  )
}

export default SearchProvider
