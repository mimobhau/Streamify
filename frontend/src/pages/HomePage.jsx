import { useEffect, useState } from 'react'
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import { getOutgoingFriendReqs, getRecommendedUsers, getUserFriends, sendFriendRequest } from '../lib/api'
import {Link} from "react-router"
import NoFriendsFound from '../components/NoFriendsFound'
import FriendCard, { getLanguageFlag } from '../components/FriendCard'
import {CheckCircleIcon, MapPinIcon} from 'lucide-react'

const HomePage = () => {
  
    const queryClient = useQueryClient()
    // to track the already sent 'friend-requests' which are still pending
    const [outgoingRequestIds, setOutgoingRequestIds] = useState(new Set())

    // to fetch the friends list
    // "data: friends =[]" -- data is renamed with 'friends' initialised with 'null array'[] -- so that it doesn't return 'undefined' any way
    const {data: friends=[], isLoading: loadingFriends} = useQuery({
      queryKey: ["friends"],
      queryFn: getUserFriends
    })

    // to fetch the 'recommedned users' list
    const {data: recommendedUsers=[], isLoading: loadingUsers} = useQuery({
      queryKey: ["users"],
      queryFn: getRecommendedUsers
    })

    // fetch already sent friend-requets
    const {data: outgoingFriendReqs} = useQuery({
      queryKey: ["outgoingFriendReqs"],
      queryFn: getOutgoingFriendReqs
    })

    // SENDS FRIEND REQUEST
    // "onSuccess" it updates "getOutgoingFriendReqs"
    const {mutate: sendRequestMutation, isPending} = useMutation({
      mutationFn: sendFriendRequest,
      onSuccess: () => queryClient.invalidateQueries({queryKey: ["outgoingFriendReqs"]})
    })

    // to update the "state"
    // the function is executed whenever there is a change in "outgoingFriendReqs"
    useEffect(() => {
      const outgoingIds = new Set()
      if(outgoingFriendReqs && outgoingFriendReqs.length > 0)
      {
        outgoingFriendReqs.forEach((req) => {
          outgoingIds.add(req.recipient._id)
        });
        setOutgoingRequestIds(outgoingIds)
      }
    }, [outgoingFriendReqs])

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='container mx-auto space-y-10'>
        {/* SECOND NAV kinda  with BUTTON to NOTFICATIONS*/}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>
            Your Friends
          </h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            Friends Requests
          </Link>
        </div>

        {/* FRIENDS LIST */}
        {loadingFriends ? (
          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg' />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {
              friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))
            }
          </div>
        )}

        {/* RECOMMENDED USERS SECTION */}
        <section>
          <div className='mb-6 sm:mb-8'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
              <div>
                <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>
                  Meet New Learners
                </h2>
                <p className='opacity-70 text-sm'>
                  Discover perfect language exchange partners based on your profile
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className='flex justify-center py-12'>
              <span className='loading loading-spinner loading-lg' />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className='card bg-base-200 p-6 text-center'>
              {/* NO RECOMMENDATIONS AVAILABLE */}
              <h3 className='font-semibold text-lg mb-2'>
                No recommendations available
              </h3>
              <p className='text-base-content opacity-70'>
                Check for later for new language partners!
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {/* RECOMMEDED USERS' CARD */}
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestIds.has(user._id)
                return(
                  <div key={user._id} className='card bg-base-200 hover:shadow-lg transition-all duration-300'>
                    <div className='card-body p-5 space-y-4'>
                      <div className='flex items-center gap-3'>
                        <div className='avatar size-16 rounded-full'>
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>

                        <div>
                          <h3 className='font-semibold text-lg'>
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Language with FLAGS */}
                      <div className='flex flex-wrap gap-1.5'>
                        <span className='badge badge-secondary'>
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitalize(user.nativeLanguage)}
                        </span>

                        <span className='badge badge-secondary btn-ghost border-secondary'>
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitalize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && <p className='text-sm opacity-70'>
                        {user.bio}
                      </p>}

                      {/* ACTION BUTTON */}
                      <button
                        className={`btn w-full mt-2 ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        }`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className='size-4 mr-2' />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon className='size-4 mr-2' />
                            Send Friend Request
                          </>
                        )}
                      </button>

                    </div>
                  </div>
                )
              })}
            </div>
          )}

        </section>

      </div>
    </div>
  )
}

export default HomePage

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)