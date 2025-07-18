import { Link, useLocation } from "react-router"
import useAuthUser from "../hooks/useAuthUser"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import ThemeSelector from "./ThemeSelector.jsx"
import { logout } from "../lib/api.js"
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react"

const Navbar = () => {
    const { authUser } = useAuthUser()
    const location = useLocation()
    /**
     *  "/chat" (ChatPage) doesn't have 'Navbar'
     *  'isChatPage' is used to hide 'Navbar' while in chat page
     */
    const isChatPage = location.pathname?.startsWith("/chat")

    const queryClient = useQueryClient()

    const {mutate: logoutMutation} = useMutation({
        mutationFn: logout,
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["authUser"]})
    })

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center sm:justify-end w-full gap-6 pr-2">
                {/* LOGO - ONLY IN THE CHAT PAGE */}
                {isChatPage && (
                    <div className="pl-5">
                        <Link to="/" className="flex items-center gap-2.5">
                        <ShipWheelIcon className="size-9 text-primary" />
                        <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                            Streamify
                        </span>
                        </Link>
                    </div>
                )}

                <div className="flex items-center gap-3 sm:gap-4 ml-auto">
                    <Link to={"/notifications"}>
                    <button className="btn btn-ghost btn-circle">
                        <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                    </button>
                    </Link>
                </div>

                {/* TODO */}
                <ThemeSelector />

                {/* AVATAR */}
                <div className="avatar">
                    <div className="w-9 rounded-full">
                        <img src={authUser?.profilePic} alt="User Avatar" rel="noreferrer" />
                    </div>
                </div>

                {/* LOGOUT BUTTON */}
                <button className="btn btn-primary btn-circle btn-ghost" onClick={logoutMutation}>
                    <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
                </button>

            </div>
        </div>
    </nav>
  )
}

export default Navbar