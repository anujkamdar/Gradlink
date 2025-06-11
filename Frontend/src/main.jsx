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
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import Network from './components/Network'
import EventsTab from './components/EventsTab'
import TabsLayout from './TabsLayout'
import Homepage from './components/Homepage'

const router = createBrowserRouter([{
  path: "/",
  element: <Layout />,
  children: [
    {
      path: "",
      element: <LandingPage />
    },
    {
      path: "profile-page",
      element: <ProfilePage />
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
          path: "network",
          element: <Network />
        },
        {
          path: "events",
          element: <EventsTab />
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
