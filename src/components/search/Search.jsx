//import React from 'react'
import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import axios from "axios";
import BlogCard from "../blogCard/BlogCard.jsx";
import BloggerCard from "../bloggerCard/BloggerCard.jsx";

function Search() {
    const {register : registerForm1 , handleSubmit : handleSubmitForm1 , reset: resetForm1, formState: {errors : errorsForm1}} = useForm();
    const {register : registerForm2 , handleSubmit : handleSubmitForm2 ,  reset: resetForm2, formState: {errors : errorsForm2}} = useForm();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [hasMore, setHasMore] = useState(true);
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [blogSearch, setBlogSearch] = useState(true);
    const limit = 15;

    const blogSearchHandler = useCallback(async(data) => {
        if (loading || !hasMore || !blogSearch) return ;
        console.log("blogSearchHandler")
        setLoading(true);
        try {
            const response = await axios.get(`/api/v1/blog/searchBlogs/?query=${data.query1}&page=${page}&limit=${limit}`, {withCredentials: true})
            setItems((prev)=>[...prev , ...response.data.data.docs])
            console.log("response from blogsearch",response)
            setHasMore(page < response.data.data.totalPages)
        } catch (error) {
            setErrorMessage(error.response.data)
            console.log(`from search error.response.data : ${error.response.data}`)
        }finally{
            setLoading(false)
        }
    },[page])

    const bloggerSearchHandler = async(data) => {
      if (blogSearch) return ;
      console.log("bloggerSearchHandler")
      setLoading(true);
      try {
        const response = await axios.get(`/api/v1/user/bloggers?query=${data.query2}`, {withCredentials: true})
        setItems(response.data.data)
        console.log("response from blogger search :", response)
      } catch (error) {
        setErrorMessage(error.response.data)
        console.log(`from 2nd search error.response.data : ${error.response.data}`)
      }finally{
        setLoading(false)
        console.log("items: ", items)
        console.log("blogsearch: ", blogSearch)
      }
    }
   
      const handleScroll = useCallback((e) => {
        console.log("handleScrolltriggered!!")
        const nearBottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 50; // Start fetching when 50px from the bottom
        if (nearBottom && hasMore && !loading) {
          setPage((prevPage) => prevPage + 1); // Increment page to load more blogs
          console.log("handlescroll triggered !!")
        }
      },[loading, hasMore])

  return (
    <div className="bg-[#DDDBDB] h-[100vh] max-w-[100vw]   py-4">
      <form onSubmit={handleSubmitForm1(blogSearchHandler)}  className="w-full px-9 pt-3 h-[8vh] flex">
        <input type="text" placeholder="Search Blogs" className="rounded-l-xl bg-[#9d9a9a] placeholder:text-gray-700 px-3 py-3 flex-1 focus:bg-[#bdbbbb] focus:outline-[#207F87]" {...registerForm1("query1", {required: "Search cannot be empty !!"})} />
        <button type="submit" disabled={loading} onClick={()=>{setBlogSearch(true); setItems([]); setErrorMessage("") ; resetForm2(); errorsForm2.query1 = "";}} className="bg-[#207F87] text-white rounded-r-xl  px-3 py-3">Search Blogs</button>
      </form>
      {errorsForm1.query1 && <p className="text-red-600 w-full text-center">{errorsForm1.query1.message}</p>}

      <form onSubmit={handleSubmitForm2(bloggerSearchHandler)} className="w-full px-9 pt-3 h-[8vh] flex ">
        <input type="text" placeholder="Search Bloggers" className="rounded-l-xl bg-[#9d9a9a] placeholder:text-gray-700 px-3 py-3 flex-1 focus:bg-[#bdbbbb] focus:outline-[#207F87]" {...registerForm2("query2", {required: "Search cannot be empty !!"})} />
        <button type="submit" disabled={loading} onClick={()=>{setBlogSearch(false); setItems([]); setErrorMessage(""); resetForm1(); errorsForm1.query1 = "";}} className="bg-[#207F87] text-white rounded-r-xl px-3 py-3">Search Bloggers</button>
      </form>
      {errorsForm2.query1 && <p className="text-red-600 w-full text-center">{errorsForm2.query1.message}</p>}

      <div className="h-[70vh] overflow-y-auto py-5" onScroll={handleScroll} >

      {items && items.length > 0 && blogSearch ? (
        <>
           <div className="px-[40px] grid grid-cols-4 gap-5 gap-y-11 ">
             {items.map((blog) => (
               <div key={blog._id} className="flex justify-center">
                 <BlogCard
                   coverImage={blog.coverImage}
                   title={blog.title}
                   content={blog.content}
                   authorImage={blog.author?.profilePic}
                   authorName={blog.author?.username}
                   blogId={blog._id}
                   authorId={blog.author?._id}
                 />
               </div>
             ))}   
           </div>
           {loading && 
            <div className="w-full h-[30px]  flex justify-center items-center my-7">
                <div className="animate-spin rounded-full h-[30px] w-[30px] border-t-[5px] border-[#207F87]"></div>
            </div>}
            {errorMessage && <div className=" w-full text-centre flex justify-center my-7" >{errorMessage}</div>}
            {!hasMore && <div className="w-full text-center my-7">No more blogs to load</div>}
          </>
         ) : (
          <>
           <div className="w-full  items-center flex flex-col gap-y-4 ">
             {items &&
               items.length > 0 &&
               items.map((blogger) => (
                 <div key={blogger._id} className="flex justify-center">
                   <BloggerCard
                     username={blogger.username}
                     fullname={blogger.fullname}
                     bio={blogger.bio}
                     userId={blogger._id}
                     profilePic={blogger.profilePic}
                   />
                 </div>
               ))}
           </div>
           {loading && 
            <div className="w-full h-[30px]  flex justify-center items-center my-7">
                <div className="animate-spin rounded-full h-[30px] w-[30px] border-t-[5px] border-[#207F87]"></div>
            </div>}
            {errorMessage && <div className="w-full text-centre my-7 flex justify-center" >{errorMessage}</div>}
            {!hasMore && <div className="w-full text-center my-7">No more bloggers to load</div>}
          </>
         )}
      </div>
      
      
    </div>
  )
}

export default Search
