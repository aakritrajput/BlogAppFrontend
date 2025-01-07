import React from 'react'
import { useForm } from 'react-hook-form'
function CreateBlog() {
    const {register, handleSubmit, formState: {errors}} = useForm();
  return (
    <div className='w-[100vw] min-h-[100vh] bg-[#DDDBDB] p-4'>
      <form onSubmit={handleSubmit(submitHandler)} encType="multipart/form-data">
        <div className='flex gap-2 mt-2 w-full'>
            <label htmlFor="title" className='text-black'>Title :</label>
            <input type="text" id="title" className='bg-[#747171] flex-1 focus:outline-[#207F87] p-2 rounded-lg focus:bg-[#8c8989]' {...register("title", {required: "title is required !!"})} />
        </div>
        {errors.title && <p className='text-red-600'>{errors.title.message}</p>}
        <div className='flex gap-2 mt-2 w-full'>
            <label htmlFor="coverImage" className='text-black'>Cover Image :</label>
            <input type="file" id="coverImage" className='bg-[#747171] flex-1 focus:outline-[#207F87] p-2 rounded-lg focus:bg-[#8c8989]' {...register("coverImage", {required: "Cover-photo is required !!"})} />
        </div>
        <div className='flex gap-2 mt-2 w-full'>
            <label htmlFor="title" className='text-black'>Title :</label>
            <input type="text" id="title" className='bg-[#747171] focus:outline-[#207F87] p-2 rounded-lg focus:bg-[#8c8989]' {...register("title", {required: "title is required !!"})} />
        </div>
        <div className='flex gap-2 mt-2 w-full'>
            <label htmlFor="title" className='text-black'>Title :</label>
            <input type="text" id="title" className='bg-[#747171] focus:outline-[#207F87] p-2 rounded-lg focus:bg-[#8c8989]' {...register("title", {required: "title is required !!"})} />
        </div>
      </form>
    </div>
  )
}

export default CreateBlog
