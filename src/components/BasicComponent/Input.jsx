import { forwardRef } from "react"


function Input({label , placeholder , type="text" ,className="", id = "",  ...props }, ref) {
  return (
    <div className="w-full mt-2">
        {label && <label className="text-black w-full mb-1" htmlFor={id}>{label}</label> }
        <input type={type} placeholder={placeholder} ref={ref} id={id} className={`p-2 bg-[#DDDBDB] rounded-md placeholder:text-[#8F8787] focus:outline-[#207F87] w-full {className}`} {...props}/>
    </div>
  )
}

export default forwardRef(Input)
