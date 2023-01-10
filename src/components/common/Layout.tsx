import BottomNavBar from './BottomNavbar'
import Navbar from './Navbar'

const Layout = ({ children }: { children: JSX.Element[] | JSX.Element }) => {
  return (
    <>
      <Navbar />
      <div className="mx-auto w-5/6">{children}</div>
      <BottomNavBar />
    </>
  )
}

export default Layout
