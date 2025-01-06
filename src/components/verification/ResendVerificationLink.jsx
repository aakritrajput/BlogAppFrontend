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
            const response = await axios.get(`http://localhost:5000/api/v1/user/resendVerificationLink/${encodeURIComponent(data.email)}`)
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
            <div className="animate-spin rounded-full h-[10vw] w-[10vw] border-t-[10px] border-[#207F87]"></div>
        </div>}
      <h1 className="w-full text-center text-[#207F87] text-[60px]  font-bold mb-[30px]">BloggApp</h1>
      <div className="bg-white shadow-lg shadow-black rounded-2xl flex flex-col  justify-center items-center relative py-8 md:h-[60%] md:w-[60%]">
        <h1 className="text-[#207F87] text-[35px] font-semibold w-full h-[30%] text-center absolute top-6">Resend email verification link</h1>
        <form onSubmit={handleSubmit(submitHandler)}>
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
