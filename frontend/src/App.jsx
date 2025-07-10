import React from 'react'
import {Routes, Route, Navigate} from "react-router"
import {Toaster} from "react-hot-toast"

import HomePage from "./pages/HomePage.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import NotificationsPage from "./pages/NotificationsPage.jsx"
import CallPage from "./pages/CallPage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import OnboardingPage from "./pages/OnboardingPage.jsx"

import { useQuery } from '@tanstack/react-query'
// "useQuery" heps manage data fetching, caching, loading states & error handling
import {axiosInstance} from "./lib/axios.js"

const App = () => {
  // declares the main 'App' component that contains the main routes of the application

  // tanstack query crash course
  const { data: authData, isLoading, error } = useQuery({
    /**
     *  'useQuery' runs the 'QueryFn'; handles loading/error states and returns the data
     *  'data' is the response from the server, 'isLoading' is true
     * 'error' - contains any error that occured
     */
    queryKey: ["authUser"],
    // 'queryKey' is used to identify the query, can be any unique value

    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      // 'axios.get' is used to make a GET request to '/auth/me
      return res.data;
    },
    retry: false    //auth checks should not retry / disables automatic retries on failure
  });

  const authUser = authData?.user
  // safely extracts the 'user' object from 'authData' if it exists
  
  // stores the result in 'authData', from which "authUser" is extracted
  
  return (
    <div className="h-screen text-5xl" data-theme="night">
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        {/* if user is 'authenticated' (authUser) --> can go to "HomePage"
            if user is 'not authenticated --> redirect (<Navigate to="" />) to "LoginPage" */}
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        {/* if user is 'not authenticated' (!authUser) --> can go to "SignUpPage"
            if user is 'authenticated' --> redirect to "HomePage" */}
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/notifications" element={authUser ? <NotificationsPage /> : <Navigate to="/login" />} />
        <Route path="/call" element={authUser ? <CallPage /> : <Navigate to="/login" />} />
        <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/onboarding" element={authUser ? <OnboardingPage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App