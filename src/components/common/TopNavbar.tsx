import HamburgerNavbar from './HamburgerNavbar'
import Navbar from './Navbar'
import { useMediaQuery } from 'usehooks-ts'


export default function TopNavbar() {
  const isMax = useMediaQuery('(min-width: 768px)')
  if (isMax) {
    return <Navbar />;
  }
  return <HamburgerNavbar />;
}
