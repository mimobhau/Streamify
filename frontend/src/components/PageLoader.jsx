import { LoaderIcon } from "lucide-react"

// to show a 'Loading' animation while the app is fetching data
const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10 text-primary" />
    </div>
  )
}

export default PageLoader