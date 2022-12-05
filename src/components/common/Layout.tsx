import BottomNavBar from './BottomNavbar'
import Navbar from './Navbar'

const Layout = ({ children }: { children: JSX.Element[] | JSX.Element }) => {
  return (
    <>
      <Navbar />
      <div className="w-5/6 mx-auto">{children}</div>
      <BottomNavBar />
    </>
  )
}

export default Layout
