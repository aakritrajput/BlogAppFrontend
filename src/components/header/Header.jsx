//import React from 'react'
import axios from "axios"
import { useState, useEffect } from "react"
import { NavLink, Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setUser, unsetUser } from "../store/userSlice.js"
//import defaultProfilePicture from "../../../public/defaultProfilePicture.jpeg"

function Header() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const user = useSelector((state)=> state.user.user)
    const navigate = useNavigate()
    useEffect(() => {
        const checkLogin = async () => {
            try {
                const response = await axios.get('https://blogappbackend-uy9g.onrender.com/api/v1/user/profile', { withCredentials: true });
                setLoggedIn(true);
                dispatch(setUser(response.data.data))
                console.log("current user :", response)
            } catch (error) {
                setLoggedIn(false);
                dispatch(unsetUser());
                console.log("error fetching current user !!",error)
            }
        };

        checkLogin(); 
    }, [dispatch]);

    const LogoutHandler = async() => {
        setLoading(true)
        try {
            const response = await axios.get("https://blogappbackend-uy9g.onrender.com/api/v1/user/logout", { withCredentials: true})
            console.log("response logout : ", response)
            dispatch(unsetUser())
            
            location.reload()
        } catch (error) {
            alert(error.status === 401 ? "You are not authorized to perform this action or perform this task !! please login .. " : error.response.data)
        }finally{
            setLoading(false)
        }
    } 
    console.log("currentUserMain status:", loggedIn)
  return (
    <>
    <div className="flex justify-between px-4  bg-[#DDDBDB]">
      <h1 className="text-[#207F87] text-3xl font-semibold py-3">BlogApp</h1>
      <div >
        <ul className="md:flex list-none gap-5 hidden h-full justify-center items-center">
            <li>
                <NavLink to="/" className={({ isActive })=> `${isActive ? "text-[#207F87] text-[25px] after:scale-x-100" : "text-[#989494] text-[25px] hover:text-[#7a7777]"} 
                relative after:absolute after:bottom-0  after:left-0 
                after:w-full after:h-[2px] after:bg-[#207F87] 
                after:scale-x-0 hover:after:scale-x-100 
                transition-all duration-300 ease-in-out `}>
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink to="/search" className={({ isActive })=> `${isActive ? "text-[#207F87] text-[25px] after:scale-x-100" : "text-[#989494] text-[25px] hover:text-[#7a7777]"} 
                relative after:absolute after:bottom-0  after:left-0 
                after:w-full after:h-[2px] after:bg-[#207F87] 
                after:scale-x-0 hover:after:scale-x-100 
                transition-all duration-1000 ease-linear `}>
                    Search
                </NavLink>
            </li>
            {loggedIn && <li>
                <NavLink to="/create" className={({ isActive })=> `${isActive ? "text-[#207F87]  text-[25px] after:scale-x-100" : "text-[#989494] text-[25px] hover:text-[#7a7777]"} 
                relative after:absolute after:bottom-[-3px] after:left-0 
                after:w-full after:h-[2px] after:bg-[#207F87] 
                after:scale-x-0 hover:after:scale-x-100 
                transition-all duration-300 ease-in-out `}>
                    Create
                </NavLink>

            </li>}
            {loggedIn && <li>
                <NavLink to={`/userProfile/${user?._id}`} className={({ isActive })=> `${isActive ? "text-[#207F87] text-[25px] after:scale-x-100" : "text-[#989494] text-[25px] hover:text-[#7a7777]"} 
                relative after:absolute  after:bottom-0 after:left-0 
                after:w-full after:h-[2px] after:bg-[#207F87] 
                after:scale-x-0 hover:after:scale-x-100 
                transition-all duration-300 ease-in-out `}>
                    Profile
                </NavLink>
            </li>}
        </ul>
      </div>
      {loggedIn ? 
      <div className="flex gap-2 sm:gap-5 items-center"><button onClick={LogoutHandler} className="sm:px-3 sm:py-2 p-1 bg-[#6C2E2E] rounded-xl text-white">Logout</button></div>
       : 
       <div className="flex gap-2 sm:gap-5 items-center">
        <Link to="/register" className="sm:px-3 sm:py-2 p-1 bg-[#6C2E2E] hover:bg-[#7b3e3e] rounded-xl text-white">Register</Link>
        <Link to="/login" className="sm:px-3 sm:py-2 p-1 bg-[#6C2E2E] rounded-xl text-white">Login</Link>
      </div>
      }
    </div>
    {loading && 
    <div className="w-[100vw] h-[2px] bg-[#DDDBDB]">
        <div className="animate-run w-[40vww] h-full bg-[#207F87]"></div>
    </div>
    }
    </>
  )
}

export default Header
