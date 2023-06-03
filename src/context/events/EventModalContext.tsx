import { createContext } from 'react'

type EventModalType = {
  id: string
  isOpen: boolean
  onClose: () => void
}

export const EventModalContext = createContext<EventModalType>({
  id: '',
  isOpen: false,
  onClose: () => {
    return
  },
})
