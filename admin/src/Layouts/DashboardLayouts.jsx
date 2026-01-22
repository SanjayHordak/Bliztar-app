import React from 'react'
import Navbar from '../Components/Navbar'
import Sidebar from '../Components/Sidebar'
import { Outlet } from 'react-router'

export default function DashboardLayouts() {
  return (
    <div className='drawer lg:drawer-open'>
        <input id='my-drawer' type='checkbox' className='drawer-toggle'/>
        <div className='drawer-content'>
            <Navbar/>
            <main className='p-6'>
           <Outlet/>
           </main>
           <div>
            <Sidebar/>
           </div>
        </div>
    </div>
  )
}
