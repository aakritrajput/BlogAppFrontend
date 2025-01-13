//import React from 'react'
import { useForm } from "react-hook-form"
import Input from "../BasicComponent/Input.jsx";
import Button from "../BasicComponent/Button.jsx";
import { useState } from "react";
import axios from "axios";

function ResendVerificationLink() {
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("");;
    const submitHandler = async(data) => {
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        try {
            console.log("data:",data)
            const response = await axios.get(`/api/v1/user/resendVerificationLink/${encodeURIComponent(data.email)}`)
            setSuccessMessage(response.data.message)
        } catch (error) {
            console.log(error)
            setErrorMessage(error.response.data)
        }finally{
            setLoading(false)
        }
    }
  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center bg-[#DDDBDB]">
        {loading && 
        <div className="w-[100vw] h-[100vh] absolute flex justify-center items-center z-20 bg-[#000000c8]">
            <div className="animate-spin rounded-full h-[10vw] w-[10vw] md:border-t-[10px] border-t-[5px] border-[#207F87]"></div>
        </div>}
      <h1 className="w-full text-center text-[#207F87] lg:text-[55px] text-[30px] font-bold mb-4 md:mb-[30px]">BloggApp</h1>
      <div className="bg-white shadow-lg shadow-black rounded-2xl flex flex-col m-3 justify-center items-center relative py-8 md:h-[60%] md:w-[60%]">
        <h1 className="text-[#207F87] lg:text-[35px] md:text-[28px] text-[18px] font-semibold w-full h-[30%] text-center absolute top-6">Resend email verification link</h1>
        <form onSubmit={handleSubmit(submitHandler)} className="m-1 mt-4">
            <Input type="email" label="Enter your registered email" placeholder="email" id="Email" {...register("email", {required: "email is required!!"})}/>
            {errors.email && <p className="text-red-600">{errors.email.message}</p>}
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}
            {successMessage && <p className="text-green-600">{successMessage}</p>}
            <Button type="submit" disabled={loading} className="rounded-md px-4">{loading ? "sending..." : "Send"}</Button>
        </form>
      </div>
    </div>
  )
}

export default ResendVerificationLink
