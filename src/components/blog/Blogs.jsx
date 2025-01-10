import {useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import defaultProfilePicture from "../../../public/defaultProfilePicture.jpeg"
import axios from 'axios';
import { useSelector } from "react-redux";
import LikeButton from "../BasicComponent/LikeButton.jsx";

function Blogs() {
    const [blogOwner, setBlogOwner] = useState(false);
    const currentUser = useSelector((state)=> state.user.user) ;
    const {blogId , authorId} = useParams();
    const [loading, setLoading] = useState(false);
    const [isFollowing , setIsFollowing] = useState(false); // if i follow the user 
    const [isFollowed, setIsFollowed] = useState(false);  // if user follow me 
    const [followers, setFollowers] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [btnClicked, setBtnClicked] = useState(false);
    const [blog , setBlog] = useState({});
    const navigate = useNavigate();
    const [likesCount, setLikesCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [isBlogSaved, setIsBlogedSaved] = useState(false);
    const [commentVisible , SetCommentVisible] = useState(false);

    useEffect(()=>{
        const getUserFollowings = async() => {
            setLoading(true);
            try {
                const FollowingCountResponse = await axios.get(`/api/v1/followings/followerAndFollowingCount/${authorId}`,{withCredentials: true})
                const followingStatusResponse = await axios.get(`/api/v1/followings/followingStatus/${authorId}`,{withCredentials: true})
    
                //response.data.data.followers && following  --> count
                // response.data.data.isFollowing && isFollowedByBlogger --> followingStatus
    
                setFollowers(FollowingCountResponse.data.data.followers);
                setIsFollowing(followingStatusResponse.data.data.isFollowing);
                setIsFollowed(followingStatusResponse.data.data.isFollowedByBlogger);
            } catch (error) {
                error.status === 401 ? setErrorMessage("You are not authorized to perform this action or perform this task !! please login .. ") : setErrorMessage(error.response.data)
            }finally{
                setLoading(false)
            }
        }
        getUserFollowings();
    },[btnClicked, authorId])

    useEffect(()=>{
        const getBlog = async()=> {
            setLoading(true);
            try {
                const response = await axios.get(`/api/v1/blog/blogById/${blogId}`, {withCredentials: true})
                setBlog(response.data.data)
                console.log("fetched Blog successfully :", response)
            } catch (error) {
                error.status === 401 ? setErrorMessage("You are not authorized to perform this action or perform this task !! please login .. ") : setErrorMessage(error.response.data)
            }finally{
                setLoading(false)
            }
        }
        getBlog();
    },[blogId])

    useEffect(()=>{
        if(currentUser._id === authorId){
            setBlogOwner(true)
        }
    },[authorId, currentUser])

    const toggleHandler = async() => {
        setLoading(true)
        try {
            const response = await axios.patch(`/api/v1/followings/toggleFollow/${authorId}`, {withCredentials: true})
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
        navigate(`/userProfile/${authorId}`)
    }

    const likeToggleHandler = async() => {

    }

    const saveBlogHandler = async() => {
        
    }

    const commentHandler = async() => {
        
    }

    const editHandler = async() => {
        
    }

    const deleteHandler = async() => {
        
    }

  return (
    <div>
      <div className='flex justify-between w-full mx-9 px-5'>
        <h1 >BlogApp</h1>
        {blogOwner && 
        <div className='flex gap-3'>
            <button onClick={editHandler} className='px-3 py-2 rounded-lg text-black'>Edit</button>
            <button onClick={deleteHandler} className='px-3 py-2 rounded-lg text-white'>Delete</button>
        </div>}
      </div>
      <div>
        <div className='flex flex-col items-center my-3'>
            <h1 className='text-black text-[30px] font-semibold'>{blog.title}</h1>
            <div>
                <img src={blog?.coverImage} className='rounded-2xl' alt="coverImage" />
            </div>
            <div className='p-5 mt-2'>
                {blog?.content}
            </div>
        </div>

        <div className='mx-4 px-3 my-2 flex justify-around'>
            <div>
                <button onClick={likeToggleHandler} className='mb-2 w-[40px] h-[40px]'>
                <LikeButton
                  fill={liked ? "#ff0000" : "#ffffff"}
                  onClick={() => setLiked(!liked)}
                />
                </button>
                <h1>{likesCount}</h1>
            </div>
            <div>
                <button onClick={saveBlogHandler} className='mb-2 w-[40px] h-[40px]'></button>
                <h1>Save</h1>
            </div>
            <div>
                <button onClick={commentHandler} className='mb-2 w-[40px] h-[40px]'></button>
                <h1>Comments</h1>
            </div>
        </div>

        <div className='flex justify-between mx-3 px-2'>
            <div >
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
                    )}
                    {loading && (
                      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-10 bg-black z-20">
                        <div className="animate-spin rounded-full h-[25px] w-[25px] border-t-[5px] border-[#24393b]"></div>
                      </div>
                    )}
                </button>
                {isFollowed && <p className="text-[#207F87]"> Follows you </p>}
            </div>
            <div className='flex gap-3'>
                <h1>Author: </h1>
                <button className="w-75% border-r-4 h-full pr-3 border-r-[#d3d2d2] flex gap-2" onClick={profileClickHandler}>
                    <div className="h-full flex items-center">
                        {blog?.author?.profilePic?.length > 0 ? <img src={blog?.author?.profilePic}  className="w-[70px] h-[70px] rounded-full" /> : <img src={defaultProfilePicture}  className="w-[70px] h-[70px] rounded-full" /> }
                    </div>
                    <div>
                        <h1 className="text-xl text-black font-bold">{blog?.author?.username}</h1>
                        <p className="text-[#959595]">{`${followers} followers`}</p>
                    </div>
                </button>
            </div>
        </div>

        <div>
            
        </div>
      </div>
    </div>
  )
}

export default Blogs
