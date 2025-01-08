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
      const response = await axios.get(`/api/v1/blog/allBlogs?page=${page}&limit=${limit}`)
      console.log("blogs response : ", response)
      setBlogs((prev)=>[...prev , ...response.data.data.docs])
      setHasMore(page < response.data.data.totalPages)
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred while fetching blogs")
      console.log(error)
    }finally{
      setLoading(false)
    }
  },[page,limit])

  const handleScroll = useCallback((e) => {
    console.log("handle scroll triggered")
    const nearBottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 50; // Start fetching when 50px from the bottom
    if (nearBottom && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1); // Increment page to load more blogs
    }
  }, [hasMore, loading]);

  useEffect(() => {
    console.log("getBlogs()")
    getBlogs();
  }, [getBlogs]);

  return (
    <div onScroll={handleScroll}  className="bg-[#DDDBDB] pt-8 w-[100vw] h-[90vh] overflow-y-auto ">
      <div className="px-[40px] grid grid-cols-4 gap-7 ">
        {blogs.map((blog)=>(
          <div key={blog._id} className="flex justify-center">
            <BlogCard coverImage={blog.coverImage} title={blog.title} content={blog.content} authorImage={blog.author?.profilePic} authorName={blog.author?.username} blogId={blog._id} authorId={blog.author?._id}/>
          </div>
        ))}
      </div>
      {loading && <div>Loading...</div>} 
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>} 
      {!hasMore && <div>No more blogs to load</div>}
    </div>
  )
}

export default Home
