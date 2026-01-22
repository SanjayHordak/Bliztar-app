import { UserButton } from '@clerk/clerk-react'
import { useLocation } from 'react-router'
import {  
    ClipboardListIcon, 
    HomeIcon,  
    PanelLeftIcon,  
    ShoppingBagIcon, 
    UserIcon } from 'lucide-react'
import React from 'react'

//eslint-disable-next-line
export const NAVIGATION=[
    {name:"Dashboard", path:"/dashboard", Icon:<HomeIcon className='size-5'/>},
    {name:"Products", path:"/products", Icon:<ShoppingBagIcon className='size-5'/>},
    {name:"Orders", path:"/orders", Icon:<ClipboardListIcon className='size-5'/>},
    {name:"Customers", path:"/customers", Icon:<UserIcon className='size-5'/>}
]

export default function Navbar() {
    const location = useLocation();
  return (
    <div className='navbar w-full bg-base-300'> 
        <label htmlFor="my-drawer" className='btn btn-square btn-ghost' aria-label='open sidebar'>
            <PanelLeftIcon className='size-5'/>
        </label>
        <div className='flex-1 px-4'>
            <h1 className='text-xl font-bold'>
                {NAVIGATION.find((item)=> item.path === location.pathname)?.name || "Dashboard"}
            </h1>
        </div>
        <div className='mr-5'>
            <UserButton/>
        </div>
    </div>
  )
}

