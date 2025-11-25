'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Search, Fingerprint, AlignJustify, ChevronRight, 
  ChevronLeft, Clock, Check, User
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- CONSTANTS ---
const CLINICS = [
  'Accident and Emergency', 'Neurology', 'Cardiology', 
  'Gastroenterology', 'Renal', 'Ear, Nose & Throat'
];

const APPOINTMENT_TYPES = [
  'Walk-in', 'Referral', 'Consult', 
  'Follow-up', 'For Medical Exam'
];

const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Define Patient Interface (Matching Dashboard)
interface Patient {
  id: number;
  name: string;
  patientId: string;
  // Add other fields if needed for display, but these are required for search
}

interface NewAppointmentProps {
  onClose: () => void;
  patients: Patient[]; // <--- Added this prop
}

export default function NewAppointment({ onClose, patients }: NewAppointmentProps) {
  // --- STATE ---
  const [clinic, setClinic] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<string>('');
  
  // Patient Search State
  const [patientSearch, setPatientSearch] = useState('');
  const [showPatientResults, setShowPatientResults] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Selection Modals State
  const [showClinicModal, setShowClinicModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [modalSearch, setModalSearch] = useState('');

  // Date/Time State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeString, setTimeString] = useState('');

  // --- EFFECTS ---
  
  // Initialize Time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // Close search dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowPatientResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- CALENDAR LOGIC ---
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);
    const days = [];
    
    for (let i = firstDay - 1; i >= 0; i--) days.push({ day: daysInPrevMonth - i, currentMonth: false });
    for (let i = 1; i <= daysInMonth; i++) days.push({ day: i, currentMonth: true });
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) days.push({ day: i, currentMonth: false });
    
    return days;
  };

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  
  const handleDateClick = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const isToday = (day: number, isCurrentMonth: boolean) => {
    const today = new Date();
    return isCurrentMonth && day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
  };

  const isSelected = (day: number, isCurrentMonth: boolean) => {
    return isCurrentMonth && day === selectedDate.getDate() && currentDate.getMonth() === selectedDate.getMonth() && currentDate.getFullYear() === selectedDate.getFullYear();
  };

  // --- DYNAMIC SEARCH LOGIC ---
  // This now filters the `patients` prop passed from the dashboard
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.patientId.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setPatientSearch(`${patient.name}`);
    setShowPatientResults(false);
  };

  return (
    <div className="appointmentModal bg-[#F5F7FB] w-full h-[650px] md:w-[800px] rounded-xl overflow-hidden relative font-sans shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6 pb-2 shrink-0">
        <h3 className="text-[#0A0B3B] font-bold text-xl">Add new appointment</h3>
        <button onClick={onClose} className="w-8 h-8 flex justify-center items-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 transition cursor-pointer">
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* SEARCH BAR */}
        <div ref={searchRef} className="relative w-full">
            <div className="relative w-full bg-white rounded-xl border border-gray-100 shadow-sm z-10">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                    type="text"
                    placeholder="Find patient by name or ID"
                    className="w-full py-3 pl-10 pr-20 rounded-xl text-sm outline-none placeholder:text-gray-400 text-gray-700"
                    value={patientSearch}
                    onChange={(e) => {
                        setPatientSearch(e.target.value);
                        if(selectedPatient) setSelectedPatient(null); // Reset selection if typing
                        setShowPatientResults(true);
                    }}
                    onFocus={() => setShowPatientResults(true)}
                />
                <div className="absolute inset-y-0 right-4 flex items-center gap-3 text-gray-400">
                    {selectedPatient ? (
                        <span className="text-xs font-bold text-[#0A0B3B] bg-blue-50 px-2 py-1 rounded">{selectedPatient.patientId}</span>
                    ) : (
                        <>
                            <Fingerprint className="h-4 w-4 cursor-pointer hover:text-gray-600" />
                            <AlignJustify className="h-4 w-4 cursor-pointer hover:text-gray-600" />
                        </>
                    )}
                </div>
            </div>

            {/* SEARCH RESULTS DROPDOWN */}
            {showPatientResults && patientSearch && !selectedPatient && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="max-h-60 overflow-y-auto">
                        {filteredPatients.length > 0 ? (
                            filteredPatients.map((patient) => (
                                <div 
                                    key={patient.id}
                                    onClick={() => handleSelectPatient(patient)}
                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                                >
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                        <User size={14} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#0A0B3B]">{patient.name}</p>
                                        <p className="text-xs text-gray-500">{patient.patientId}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-sm text-gray-500">No patients found matching &quot;{patientSearch}&quot;</div>
                        )}
                    </div>
                </div>
            )}
        </div>

        {/* List Options */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-100">
            <div onClick={() => { setModalSearch(''); setShowClinicModal(true); }} className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition">
                <span className="text-gray-500 text-sm font-medium">Clinic</span>
                <div className="flex items-center gap-2">
                    <span className={cn("text-sm font-semibold", clinic ? "text-[#0A0B3B]" : "text-gray-400")}>{clinic || 'Select Clinic'}</span>
                    <ChevronRight size={16} className="text-gray-400" />
                </div>
            </div>
            <div onClick={() => { setModalSearch(''); setShowTypeModal(true); }} className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition">
                <span className="text-gray-500 text-sm font-medium">Title</span>
                <div className="flex items-center gap-2">
                    <span className={cn("text-sm font-semibold", appointmentType ? "text-[#0A0B3B]" : "text-gray-400")}>{appointmentType || 'Appointment type'}</span>
                    <ChevronRight size={16} className="text-gray-400" />
                </div>
            </div>
        </div>

        {/* Date Time Row */}
        <div className="flex justify-between items-center px-2 py-1">
            <span className="text-gray-500 text-sm font-medium">Time</span>
            <div className="flex gap-4 text-[#0A0B3B] font-bold text-sm">
                <span>{selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span>{timeString}</span>
            </div>
        </div>

        {/* Calendar */}
        <div className="bg-[#74829F] rounded-xl p-4 text-white shadow-inner select-none">
            <div className="flex justify-between items-center mb-4">
                <button className="p-1 hover:bg-white/10 rounded"><AlignJustify size={20} className="opacity-70" /></button>
                <div className="flex items-center gap-4">
                    <button onClick={handlePrevMonth} className="p-1 hover:bg-white/10 rounded"><ChevronLeft size={16} className="opacity-70" /></button>
                    <span className="font-semibold w-32 text-center">{MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                    <button onClick={handleNextMonth} className="p-1 hover:bg-white/10 rounded"><ChevronRight size={16} className="opacity-70" /></button>
                </div>
                <button onClick={() => setSelectedDate(new Date())} title="Go to Today" className="p-1 hover:bg-white/10 rounded"><Clock size={20} className="opacity-100" /></button>
            </div>
            <div className="grid grid-cols-7 text-center text-sm gap-y-3">
                {DAYS_OF_WEEK.map((day, i) => <div key={i} className="text-white/60 text-xs font-medium mb-2">{day}</div>)}
                {generateCalendarDays().map((dateObj, index) => {
                    const selected = isSelected(dateObj.day, dateObj.currentMonth);
                    const today = isToday(dateObj.day, dateObj.currentMonth);
                    return (
                        <div key={index} onClick={() => handleDateClick(dateObj.day, dateObj.currentMonth)} className={cn("h-8 w-8 flex items-center justify-center rounded-full mx-auto cursor-pointer transition-all text-sm", !dateObj.currentMonth && "text-white/40 cursor-default", dateObj.currentMonth && !selected && "hover:bg-white/10", selected && "bg-[#8EA3C8] shadow-lg font-bold text-white", today && !selected && "border border-white/50")}>
                            {dateObj.day}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Repeat */}
        <div className="bg-[#F5F7FB] pt-2 pb-4">
            <div className="flex items-center justify-between px-2 cursor-pointer group">
                <span className="text-[#6B7A99] font-medium">Repeat</span>
                <div className="flex items-center gap-2">
                    <span className="text-[#0A0B3B] font-bold text-sm group-hover:text-blue-700">Does not repeat</span>
                    <ChevronRight size={16} className="text-[#0A0B3B]" />
                </div>
            </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 p-6 pt-2 border-t border-gray-100 shrink-0 bg-[#F5F7FB]">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-[#6B5AED] text-[#6B5AED] font-medium bg-white hover:bg-purple-50 transition text-sm">Save & Close</button>
          <button className="px-6 py-2.5 rounded-xl bg-[#0A0B3B] text-white font-medium hover:bg-[#15164d] transition text-sm">Create invoice</button>
      </div>

      {/* Modals */}
      {showClinicModal && <SelectionModal title="Clinic" options={CLINICS} selected={clinic} searchValue={modalSearch} onSearchChange={setModalSearch} onSelect={(val) => { setClinic(val); setShowClinicModal(false); }} onClose={() => setShowClinicModal(false)} />}
      {showTypeModal && <SelectionModal title="Appointment type" options={APPOINTMENT_TYPES} selected={appointmentType} onSelect={(val) => { setAppointmentType(val); setShowTypeModal(false); }} onClose={() => setShowTypeModal(false)} hideSearch={true} customHeader={<div className="mb-2"><p className="text-sm text-gray-500 mb-2">New (Walk-in, Referral, Consult)</p></div>} />}
    </div>
  );
}

// --- SELECTION MODAL ---
interface SelectionModalProps {
    title: string; options: string[]; selected: string; onSelect: (value: string) => void; onClose: () => void; searchValue?: string; onSearchChange?: (val: string) => void; hideSearch?: boolean; customHeader?: React.ReactNode;
}
const SelectionModal = ({ title, options, selected, onSelect, onClose, searchValue, onSearchChange, hideSearch, customHeader }: SelectionModalProps) => {
    const filteredOptions = searchValue ? options.filter(opt => opt.toLowerCase().includes(searchValue.toLowerCase())) : options;
    return (
        <div className="absolute inset-0 bg-white z-20 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="text-[#0A0B3B] font-bold text-lg">{title}</h3>
                <button onClick={onClose} className="w-8 h-8 flex justify-center items-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"><X size={18} /></button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
                {customHeader}
                {!hideSearch && (
                    <div className="relative w-full mb-4">
                        <input autoFocus value={searchValue} onChange={(e) => onSearchChange?.(e.target.value)} type="text" placeholder={`Search ${title.toLowerCase()}`} className="w-full py-3 pl-4 pr-10 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 transition" />
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none"><Search className="h-4 w-4 text-gray-400" /></div>
                    </div>
                )}
                <div className="space-y-1">
                    {filteredOptions.map((option) => (
                        <div key={option} onClick={() => onSelect(option)} className={cn("flex items-center justify-between p-3 rounded-lg cursor-pointer transition", selected === option ? "bg-blue-50 text-[#0A0B3B] font-semibold" : "text-gray-600 hover:bg-gray-50")}>
                            <span>{option}</span>
                            {selected === option ? <Check size={16} className="text-[#0A0B3B]" /> : null}
                            {option === 'Consult' && selected !== option && <ChevronRight size={16} className="text-gray-400" />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};