import {useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import defaultProfilePicture from "../../../public/defaultProfilePicture.jpeg"
import likedPng from "../../../public/like-icon-vector-illustration.jpg"
import unLikedPng from "../../../public/like-icon-vector-illustration (1).jpg"
import axios from 'axios';
import { useSelector ,useDispatch} from "react-redux";
import { useForm } from 'react-hook-form'
import Comment from '../commentCard/Comment.jsx'
import { setUser, unsetUser } from "../store/userSlice.js"



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
    const dispatch = useDispatch();
    const [FollowLoading , setFollowLoading ] = useState(false);

    const {register, handleSubmit, reset, formState: {errors}} = useForm();

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const response = await axios.get('/api/v1/user/profile', { withCredentials: true });
                dispatch(setUser(response.data.data))
            } catch (error) {
                dispatch(unsetUser());
                console.log(error.status)
            }
        };
    
        checkLogin(); 
    }, [dispatch]);

    useEffect(()=>{
        const getUserFollowings = async() => {
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
            }
        }
        getUserFollowings();
    },[btnClicked, authorId])

    useEffect(()=>{
        const getBlog = async()=> {
            setLoading(true);
            try {
                const response = await axios.get(`/api/v1/blog/blogById/${blogId}`, {withCredentials: true})
                const likestatus = await axios.get(`/api/v1/like/isBlogLiked/${blogId}`, {withCredentials: true}) 
                const likeCountResponse = await axios.get(`/api/v1/like/blogLikesCount/${blogId}`, {withCredentials:true})
                const isBlogSaved = await axios.get(`/api/v1/blog/isBlogSaved/${blogId}`, {withCredentials: true})
                setBlog(response.data.data)
                setLiked(likestatus.data.data.isLiked);
                setLikesCount(likeCountResponse.data.data.likes);
                setIsBlogedSaved(isBlogSaved.data.data.isSaved);
                //console.log("fetched Blog successfully :", response)
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
        setFollowLoading(true)
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
            setFollowLoading(false);
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
        setCommentLoading(true);
        try {
            const response = await axios.post(`/api/v1/comment/postComment/${blogId}`, data, {withCredentials: true});
            setBlogComments((prev)=> [response.data.data , ...prev])
            console.log("comment added!!", response.data.data)
        } catch (error) {
            error.status === 401 ? setErrorMessage("You are not authorized to perform this action or perform this task !! please login .. ") : setErrorMessage(error.response.data) ;
            console.log("error adding comment")
        }finally{
            setCommentLoading(false)
            reset();
        }
    }
    const likeToggleHandler = async() => {
        try {
            console.log("liketoggle try runs!!");
            const response = await axios.patch(`/api/v1/like/toggleBlogLike/${blogId}`, {withCredentials:true})
            const likeCountResponse = await axios.get(`/api/v1/like/blogLikesCount/${blogId}`, {withCredentials:true})
            setLiked(response.data.data.like);
            setLikesCount(likeCountResponse.data.data.likes);
        } catch (error) {
            console.log(error)
            error.status === 401 ? setErrorMessage("You are not authorized to perform this action or perform this task !! please login .. ") : setErrorMessage(error.response.data)
        }
    }

    const saveBlogHandler = async() => {
        setLoading(true);
        try {
            if(isBlogSaved === false){
              await axios.patch(`/api/v1/blog/saveBlog/${blogId}`, {withCredentials:true})
              setIsBlogedSaved(true);
              console.log("blog saved successfully !!")
            }else{
                await axios.patch(`/api/v1/user/removeFromSavedBlogs/${blogId}`, {withCredentials:true})
                setIsBlogedSaved(false);
                console.log("blog unsaved successfully !!")
            }
        } catch (error) {
            error.status === 401 ? setErrorMessage("You are not authorized to perform this action or perform this task !! please login .. ") : setErrorMessage(error.response.data)
        }finally{
            setLoading(false);
        }
    }

    const commentHandler = async() => {
        
        const commentDiv = document.getElementById("commentDiv");
        
        const divClassList = commentDiv.classList ;
        
        if (  divClassList[0] === "hidden" ){
            commentDiv.classList.remove("hidden");
            SetCommentVisible(true);
            setCommentLoading(true);
            try {
                const response = await axios.get(`/api/v1/comment/blogComments/${blogId}`, {withCredentials:true})
                setBlogComments(response.data.data)
                console.log("comment data received from backend !!", response)
            } catch (error) {
                error.status === 401 ? setErrorMessage("You are not authorized to perform this action or perform this task !! please login .. ") : setErrorMessage(error.response.data) ;
            }finally{
                setCommentLoading(false);
            }
        }else{
            commentDiv.classList.add("hidden");
            SetCommentVisible(false);
        }
    }

    const editHandler = async() => {
        navigate(`/editBlog/${blogId}`)
    }

    const deleteHandler = async() => {
        setLoading(true);
        try {
            await axios.delete(`/api/v1/blog/deleteBlog/${blogId}`, {withCredentials: true})
            setLoading(false);
            navigate("/")
        } catch (error) {
            setLoading(false);
            alert(error.status === 401 ? "You are not authorized to perform this action or perform this task !! please login .. " : error.response.data )
        }
    }

  return (
    <div className='relative'>
        {loading && 
        <div className="w-[100vw] h-full absolute flex justify-center z-50 items-center bg-[#000000c8]">
            <div className="animate-spin rounded-full h-[10vw] w-[10vw] md:border-t-[10px] border-t-[4px] border-[#207F87]"></div>
        </div>}
      <div className='flex my-2 justify-between mx-2 px-2 md:mx-9 md:px-5'>
        <h1 className='text-[#207F87] md:text-3xl sm:text-2xl text-[18px] font-bold'>BlogApp</h1>
        {blogOwner && 
        <div className='flex gap-3'>
            <button onClick={editHandler} className='sm:px-3 px-1.5 py-1.5 sm:py-2 rounded-lg bg-green-600 text-black'>Edit</button>
            <button onClick={deleteHandler} className='sm:px-3 px-1.5 py-1.5 sm:py-2 rounded-lg bg-red-500 text-white'>Delete</button>
        </div>}
      </div>
      <div>
        <div className='flex flex-col items-center my-3'>
            <h1 className='text-black sm:text-[30px] w-full  text-center mb-2 mx-2 font-semibold'>{blog.title}</h1>
            <div className='px-2'>
                <img src={blog?.coverImage} className='rounded-2xl border-2 border-spacing-1 border-[#207F87]  sm:w-auto sm:h-[300px]' alt="coverImage" />
            </div>
            <div className='sm:p-5 md:px-11 sm:px-8 px-6 sm:m-8 sm:border-b-4 sm:border-b-[#207F87] mt-2'>
                {blog?.content}
            </div>
        </div>

        <div className='sm:m-5  mb-5 flex border-2 border-[gray] mx-2 rounded-3xl p-3 justify-around'>
            <div >
                <button onClick={likeToggleHandler} className='mb-2 bg-green-400 w-[30px] h-[30px]'>
                  {liked ? <img src={likedPng} /> : <img src={unLikedPng}/>}
                </button>
                <h1 className='w-full flex justify-center'>{likesCount}</h1>
                
            </div>
            <div >
                <button onClick={saveBlogHandler} className='mb-2 w-[30px] flex justify-center  h-[30px]'>
                    {isBlogSaved ? 
                    <svg width="30" height="30" viewBox="0 0 24 24" stroke='black' xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 3H7C5.9 3 5 3.9 5 5v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7l-4-4zM12 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm2-9H8V5h6v5z" fill="black" />
                    </svg> :
                    <svg width="30" height="30" viewBox="0 0 24 24" stroke='black' xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 3H7C5.9 3 5 3.9 5 5v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7l-4-4zM12 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm2-9H8V5h6v5z" fill="none" />
                    </svg> 
                    }
                </button>
                <h1 className='w-full flex justify-center'>{isBlogSaved ? "Saved" : "save"}</h1>
            </div>
            <div className= 'flex flex-col items-center'>
                { commentVisible ?
                    <button onClick={commentHandler} className='mb-2 w-[30px] flex justify-center h-[30px]'><svg width="30" height="30" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg"> <path d="M21 2H3c-1.1 0-2 .9-2 2v18l4-4h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM3 16v-2h16v2H3zm0-4V8h16v4H3zM3 6V4h16v2H3z" stroke="black" fill="black"/> </svg></button>
                    :
                    <button onClick={commentHandler} className='mb-2 w-[30px] flex justify-center h-[30px]'><svg width="30" height="30" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg"> <path d="M21 2H3c-1.1 0-2 .9-2 2v18l4-4h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM3 16v-2h16v2H3zm0-4V8h16v4H3zM3 6V4h16v2H3z" stroke="black" fill="none"/> </svg></button>
                }
                <h1>Comments</h1>
            </div>
        </div>

        <div className='flex justify-between mx-3 bg-[#3e3d3d51] rounded-lg py-3 mb-7 sm:px-2'>
            <div className='sm:ml-4 ml-2 flex flex-col justify-center'>
                <button
                className="w-full h-[30px] sm:h-[40px] relative mb-2"
                disabled={loading}
                onClick={toggleHandler}
                >
                    {isFollowing ? (
                      <div className="sm:px-3.5 sm:py-2.5 px-1.5 py-1.5 text-center w-full h-full rounded-md text-[gray] bg-[#aedde1]">
                        Following
                      </div>
                    ) : (
                      <div className="sm:px-3.5 sm:py-2.5 px-1.5 py-1.5 text-center text-white w-full rounded-md h-full bg-[#207F87]">
                        Follow
                      </div>
                    )}
                    {FollowLoading && (
                      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-10 bg-black z-20">
                        <div className="animate-spin rounded-full h-[20px] w-[20px] border-t-[5px] border-[#24393b]"></div>
                      </div>
                    )}
                </button>
                {isFollowed && <p className="text-[#207F87] w-full justify-center flex"> Follows you </p>}
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 mx-4 sm:gap-3'>
                <h1 className='h-full flex items-center sm:text-2xl text-[19px] font-semibold'>Author: </h1>
                <button className="w-75% sm:border-r-4 h-full sm:pr-3 pr-2 border-r-[#d3d2d2] flex gap-2" onClick={profileClickHandler}>
                    <div className="h-full flex items-center">
                        {blog?.author?.profilePic?.length > 0 ? <img src={blog?.author?.profilePic}  className="sm:w-[70px] sm:h-[70px] w-[40px] h-[40px] object-cover rounded-full" /> : <img src={defaultProfilePicture}  className="sm:w-[70px] sm:h-[70px] w-[40px] h-[40px] rounded-full" /> }
                    </div>
                    <div>
                        <h1 className="sm:text-xl text-[16px] text-black font-bold">{blog?.author?.username}</h1>
                        <p className="text-[#444444]">{`${followers} followers`}</p>
                    </div>
                </button>
            </div>
        </div>

        <div className='hidden' id='commentDiv'>
            <form onSubmit={handleSubmit(addCommentHandler)} className='flex relative px-6 sm:px-11 mt-4' >
               <div className=" w-[40px] h-[40px] flex-shrink-0 sm:flex items-center">
                   {currentUser?.profilePic?.length > 0 ? <img src={currentUser?.profilePic}  className="w-[40px] h-[40px] rounded-full object-cover" /> : <img src={defaultProfilePicture}  className="w-[40px] h-[40px] object-cover rounded-full" /> }
               </div>
               <input type="text" placeholder='Enter your comment..' className=' bg-transparent flex-1 mr-[60px] focus:outline-none border-b-[2px] border-b-gray-700 px-4 my-4 text-[14px] placeholder:text-gray-600' {...register("content", {required: "comment cannot be empty!!"})}/>
               <button type='submit' className='bg-[#207F87] px-3 py-1 h-[40px] absolute bottom-4 right-[24px] sm:right-11 rounded-lg text-white'>POST</button>
            </form>
            {errors.content && <p className='w-full flex justify-center text-red-600'>{errors.content.message}</p>}
            <div className='flex flex-col mb-11 items-center gap-2 mt-2'>
                { blogComments.length > 0 ? 
                blogComments.map((comment)=> (
                    <div key={comment?._id}>
                        <Comment userImage={comment?.user?.profilePic} userId={comment?.user?._id} username={comment?.user?.username} authorId={authorId} commentId={comment?._id} content={comment?.content}/>
                    </div>
                ))
                :
                <h1 className='w-full flex justify-center text-gray-800'>No comments...</h1>
            }
                {commentLoading && 
                <div className="w-full h-[30px]  flex justify-center items-center my-7">
                    <div className="animate-spin rounded-full h-[30px] w-[30px] border-t-[5px] border-[#207F87]"></div>
                </div>}
      
                
            </div>
        </div>
      </div>
      {errorMessage && <div className="text-red-600 w-full flex justify-center text-centre my-7" >{errorMessage}</div>} 
    </div>
  )
}

export default Blogs
