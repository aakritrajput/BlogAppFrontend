//import React from 'react'

function Button({children, type="button" , className="" , ...props}) {
  return (
    <div className="w-full my-6 flex items-center justify-center">
      <button type={type} className={`bg-[#207F87] p-2  text-white ${className}`} {...props}>{children}</button>
    </div>
  )
}

export default Button
