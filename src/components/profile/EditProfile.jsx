//import React from 'react'
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form"

function EditProfile() {
    const {register : registerProfilePic , handleSubmit: handleSubmitProfilePic , formState: {errors: errorsProfilePic} , reset : resetProfilePic} = useForm();
    const {register : registerBannerPic , handleSubmit: handleSubmitBannerPic , formState: {errors: errorsBannerPic} , reset : resetBannerPic} = useForm();
    const {register : registerProfile , handleSubmit: handleSubmitProfile , formState: {errors: errorsProfile} , reset : resetProfile} = useForm();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const profilePicHandler = async(data) => {
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        try {
            const formData = new FormData();
            formData.append("profilePic", data.profilePic[0]);

            const response = await axios.patch("https://blogappbackend-uy9g.onrender.com/api/v1/user/changeProfilePic", formData, {
                headers: {
                  "Content-Type": "multipart/form-data", 
                },
                withCredentials: true, 
              }) 
            setSuccessMessage(response.data.message)
        } catch (error) {
            error.status === 401 ? setErrorMessage("You are not authorized to perform this action or perform this task !! please login .. ") : setErrorMessage(error.response.data)
        }finally{
            setLoading(false);
        }
    }

    const bannerPicHandler = async(data) => {
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        try {
            const formData = new FormData();
            formData.append("bannerPic", data.bannerPic[0]);

            const response = await axios.patch("https://blogappbackend-uy9g.onrender.com/api/v1/user/changeBannerPic", formData, {
                headers: {
                  "Content-Type": "multipart/form-data", 
                },
                withCredentials: true, 
              }) 
            setSuccessMessage(response.data.message)
        } catch (error) {
            setErrorMessage(error.response.data)
        }finally{
            setLoading(false);
        }
    }

    const profileHandler = async(data) => {
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        try {

            const response = await axios.patch("https://blogappbackend-uy9g.onrender.com/api/v1/user/updateProfile", data, { withCredentials: true }) 
            setSuccessMessage(response.data.message)
        } catch (error) {
            setErrorMessage(error.response.data)
        }finally{
            setLoading(false);
        }
    }

  return (
    <div>
     <h1 className="text-[#207F87] text-3xl w-full flex justify-center font-semibold py-3">BlogApp</h1>
     <div className="h-[100vh]  flex relative justify-center bg-[#DDDBDB] items-center">
        {loading && 
        <div className="w-[90vw] h-[70vh] absolute flex justify-center items-center">
            <div className="animate-spin rounded-full h-[10vw] w-[10vw] border-t-[10px] border-[#207F87]"></div>
        </div>}
      <div className="flex flex-col sm:mx-3 sm:px-5 items-center bg-[#DDDBDB] p-4 rounded-xl shadow-md">
        <form onSubmit={handleSubmitProfilePic(profilePicHandler)} encType="multipart/form-data" className="flex flex-col w-full mt-2">
        
            <label htmlFor="profilePic" className='text-black sm:text-xl text-[15px] font-semibold'>ProfilePic:</label>
            <div className="flex">
                <input type="file" id="profilePic" className='bg-[#9d9a9a] flex-1 py-3 focus:outline-[#207F87] text-[10px] sm:p-2 p-1 rounded-l-lg focus:bg-[#bdbbbb]' {...registerProfilePic("profilePic", {required: "profilePic is required !!"})} />
                <button type="submit" disabled={loading} onClick={()=>{resetBannerPic() ; resetProfile();}} className="rounded-r-lg bg-[#207F87] px-3 hover:bg-[#192f31] text-white">Upload</button>
            </div>
        </form>
        {errorsProfilePic.profilePic && <p className='text-red-600'>{errorsProfilePic.profilePic.message}</p>}

        <form onSubmit={handleSubmitBannerPic(bannerPicHandler)} encType="multipart/form-data" className="flex flex-col w-full mt-2">
            <label htmlFor="bannerPic" className='text-black sm:text-xl text-[15px] font-semibold'>BannerPic:</label>
            <div className="flex">
                <input type="file" id="bannerPic" className='bg-[#9d9a9a] flex-1 py-3 focus:outline-[#207F87] text-[10px] sm:p-2 p-1 rounded-l-lg focus:bg-[#bdbbbb]' {...registerBannerPic("bannerPic", {required: "bannerPic is required !!"})} />
                <button type="submit" disabled={loading} onClick={()=>{resetProfilePic() ; resetProfile();}} className="rounded-r-lg bg-[#207F87] px-3 hover:bg-[#192f31] text-white">Upload</button>
            </div>
        </form>
        {errorsBannerPic.profilePic && <p className='text-red-600'>{errorsBannerPic.profilePic.message}</p>}

        <form onSubmit={handleSubmitProfile(profileHandler)} className="flex flex-col w-full mt-2">
            <div className='flex gap-2 items-center mt-[20px] w-full'>
                <label htmlFor="fullname" className='text-black sm:text-xl text-[15px] font-semibold'>Fullname:</label>
                <input type="text" id="fullname" className='bg-[#9d9a9a] flex-1 py-3 focus:outline-[#207F87] p-2 rounded-lg focus:bg-[#bdbbbb]' {...registerProfile("fullname")} />
            </div>
            {errorsProfile.fullname && <p className='text-red-600'>{errorsProfile.fullname.message}</p>}
            <div className='flex gap-2 items-center mt-[20px] w-full'>
                <label htmlFor="bio" className='text-black sm:text-xl text-[15px] font-semibold'>Bio:</label>
                <input type="text" id="bio" className='bg-[#9d9a9a] flex-1 py-3 focus:outline-[#207F87] p-2 px-3 rounded-lg focus:bg-[#bdbbbb]' {...registerProfile("bio")} />
            </div>
            {errorsProfile.bio && <p className='text-red-600'>{errorsProfile.bio.message}</p>}
            <div className='flex justify-center w-full mt-4'>
                <button type="submit" disabled={loading} onClick={()=>{resetProfilePic() ; resetBannerPic();}} className='bg-[#207F87] px-3 py-2 rounded-md hover:bg-[#5fb5bc] text-white'>POST</button>
            </div>
        </form>

        {errorMessage && <p className="w-full flex my-4 justify-center">{errorMessage}</p>}
        {successMessage && <p className="text-green-600 mt-2 w-full font-bold flex justify-center ">{successMessage}</p>}
      </div>
    </div>
    </div>
  )
}

export default EditProfile
