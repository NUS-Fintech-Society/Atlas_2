import { filter } from '@chakra-ui/react'
import { createContext, useState } from 'react'

type SearchContextType = {
  search: string
  setSearch: (s: string) => void
  filter: string
  setFilter: (s: string) => void
}

// type filterContextType = {
//   filter: string
//   setFilter: (s: string) => void
// }

export const searchContext = createContext<SearchContextType>({
  search: '',
  setSearch: () => {
    return
  },
  filter: '',
  setFilter: () => {
    return
  },
})

// export const filterContext = createContext<filterContextType>({
//   filter: '',
//   setFilter: () => {
//     return
//   },
// })


const SearchProvider = (props: any) => {
  const [search, setSearch] = useState<string>('')
  const [filter, setFilter] = useState<string>('')
  return (
    // <filterContext.Provider value={{ filter, setFilter }}>
    <searchContext.Provider value={{ search, filter, setFilter, setSearch }}>
      {props.children}
    </searchContext.Provider>
    // </filterContext.Provider>
  )
}

export default SearchProvider
