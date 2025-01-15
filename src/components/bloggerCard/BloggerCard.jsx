//import React from 'react'

import axios from "axios";
import { useEffect, useState } from "react"
import PropTypes from "prop-types";
import defaultProfilePicture from "../../../public/defaultProfilePicture.jpeg"
import { useNavigate } from "react-router-dom";


function BloggerCard({username, fullname,  userId, profilePic=""}) {
    const [loading, setLoading] = useState(false)
    const [isFollowing , setIsFollowing] = useState(false); // if i follow the user 
    const [isFollowed, setIsFollowed] = useState(false);  // if user follow me 
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [btnClicked, setBtnClicked] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        const getUserFollowings = async() => {
            setLoading(true);
            try {
                const FollowingCountResponse = await axios.get(`https://blogappbackend-uy9g.onrender.com/api/v1/followings/followerAndFollowingCount/${userId}`,{withCredentials: true})
                const followingStatusResponse = await axios.get(`https://blogappbackend-uy9g.onrender.com/api/v1/followings/followingStatus/${userId}`,{withCredentials: true})
    
                setFollowers(FollowingCountResponse.data.data.followers);
                setFollowing(FollowingCountResponse.data.data.following);
                setIsFollowing(followingStatusResponse.data.data.isFollowing);
                setIsFollowed(followingStatusResponse.data.data.isFollowedByBlogger);
            } catch (error) {
                setErrorMessage(error.response.data)
            }finally{
                setLoading(false)
            }
        }
        getUserFollowings();
    },[userId, btnClicked])

    const toggleHandler = async() => {
        setLoading(true)
        try {
            const response = await axios.patch(`https://blogappbackend-uy9g.onrender.com/api/v1/followings/toggleFollow/${userId}`,{}, {withCredentials: true})
            if(response.data.data.Following === true){
                setIsFollowing(true);
            }else{
                setIsFollowing(false);
            }
        } catch (error) {
            setErrorMessage(error.response.data)
        }finally{
            setLoading(false);
            if(btnClicked === true){
                setBtnClicked(false);
            }else{
                setBtnClicked(true);
            }
        }
    }

    const profileClickHandler = () => {
        navigate(`/userProfile/${userId}`)
    }

  return (
    <div className="bg-white flex gap-2 rounded-xl justify-between p-1.5 sm:p-3">
      <button className="w-75% sm:border-r-4  h-full md:pr-3 border-r-[#d3d2d2] flex gap-2 md:gap-3" onClick={profileClickHandler}>
        <div className="h-full flex items-center">
            {profilePic.length > 0 ? <img src={profilePic}  className="sm:w-[70px] sm:h-[70px] w-[40px] h-[40px] min-w-[40px] min-h-[40px] object-cover rounded-full" /> : <img src={defaultProfilePicture}  className="w-[70px] h-[70px]  rounded-full" /> }
        </div>
        <div className=" flex flex-col leading-tight items-start">
            <h1 className="sm:text-lg text-[14px] font-bold mt-1">{fullname}</h1>
            <h3 className="sm:text-[14x] text-[12px] font-semibold">{username}</h3>
            <div className="flex sm:gap-3 gap-2 mt-1">
                <p className="text-[#959595] text-[11px] sm:text-[13px]">{`${followers} followers`}</p>
                <p className="text-[#959595] text-[11px] sm:text-[13px]">{`${following} following`}</p>
            </div>
            {errorMessage  && <p className="text-red-500 text-wrap">{errorMessage.message || errorMessage}</p>}
        </div>
      </button>
      <div className="w-25% h-full flex flex-col justify-center mx-1 sm:mx-2.5 items-center">
      <button
        className="w-full sm:h-[40px] h-[32px] relative sm:mb-2"
        disabled={loading}
        onClick={toggleHandler}
      >
        {isFollowing ? (
          <div className="sm:px-3.5 px-1 sm:py-2.5 text-center text-[12px] justify-center sm:text-[14px] flex items-center w-full h-full rounded-md text-[gray] bg-[#aedde1]">
            Following
          </div>
        ) : (
          <div className="sm:px-3.5 px-1 sm:py-2.5 text-center text-[12px] justify-center sm:text-[14px] flex items-center text-white w-full rounded-md h-full bg-[#207F87]">
            Follow
          </div>
        )}
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-10 bg-black z-20">
            <div className="animate-spin rounded-full h-[25px] w-[25px] border-t-[2px] sm:border-t-[5px] border-[#24393b]"></div>
          </div>
        )}
    </button>

      {isFollowed && <p className="text-[#207F87] text-[11px] sm:text-[14px]"> Follows you </p>}
      </div>
    </div>
  )
}

BloggerCard.propTypes = {
    username: PropTypes.string.isRequired,
    fullname: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    profilePic: PropTypes.string.isRequired
}

export default BloggerCard
