'use client';

import React, { useState } from 'react';
import { 
  Search, Plus, Calendar, ChevronDown, MoreVertical, Fingerprint,
  Wallet, PieChart
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- IMPORT COMPONENTS ---
import NewPatient, { NewPatientData } from '../new-patient/page'; 
import NewAppointment from '../new-appointment/page'; // <-- Make sure path is correct

// --- Utility for Tailwind classes ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Modal Component ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>
      {/* Modal Content */}
      <div className="relative z-10 animate-in zoom-in-95 duration-200">
        {children}
      </div>
    </div>
  );
};

// --- Types ---
type StatusType = 'Processing' | 'Not arrived' | 'Awaiting vitals' | 'Awaiting doctor' | 'Admitted to ward' | 'Transferred to A&E' | 'Seen doctor';

interface Patient {
  id: number;
  name: string;
  patientId: string;
  gender: 'Male' | 'Female';
  age: string;
  isNew: boolean;
  clinic: string;
  clinicBadge?: string;
  walletBalance: number;
  time: string;
  date: string;
  status: StatusType;
  avatarColor: string;
}

// --- FULL INITIAL DATA ---
const INITIAL_DATA: Patient[] = [
  { id: 1, name: 'Akpopodion Endurance', patientId: 'HOSP29384756', gender: 'Male', age: '21yrs', isNew: true, clinic: 'Neurology', clinicBadge: '+1', walletBalance: 120000, time: '11:30 AM', date: '22 Sep 2025', status: 'Processing', avatarColor: 'bg-blue-200' },
  { id: 2, name: 'Boluwatife Olusola', patientId: 'HOSP87654321', gender: 'Female', age: '30yrs', isNew: true, clinic: 'Ear, Nose & Throat', walletBalance: 230500, time: '05:30 PM', date: '22 Sep 2025', status: 'Not arrived', avatarColor: 'bg-green-200' },
  { id: 3, name: 'Arlie Mertz', patientId: 'HOSP76354892', gender: 'Female', age: '23days', isNew: true, clinic: 'Neurology', walletBalance: 90000, time: '03:45 PM', date: '22 Sep 2025', status: 'Awaiting vitals', avatarColor: 'bg-gray-200' },
  { id: 4, name: 'Akuchi Amadi', patientId: 'HOSP98765432', gender: 'Female', age: '11mths', isNew: false, clinic: 'Accident & Emergency', walletBalance: 100000, time: '02:00 PM', date: '22 Sep 2025', status: 'Not arrived', avatarColor: 'bg-yellow-200' },
  { id: 5, name: 'Omolola Bakare', patientId: 'HOSP23456789', gender: 'Female', age: '26yrs', isNew: false, clinic: 'Accident & Emergency', walletBalance: 180000, time: '01:15 PM', date: '22 Sep 2025', status: 'Awaiting doctor', avatarColor: 'bg-pink-200' },
  { id: 6, name: 'Ayobami Musa', patientId: 'HOSP34567890', gender: 'Female', age: '11mths', isNew: false, clinic: 'Accident & Emergency', walletBalance: 190000, time: '12:45 PM', date: '22 Sep 2025', status: 'Admitted to ward', avatarColor: 'bg-indigo-200' },
  { id: 7, name: 'Ngozi Okeke', patientId: 'HOSP45678901', gender: 'Female', age: '11mths', isNew: false, clinic: 'Accident & Emergency', walletBalance: 200000, time: '10:00 AM', date: '22 Sep 2025', status: 'Transferred to A&E', avatarColor: 'bg-purple-200' },
  { id: 8, name: 'Chinwe Azikiwe', patientId: 'HOSP56789012', gender: 'Female', age: '11mths', isNew: false, clinic: 'Accident & Emergency', walletBalance: 210000, time: '08:00 AM', date: '22 Sep 2025', status: 'Seen doctor', avatarColor: 'bg-red-200' },
];

// --- Sub-Components ---
const StatusBadge = ({ status, time }: { status: StatusType, time: string }) => {
  const styles: Record<StatusType, string> = {
    'Processing': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Not arrived': 'bg-red-100 text-red-600 border-red-200',
    'Awaiting vitals': 'bg-purple-100 text-purple-600 border-purple-200',
    'Awaiting doctor': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Admitted to ward': 'bg-orange-100 text-orange-600 border-orange-200',
    'Transferred to A&E': 'bg-purple-100 text-purple-600 border-purple-200',
    'Seen doctor': 'bg-green-100 text-green-700 border-green-200',
  };

  const timeColor = 
    status === 'Not arrived' ? 'text-red-500' : 
    status === 'Processing' ? 'text-yellow-600' :
    status === 'Awaiting vitals' ? 'text-purple-500' : 
    status === 'Admitted to ward' ? 'text-orange-500' :
    status === 'Seen doctor' ? 'text-green-500' :
    'text-blue-900';

  return (
    <>
      <div className={cn("hidden lg:flex flex-col items-center mr-4")}>
        <span className={cn("font-bold text-sm", timeColor)}>{time}</span>
        <span className="text-xs text-gray-400 font-medium">22 Sep 2025</span>
      </div>
      <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border min-w-[130px] justify-between", styles[status])}>
        {status}
        {status === 'Processing' && <div className="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center text-[10px] text-white">»</div>}
        {status === 'Not arrived' && <div className="w-4 h-4 rounded-full bg-red-400 flex items-center justify-center text-white">-</div>}
        {status === 'Awaiting vitals' && <div className="w-4 h-4 rounded-full bg-purple-400 flex items-center justify-center text-white">♥</div>}
        {status === 'Awaiting doctor' && <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-white">♥</div>}
        {status === 'Admitted to ward' && <div className="w-4 h-4 rounded-full bg-orange-400 flex items-center justify-center text-white">+</div>}
        {status === 'Seen doctor' && <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white">✓</div>}
      </div>
    </>
  );
};

export default function PatientDashboard() {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRow, setActiveRow] = useState<number | null>(1);
  
  // --- STATES FOR MODALS ---
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  // Filter Logic
  const filteredData = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Logic to add a new patient
  const handleAddNewPatient = (data: NewPatientData) => {
    const newPatient: Patient = {
        id: patients.length + 1,
        name: `${data.firstName} ${data.lastName}`,
        patientId: data.patientId,
        gender: data.gender,
        age: '25yrs', 
        isNew: data.isNew,
        clinic: 'General Practice',
        walletBalance: 0,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: '22 Sep 2025',
        status: 'Not arrived',
        avatarColor: 'bg-purple-200' 
    };

    setPatients([newPatient, ...patients]);
    setIsAddPatientModalOpen(false); 
  };

  return (
    <div className="landingComponents min-h-screen bg-[#F5F7FB] p-4 md:p-8 font-sans text-[#1a1a4d]">
      
      {/* Top Header & Search */}
      <div className="flex flex-col justify-between items-center gap-4 mb-8">
        {/* Search Bar */}
        <div className="relative w-full md:w-[750px] bg-white rounded-full shadow-sm">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input 
                type="text"
                placeholder="Find patient"
                className="w-full py-3 pl-10 pr-12 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
             <div className="absolute inset-y-0 right-4 flex items-center gap-2 text-gray-400">
                <Fingerprint className="h-4 w-4 cursor-pointer hover:text-gray-600" />
                <div className="h-4 w-px bg-gray-300"></div>
                <ChevronDown className="h-4 w-4 cursor-pointer hover:text-gray-600" />
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-3 w-full">
            <button 
                onClick={() => setIsAddPatientModalOpen(true)}
                className="landingBtns flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#0A0B3B] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-[#15164d] transition cursor-pointer"
            >
                Add new patient
                <div className="bg-white/20 rounded-full p-0.5"><Plus size={12} /></div>
            </button>
            <button 
                onClick={() => setIsAppointmentModalOpen(true)}
                className="landingBtns flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#0A0B3B] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-[#15164d] transition cursor-pointer"
            >
                Create appointment
                <div className="bg-white/20 rounded-md p-0.5"><Calendar size={12} /></div>
            </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full overflow-x-auto pb-10">
        <div className="landingTable min-w-[1000px]">
            {/* Header Row */}
            <div className="landingTable grid grid-cols-[50px_40px_2.5fr_1.5fr_1fr_1.5fr_1.5fr_40px] gap-4 px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <div></div>
                <div>#</div>
                <div>Patient information</div>
                <div>Clinic</div>
                <div>Wallet bal. (₦)</div>
                <div className="flex items-center gap-1">Time/Date <Calendar size={12}/></div>
                <div>Status</div>
                <div></div>
            </div>

            {/* Data Rows */}
            <div className="landingTable space-y-3">
                {filteredData.map((patient) => {
                    const isActive = activeRow === patient.id;
                    const isLast = patient.id === 8; 

                    return (
                        <div 
                            key={patient.id}
                            onClick={() => setActiveRow(patient.id === activeRow ? null : patient.id)}
                            className={cn(
                                "landingTable group relative grid grid-cols-[50px_40px_2.5fr_1.5fr_1fr_1.5fr_1.5fr_40px] gap-4 items-center bg-white rounded-xl py-4 px-6 shadow-sm border border-transparent transition-all cursor-pointer",
                                isActive ? "shadow-md" : "hover:shadow-md"
                            )}
                        >
                            <div className={cn(
                                "landingTable absolute left-0 top-2 bottom-2 w-1.5 rounded-r-lg transition-colors",
                                isActive ? "bg-orange-400" : "bg-transparent group-hover:bg-orange-200"
                            )}></div>

                            <div className="flex flex-col items-center justify-center">
                                {isLast ? (
                                     <div className="h-10 w-10 bg-[#8384b6] rounded-lg flex items-center justify-center text-white shadow-lg">
                                        <PieChart size={20} />
                                     </div>
                                ) : (
                                    <button className="text-gray-400 hover:text-black">
                                        {isActive ? <div className="h-5 w-5 bg-blue-900 rounded-full text-white flex items-center justify-center text-xs font-bold">-</div> : <ChevronDown size={16} />}
                                    </button>
                                )}
                            </div>

                            <div className="landingTable font-semibold text-gray-700">{patient.id}</div>

                            <div className="flex items-center gap-3">
                                <div className={cn("h-10 w-10 rounded-full overflow-hidden flex items-center justify-center", patient.avatarColor)}>
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.id}`} alt="avatar" className="h-full w-full object-cover" />
                                </div>
                                <div>
                                    <div className="landingTable font-bold text-[#0A0B3B] text-sm leading-tight">{patient.name}</div>
                                    <div className="landingTable text-[11px] text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                                        <span className="uppercase">{patient.patientId}</span> • {patient.gender} • {patient.age}
                                    </div>
                                </div>
                                <div className="landingTable flex gap-2 ml-2">
                                    {patient.isNew && <span className="bg-indigo-100 text-indigo-700 text-[10px] px-1.5 py-0.5 rounded font-bold">New</span>}
                                    <div className="bg-red-50 p-1 rounded border border-red-100">
                                        <Wallet size={12} className="text-red-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="landingTable font-semibold text-sm text-[#0A0B3B]">{patient.clinic}</span>
                                {patient.clinicBadge && (
                                    <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded font-bold">{patient.clinicBadge}</span>
                                )}
                            </div>

                            <div className="landingTable font-bold text-sm text-[#0A0B3B] opacity-90">
                                {patient.walletBalance.toLocaleString()}
                            </div>

                            <div className="tableStatus col-span-2 flex items-center justify-between">
                                <StatusBadge status={patient.status} time={patient.time} />
                            </div>

                            <div className="flex justify-end">
                                <button className="landingTable text-gray-400 hover:text-black">
                                    <MoreVertical size={18} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>

      {/* --- ADD PATIENT MODAL --- */}
      <Modal 
        isOpen={isAddPatientModalOpen} 
        onClose={() => setIsAddPatientModalOpen(false)}
      >
        <NewPatient 
            onClose={() => setIsAddPatientModalOpen(false)}
            onSave={handleAddNewPatient}
        />
      </Modal>

      {/* --- ADD APPOINTMENT MODAL --- */}
      <Modal 
        isOpen={isAppointmentModalOpen} 
        onClose={() => setIsAppointmentModalOpen(false)}
      >
        <NewAppointment 
            onClose={() => setIsAppointmentModalOpen(false)}
            patients={patients} 
        />
      </Modal>

    </div>
  );
}