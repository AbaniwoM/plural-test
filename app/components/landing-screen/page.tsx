"use client"
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { IoMdNotifications } from "react-icons/io";
import { IoPersonCircleSharp, IoMenu, IoClose } from "react-icons/io5"; // Added Menu and Close icons
import LandingComponent from './LandingComponents';

const LandingScreen = () => {
  const [date, setDate] = useState<Date | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false) // State for hamburger menu

  useEffect(() => {
    setDate(new Date())
    const timer = setInterval(() => {
      setDate(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!date) {
    return <div className="animate-pulse h-6 w-32 bg-gray-200 rounded"></div>
  }

  return (
    <div>
        <div className="flex fixed top-0 w-full z-40 justify-between bg-[#F5F7FB] shadow-md shadow-gray-350/50 items-center p-3 px-4">
            {/* Logo */}
            <Image src="/logo.png" width={140} height={20} alt="logo" className="w-28 md:w-[140px]" />
            
            {/* Date & Time (Hidden on very small screens to save space, visible on sm+) */}
            <div className="hidden sm:flex gap-4">
                <p className="text-blue-900 font-bold text-[0.9rem] md:text-[1.1rem]">
                    {date.toLocaleDateString(undefined, { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                    })}
                </p>
                <p className="text-[0.9rem] md:text-[1.1rem] font-mono text-gray-500">
                    {date.toLocaleTimeString()}
                </p>
            </div>

            {/* DESKTOP VIEW: Original User Info (Hidden on mobile) */}
            <div className="hidden md:flex items-center gap-4 mr-5">
                <p className="text-blue-900 font-bold text-[1.1rem]">Hi Mr Daniel</p>
                <IoMdNotifications className="text-blue-900 text-[1.3rem] cursor-pointer"/>
                <IoPersonCircleSharp className="text-gray-400 text-[1.7rem] cursor-pointer"/>
            </div>

            {/* MOBILE VIEW: Hamburger Icon (Visible only on small screens) */}
            <div className="md:hidden flex items-center">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-blue-900 text-3xl focus:outline-none">
                    {isMenuOpen ? <IoClose /> : <IoMenu />}
                </button>
            </div>
        </div> 

        {/* MOBILE MENU DROPDOWN */}
        {isMenuOpen && (
            <div className="fixed top-[60px] left-0 w-full bg-[#F5F7FB] shadow-lg z-30 md:hidden border-t border-gray-200">
                <div className="flex flex-col p-6 gap-4">
                    {/* Mobile Date/Time (Optional: Show here if hidden in header) */}
                    <div className="sm:hidden flex flex-col gap-1 text-center border-b border-gray-200 pb-4">
                        <p className="text-blue-900 font-bold text-sm">
                            {date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-sm font-mono text-gray-500">
                            {date.toLocaleTimeString()}
                        </p>
                    </div>

                    {/* User Info in Mobile Menu */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between hover:bg-gray-100 p-2 rounded cursor-pointer">
                            <span className="landingText text-blue-900 font-bold text-[1.1rem]">Hi Mr Daniel</span>
                            <IoPersonCircleSharp className="landingText text-gray-400 text-[2rem]" />
                        </div>
                        <div className="flex items-center justify-between hover:bg-gray-100 p-2 rounded cursor-pointer">
                            <span className="landingText text-gray-600 font-medium">Notifications</span>
                            <IoMdNotifications className="landingText text-blue-900 text-[1.5rem]" />
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div className="mt-10 md:mt-17">
            <LandingComponent />  
        </div>
    </div>
  )
}

export default LandingScreen