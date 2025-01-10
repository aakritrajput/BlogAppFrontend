import {useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import defaultProfilePicture from "../../../public/defaultProfilePicture.jpeg"
import likedPng from "../../../public/like-icon-vector-illustration.jpg"
import unLikedPng from "../../../public/like-icon-vector-illustration (1).jpg"
import axios from 'axios';
import { useSelector } from "react-redux";
import { useForm } from 'react-hook-form'
import Comment from '../commentCard/Comment'


function Blogs() {
    const [blogOwner, setBlogOwner] = useState(false);
    const currentUser = useSelector((state)=> state.user.user) ;
    const {blogId , authorId} = useParams();
    const [loading, setLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
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
    const [blogComments, setBlogComments] = useState([]);

    const {register, handleSubmit, reset, formState: {errors}} = useForm();

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
        if(currentUser?._id === authorId){
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
            error.status === 401 ? setErrorMessage("You are not authorized to perform this action or perform this task !! please login .. ") : setErrorMessage(error.response.data)
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

    const addCommentHandler = async(data) => {
        setLoading(true);
        try {
            const response = await axios.post(`/api/v1/comment/postComment/${blogId}`, data, {withCredentials: true});
            setBlogComments((prev)=> [response.data.data , ...prev])
            console.log("comment added!!")
        } catch (error) {
            error.status === 401 ? setErrorMessage("You are not authorized to perform this action or perform this task !! please login .. ") : setErrorMessage(error.response.data) ;
            console.log("error adding comment")
        }finally{
            setLoading(false)
            reset();
        }
    }
    const likeToggleHandler = async() => {

    }

    const saveBlogHandler = async() => {
        
    }

    const commentHandler = async() => {
        
        const commentDiv = document.getElementById("commentDiv");
        
        const divClassList = commentDiv.classList ;
        
        if (  divClassList[0] === "hidden" ){
            commentDiv.classList.remove("hidden");
            setCommentLoading(true);
            try {
                const response = await axios.get(`/api/v1/comment/blogComments/${blogId}`, {withCredentials:true})
                setBlogComments(response.data.data)
            } catch (error) {
                error.status === 401 ? setErrorMessage("You are not authorized to perform this action or perform this task !! please login .. ") : setErrorMessage(error.response.data) ;
            }finally{
                setCommentLoading(false);
            }
        }else{
            commentDiv.classList.add("hidden");
        }
    }

    const editHandler = async() => {
        
    }

    const deleteHandler = async() => {
        
    }

  return (
    <div>
      <div className='flex justify-between w-full mx-9 px-5'>
        <h1 className='text-[#207F87]'>BlogApp</h1>
        {blogOwner && 
        <div className='flex gap-3'>
            <button onClick={editHandler} className='px-3 py-2 rounded-lg bg-green-600 text-black'>Edit</button>
            <button onClick={deleteHandler} className='px-3 py-2 rounded-lg bg-red-500 text-white'>Delete</button>
        </div>}
      </div>
      <div>
        <div className='flex flex-col items-center my-3'>
            <h1 className='text-black text-[30px] font-semibold'>{blog.title}</h1>
            <div>
                <img src={blog?.coverImage} className='rounded-2xl h-[300px]' alt="coverImage" />
            </div>
            <div className='p-5 mt-2'>
                {blog?.content}
            </div>
        </div>

        <div className='mx-4 px-3 my-2 flex justify-around'>
            <div>
                <button onClick={likeToggleHandler} className='mb-2  w-[40px] h-[40px]'>
                  {liked ? <img src={likedPng} /> : <img src={unLikedPng}/>}
                </button>
                <h1>{likesCount}</h1>
                
            </div>
            <div>
                <button onClick={saveBlogHandler} className='mb-2 w-[40px] h-[40px]'>
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 3H7C5.9 3 5 3.9 5 5v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7l-4-4zM12 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm2-9H8V5h6v5z" fill="black" />
                    </svg>
                </button>
                <h1>Save</h1>
            </div>
            <div>
                <button onClick={commentHandler} className='mb-2 w-[40px] h-[40px]'><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="M21 2H3c-1.1 0-2 .9-2 2v18l4-4h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM3 16v-2h16v2H3zm0-4V8h16v4H3zM3 6V4h16v2H3z" stroke="black" fill="none"/> </svg></button>
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

        <div className='hidden' id='commentDiv'>
            <form onSubmit={handleSubmit(addCommentHandler)} className='flex relative px-11 mt-4' >
               <div className="h-full flex items-center">
                   {blog?.author?.profilePic?.length > 0 ? <img src={blog?.author?.profilePic}  className="w-[40px] h-[40px] rounded-full" /> : <img src={defaultProfilePicture}  className="w-[40px] h-[40px] rounded-full" /> }
               </div>
               <input type="text" placeholder='Enter your comment..' className=' bg-transparent flex-1 focus:outline-none border-b-[2px] border-b-gray-700 px-4 my-4 placeholder:text-gray-600' {...register("content", {required: "comment cannot be empty!!"})}/>
               <button type='submit' className='bg-[#207F87] px-3 py-1 h-[40px] absolute bottom-4 right-11 rounded-lg text-white'>POST</button>
            </form>
            {errors.content && <p className='w-full flex justify-center text-red-600'>{errors.content.message}</p>}
            <div className='flex flex-col items-center mt-2'>
                {blogComments.map((comment)=> (
                    <div key={comment?._id}>
                        <Comment userImage={comment?.user?.profilePic} userId={comment?.user?._id} username={comment?.user?.username} authorId={authorId} commentId={comment?._id} content={comment?.content}/>
                    </div>
                ))}
            </div>
        </div>
      </div>
      {errorMessage && <div className="text-red-600 w-full flex justify-center text-centre my-7" >{errorMessage}</div>} 
    </div>
  )
}

export default Blogs
