//import React from 'react'

import axios from "axios";
import { useEffect, useState } from "react"
import PropTypes from "prop-types";
import defaultProfilePicture from "../../../public/defaultProfilePicture.jpeg"


function BloggerCard({username, fullname, bio, userId, profilePic}) {
    const [loading, setLoading] = useState(false)
    const [isFollowing , setIsFollowing] = useState(false); // if i follow the user 
    const [isFollowed, setIsFollowed] = useState(false);  // if user follow me 
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(()=>{
        const getUserFollowings = async() => {
            setLoading(true);
            try {
                const FollowingCountResponse = await axios.get(`api/v1/followings/followerAndFollowingCount/${userId}`,{withCredentials: true})
                const followingStatusResponse = await axios.get(`api/v1/followings/followingStatus/${userId}`,{withCredentials: true})
    
                //response.data.data.followers && following  --> count
                // response.data.data.isFollowing && isFollowedByBlogger --> followingStatus
    
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
    },[userId])

  return (
    <div className="bg-white flex gap-2 rounded-xl justify-between p-3">
      <div className="w-70% border-r-4 h-full border-r-[#d3d2d2] flex gap-3">
        <div className="h-full flex items-center">
            {profilePic.length > 0 ? <img src={profilePic}  className="w-[70px] h-[70px] rounded-full" /> : <img src={defaultProfilePicture}  className="w-[70px] h-[70px] rounded-full" /> }
        </div>
        <div>
            <h1 className="text-lg font-bold mt-1">{fullname}</h1>
            <h3 className="text-md font-semibold">{username}</h3>
            <p className="leading-none text-[black] mt-1">{bio}</p>
            <div className="flex gap-3 mt-1">
                <p className="text-[#959595]">{`${followers} followers`}</p>
                <p className="text-[#959595]">{`${following} following`}</p>
            </div>
            {errorMessage  && <p className="text-red-500">{errorMessage.message || errorMessage}</p>}
        </div>
      </div>
      <div className="w-30% h-full flex justify-center mx-2.5 items-center">
        <button className="w-full h-[40px] relative mb-2">
            {isFollowing ? <div className="px-3.5 py-2.5 text-center w-full h-full text-[gray] bg-[#aedde1]">Following</div> : <div className="px-3.5 py-2.5 text-center text-white w-full h-full bg-[#207F87]">Follow</div>}
            {loading && 
            <div className="w-full h-full absolute flex justify-center items-center my-7">
                <div className="animate-spin rounded-full h-[25px] w-[25px] border-t-[5px] border-[#24393b]"></div>
            </div>}
        </button>
        {isFollowed && <p className="text-[#207F87]"> Follows you </p>}
      </div>
    </div>
  )
}

BloggerCard.propTypes = {
    username: PropTypes.string.isRequired,
    fullname: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    profilePic: PropTypes.string.isRequired
}

export default BloggerCard
