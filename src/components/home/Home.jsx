//import React from 'react'

import axios from "axios";
import { useState, useEffect, useCallback } from "react"
import BlogCard from "../blogCard/BlogCard.jsx";

function Home() {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]) ;
  const [hasMore, setHasMore] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10 ; 

  const getBlogs = useCallback(async() => {
    if (loading || !hasMore) return ;
    setLoading(true);
    try {
      const response = await axios.get(`https://blogappbackend-uy9g.onrender.com/api/v1/blog/allBlogs?page=${page}&limit=${limit}`)
      console.log("blogs response : ", response)
      setBlogs((prev)=>[...prev , ...response.data.data.docs])
      setHasMore(page < response.data.data.totalPages)
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred while fetching blogs")
      console.log(error)
    }finally{
      setLoading(false)
    }
  },[page])

  const handleScroll = useCallback((e) => {
    const nearBottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 50; // Start fetching when 50px from the bottom
    if (nearBottom && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1); // Increment page to load more blogs
      console.log("handlescroll triggered !!")
    }
  },[loading, hasMore])

  useEffect(()=>{
    getBlogs();
  }, [getBlogs])

  


  return (
    <div onScroll={handleScroll}  className="bg-[#DDDBDB] pt-8 w-[100vw] pb-[70px] h-[90vh] overflow-y-auto ">
      <div className="lg:px-[40px] px-4 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 gap-y-11">
        {blogs.map((blog)=>(
          <div key={blog._id} className="flex justify-center ">
            <BlogCard coverImage={blog.coverImage} title={blog.title} content={blog.content} authorImage={blog.author?.profilePic} authorName={blog.author?.username} blogId={blog._id} authorId={blog.author?._id}/>
          </div>
        ))}
      </div>
      {loading && 
        <div className="w-full h-[30px]  flex justify-center items-center my-7">
            <div className="animate-spin rounded-full h-[30px] w-[30px] border-t-[5px] border-[#207F87]"></div>
        </div>}
      {errorMessage && <div className="text-red-600 w-full flex justify-center text-centre my-7" >{errorMessage}</div>} 
      {!hasMore && <div className="w-full flex justify-center text-center my-7">No more blogs to load</div>}
    </div>
  )
}

export default Home
