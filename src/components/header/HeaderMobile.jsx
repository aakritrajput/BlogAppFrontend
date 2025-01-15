import { useEffect, useState } from "react";
import {  useSelector } from "react-redux"
import defaultProfilePicture from "../../../public/defaultProfilePicture.jpeg"
import {NavLink} from "react-router-dom"
import axios from "axios";

function HeaderMobile() {
    const [loggedIn, setLoggedIn] = useState(false);
    const user = useSelector((state)=> state.user.user);
    useEffect(() => {
        const checkLogin = async () => {
            try {
                await axios.get('https://blogappbackend-uy9g.onrender.com/api/v1/user/profile', { withCredentials: true });
                setLoggedIn(true);
            } catch (error) {
                setLoggedIn(false);
                console.log(error.status)
            }
        };
        checkLogin(); 
    }, []);
  return (
    <div className= " m-1 p-2 justify-center bg-[#000000d1] fixed bottom-2 w-[96%] rounded-lg  flex md:hidden z-20">
      <ul className="flex list-none gap-5  h-full justify-around w-full items-center">
            <li>
                <NavLink to="/" className={({ isActive })=> `${isActive ? "text-[#207F87] text-[25px] after:scale-x-100" : "text-[#989494] text-[25px] hover:text-[#7a7777]"} `}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="35" height="35">
                        <path d="M12 3L2 12h3v9h6v-6h2v6h6v-9h3L12 3z"/>
                    </svg>
                </NavLink>
            </li>
            <li>
                <NavLink to="/search" className={({ isActive })=> `${isActive ? "text-[#207F87] text-[25px] after:scale-x-100" : "text-[#989494] text-[25px] hover:text-[#7a7777]"} `}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="35" height="35">
                       <path d="M10 2a8 8 0 105.3 14.3l5.4 5.4a1 1 0 001.4-1.4l-5.4-5.4A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4z"/>
                    </svg>
                </NavLink>
            </li>
            {loggedIn && <li>
                <NavLink to="/create" className={({ isActive })=> `${isActive ? "text-[#207F87]  text-[25px] after:scale-x-100" : "text-[#989494] text-[25px] hover:text-[#7a7777]"} `}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="35" height="35">
                       <circle cx="12" cy="12" r="10" />
                       <line x1="12" y1="8" x2="12" y2="16" />
                       <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                </NavLink>

            </li>}
            {loggedIn && <li>
                <NavLink to={`/userProfile/${user?._id}`} className={({ isActive })=> `${isActive ? "text-[#207F87] text-[25px] after:scale-x-100" : "text-[#989494]  hover:text-[#7a7777]"} w-[35px] h-[35px] `}>
                    {user?.profilePic?.length > 0 ? <img src={user.profilePic} className="object-cover h-[35px] w-[35px] border-2 rounded-full border-current"/> : <img src={defaultProfilePicture} className="object-cover h-[35px] w-[35px] border-2 rounded-full border-current"/>}
                </NavLink>
            </li>}
        </ul>
    </div>
  )
}

export default HeaderMobile
