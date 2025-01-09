//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Register from './components/register/Register.jsx'
import Login from './components/login/Login.jsx'
import { Provider } from 'react-redux'
import store from './components/store/store.js'
import ResendVerificationLink from './components/verification/ResendVerificationLink.jsx'
import VerifyEmail from './components/verification/verifyEmail.jsx'
import CreateBlog from './components/createBlog/CreateBlog.jsx'
import Root from './components/root/Root.jsx'
import Home from './components/home/Home.jsx'
import Search from './components/search/Search.jsx'
import Profile from './components/profile/Profile.jsx'

const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register/>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/resendVerificationLink",
    element: <ResendVerificationLink/>
  },
  {
    path: "/verifyEmail",
    element: <VerifyEmail/>
  },
  {
    path: "/",
    element: <Root/>,
    children: [
      {
        path: "",
        element: <Home/>
      },
      {
        path: "create",
        element: <CreateBlog/>
      },
      {
        path: "search",
        element: <Search/>
      },
      {
        path: "userProfile/:userId",
        element: <Profile/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
 
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  
)

