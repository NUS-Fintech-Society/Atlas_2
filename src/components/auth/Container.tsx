const Container = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
      <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded-2xl p-8 shadow-lg transition-all duration-1000 hover:shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Container
