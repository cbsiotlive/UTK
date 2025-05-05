export default function Header() {
  return (
    <header className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
      <div className="flex space-x-4 text-sm">
        <span className="text-blue-600 font-medium">This month</span>
        <span className="text-gray-500">Last month</span>
      </div>
    </header>
  )
}

