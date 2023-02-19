import BottomNavBar from './BottomNavbar'

const Layout = ({ children }: { children: JSX.Element[] | JSX.Element }) => {
  return (
    <>
      <div className="mx-auto flex min-h-screen w-screen flex-col">
        {children}
      </div>
      <BottomNavBar />
    </>
  )
}

export default Layout
