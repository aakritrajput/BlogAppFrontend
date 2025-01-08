//import React from 'react'
import { useState } from "react"
import { useForm } from "react-hook-form"
import axios from "axios";

function Search() {
    const {register : registerForm1 , handleSubmit : handleSubmitForm1 , formState: {errors : errorsForm1}} = useForm();
    const {register : registerForm2 , handleSubmit : handleSubmitForm2 , formState: {errors : errorsForm2}} = useForm();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [hasMore, setHasMore] = useState(true);
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [limit , setLimit] = useState(15);

    const blogSearchHandler = async(data) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/v1/blog/searchBlogs/?query=${data.query1}&page=${page}&limit=${limit}`, {withCredentials: true})

        } catch (error) {
            setErrorMessage(error.response.data)
            console.log(`from search error.response.data : ${error.response.data}`)
        }finally{
            setLoading(false)
        }
    }

    const bloggerSearchHandler = async() => {

    }

    const scrollHandler = async() => {

    }

  return (
    <div className="bg-[#DDDBDB] h-[100vh] max-w-[100vw]   py-4">
      <form onSubmit={handleSubmitForm1(blogSearchHandler)}  className="w-full px-9 pt-3 h-[8vh] flex">
        <input type="text" placeholder="Search Blogs" className="rounded-l-xl bg-[#9d9a9a] placeholder:text-gray-700 px-3 py-3 flex-1 focus:bg-[#bdbbbb] focus:outline-[#207F87]" {...registerForm1("query1", {required: "Search cannot be empty !!"})} />
        <button type="submit" disabled={loading} className="bg-[#207F87] text-white rounded-r-xl  px-3 py-3">Search Blogs</button>
      </form>
      {errorsForm1.query1 && <p className="text-red-600">{errorsForm1.query1.message}</p>}

      <form onSubmit={handleSubmitForm2(bloggerSearchHandler)} className="w-full px-9 pt-3 h-[8vh] flex ">
        <input type="text" placeholder="Search Bloggers" className="rounded-l-xl bg-[#9d9a9a] placeholder:text-gray-700 px-3 py-3 flex-1 focus:bg-[#bdbbbb] focus:outline-[#207F87]" {...registerForm2("query2", {required: "Search cannot be empty !!"})} />
        <button type="submit" disabled={loading} className="bg-[#207F87] text-white rounded-r-xl px-3 py-3">Search Bloggers</button>
      </form>
      {errorsForm2.query1 && <p className="text-red-600">{errorsForm2.query1.message}</p>}

      <div className="h-[70vh] overflow-y-auto" onScroll={scrollHandler} >

      </div>
      {loading && 
        <div className="w-full h-[30px]  flex justify-center items-center my-7">
            <div className="animate-spin rounded-full h-[30px] w-[30px] border-t-[5px] border-[#207F87]"></div>
        </div>}
      {errorMessage && <div className="text-red-600 w-full text-centre my-7" >{errorMessage}</div>} 
      {!hasMore && <div className="w-full text-center my-7">No more blogs to load</div>}
    </div>
  )
}

export default Search
