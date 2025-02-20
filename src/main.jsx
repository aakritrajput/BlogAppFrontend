import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import { Provider } from "react-redux";
import store from "./components/store/store.js";
import "./index.css";
import {
  Register, Login, ResendVerificationLink, VerifyEmail, CreateBlog, Root,
  Home, Search, Profile, EditProfile, Blogs, EditBlog, Follower, Following
} from "./components/LazyComponents.jsx";
import Loader from "./components/Loader.jsx";

const router = createBrowserRouter([
  { path: "/register", element: <Suspense fallback={<Loader />}><Register /></Suspense> },
  { path: "/login", element: <Suspense fallback={<Loader />}><Login /></Suspense> },
  { path: "/resendVerificationLink", element: <Suspense fallback={<Loader />}><ResendVerificationLink /></Suspense> },
  { path: "/verifyEmail", element: <Suspense fallback={<Loader />}><VerifyEmail /></Suspense> },
  {
    path: "/",
    element: <Suspense fallback={<Loader />}><Root /></Suspense>,
    children: [
      { path: "", element: <Suspense fallback={<Loader />}><Home /></Suspense> },
      { path: "create", element: <Suspense fallback={<Loader />}><CreateBlog /></Suspense> },
      { path: "search", element: <Suspense fallback={<Loader />}><Search /></Suspense> },
      { path: "userProfile/:userId", element: <Suspense fallback={<Loader />}><Profile /></Suspense> }
    ]
  },
  { path: "/editProfile", element: <Suspense fallback={<Loader />}><EditProfile /></Suspense> },
  { path: "/blog/:blogId/:authorId", element: <Suspense fallback={<Loader />}><Blogs /></Suspense> },
  { path: "/editBlog/:blogId", element: <Suspense fallback={<Loader />}><EditBlog /></Suspense> },
  { path: "/userFollowers/:bloggerId", element: <Suspense fallback={<Loader />}><Follower /></Suspense> },
  { path: "/userFollowings/:bloggerId", element: <Suspense fallback={<Loader />}><Following /></Suspense> }
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
