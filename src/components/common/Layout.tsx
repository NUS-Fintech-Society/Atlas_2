import BottomNavBar from './BottomNavbar'

const Layout = ({ children }: { children: JSX.Element[] | JSX.Element }) => {
  return (
    <>
      <div className="relative mx-auto mt-8 min-h-screen w-screen flex-col">
        {children}
      </div>
      <BottomNavBar />
    </>
  )
}

export default Layout
