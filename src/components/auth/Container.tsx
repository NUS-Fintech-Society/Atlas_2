const Container = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center text-black">
      <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded-2xl p-6 transition-all">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Container
