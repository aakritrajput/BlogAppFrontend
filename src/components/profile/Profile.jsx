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
    console.log("currentUser: ", currentUser)
    const [content, setContent] = useState([]); 
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [blogsCount , setBlogsCount] = useState(0);
    const [followersCount , setFollowersCount] = useState(0);
    const [followingCount , setFollowingCount] = useState(0);
    const [likesCount , setLikesCount] = useState(0);
    const [isFollowing , setIsFollowing] = useState(false); // if i follow the user 
    const [isFollowed, setIsFollowed] = useState(false);  // if user follow me 
    const [btnClicked, setBtnClicked] = useState(false);
    const [isYourBlogs , setIsYourBlogs] = useState(true);
    const [isSavedBlogs, setIsSavedBLogs] = useState(false);
    const [isLikedBlogs, setIsLikedBlogs] = useState(false);
    
    console.log(`userId = ${userId} and currentUser : ${currentUser}`)
    
    console.log("component rendered")

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
      console.log(" useEffect runs ")
        const getUserProfile = async() => {
          console.log("userProflie runs")
            setLoading(true);
            try {
                const response = await axios.get(`/api/v1/user/userProfile/${userId}`,{withCredentials: true})
                setProfile(response.data.data)
                console.log(`response.data.data : ` , response.data.data)
            } catch (error) {
                setErrorMessage(error.response.data)
                console.log("error occured in useeffect get profile ", error.message)
            }
        }

        const dashBoard = async() => {
            try {
                const response = await axios.get(`/api/v1/dashboard/${userId}`, {withCredentials: true});
                const followingStatusResponse = await axios.get(`/api/v1/followings/followingStatus/${userId}`,{withCredentials: true})
                const contentResponse = await axios.get(`/api/v1/blog/userBlogs/${userId}`, {withCredentials: true})
                setContent(contentResponse.data.data);
                console.log('contentResponse.data.data', contentResponse.data.data)
                setIsFollowing(followingStatusResponse.data.data.isFollowing);
                setIsFollowed(followingStatusResponse.data.data.isFollowedByBlogger);
                console.log(`dashboard response:`, response);
                setBlogsCount(response.data.data.totalBlogs);
                setFollowersCount(response.data.data.followers);
                setFollowingCount(response.data.data.following);
                setLikesCount(response.data.data.totalLikes);
            } catch (error) {
                setErrorMessage(error.response.data);
                console.log(error);
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
            const response = await axios.patch(`/api/v1/followings/toggleFollow/${userId}`, {withCredentials: true})
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
        const contentResponse = await axios.get(`/api/v1/blog/userBlogs/${userId}`, {withCredentials: true});
        setContent(contentResponse.data.data);
      } catch (error) {
        setErrorMessage(error.response.data);
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
        const contentResponse = await axios.get(`/api/v1/like/usersLikedBlogs`, {withCredentials: true});
        setContent(contentResponse.data.data);
      } catch (error) {
        setErrorMessage(error.response.data);
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
        const contentResponse = await axios.get(`/api/v1/user/savedBlogs`, {withCredentials: true});
        setContent(contentResponse.data.data);
      } catch (error) {
        setErrorMessage(error.response.data);
      }finally{
        setLoading(false);
      }
    }
    
    console.log("profile :", profile)
    console.log("content:", content)

  return (
    <div className='min-h-[100vh] relative '>
      {loading && 
        <div className="w-full h-[100vh] absolute flex justify-center items-center bg-[#000000c8]">
            <div className="animate-spin rounded-full h-[10vw] w-[10vw] border-t-[10px] border-[#207F87]"></div>
        </div>}
      <div className='mb-5'>
        <div className='w-full h-[130px] relative'>
            {profile?.bannerPic?.length > 0 ? <img src={profile?.bannerPic} className='w-full h-full object-cover'/> : <div className='w-full h-full object-cover bg-[#364E4B]'></div>}
        </div>
        <div className='  flex gap-7  px-[50px] py-4'>
            <div className='flex gap-5 pl-[50px] '>
                <div >
                   { profile?.profilePic?.length > 0 ? <img src={profile?.profilePic}  className='w-[170px]  top-[-30px] h-[170px] rounded-full'/> : <img src={defaultProfilePicture} className='w-[150px] h-[150px]   rounded-full'/>}
                </div>
                <div className='py-3 flex flex-col justify-between items-center gap-1'>
                    <div>
                      <h1 className='font-bold text-lg pl-2 text-black'>{profile?.fullname}</h1>
                      <h3 className='text-[#393939] pl-2'>{profile?.username}</h3>
                      <p className='text-[#323232] pl-2'>{profile?.bio}</p>
                    </div>
                    {profileOwner ? <Link to="/editProfile" className='px-3.5 py-2.5 text-center w-full   rounded-md text-[White] bg-[#207F87]'>Edit Profile</Link>
                    :
                    <>
                      <button
                      className="w-full h-[40px] relative mb-2"
                      disabled={loading}
                      onClick={toggleHandler}
                    >
                    {isFollowing ? (
                      <div className="px-3.5 py-2.5 text-center w-full h-full rounded-md text-[gray] bg-[#aedde1]">
                        Following
                      </div>
                      ) : (
                        <div className="px-3.5 py-2.5 text-center text-white w-full rounded-md h-full bg-[#207F87]">
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
            <div className='pr-11 flex-1 '>
                <div className='flex justify-center gap-6'>
                  <div  className='flex flex-col gap-1 items-center'><h1 className='text-[40px] font-bold text-[#2d2c2c]'>{blogsCount}</h1><h3 className='font-semibold text-lg'>Total Blogs</h3></div>
                  <Link to={`/userFollowers/${userId}`} className='flex flex-col gap-1 items-center'><h1 className='text-[40px] font-bold text-[#2d2c2c]'>{followersCount}</h1><h3 className='font-semibold text-lg'>Followers</h3></Link>
                  <Link to={`/userFollowings/${userId}`} className='flex flex-col gap-1 items-center'><h1 className='text-[40px] font-bold text-[#2d2c2c]'>{followingCount}</h1><h3 className='font-semibold text-lg'>Following</h3></Link>
                </div>
                <div className='flex flex-row-reverse'><p>Total Likes: {likesCount}</p></div>
            </div>
        </div>
      </div>
      <div>
        {profileOwner && 
          <div className='flex mx-auto justify-center gap-11 border-y-2 border-y-gray-600 mt-3'>
            <button onClick={yourBlogsHandler}>{ isYourBlogs ? <h1 className='text-[#207F87] text-xl'>Your Blogs</h1> : <h1 className='text-[#738586] text-xl'>Your Blogs</h1> }</button>
            <button onClick={savedBlogsHandler}>{ isSavedBlogs ? <h1 className='text-[#207F87] text-xl'>Saved Blogs</h1> : <h1 className='text-[#738586] text-xl'>Saved Blogs</h1> }</button>
            <button onClick={likedBlogsHandler}>{ isLikedBlogs ? <h1 className='text-[#207F87] text-xl'>Liked Blogs</h1> : <h1 className='text-[#738586] text-xl'>Liked Blogs</h1> }</button>
          </div>}
        <div className="px-[40px] grid grid-cols-4 gap-5 gap-y-11 border-t-2 border-t-gray-600 pt-3">
                {content.map((blog)=>(
                  <div key={blog._id} className="flex justify-center ">
                    <BlogCard coverImage={blog.coverImage} title={blog.title} content={blog.content} authorImage={blog.author.profilePic} authorName={blog.author.username} blogId={blog._id} authorId={blog.author._id}/>
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
