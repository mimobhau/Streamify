import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import useAuthUser from "../hooks/useAuthUser"
import { useQuery } from "@tanstack/react-query"
import { getStreamToken } from "../lib/api"

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks
} from "@stream-io/video-react-sdk"

import "@stream-io/video-react-sdk/dist/css/styles.css"
import PageLoader from "../components/PageLoader"
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

const CallPage = () => {
  // fetches the 'id' from the url
  const {id: callId} = useParams()

  // stores the required data and updates it when "set..." func is called
  const [client, setClient] = useState(null)
  const [call, setCall] = useState(null)
  const [isConnecting, setIsConnecting] = useState(true)

  const {authUser, isLoading} = useAuthUser()

  const {data: tokenData} = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser
  })

  useEffect(() => {
    const initCall = async () => {
      if(!tokenData.token || !authUser || !callId)
        return

      try {
        console.log("Initializing Stream video client...")

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic
        }

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token
        })

        const callInstance = videoClient.call("default", callId)

        await callInstance.join({create: true})
        console.log("Joined Call successfully")

        setClient(videoClient)
        setCall(callInstance)

      } catch (error) {
        console.error("Error joining call: ", error)
        toast.error("Could not join the call. Please try again.")
      } finally {
        setIsConnecting(false)
      }
    }

    initCall()
  }, [tokenData, authUser, callId])

  if(isLoading || isConnecting)
    return <PageLoader />

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>
              Could not initiate call. Please refesh or try again later.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const CallContent = () => {
  const {useCallCallingState} = useCallStateHooks()
  const callingState = useCallCallingState()

  const navigate = useNavigate()

  // if the call is ended/left/cut, return to homepage("/")
  if(callingState === CallingState.LEFT)
    return navigate("/")

  return(
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  )
}

export default CallPage