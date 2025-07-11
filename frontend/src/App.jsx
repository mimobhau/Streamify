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

import useAuthUser from './hooks/useAuthUser.js'
// custom hook to fetch the authenticated user data
import PageLoader from './components/PageLoader.jsx'

const App = () => {
  // declares the main 'App' component that contains the main routes of the application

  // tanstack query
  const {isLoading, authUser} = useAuthUser()

  const isAuthenticated = Boolean(authUser)
  // returns true if 'authUser' exists, false otherwise
  const isOnboarded = authUser?.isOnboarded

  // used to show a 'Loading' animation while its being redirected
  if(isLoading)
    return <PageLoader />
  
  return (
    <div className="h-screen text-5xl" data-theme="night">
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <HomePage />
            ) : (
              <Navigate to={
                isAuthenticated ? "/onboarding" : "/login"
              } />
            )
          }
        />
        {/* if user is 'isAuthenticated' && 'isOboarded' --> can go to "HomePage"
            if user is 'Authenticated' && 'not onboarded' --> redirect (<Navigate to="" />) to "OnboardingPage"
            if user is 'not Authenticated' or 'not onboarded' --> redirect (<Navigate to="" />) to "LoginPage" */}
        <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" />} />
        {/* if user is 'not authenticated' (!isAuthenticated) --> can go to "SignUpPage"
            if user is 'authenticated' --> redirect to "HomePage" */}
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/notifications" element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" />} />
        <Route path="/call" element={isAuthenticated ? <CallPage /> : <Navigate to="/login" />} />
        <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/onboarding" element={isAuthenticated ? <OnboardingPage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App