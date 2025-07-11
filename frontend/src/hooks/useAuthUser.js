import { useQuery } from "@tanstack/react-query";
// "useQuery" heps manage data fetching, caching, loading states & error handling
import { getAuthUser } from "../lib/api.js";

const useAuthUser = () => {
    // tanstack query crash course
  const { data: authData, isLoading, error } = useQuery({
    /**
     *  'useQuery' runs the 'QueryFn'; handles loading/error states and returns the data
     *  'data' is the response from the server, 'isLoading' is true
     * 'error' - contains any error that occured
     */
    queryKey: ["authUser"],
    // 'queryKey' is used to identify the query, can be any unique value

    queryFn: getAuthUser,
    retry: false    //auth checks should not retry / disables automatic retries on failure
  })

  return {
    isLoading,
    error,
    authUser: authData?.user || null
    // 'authUser' is the user object from the response, or null if it doesn't exist
    // safely extracts the 'user' object from 'authData' if it exists
  }
}

export default useAuthUser