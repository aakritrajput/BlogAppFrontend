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
import VerifyEmail from './components/verification/VerifyEmail.jsx'
import CreateBlog from './components/createBlog/CreateBlog.jsx'
import Root from './components/root/Root.jsx'
import Home from './components/home/Home.jsx'
import Search from './components/search/Search.jsx'
import Profile from './components/profile/Profile.jsx'
import EditProfile from './components/profile/EditProfile.jsx'
import Blogs from './components/blog/Blogs.jsx'
import EditBlog from './components/blog/editBlog.jsx'
import Follower from './components/followings/Follower.jsx'
import Following from './components/followings/Following.jsx'


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
  },
  {
    path: "/editProfile",
    element: <EditProfile/>
  },
  {
    path: "/blog/:blogId/:authorId",
    element: <Blogs/>
  },
  {
    path: "/editBlog/:blogId",
    element: <EditBlog/>
  },
  {
    path: "/userFollowers/:bloggerId",
    element: <Follower/>
  },
  {
    path: "/userFollowings/:bloggerId",
    element: <Following/>
  }
])

createRoot(document.getElementById('root')).render(
 
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  
)

