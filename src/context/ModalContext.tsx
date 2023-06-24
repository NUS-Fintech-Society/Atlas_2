import { createContext } from 'react'

type ModalType = {
  id: string
  isOpen: boolean
  onClose: () => void
}

export const ModalContext = createContext<ModalType>({
  id: '',
  isOpen: false,
  onClose: () => {
    return
  },
})
