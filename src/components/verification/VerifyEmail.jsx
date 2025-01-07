import axios from "axios";
import { useEffect, useState , useCallback} from "react";
import { useLocation } from "react-router-dom"
import { Link } from "react-router-dom";


function VerifyEmail() {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email");
    const token = queryParams.get("token");
    const verifyEmail = useCallback(async() => {
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        const verificationLink = `/api/v1/user/register/verify-token?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
        try {
            const response = await axios.get(verificationLink)
            setSuccessMessage(response.data.message)
        } catch (error) {
            setErrorMessage(error.response.data)
        }finally{
            setLoading(false)
        }
    }, [email, token])

    useEffect(()=>{
        if(email && token){
            verifyEmail();
        }else{
            setErrorMessage("Invalid verification link !!")
        }
    }, [email, token, verifyEmail])
  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center bg-[#DDDBDB]">
        {loading && 
        <div className="w-[100vw] h-[100vh] absolute flex justify-center items-center z-20 bg-[#000000c8]">
            <div className="animate-spin rounded-full h-[10vw] w-[10vw] border-t-[10px] border-[#207F87]"></div>
        </div>}
      <h1 className="w-full text-center text-[#207F87] text-[60px]  font-bold mb-[30px]">BloggApp</h1>
      <div className="bg-white shadow-lg shadow-black rounded-2xl flex flex-col  justify-center items-center  py-8 md:h-[60%] md:w-[60%]">
       {successMessage && 
       <div className="flex flex-col justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#207F87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 9V5a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h5a4 4 0 0 0 4-4v-4"></path>
          <path d="M14 9l2-2"></path>
          <path d="M14 9l-2-2"></path>
        </svg>

        <h1 className="text-2xl text-[black]">Your email is successfully verified !!</h1>
        <Link to="/login" className="px-3 py-2 rounded-md bg-[#207F87] text-white">Login</Link>
       </div>}
       {errorMessage && <div className="flex flex-col justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#207F87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 15v4a4 4 0 0 0 4 4h5a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4h-5a4 4 0 0 0-4 4v4"></path>
          <path d="M10 15l2 2"></path>
          <path d="M10 15l-2 2"></path>
        </svg>
        
        <h1 className="text-[black] font-semibold text-[40px]">{errorMessage}</h1>
        </div>}
      </div>
    </div>
  )
}

export default VerifyEmail
