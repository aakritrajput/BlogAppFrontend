import {useEffect, useState} from 'react'
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom"
import axios from 'axios';
import defaultProfilePicture from "../../../public/defaultProfilePicture.jpeg"
import BlogCard from '../blogCard/BlogCard.jsx';

function Profile() {
    const [profileOwner, setProfileOwner] = useState(false);
    const {userId} = useParams();
    const currentUser = useSelector((state)=> state.user.user) ;
    //console.log("currentUser: ", currentUser)
    const [content, setContent] = useState([]); 
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [blogsCount , setBlogsCount] = useState(0);
    const [followersCount , setFollowersCount] = useState(0);
    const [followingCount , setFollowingCount] = useState(0);
    const [isFollowing , setIsFollowing] = useState(false); // if i follow the user 
    const [isFollowed, setIsFollowed] = useState(false);  // if user follow me 
    const [btnClicked, setBtnClicked] = useState(false);
    const [isYourBlogs , setIsYourBlogs] = useState(true);
    const [isSavedBlogs, setIsSavedBLogs] = useState(false);
    const [isLikedBlogs, setIsLikedBlogs] = useState(false);


    useEffect(() => {
      if (userId === currentUser?._id) {
          setProfileOwner(true);
      } else {
          setProfileOwner(false);
      }
  }, [userId, currentUser]);

    useEffect(()=>{
      setIsYourBlogs(true);
      setIsSavedBLogs(false);
      setIsLikedBlogs(false);
        const getUserProfile = async() => {
            setLoading(true);
            try {
                const response = await axios.get(`https://blogappbackend-uy9g.onrender.com/api/v1/user/userProfile/${userId}`,{withCredentials: true})
                setProfile(response.data.data)
            } catch (error) {
              error.status === 401 ? setErrorMessage("You are not authorized to perform this action or perform this task !! please login .. ") : setErrorMessage(error.response.data)
            }
        }

        const dashBoard = async() => {
            try {
                const response = await axios.get(`https://blogappbackend-uy9g.onrender.com/api/v1/dashboard/${userId}`, {withCredentials: true});
                const followingStatusResponse = await axios.get(`https://blogappbackend-uy9g.onrender.com/api/v1/followings/followingStatus/${userId}`,{withCredentials: true})
                const contentResponse = await axios.get(`https://blogappbackend-uy9g.onrender.com/api/v1/blog/userBlogs/${userId}`, {withCredentials: true})
                setContent(contentResponse.data.data);
                setIsFollowing(followingStatusResponse.data.data.isFollowing);
                setIsFollowed(followingStatusResponse.data.data.isFollowedByBlogger);
                setBlogsCount(response.data.data.totalBlogs);
                setFollowersCount(response.data.data.followers);
                setFollowingCount(response.data.data.following);
            } catch (error) {
              error.status === 401 ? setErrorMessage("You are not authorized to perform this action or perform this task !! please login .. ") : setErrorMessage(error.response.data)
            }finally{
              setLoading(false)
            }
        }
        dashBoard();
        getUserProfile();
    },[currentUser, profileOwner, userId, btnClicked])

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

    const yourBlogsHandler = async() => {
      setLoading(true);
      setIsYourBlogs(true);
      setIsSavedBLogs(false);
      setIsLikedBlogs(false);
      try {
        const contentResponse = await axios.get(`https://blogappbackend-uy9g.onrender.com/api/v1/blog/userBlogs/${userId}`, {withCredentials: true});
        setContent(contentResponse.data.data);
      } catch (error) {
        error.status === 401 ? setErrorMessage("You are not authorized to perform this action or perform this task !! please login .. ") : setErrorMessage(error.response.data)
      }finally{
        setLoading(false);
        
      }
    }

    const likedBlogsHandler = async() => {
      setLoading(true);
      setIsYourBlogs(false);
      setIsSavedBLogs(false);
      setIsLikedBlogs(true);
      try {
        const contentResponse = await axios.get(`https://blogappbackend-uy9g.onrender.com/api/v1/like/usersLikedBlogs`, {withCredentials: true});
        setContent(contentResponse.data.data);
      } catch (error) {
        error.status === 401 ? setErrorMessage("You are not authorized to perform this action or perform this task !! please login .. ") : setErrorMessage(error.response.data)
      }finally{
        setLoading(false);
        
      }
    }

    const savedBlogsHandler = async() => {
      setLoading(true);
      setIsYourBlogs(false);
      setIsSavedBLogs(true);
      setIsLikedBlogs(false);
      try {
        const contentResponse = await axios.get(`https://blogappbackend-uy9g.onrender.com/api/v1/user/savedBlogs`, {withCredentials: true});
        if(contentResponse?.data?.data[0]?.savedBlogs?.length > 0){
          setContent(contentResponse.data.data[0].savedBlogs );
        }else{
          setContent([]);
        }
      } catch (error) {
        error.status === 401 ? setErrorMessage("You are not authorized to perform this action or perform this task !! please login .. ") : setErrorMessage(error.response?.data)
      }finally{
        setLoading(false);
      }
    }
  return (
    <div className='min-h-[100vh] pb-[60px] relative '>
      {loading && 
        <div className="w-full h-[100vh] absolute flex justify-center z-30 items-center">
            <div className="animate-spin rounded-full h-[10vw] w-[10vw] md:border-t-[10px] border-t-[4px] border-[#207F87]"></div>
        </div>}
      <div className='mb-5'>
        <div className='w-full h-[80px] sm:h-[130px] relative'>
            {profile?.bannerPic?.length > 0 ? <img src={profile?.bannerPic} className='w-full h-full object-cover'/> : <div className='w-full h-full object-cover bg-[#364E4B]'></div>}
        </div>
        <div className=' border-t-[4px] border-t-[#207F87] grid grid-cols-1 sm:grid-cols-2 md:gap-7 gap-1 sm:gap-2 md:px-[50px] py-4'>
            <div className='flex gap-2 md:gap-5  pl-[10px]  md:pl-[50px] '>
                <div className='flex-shrink-0 w-[70px] h-[70px] sm:w-[100px] sm:h-[100px] md:w-[140px] md:h-[140px] lg:w-[170px] lg:h-[170px]'>
                    {profile?.profilePic?.length > 0 ? (
                      <img
                        src={profile?.profilePic}
                        className='w-full h-full object-cover rounded-full'
                        alt="Profile"
                      />
                    ) : (
                      <img
                        src={defaultProfilePicture}
                        className='w-full h-full object-cover rounded-full'
                        alt="Default Profile"
                      />
                    )}
                </div>

                <div className='py-3 flex flex-col justify-between md:items-center gap-1'>
                    <div>
                      <h1 className='font-bold md:text-lg text-[14px] pl-2 text-black'>{profile?.fullname}</h1>
                      <h3 className='text-[#393939] font-semibold text-[12px] md:text-[14px] pl-2'>{profile?.username}</h3>
                      <p className='text-[#323232] text-[12px] md:text-[14px] text-wrap leading-tight pl-2'>{profile?.bio}</p>
                    </div>
                    {profileOwner ? <Link to="/editProfile" className='mr-2 md:px-3.5 md:py-2.5 text-center  text-[12px] md:text-[14px] p-[3px]  rounded-md text-[White] bg-[#207F87]'>Edit Profile</Link>
                    :
                    <>
                      <button
                      className="w-full h-[40px] relative mb-2"
                      disabled={loading}
                      onClick={toggleHandler}
                    >
                    {isFollowing ? (
                      <div className="md:px-3.5 md:py-2.5 text-center  h-full rounded-md text-[gray] bg-[#aedde1]">
                        Following
                      </div>
                      ) : (
                        <div className="md:px-3.5 md:py-2.5 text-center text-white  rounded-md h-full bg-[#207F87]">
                          Follow
                        </div>
                      )
                    }
                    {loading && (
                      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-10 bg-black z-20">
                        <div className="animate-spin rounded-full h-[25px] w-[25px] border-t-[5px] border-[#24393b]"></div>
                      </div>
                    )}
                      </button>
                      {isFollowed && <p className="text-[#207F87]"> Follows you </p>}
                    </>
                  }
                </div>
            </div>
            <div className='md:pr-11 pr-3 flex-1 '>
                <div className='flex justify-center gap-2 sm:gap-4 md:gap-6'>
                  <div  className='flex flex-col gap-1 items-center'><h1 className='md:text-[30px] lg:text-[40px] sm:text-[28px] text-[19px] font-bold text-[#2d2c2c]'>{blogsCount}</h1><h3 className='font-semibold leading-tight text-[11px] sm:text-[16px] lg:text-lg'>Total Blogs</h3></div>
                  <Link to={`/userFollowers/${userId}`} className='flex flex-col gap-1 items-center'><h1 className='md:text-[30px] lg:text-[40px] sm:text-[28px] text-[19px] font-bold text-[#2d2c2c]'>{followersCount}</h1><h3 className='font-semibold leading-tight text-[11px] sm:text-[16px] lg:text-lg'>Followers</h3></Link>
                  <Link to={`/userFollowings/${userId}`} className='flex flex-col gap-1 items-center'><h1 className='md:text-[30px] lg:text-[40px] sm:text-[28px] text-[19px] font-bold text-[#2d2c2c]'>{followingCount}</h1><h3 className='font-semibold leading-tight text-[11px] sm:text-[16px] lg:text-lg'>Following</h3></Link>
                </div>
            </div>
        </div>
      </div>
      <div>
        {profileOwner && 
          <div className='flex mx-auto justify-center gap-3 sm:gap-11 border-y-2 border-y-gray-600 mt-1 sm:mt-3'>
            <button onClick={yourBlogsHandler}>{ isYourBlogs ? <h1 className='text-[#207F87] text-[14px] sm:text-xl'>Your Blogs</h1> : <h1 className='text-[#738586] text-[14px] sm:text-xl'>Your Blogs</h1> }</button>
            <button onClick={savedBlogsHandler}>{ isSavedBlogs ? <h1 className='text-[#207F87] text-[14px] sm:text-xl'>Saved Blogs</h1> : <h1 className='text-[#738586] text-[14px] sm:text-xl'>Saved Blogs</h1> }</button>
            <button onClick={likedBlogsHandler}>{ isLikedBlogs ? <h1 className='text-[#207F87] text-[14px] sm:text-xl'>Liked Blogs</h1> : <h1 className='text-[#738586] text-[14px] sm:text-xl'>Liked Blogs</h1> }</button>
          </div>}
        <div className="sm:px-[40px] px-2 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-5 sm:gap-y-11 gap-5 mb-7 border-t-2 border-t-gray-600 pt-3">
                {content.map((blog)=>(
                  <div key={blog._id} className="flex justify-center ">
                    <BlogCard coverImage={blog?.coverImage} title={blog?.title} content={blog?.content} authorImage={blog?.author?.profilePic} authorName={blog?.author?.username} blogId={blog?._id} authorId={blog?.author?._id}/>
                  </div>
                ))}
        </div>
        {content.length === 0 && <p className='text-gray-700 w-full flex justify-center '>No blogs to show !!</p>}
        {errorMessage && <div className="text-red-600 w-full flex justify-center text-centre my-7" >{errorMessage}</div>} 
      </div>
    </div>
  )
}

export default Profile
