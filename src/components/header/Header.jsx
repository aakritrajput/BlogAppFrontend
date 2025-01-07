//import React from 'react'
import axios from "axios"
import { useState, useEffect } from "react"
import { NavLink, Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { unsetUser } from "../store/userSlice.js"

function Header() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    useEffect(() => {
        const checkLogin = async () => {
            try {
                const response = await axios.get('/api/v1/user/profile', { withCredentials: true });
                console.log("response",response);
                setLoggedIn(true);
            } catch (error) {
                console.log("error header",error);
                setLoggedIn(false);
            }
        };
    
        checkLogin(); 
    }, []);

    const LogoutHandler = async() => {
        setLoading(true)
        try {
            const response = await axios.get("/api/v1/user/logout", { withCredentials: true})
            console.log("response logout : ", response)
            dispatch(unsetUser())
            location.reload()
        } catch (error) {
            alert(error.response.data)
        }finally{
            setLoading(false)
        }
    }


  return (
    <>
    <div className="flex justify-between px-4  bg-[#DDDBDB]">
      <h1 className="text-[#207F87] text-3xl font-semibold py-3">BlogApp</h1>
      <div >
        <ul className="flex list-none gap-5  h-full justify-center items-center">
            <li>
                <NavLink to="/" className={({ isActive })=> `${isActive ? "text-[#207F87] text-[25px] after:scale-x-100" : "text-[#989494] text-[25px] hover:text-[#7a7777]"} 
                relative after:absolute after:bottom-0 after:left-0 
                after:w-full after:h-[2px] after:bg-[#207F87] 
                after:scale-x-0 hover:after:scale-x-100 
                transition-all duration-300 ease-in-out `}>
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink to="/search" className={({ isActive })=> `${isActive ? "text-[#207F87] text-[25px] after:scale-x-100" : "text-[#989494] text-[25px] hover:text-[#7a7777]"} 
                relative after:absolute after:bottom-0 after:left-0 
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="22" stroke="gray" strokeWidth="2"/>
                        <line x1="24" y1="14" x2="24" y2="34" stroke="gray" strokeWidth="2"/>
                        <line x1="14" y1="24" x2="34" y2="24" stroke="gray" strokeWidth="2"/>
                    </svg>
                </NavLink>
            </li>}
            <li>
                <NavLink to="/trending" className={({ isActive })=> `${isActive ? "text-[#207F87] text-[25px] after:scale-x-100" : "text-[#989494] text-[25px] hover:text-[#7a7777]"} 
                relative after:absolute after:bottom-0 after:left-0 
                after:w-full after:h-[2px] after:bg-[#207F87] 
                after:scale-x-0 hover:after:scale-x-100 
                transition-all duration-300 ease-in-out `}>
                    Trending
                </NavLink>
            </li>
            {loggedIn && <li>
                <NavLink to="/profile" className={({ isActive })=> `${isActive ? "text-[#207F87] text-[25px] after:scale-x-100" : "text-[#989494] text-[25px] hover:text-[#7a7777]"} 
                relative after:absolute after:bottom-0 after:left-0 
                after:w-full after:h-[2px] after:bg-[#207F87] 
                after:scale-x-0 hover:after:scale-x-100 
                transition-all duration-300 ease-in-out `}>
                    Profile
                </NavLink>
            </li>}
        </ul>
      </div>
      {loggedIn ? 
      <div className="flex gap-5 items-center"><button onClick={LogoutHandler} className="px-3 py-2 bg-[#6C2E2E] rounded-xl text-white">Logout</button></div>
       : 
       <div className="flex gap-5 items-center">
        <Link to="/register" className="px-3 py-2 bg-[#6C2E2E] hover:bg-[#7b3e3e] rounded-xl text-white">Register</Link>
        <Link to="/login" className="px-3 py-2 bg-[#6C2E2E] rounded-xl text-white">Login</Link>
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
