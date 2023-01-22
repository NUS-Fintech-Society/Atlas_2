import BottomNavBar from './BottomNavbar'
import Navbar from './Navbar'

const Layout = ({ children }: { children: JSX.Element[] | JSX.Element }) => {
  return (
    <>
      {/* <Navbar /> */}
      <div className="mx-auto flex min-h-screen w-screen flex-col">
        {children}
      </div>
      <BottomNavBar />
    </>
  )
}

export default Layout
