import { createContext, useState } from 'react'

type ApplicantSearchContextType = {
  search: string
  setSearch: (s: string) => void
  filter: string
  setFilter: (s: string) => void
}

export const applicantSearchContext = createContext<ApplicantSearchContextType>(
  {
    search: '',
    setSearch: () => {
      return
    },
    filter: '',
    setFilter: () => {
      return
    },
  }
)

const ApplicantSearchProvider = (props: any) => {
  const [search, setSearch] = useState<string>('')
  const [filter, setFilter] = useState<string>('')
  return (
    <applicantSearchContext.Provider
      value={{ search, filter, setFilter, setSearch }}
    >
      {props.children}
    </applicantSearchContext.Provider>
  )
}

export default ApplicantSearchProvider
