//import React from 'react'
import { Outlet } from "react-router-dom"
import Header from "../header/Header.jsx"
import HeaderMobile from "../header/HeaderMobile.jsx"
function Root() {
  return (
    <div className="min-h-[100vh] ">
      <Header/>
      <Outlet/>
      <HeaderMobile/>
    </div>
  )
}

export default Root
