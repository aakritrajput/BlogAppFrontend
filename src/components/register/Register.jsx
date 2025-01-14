import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import Input from "../BasicComponent/Input.jsx"
import Button from "../BasicComponent/Button.jsx"
import axios from "axios"
import { useState } from "react"

//import { useRef } from "react";

function Register() {
    const [errorMessage , setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: {errors}} = useForm();
    const SubmitHandler = async(data)=>{
      setErrorMessage("");
      setSuccessMessage("");
        console.log(data)
        setLoading(true)
        try {
            const response = await axios.post("https://blogappbackend-uy9g.onrender.com/api/v1/user/register", data)
            console.log(response.data.message)
            setSuccessMessage(response.data.message)
        } catch (error) {
            console.log("error:", error, "error.message:", error.message)
            setErrorMessage(error.response.data.message)
        } finally{
            setLoading(false)
        }
    }
  return (
    <div className="w-full relative min-h-[100vh] bg-[#DDDBDB] flex md:flex-row flex-col md:gap-[40px] gap-4 items-center justify-center ">
        {loading && 
        <div className="w-[100vw] h-[100vh] absolute flex justify-center items-center bg-[#000000c8]">
            <div className="animate-spin rounded-full h-[10vw] w-[10vw] md:border-t-[10px] border-t-[5px]  border-[#207F87]"></div>
        </div>}
      <div className="block gap-2 md:p-5  md:w-[30vw]">
        <h1 className="text-[#207F87] lg:text-[75px] md:text-[50px] text-[30px] md:ml-2 font-bold">BlogApp</h1>
        <p className="text-[#263D3F] md:block hidden leading-tight text-[15px] lg:text-[20px]">Welcome to <b>BlogApp</b>
          <br />your gateway to creativity, connection, 
          <br />and inspiration! 🌟
          <br />Join our community of passionate 
          <br />bloggers and readers. By creating an 
          <br />account, you&apos;ll unlock the full potential of 
          <br />BlogApp and become a part of a platform 
          <br />that celebrates ideas and stories.
        </p>
      </div>
      <div className="p-4 bg-white rounded-xl shadow-lg shadow-black">
        <h1 className="w-[100%] text-center text-[#207F87] text-4xl mb-2">Register</h1>
        <p className="text-black mb-3 text-center w-full">Already have an account ? <Link to={"/login"} className="text-[#b5a82f] ">Login</Link></p>
        <form onSubmit={handleSubmit(SubmitHandler)} className="w-[100%]">
            <Input 
            label="Enter your full name" 
            placeholder = "Full Name" 
            id="fullname" 
            {...register("fullname", {required: "username is required"})}/>
            {errors.fullname && <p className="text-red-600">{errors.fullname.message}</p>}

            <Input 
            label="Enter a unique username" 
            placeholder="Username" 
            id="username" 
            {...register("username" ,{required: "username is required !!"})}/>
            {errors.username && <p className="text-red-600">{errors.username.message}</p>}

            <Input 
            label="Enter your email" 
            placeholder="email" 
            id="email" 
            type= "email"
            {...register("email" ,{required: "email is required !!"})}/>
            {errors.email && <p className="text-red-600">{errors.email.message}</p>}

            <Input 
            label="Enter your password" 
            placeholder="Password" 
            id="password" 
            {...register("password" ,{required: "password is required !!"})}/>
            {errors.password && <p className="text-red-600">{errors.password.message}</p>}
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}
            {successMessage && <p className="text-green-600">{successMessage}</p>}
            <Button type="submit" disabled={loading} className="rounded-md">{ loading ? "Processing.." : "REGISTER"}</Button>
        </form>
      </div>
      {successMessage.length > 0 && <div className="absolute w-[80vw] h-[50vh] flex flex-col justify-center items-center border-[#207F87] border-[3px] rounded-[20px] bg-[#000000d3] z-30">
        <h1 className="text-[white] text-3xl mb-3">{successMessage}</h1>
        <Link to="/login" className="px-2 py-1 text-white bg-[#207F87] rounded-2xl hover:bg-[#1e646a]">Login</Link>
      </div>}
    </div>
  )
}

export default Register

//<p className="text-[#263D3F]">Welcome to the <br /><b>BlogApp&apos;s Login Page,</b><br />where your journey to sharing <br />and discovering amazing <br />stories begins!</p>