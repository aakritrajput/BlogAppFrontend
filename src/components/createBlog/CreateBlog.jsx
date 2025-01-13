import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form'
function CreateBlog() {
    const {register, handleSubmit, reset, formState: {errors}} = useForm();
    const [loading , setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const submitHandler = async(data) => {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      try {
        const formData = new FormData();
        formData.append("title", data.title);
        if(data.coverImage[0]){
          formData.append("coverImage", data.coverImage[0])
        }
        formData.append("tags", data.tags);
        formData.append("content", data.content);

        const response = await axios.post("/api/v1/blog/createBlog", formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", 
            },
            withCredentials: true, 
          })
        console.log("blog created successfully : ", response)
        setSuccessMessage(response.data.message)
        
      } catch (error) {
         error.status === 401 ? setErrorMessage("You are not authorized to perform this action or perform this task !! please login .. ") : setErrorMessage(error.response.data)
      }finally{
        setLoading(false)
        reset()
      }
    }
  return (
    <div className='max-w-[100vw] min-h-[100vh] relative bg-[#DDDBDB] pb-[70px] p-4 px-[5vw]'>
      {loading && 
        <div className="w-[90vw] h-[70vh] absolute flex justify-center items-center">
            <div className="animate-spin rounded-full h-[10vw] w-[10vw] border-t-[10px] border-[#207F87]"></div>
        </div>}
      <form onSubmit={handleSubmit(submitHandler)}  encType="multipart/form-data">
        <div className='flex gap-1 sm:gap-2 items-center mt-[10px] sm:mt-[20px] w-full'>
            <label htmlFor="title" className='text-black sm:text-xl text-[15px] font-semibold'>Title :</label>
            <input type="text" id="title" className='bg-[#9d9a9a]  flex-1 py-3 focus:outline-[#207F87] p-2 rounded-lg focus:bg-[#bdbbbb]' {...register("title", {required: "title is required !!"})} />
        </div>
        {errors.title && <p className='text-red-600'>{errors.title.message}</p>}
        <div className='flex gap-1 sm:gap-2 mt-[20px]  items-center w-full'>
            <label htmlFor="coverImage" className='text-black sm:text-xl text-[15px] font-semibold'>Cover Image:</label>
            <input type="file" id="coverImage" className='bg-[#9d9a9a] flex-1 py-3 focus:outline-[#207F87] text-[10px] sm:p-2 p-1 rounded-lg focus:bg-[#bdbbbb]' {...register("coverImage", {required: "Cover-photo is required !!"})} />
        </div>
        {errors.coverImage && <p className='text-red-600'>{errors.coverImage.message}</p>}
        <div className='flex gap-1 sm:gap-2 items-center mt-[20px] w-full'>
            <label htmlFor="tags" className='text-black sm:text-xl text-[15px] font-semibold'>Tags :</label>
            <input type="text" id="tags" className='bg-[#9d9a9a] flex-1 py-3 focus:outline-[#207F87] p-2 rounded-lg focus:bg-[#bdbbbb]' {...register("tags")} />
        </div>
        <div className='flex flex-col gap-2 justify-center mt-[20px] w-full'>
            <label htmlFor="content" className='text-black sm:text-xl text-[15px] font-semibold'>Content :</label>
            <textarea type="text" id="content" className='bg-[#9d9a9a] h-[300px] py-3 focus:outline-[#207F87] p-2 rounded-lg focus:bg-[#bdbbbb]' {...register("content", {required: "content is required !!"})} ></textarea>
        </div>
        {errors.content && <p className='text-red-600 '>{errors.content.message}</p>}
        {errorMessage && <p className="text-red-600 mt-2 w-full font-bold flex justify-center">{errorMessage}</p>}
        {successMessage && <p className="text-green-600 mt-2 w-full font-bold flex justify-center ">{successMessage}</p>}
        <div className='flex justify-center w-full mt-4'>
          <button type="submit" disabled={loading}  className='bg-[#207F87] px-3 py-2 rounded-md hover:bg-[#5fb5bc] text-white'>POST</button>
        </div>
        
      </form>
    </div>
  )
}

export default CreateBlog
