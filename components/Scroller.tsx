export default function Scroller ({ children }: any) {
  return (
    <div className="overflow-y-auto h-full">
      {children}
    </div>
  )
}
