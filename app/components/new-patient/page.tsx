'use client';

import React, { useState } from 'react';
import { X, ChevronDown, Calendar, Info, Fingerprint } from 'lucide-react';

// Define the interface for the data we pass back to the parent
export interface NewPatientData {
  firstName: string;
  middleName: string;
  lastName: string;
  patientId: string;
  gender: 'Male' | 'Female';
  age: string;
  isNew: boolean;
  title: string;
  phone: string;
  dob: string;
}

interface NewPatientProps {
  onClose?: () => void;
  onSave?: (data: NewPatientData) => void;
}

const NewPatient = ({ onClose, onSave }: NewPatientProps) => {
  // Local state for the form
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    title: '',
    dob: '',
    gender: '',
    phone: '',
    isNew: false,
    patientId: 'HOSP98765433' // Pre-filled from screenshot
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setFormData(prev => ({ ...prev, isNew: !prev.isNew }));
  };

  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName) {
      alert("Please fill in required fields");
      return;
    }

    const data: NewPatientData = {
      ...formData,
      gender: (formData.gender as 'Male' | 'Female') || 'Female',
      age: '0days' 
    };

    if (onSave) onSave(data);
  };

  return (
    <div className="patientModal bg-[#F5F7FB] w-full md:w-[900px] max-h-[90vh] overflow-y-auto rounded-xl p-6 md:p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex flex-col gap-1">
          <h3 className="text-[#0A0B3B] font-bold text-xl">Add new patient</h3>
          <p className="text-gray-500 text-sm">Fill in the patient information in the fields provided below</p>
        </div>
        <button 
          onClick={onClose}
          className="w-8 h-8 flex justify-center items-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Profile & ID Section */}
      <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
        {/* Avatar Placeholder */}
        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-400/50 flex items-end justify-center relative">
             <div className="w-16 h-16 bg-white/80 rounded-full -mb-2.5"></div>
             <div className="absolute w-8 h-8 bg-white/80 rounded-full top-6"></div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex-1 space-y-2">
            <div className="flex gap-3">
                <button className="patientBtn flex items-center gap-2 bg-[#0A0B3B] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#15164d]">
                    Take patient's picture <ChevronDown size={14} />
                </button>
                <button className="patientBtn flex items-center gap-2 bg-[#0A0B3B] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#15164d]">
                    Add fingerprint <Fingerprint size={16} />
                </button>
            </div>
            <p className="text-gray-400 text-xs">Patient picture should be updated by reception personnel</p>
        </div>

        {/* Patient ID Box */}
        <div className="w-full md:w-auto">
            <div className="bg-blue-100/50 p-2 rounded-md mb-2 flex items-start gap-2 max-w-xs">
                <Info className="text-orange-500 mt-0.5 shrink-0" size={14} />
                <p className="text-[10px] text-[#0A0B3B] leading-tight">If there is an existing Patient ID, input the patient's existing ID into the field</p>
            </div>
            <div className="flex items-center gap-2">
                <label className="text-sm font-bold text-gray-500 whitespace-nowrap">Patient ID</label>
                <div className="relative w-full">
                    <input 
                        readOnly
                        value={formData.patientId}
                        className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-[#0A0B3B] font-bold text-sm focus:outline-none"
                    />
                     <Info className="text-gray-400 absolute right-3 top-2.5" size={14} />
                </div>
            </div>
        </div>
      </div>

       {/* Form Grid - FIXED: Added 'value' prop to all inputs */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
            <div className="relative">
                 <input 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    placeholder="First name" 
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 outline-none text-sm bg-white" 
                 />
                 <span className="absolute top-2 right-2 text-red-500">*</span>
            </div>
            <div className="relative">
                 <input 
                    name="middleName" 
                    value={formData.middleName} 
                    onChange={handleChange} 
                    placeholder="Middle name" 
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 outline-none text-sm bg-white" 
                 />
            </div>
            <div className="relative">
                 <input 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    placeholder="Last name" 
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 outline-none text-sm bg-white" 
                 />
                 <span className="absolute top-2 right-2 text-red-500">*</span>
            </div>
            <div className="relative">
                 <select 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 outline-none text-sm bg-white text-gray-500 appearance-none"
                 >
                    <option value="">Title</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Miss">Miss</option>
                 </select>
                 <ChevronDown className="absolute right-3 top-4 text-gray-400" size={16} />
            </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="relative">
                 <input 
                    name="dob" 
                    type="text" 
                    value={formData.dob}
                    onFocus={(e) => e.target.type = 'date'} 
                    onBlur={(e) => { if(!formData.dob) e.target.type = 'text' }}
                    onChange={handleChange} 
                    placeholder="Date of birth" 
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 outline-none text-sm bg-white placeholder:text-gray-400" 
                 />
                 <Calendar className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={16} />
                 <span className="absolute top-2 right-8 text-red-500">*</span>
            </div>
            <div className="relative">
                 <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange} 
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 outline-none text-sm bg-white text-gray-500 appearance-none"
                 >
                    <option value="">Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                 </select>
                 <ChevronDown className="absolute right-3 top-4 text-gray-400" size={16} />
                 <span className="absolute top-2 right-8 text-red-500">*</span>
            </div>
            <div className="relative">
                 <input 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="Phone number" 
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 outline-none text-sm bg-white" 
                 />
                 <span className="absolute top-2 right-2 text-red-500">*</span>
            </div>
            <div className="flex flex-col justify-center pl-2">
                <label className="text-sm text-[#0A0B3B] font-medium mb-1">Is patient new to the hospital?</label>
                <div 
                    onClick={handleToggle}
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${formData.isNew ? 'bg-[#0A0B3B]' : 'bg-gray-200'}`}
                >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${formData.isNew ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
            </div>
       </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-4 mt-36">
        <button 
            onClick={handleSubmit}
            className="patientBtns px-8 py-3 rounded-xl border border-[#0A0B3B] text-[#0A0B3B] font-medium hover:bg-blue-50 transition"
        >
            Save & close
        </button>
        <button 
            className="patientBtns px-8 py-3 rounded-xl bg-[#0A0B3B] text-white font-medium hover:bg-[#15164d] transition shadow-lg shadow-blue-900/20"
        >
            Create appointment
        </button>
      </div>
    </div>
  )
}

export default NewPatient