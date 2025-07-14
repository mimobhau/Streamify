import { LoaderIcon } from "lucide-react"
import { useThemeStore } from "../store/useThemeStore"

// to show a 'Loading' animation while the app is fetching data
const PageLoader = () => {
  // so that the Loading animation follws the current theme
  const {theme} = useThemeStore()

  return (
    <div className="min-h-screen flex items-center justify-center" data-theme={theme}>
        <LoaderIcon className="animate-spin size-10 text-primary" />
    </div>
  )
}

export default PageLoader