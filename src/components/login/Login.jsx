import Input from "../BasicComponent/Input.jsx";
import Button from "../BasicComponent/Button.jsx";
import {Link, useNavigate} from "react-router-dom"
import {useState} from 'react'
import axios from "axios";
import { useDispatch } from "react-redux"
import { setUser } from "../store/userSlice.js";
function Login() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({emailOrUsername: "", password:""});
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch()
    const [errorMessage, setErrorMessage] = useState("") 
    const navigate = useNavigate()
    const [verifyLink, setVerifyLink] = useState(false) 

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }
    const validate = () => {
        const errors={};
        if (!formData.emailOrUsername) errors.emailOrUsername = "Email or username is required !!";
        if(!formData.password) errors.password = "Password is required!!";
        return errors;
    }
    const SubmitHandler = async(e) => {
        
        e.preventDefault();
        setErrors({});
        setErrorMessage("");
        setVerifyLink(false);
        const validationErrors = validate();
        if(Object.keys(validationErrors).length){
            setErrors(validationErrors)
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post("https://blogappbackend-uy9g.onrender.com/api/v1/user/login", formData)
            console.log("response:",response)
            dispatch(setUser(response.data._id))
            navigate("/")
        } catch (error) {
            console.log(error)
            setErrorMessage(error.response.data)
            if(error.status === 402){
                setVerifyLink(true)
            }
        }finally{
            setLoading(false)
        }
    }

  return (
    <div className="w-full text-wrap relative min-h-[100vh] bg-[#DDDBDB] flex md:flex-row flex-col md:gap-[40px] gap-4 items-center justify-center ">
        {loading && 
        <div className="w-[100vw] h-[100vh] absolute flex justify-center items-center bg-[#000000c8]">
            <div className="animate-spin rounded-full h-[10vw] w-[10vw] md:border-t-[10px] border-t-[5px] border-[#207F87]"></div>
        </div>}
      <div className="block gap-2 md:p-5 md:w-[30vw]">
        <h1 className="text-[#207F87] lg:text-[75px] md:text-[50px] text-[30px] ml-2 font-bold">BlogApp</h1>
        <p className="text-[#263D3F] lg:text-[20px] text-[15px] md:block hidden leading-tight">Welcome to the 
           <br /><b>BlogApp&apos;s Login Page</b>,           
           <br />where your journey to sharing           
           <br />and discovering amazing           
           <br />stories begins! 🌟
        </p>
      </div>
      <div className="p-4 bg-white rounded-xl shadow-lg  shadow-black">
        <h1 className="w-[100%] text-center text-[#207F87] text-4xl mb-2">Login</h1>
        <p className="text-black mb-3 text-center w-full">Don&apos;t have an account ? <Link to={"/register"} className="text-[#b5a82f] ">register</Link></p>
        <form onSubmit={SubmitHandler} className="w-[100%]">
            <Input 
            label="Enter your email" 
            placeholder="email" 
            id="email" 
            value= {formData.emailOrUsername}
            name="emailOrUsername"
            onChange={handleChange}
            />
            {errors.emailOrUsername && <p className="text-red-600">{errors.emailOrUsername}</p>}

            <Input 
            label="Enter your password" 
            placeholder="Password" 
            id="password" 
            value={formData.password}
            name="password"
            onChange={handleChange}
            />
            {errors.password && <p className="text-red-600">{errors.password}</p>}
            {errorMessage && <p className="text-red-600 mt-2">{errorMessage} {verifyLink && <Link to="/resendVerificationLink" className="text-blue-700"> Resend verification email</Link>}</p>}
            <Button type="submit" disabled={loading} className="rounded-md">{ loading ? "Processing..." : "LOGIN"}</Button>
        </form>
      </div>
    </div>
  )
}

export default Login
