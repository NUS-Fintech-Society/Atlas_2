const Container = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-black text-white">
      <div className="w-full min-h-screen p-4 flex flex-col items-center justify-center">
        <div className="p-8 w-full max-w-3xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-1000">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Container
