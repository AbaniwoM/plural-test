"use client"
import Image from 'next/image'
import { useState, useEffect } from 'react'
// Importing specific icons to match your image
import { IoMdNotifications } from "react-icons/io";
import { 
  IoPersonCircleSharp, 
  IoMenu, 
  IoClose,
  IoPersonOutline,
  IoPeopleOutline,
  IoChatbubbleEllipsesOutline,
  IoCloudUploadOutline,
  IoStarOutline,
  IoCloseCircleOutline,
  IoCalendarOutline,
  IoThumbsUpOutline,
  IoPowerOutline
} from "react-icons/io5"; 
import LandingComponent from './LandingComponents';

const LandingScreen = () => {
  const [date, setDate] = useState<Date | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false) 

  useEffect(() => {
    setDate(new Date())
    const timer = setInterval(() => {
      setDate(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // --- Menu Data Configuration ---
  const mainNavItems = [
    { label: "Profile", icon: <IoPersonOutline size={20} /> },
    { label: "Switch role", icon: <IoPeopleOutline size={20} /> },
    { label: "Messages", icon: <IoChatbubbleEllipsesOutline size={20} /> },
    { label: "Upload paper records", icon: <IoCloudUploadOutline size={20} /> },
    { label: "Review paper records", icon: <IoStarOutline size={20} /> },
    { label: "View rejected paper records", icon: <IoCloseCircleOutline size={20} /> },
    { label: "Calendar", icon: <IoCalendarOutline size={20} /> },
    { label: "Give feedback", icon: <IoThumbsUpOutline size={20} /> },
  ];

  const actionItems = [
    "Create appointment",
    "Create invoice",
    "View patient profile",
    "View next of kin",
    "Add demographic info",
    "Update insurance details",
    "Scan paper records"
  ];

  if (!date) {
    return <div className="animate-pulse h-6 w-32 bg-gray-200 rounded"></div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
        {/* HEADER */}
        <div className="flex fixed top-0 w-full z-50 justify-between bg-white shadow-sm items-center p-3 px-4 h-[70px]">
            {/* Logo */}
            <Image src="/logo.png" width={140} height={20} alt="logo" className="w-28 md:w-[140px]" />
            
            {/* Desktop Date */}
            <div className="hidden sm:flex gap-4">
                <p className="text-blue-900 font-bold text-[0.9rem] md:text-[1.1rem]">
                    {date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-[0.9rem] md:text-[1.1rem] font-mono text-gray-500">
                    {date.toLocaleTimeString()}
                </p>
            </div>

            {/* DESKTOP User Info */}
            <div className="hidden md:flex items-center gap-4 mr-5">
                <div className="text-right">
                    <p className="text-blue-900 font-bold text-[0.9rem]">Gbenga Arakanmi</p>
                    <p className="text-gray-500 text-[0.75rem]">Front Desk Analyst</p>
                </div>
                <IoMdNotifications className="text-blue-900 text-[1.3rem] cursor-pointer"/>
                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                    <IoPersonCircleSharp size={30} />
                </div>
            </div>

            {/* MOBILE Hamburger Button */}
            <div className="md:hidden flex items-center">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)} 
                  className="text-blue-900 text-3xl focus:outline-none transition-transform duration-200"
                >
                    {isMenuOpen ? <IoClose /> : <IoMenu />}
                </button>
            </div>
        </div> 

        {/* ------------------------------------------------------ */}
        {/* MOBILE MENU INTEGRATION (Based on your Image)          */}
        {/* ------------------------------------------------------ */}
        
        {/* Overlay Background */}
        {isMenuOpen && (
            <div 
                className="fixed inset-0 bg-black/50 z-40 md:hidden" 
                onClick={() => setIsMenuOpen(false)}
            />
        )}

        {/* Menu Content Drawer */}
        <div className={`
            fixed top-[70px] left-0 w-full sm:w-[350px] h-[calc(100vh-70px)] 
            bg-white shadow-xl z-50 md:hidden overflow-y-auto transition-transform duration-300 ease-in-out
            ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            <div className="p-6 flex flex-col gap-6">
                
                {/* 1. USER PROFILE SECTION (From Left Image) */}
                <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
                    <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center text-white">
                        <IoPersonCircleSharp size={32} />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className="text-[#1a1a1a] font-bold text-base">Gbenga Arakanmi</h3>
                            <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-medium">
                                Primary
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm">Front Desk Analyst</p>
                    </div>
                </div>

                {/* 2. MAIN NAVIGATION (From Left Image) */}
                <div className="flex flex-col gap-1">
                    {mainNavItems.map((item, index) => (
                        <div 
                            key={index} 
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer text-[#333] transition-colors"
                        >
                            <span className="text-[#1a2b4b]">{item.icon}</span>
                            <span className="text-[15px] font-medium">{item.label}</span>
                        </div>
                    ))}
                    
                    {/* Sign Out */}
                    <div className="flex items-center gap-4 p-3 mt-2 cursor-pointer text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <IoPowerOutline size={20} />
                        <span className="text-[15px] font-medium">Sign out</span>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200 my-2"></div>

                {/* 3. QUICK ACTIONS (From Middle "Burger Menu" Image) */}
                <div>
                    <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 px-3">
                        Quick Actions
                    </h4>
                    <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
                        {actionItems.map((action, idx) => (
                            <div 
                                key={idx}
                                className={`
                                    p-3 text-[14px] font-medium text-[#1a2b4b] cursor-pointer hover:bg-blue-50 transition-colors
                                    ${idx === 1 ? 'bg-blue-50/50' : ''} 
                                    ${idx !== actionItems.length - 1 ? 'border-b border-gray-50' : ''}
                                `}
                            >
                                {action}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="mt-[70px] p-4">
            <LandingComponent />  
        </div>
    </div>
  )
}

export default LandingScreen