import { Outlet } from "react-router-dom"

export function AuthLayout() {
  return (
    <div className="min-h-svh flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}
