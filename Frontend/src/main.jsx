import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LandingPage from './LandingPage'
import ProfilePage from './components/ProfilePage'
import JobsPage from './components/JobsPage'
import JobDetailsPage from './components/JobDetailsPage'
import PostJobPage from './components/PostJobPage'
import MyJobsPage from './components/MyJobsPage'
import JobApplicationsPage from './components/JobApplicationsPage'
import MyJobApplicationsPage from './components/MyJobApplicationsPage'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import Network from './components/Network'
import EventsTab from './components/EventsTab'
import TabsLayout from './TabsLayout'
import Homepage from './components/Homepage'
import OtherUserProfilePage from './components/OtherUserProfilePage'
import CollegeRegisterPage from './components/CollegeRegisterPage'
import AdminDashboard from './components/AdminDashboard'
import FundraisersPage from './components/FundraisersPage'
import PostsPage from './components/PostsPage'

const router = createBrowserRouter([{
  path: "/",
  element: <Layout />,
  children: [
    {
      path: "",
      element: <LandingPage />
    },
    {
      path: "college-register",
      element: <CollegeRegisterPage />
    },
    {
      path: "admin",
      element: <AdminDashboard />
    },
    {
      path: "my-profile-page",
      element: <ProfilePage />
    },
    {
      path:"user-profile/:otherUserId",
      element:<OtherUserProfilePage/>
    },
    {
      path: "tabs",
      element: <TabsLayout />,
      children: [
        {
          path: "home",
          element: <Homepage />
        },
        {
          path: "jobs",
          element: <JobsPage />
        },
        {
          path: "jobs/:jobId",
          element: <JobDetailsPage />
        },
        {
          path: "applications/:jobId",
          element: <JobApplicationsPage />
        },
        {
          path: "post-job",
          element: <PostJobPage />
        },
        {
          path: "my-jobs",
          element: <MyJobsPage />
        },
        {
          path: "my-applications",
          element: <MyJobApplicationsPage />
        },
        {
          path: "network",
          element: <Network />
        },
        {
          path: "events",
          element: <EventsTab />
        },
        {
          path: "fundraisers",
          element: <FundraisersPage />
        },
        {
          path: "posts",
          element: <PostsPage />
        },
      ]
    },
  ]
}])




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
