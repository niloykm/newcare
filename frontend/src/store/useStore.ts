import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DoctorProfile, FALLBACK_DOCTORS } from "@/data/doctorsData";

export type RoleType = "patient" | "doctor" | "admin";
export type ConsultationType = "In-Clinic Visit" | "HD Video Consultation";
export type AppointmentStatus = "Confirmed" | "Completed" | "Cancelled";

export interface PatientDetails {
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  reason: string;
  symptoms: string[];
}

export interface StoredAppointment {
  id: string;
  bookingId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorHospital: string;
  doctorAvatar: string;
  doctorDegree: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge: number;
  reason: string;
  symptoms: string[];
  consultationType: ConsultationType;
  slotDate: string;
  slotTime: string;
  amount: number;
  status: AppointmentStatus;
  paymentStatus: "Paid" | "Pending";
  notes?: string;
  meetingLink?: string;
  roomNumber?: string;
  qrCodeUrl?: string;
  createdAt: string;
}

interface StoreState {
  currentRole: RoleType;
  setCurrentRole: (role: RoleType) => void;
  activeDoctorId: string;
  setActiveDoctorId: (id: string) => void;

  doctors: DoctorProfile[];
  setDoctors: (doctors: DoctorProfile[]) => void;
  toggleDoctorAvailability: (doctorId: string) => void;
  updateDoctorFee: (doctorId: string, fee: number) => void;
  toggleDoctorVerification: (doctorId: string) => void;

  appointments: StoredAppointment[];
  addAppointment: (
    appointment: Omit<
      StoredAppointment,
      "id" | "bookingId" | "createdAt" | "status" | "paymentStatus"
    >
  ) => StoredAppointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  addConsultationNote: (id: string, note: string) => void;
  rescheduleAppointment: (id: string, slotDate: string, slotTime: string) => void;
  cancelAppointment: (id: string) => void;

  bookingStep: 1 | 2 | 3;
  setBookingStep: (step: 1 | 2 | 3) => void;
  selectedDoctor: DoctorProfile | null;
  setSelectedDoctor: (doctor: DoctorProfile | null) => void;
  consultationType: ConsultationType;
  setConsultationType: (type: ConsultationType) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  patientDetails: PatientDetails;
  setPatientDetails: (details: Partial<PatientDetails>) => void;
  recentConfirmedBooking: StoredAppointment | null;
  setRecentConfirmedBooking: (booking: StoredAppointment | null) => void;
  resetBookingDraft: () => void;
}

const DEFAULT_PATIENT: PatientDetails = {
  name: "Hannah Morales",
  email: "hannah.morales@example.com",
  phone: "(212) 555-0148",
  age: 38,
  gender: "Female",
  reason: "Annual cardiovascular screening and blood pressure review",
  symptoms: ["Hypertension", "Routine Annual Review"],
};

const INITIAL_APPOINTMENTS: StoredAppointment[] = [
  {
    id: "appt-101",
    bookingId: "NC-8291-NY",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Jenkins",
    doctorSpecialty: "Cardiologist",
    doctorHospital: "Midtown Cardiac Associates, New York",
    doctorAvatar: "/assets/doc2.png",
    doctorDegree: "MD, FACC (Cardiology)",
    patientName: "Hannah Morales",
    patientEmail: "hannah.morales@example.com",
    patientPhone: "(212) 555-0148",
    patientAge: 38,
    reason: "Preventive cardiac screening & blood pressure review",
    symptoms: ["Hypertension", "Routine Annual Review"],
    consultationType: "In-Clinic Visit",
    slotDate: "Today",
    slotTime: "04:30 PM",
    amount: 75,
    status: "Confirmed",
    paymentStatus: "Paid",
    roomNumber: "Suite 402 — Exam Room 3",
    qrCodeUrl:
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=NC-8291-NY",
    createdAt: "2026-11-18T09:15:00Z",
  },
  {
    id: "appt-102",
    bookingId: "NC-9943-VD",
    doctorId: "doc-3",
    doctorName: "Dr. Elena Rostova",
    doctorSpecialty: "Dermatologist",
    doctorHospital: "Madison Clinical Dermatology, NY",
    doctorAvatar: "/assets/doc11.png",
    doctorDegree: "MD, FAAD (Dermatology)",
    patientName: "Sophia Martinez",
    patientEmail: "sophia.m@example.com",
    patientPhone: "(718) 555-0194",
    patientAge: 29,
    reason: "Allergic contact dermatitis evaluation",
    symptoms: ["Skin Rash / Eczema"],
    consultationType: "HD Video Consultation",
    slotDate: "Tomorrow",
    slotTime: "05:15 PM",
    amount: 60,
    status: "Confirmed",
    paymentStatus: "Paid",
    meetingLink: "https://meet.newcare.health/room/NC-9943-VD",
    qrCodeUrl:
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=NC-9943-VD",
    createdAt: "2026-11-18T14:20:00Z",
  },
  {
    id: "appt-103",
    bookingId: "NC-3310-CL",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Jenkins",
    doctorSpecialty: "Cardiologist",
    doctorHospital: "Midtown Cardiac Associates, New York",
    doctorAvatar: "/assets/doc2.png",
    doctorDegree: "MD, FACC (Cardiology)",
    patientName: "David K. Reynolds",
    patientEmail: "d.reynolds@example.com",
    patientPhone: "(917) 555-0112",
    patientAge: 58,
    reason: "Post-angioplasty 6-month follow-up",
    symptoms: ["Post-Op Follow-up", "Hypertension"],
    consultationType: "In-Clinic Visit",
    slotDate: "Last Week",
    slotTime: "11:00 AM",
    amount: 75,
    status: "Completed",
    paymentStatus: "Paid",
    notes:
      "Normal exertion capacity. BP 122/78 mmHg. Maintained on current statin regimen; follow-up in 6 months.",
    roomNumber: "Suite 402 — Exam Room 1",
    qrCodeUrl:
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=NC-3310-CL",
    createdAt: "2026-11-10T10:00:00Z",
  },
  {
    id: "appt-104",
    bookingId: "NC-5120-CN",
    doctorId: "doc-4",
    doctorName: "Dr. David Chen",
    doctorSpecialty: "Pediatrician",
    doctorHospital: "West Side Pediatric Associates, NY",
    doctorAvatar: "/assets/doc1.png",
    doctorDegree: "MD, FAAP (Pediatrics)",
    patientName: "Claire Bennett (Child: Leo, 4)",
    patientEmail: "claire.bennett@example.com",
    patientPhone: "(646) 555-0177",
    patientAge: 4,
    reason: "Preschool physical & immunization series",
    symptoms: ["Routine Annual Review"],
    consultationType: "In-Clinic Visit",
    slotDate: "2 Weeks Ago",
    slotTime: "03:30 PM",
    amount: 50,
    status: "Completed",
    paymentStatus: "Paid",
    notes:
      "Growth velocity at 75th percentile. MMR booster administered with no adverse reaction.",
    roomNumber: "Pediatric Wing B — Room 12",
    createdAt: "2026-11-04T11:45:00Z",
  },
  {
    id: "appt-105",
    bookingId: "NC-7429-CX",
    doctorId: "doc-2",
    doctorName: "Dr. Marcus Vance",
    doctorSpecialty: "General Physician",
    doctorHospital: "NewCare Primary Care, Manhattan",
    doctorAvatar: "/assets/doc6.png",
    doctorDegree: "MD, FACP (Internal Medicine)",
    patientName: "Liam O'Connor",
    patientEmail: "liam.oconnor@example.com",
    patientPhone: "(212) 555-0163",
    patientAge: 42,
    reason: "Rescheduled due to travel",
    symptoms: ["Routine Annual Review"],
    consultationType: "HD Video Consultation",
    slotDate: "Last Month",
    slotTime: "02:00 PM",
    amount: 45,
    status: "Cancelled",
    paymentStatus: "Paid",
    createdAt: "2026-10-24T08:30:00Z",
  },
];

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      currentRole: "patient",
      setCurrentRole: (role) => set({ currentRole: role }),
      activeDoctorId: "doc-1",
      setActiveDoctorId: (id) => set({ activeDoctorId: id }),

      doctors: FALLBACK_DOCTORS,
      setDoctors: (doctors) => set({ doctors }),
      toggleDoctorAvailability: (doctorId) =>
        set((state) => ({
          doctors: state.doctors.map((d) =>
            d.id === doctorId
              ? {
                  ...d,
                  isAvailableToday: !d.isAvailableToday,
                  available: !d.available,
                  nextAvailableSlot: !d.isAvailableToday
                    ? "Today, 4:30 PM"
                    : "Tomorrow, 10:00 AM",
                }
              : d
          ),
        })),
      updateDoctorFee: (doctorId, fee) =>
        set((state) => ({
          doctors: state.doctors.map((d) =>
            d.id === doctorId ? { ...d, consultationFee: fee, fees: fee } : d
          ),
        })),
      toggleDoctorVerification: (doctorId) =>
        set((state) => ({
          doctors: state.doctors.map((d) =>
            d.id === doctorId ? { ...d, verified: !d.verified } : d
          ),
        })),

      appointments: INITIAL_APPOINTMENTS,
      addAppointment: (appointmentData) => {
        const id = `appt-${Date.now()}`;
        const bookingId = `NC-${Math.floor(1000 + Math.random() * 9000)}-${
          appointmentData.consultationType.startsWith("HD") ? "VD" : "CL"
        }`;
        const newAppt: StoredAppointment = {
          ...appointmentData,
          id,
          bookingId,
          status: "Confirmed",
          paymentStatus: "Paid",
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${bookingId}`,
          meetingLink:
            appointmentData.consultationType === "HD Video Consultation"
              ? `https://meet.newcare.health/room/${bookingId}`
              : undefined,
          roomNumber:
            appointmentData.consultationType === "In-Clinic Visit"
              ? "Suite 402 — Exam Room 2"
              : undefined,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          appointments: [newAppt, ...state.appointments],
          recentConfirmedBooking: newAppt,
          bookingStep: 3,
        }));

        return newAppt;
      },

      updateAppointmentStatus: (id, status) =>
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id ? { ...a, status } : a
          ),
        })),

      addConsultationNote: (id, note) =>
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id ? { ...a, notes: note, status: "Completed" } : a
          ),
        })),

      rescheduleAppointment: (id, slotDate, slotTime) =>
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id ? { ...a, slotDate, slotTime, status: "Confirmed" } : a
          ),
        })),

      cancelAppointment: (id) =>
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id ? { ...a, status: "Cancelled" } : a
          ),
        })),

      bookingStep: 1,
      setBookingStep: (step) => set({ bookingStep: step }),
      selectedDoctor: FALLBACK_DOCTORS[0],
      setSelectedDoctor: (doctor) => set({ selectedDoctor: doctor }),
      consultationType: "In-Clinic Visit",
      setConsultationType: (type) => set({ consultationType: type }),
      selectedDate: "Today",
      setSelectedDate: (date) => set({ selectedDate: date }),
      selectedTime: "04:30 PM",
      setSelectedTime: (time) => set({ selectedTime: time }),
      patientDetails: DEFAULT_PATIENT,
      setPatientDetails: (details) =>
        set((state) => ({
          patientDetails: { ...state.patientDetails, ...details },
        })),
      recentConfirmedBooking: null,
      setRecentConfirmedBooking: (booking) =>
        set({ recentConfirmedBooking: booking }),
      resetBookingDraft: () =>
        set({
          bookingStep: 1,
          recentConfirmedBooking: null,
          consultationType: "In-Clinic Visit",
          selectedDate: "Today",
          selectedTime: "04:30 PM",
          patientDetails: DEFAULT_PATIENT,
        }),
    }),
    {
      name: "newcare-storage-v3",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentRole: state.currentRole,
        activeDoctorId: state.activeDoctorId,
        appointments: state.appointments,
        doctors: state.doctors,
      }),
    }
  )
);
