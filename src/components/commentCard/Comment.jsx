import {useEffect, useState} from 'react'
import PropTypes from "prop-types";
import defaultProfilePicture from "../../../public/defaultProfilePicture.jpeg"
import likedPng from "../../../public/like-icon-vector-illustration.jpg"
import unLikedPng from "../../../public/like-icon-vector-illustration (1).jpg"
import axios from 'axios';
import { useSelector } from "react-redux";

function Comment({userImage, userId , username , authorId ,  commentId, content}) {
    const [likesCount, setLikesCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [commentOwner , setCommentOwner] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [btnClicked, setBtnClicked] = useState(false);
    const [deleted, setDeleted] = useState(false);

    const currentUser = useSelector((state)=> state.user.user) ;

    const likeToggleHandler = async() => {
        setLoading(true);
        try {
            const response = await axios.patch(`/api/v1/like/toggleCommentLike/${commentId}`, {withCredentials: true})
            if(response.data.data.like === true){
                setLiked(true);
            }else{
                setLiked(false);
            }
        } catch (error) {
            error.status === 401 ? setErrorMessage("You are not authorized to perform this action or perform this task !! please login .. ") : setErrorMessage(error.response.data)
        }finally{
            setLoading(false);
            if(btnClicked === true){
                setBtnClicked(false)
            }else{
                setBtnClicked(true)
            }
        }
    }

    useEffect(()=>{
        console.log("useeffect runs")
        console.log("currentUser",currentUser)
        if(currentUser?._id === authorId || currentUser?._id === userId ){
            setCommentOwner(true);
            console.log("useeffect runs again!!")
        }
    },[authorId,currentUser,userId])

    useEffect(()=>{
        const getLikesCount = async() => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/v1/like/commentLikesCount/${commentId}`, {withCredentials: true})
                const likeStatus = await axios.get(`/api/v1/like/isCommentLiked/${commentId}`, {withCredentials: true})
                //console.log(response)
                //console.log('likeStatus', likeStatus)
                setLikesCount(response.data.data.likes);
                setLiked(likeStatus.data.data.isLiked)
                //.log('fetched comment likes count !!')
            } catch (error) {
                //console.log('failed fetching comment likes count !!', error.response.data)
                error.status === 401 ? setErrorMessage("You are not authorized to perform this action or perform this task !! please login .. ") : setErrorMessage(error.response.data)
            }finally{
                setLoading(false)
            }
        }

        getLikesCount();
    },[commentId, btnClicked])

    const deleteCommentHandler = async() => {
        setLoading(true);
        try {
            await axios.delete(`/api/v1/comment/deleteComment/${commentId}`, {withCredentials: true})
            setDeleted(true)
        } catch (error) {
            error.status === 401 ? setErrorMessage("You are not authorized to perform this action or perform this task !! please login .. ") : setErrorMessage(error.response.data)
        }finally{
            setLoading(false)
        }
    }

    console.log("commentOwner" , commentOwner)
    
  return (
    <div>
    {!deleted && 
    <div className="sm:w-[80vw] w-[90vw] bg-transparent justify-between flex items-center relative ">
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-10 bg-black z-20">
            <div className="animate-spin rounded-full h-[25px] w-[25px] border-t-[5px] border-[#24393b]"></div>
          </div>
        )}
        <div className='flex gap-2'>
            <div className="flex justify-center items-center px-2">
                {userImage?.length > 0 ? (
                  <div className="w-[40px] h-[40px]">
                    <img
                      src={userImage}
                      className="w-full h-full object-cover rounded-full"
                      alt="User"
                    />
                  </div>
                ) : (
                  <div className="w-[40px] h-[40px]">
                    <img
                      src={defaultProfilePicture}
                      className="w-full h-full object-cover rounded-full"
                      alt="Default"
                    />
                  </div>
                )}
            </div>

        <div >
            <div className="mx-2">
                <h1 className="font-medium text-[#1f1f1f]">{username}</h1>
            </div>
            <div className="leading-none text-[16px] mx-2  sm:text-lg sm:mx-2 break-words whitespace-pre-wrap sm:p-2">
                {content}
            </div>
            <div className="flex gap-2">
                <button onClick={likeToggleHandler} className='mb-2 ml-2  w-[20px] h-[20px]'>
                  {liked ? <img src={likedPng} /> : <img src={unLikedPng}/>}
                </button>
                <h1>{likesCount}</h1>
            </div>
        </div>
        </div>
        <div className='flex items-center mr-2 w-[24px] '>
          {commentOwner && 
          <button className=" z-10" onClick={deleteCommentHandler}>
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="M3 6l3 18h12l3-18H3zM21 4h-5V2c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H3v2h18V4zm-9-2h4v2h-4V2z" stroke="black" fill="none"/> </svg>
          </button>}
        </div>
        {errorMessage && <div className="text-red-600 w-full flex justify-center text-centre my-7" >{errorMessage}</div>} 
    </div>}
    </div>
    
  )
}

Comment.propTypes = {
    userImage : PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    commentId: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired
}
export default Comment
