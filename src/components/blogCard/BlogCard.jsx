//import React from 'react'
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
//import axios from "axios";
import { useSelector } from "react-redux";
import defaultProfilePicture from "../../../public/defaultProfilePicture.jpeg"


function BlogCard({coverImage , title, content , authorImage="", authorName, blogId, authorId}) {
  const [loggedIn, setLoggedIn] = useState(false)
  const maxLength = 50 ;
  const previewContent = content.length > maxLength ? content.slice(0, maxLength) + "..." : content ;
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  //console.log(`user in redux store is`, user)


  useEffect(()=>{
    if(user){
      setLoggedIn(true);
    }else{
      setLoggedIn(false);
    }
  },[user])

  const readMoreHandler = () => {
    if(loggedIn){
      navigate(`/blog/${blogId}`)
    }else{
      alert("Please login to read and create Blogs ")
    }
  }

  const authorProfileHandler = () => {
    if(loggedIn){
      navigate(`userProfile/${authorId}`)
    }else{
      alert("Please login to view authors Profile ")
    }
  }


  return (
    <div className=" w-[290px] bg-white rounded-2xl min-h-[230px] shadow-lg shadow-black">
      <div className="border-b-2 h-[130px] relative  border-b-black w-full ">
        <img src={coverImage} alt={title} className="absolute rounded-t-2xl top-0 left-0 object-cover w-full h-full"/> 
      </div>
      <div className="p-2 flex gap-2">
        <div >
          <h1 className="text-black font-semibold">{title}</h1>
          <p className="text-[#413E3E] flex flex-wrap leading-none ">{previewContent} <button onClick={readMoreHandler} className="bg-transparent border-none text-[#f19b32]">read more</button></p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <button onClick={authorProfileHandler} className="bg-transparent flex flex-col justify-center items-center border-none">
            {authorImage.length > 0 ? <img src={authorImage} className="w-[40px] h-[40px] rounded-full" alt="" /> : <img src={defaultProfilePicture} className="w-[40px] h-[40px] rounded-full" />}
            <p>{authorName}</p>
          </button>
        </div>
      </div>
    </div>
  )
}

BlogCard.propTypes = {
  content: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  coverImage: PropTypes.string.isRequired,
  authorImage: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  blogId: PropTypes.string.isRequired,
  authorId: PropTypes.string.isRequired
}

export default BlogCard
