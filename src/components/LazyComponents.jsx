import { lazy } from "react";

// ✅ Lazy Load Components
export const Register = lazy(() => import("./register/Register.jsx"));
export const Login = lazy(() => import("./login/Login.jsx"));
export const ResendVerificationLink = lazy(() => import("./verification/ResendVerificationLink.jsx"));
export const VerifyEmail = lazy(() => import("./verification/VerifyEmail.jsx"));
export const CreateBlog = lazy(() => import("./createBlog/CreateBlog.jsx"));
export const Root = lazy(() => import("./root/Root.jsx"));
export const Home = lazy(() => import("./home/Home.jsx"));
export const Search = lazy(() => import("./search/Search.jsx"));
export const Profile = lazy(() => import("./profile/Profile.jsx"));
export const EditProfile = lazy(() => import("./profile/EditProfile.jsx"));
export const Blogs = lazy(() => import("./blog/Blogs.jsx"));
export const EditBlog = lazy(() => import("./blog/editBlog.jsx"));
export const Follower = lazy(() => import("./followings/Follower.jsx"));
export const Following = lazy(() => import("./followings/Following.jsx"));
