import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LandingPage from './LandingPage'
import ProfilePage from './components/ProfilePage'
import Playground from './Playground'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Layout from './Layout'

const router = createBrowserRouter([{
  path: "/",
  element: <Layout/>,
  children: [
    {
      path: "",
      element: <LandingPage/>
    },
    {
      path: "profile-page",
      element: <ProfilePage/>
    }
  ]
}])




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
