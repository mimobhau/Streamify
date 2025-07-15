import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import useAuthUser from '../hooks/useAuthUser'
import { useQuery } from '@tanstack/react-query'
import { getStreamToken } from '../lib/api'

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window
} from "stream-chat-react"
import { StreamChat } from 'stream-chat'
import toast from 'react-hot-toast'
import ChatLoader from "../components/ChatLoader.jsx"
import CallButton from "../components/CallButton.jsx"

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

const ChatPage = () => {
  // fetches 'id' of the target-user from the url
  const {id: targetUserId} = useParams()

  // gets the "client", "channel", etc. for the chatting
  const[chatClient, setChatClient] = useState(null)
  const[channel, setChannel] = useState(null)
  const[loading, setLoading] = useState(true)

  // fetches the details of the user
  const {authUser} = useAuthUser()

  // fetches the 'Stream' token api from the backend
  const {data: tokenData} = useQuery({
    queryKey: ["streamtoken"],
    queryFn: getStreamToken,
    // doesn't allow "StreamToken" to be fetched until the user is authenticated
    enabled: !!authUser
    // ( !!{variable} ) creates a boolean value
  })

  useEffect(() => {
    const initChat = async () => {
      // if 'token' or 'user' is missingl; return
      if(!tokenData?.token || !authUser)
        return

      try {
        console.log("Initialising Stream chat client....")

        const client = StreamChat.getInstance(STREAM_API_KEY)

        // test
        console.log("Profile Pic URL:", authUser.profilePic)


        // creates the client with all the fields, & the 'token'
        await client.connectUser({
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic
        }, tokenData.token)

        // creates a permanent, personal channel between the user and the targetUser
        const channelId = [authUser._id, targetUserId].sort().join("-")
        /**
         * both 'authUser' & 'targetUserId' are permanent IDs
         * they are sorted and joined with "-"
         * creating a unique and permanent channel between them
         */

        // implementing the private channel
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId]
        })

        // constantly listens, observes and updates the changes in real-time
        await currChannel.watch()

        // updating the 'client' & 'channel'
        setChatClient(client)
        setChannel(currChannel)

      } catch (error) {
        console.log("Error initialising chat: ", error)
        toast.error("Could not connect to chat. Please try again.")
      } finally{
          setLoading(false)
        }
    }

    initChat()
  }, [tokenData, authUser, targetUserId])
  // useEffect() will be trigerred if there is any changes in 'tokenData', 'authUser' or 'targetUserId'

  // video-calling
  const handleVideoCall = () => {
    if(!channel)
      return
    
    const callUrl = `${window.location.origin}/call/${channel.id}`

    channel.sendMessage({
      text: `I've started a video call. Join me here: ${callUrl}`
    })

    toast.success("Video call link sent successfully!")
  }

  if(loading || !chatClient || !channel)
    return <ChatLoader />

  return (
    <div className='h-[93vh]'>
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className='w-full relative'>
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage