import type { ReactNode } from "react"
import Sidebar from "./SideBar"

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 md:ml-64 overflow-y-auto">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  )
}

export default MainLayout
