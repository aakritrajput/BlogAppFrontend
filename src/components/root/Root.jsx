//import React from 'react'
import { Outlet } from "react-router-dom"
import Header from "../header/Header.jsx"
function Root() {
  return (
    <div className=" min-h-[100vh]">
      <Header/>
      <Outlet/>
    </div>
  )
}

export default Root
