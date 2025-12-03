"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { FaChevronLeft, FaChevronRight, FaSignInAlt, FaSignOutAlt, FaPlus, FaFileExport, FaUserCircle } from "react-icons/fa"
import Layout from "../components/Layout"
import Card from "../components/Card"
import Button from "../components/Button"
import Badge from "../components/Badge"
import { useAuth } from "../context/AuthContext"
import { getEmpAttendance, getEmpHoliday, postCheckIn } from "../services/productServices"
import Modal from "../components/modals/Modal"
// import AttendanceModal from "../components/modals/AttendanceModal"
import { toast } from "react-toastify"
import moment from "moment/moment"
import { useExport } from "../context/ExportContext"
import { useNavigate } from "react-router-dom"
import RequestModal from "../components/modals/RequestModal"
import { FaLocationDot } from "react-icons/fa6"
import CalenderGridView from "../components/CalenderGridView"

const AttendanceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.textLight};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`

const CurrentTimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  border-radius: 8px;
  color: white;
  margin-bottom: 2rem;
`

const CurrentTime = styled.div`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`

const CurrentDate = styled.div`
  font-size: 1.2rem;
  opacity: 0.9;
`

const ProfileCard = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  margin-bottom: 2.5rem;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${({ theme }) => theme.colors.secondary};
`

const ProfileInfo = styled.div`
  /* flex: 1; */
`

const EmployeeName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.colors.primaryDark};
  font-size: 1.5rem;
`

const ProfileDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  width: 100%;
`

const DetailItem = styled.div`
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const DetailLabel = styled.p`
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.85rem;
`

const DetailValue = styled.p`
  margin: 0;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`

const AttendanceActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const ActionButton = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  border: none;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background: ${({ theme }) => theme.colors.border};
  }
`

const ActionIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`

const ActionText = styled.span`
  font-weight: 500;
`

const StatusBadge = styled.div`
  display: inline-block;
  /* padding: 0.25rem 0.75rem; */
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: 0.5rem;
  background: ${({ theme, $status }) =>
    $status === "present"
      ? theme.colors.successLight
      : $status === "leave"
        ? theme.colors.warningLight
        : theme.colors.errorLight};
  color: ${({ theme, $status }) =>
    $status === "present" ? theme.colors.success : $status === "leave" ? theme.colors.warning : theme.colors.error};
`

const CalendarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const MonthText = styled.h3`
  margin: 0;
`

const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.textLight};
`

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`
const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  width: 100%;
  margin-top: 30px;
  background: white;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  margin-bottom: 1rem;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
    opacity: 0.7;
  }`
const DayCell = styled.div`
  padding: 0.5rem;
  text-align: center;
  border-radius: 4px;
  background: ${({ $isCurrent, $isHoliday, $isWeekend, theme }) =>
    $isCurrent
      ? theme.colors.primaryLight
      : $isHoliday
        ? theme.colors.secondaryLight
        : $isWeekend
          ? theme.colors.border
          : "white"};
  color: ${({ $isCurrent, $isHoliday, theme }) =>
    $isCurrent ? theme.colors.primary : $isHoliday ? theme.colors.secondary : theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const DayNumber = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`

const DayStatus = styled.div`
  font-size: 0.7rem;
  font-weight: bold;
  color: ${({ $status, theme }) =>
    $status === "P"
      ? theme.colors.success
      : $status === "L"
        ? theme.colors.warning
        : $status === "C"
          ? theme.colors.secondary
          : $status === "H"
            ? theme.colors.secondary
            : theme.colors.error};
`

const StatusGuide = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textLight};
  border-radius: 8px;
`

const StatusGuideTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 0.5rem;
`

const StatusGuideItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
  
  &:before {
    content: '';
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 0.5rem;
    background: ${({ $status, theme }) =>
      $status === "P"
        ? theme.colors.success
        : $status === "L"
          ? theme.colors.warning
          : $status === "C"
            ? theme.colors.secondary
            : $status === "H"
              ? theme.colors.secondary
              : theme.colors.error};
  }
`

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`

const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background: white;
`

const TableContainer = styled.div`
  overflow-x: auto;
`
const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`

const AttendanceTracking = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [checkedIn, setCheckedIn] = useState(false)
  const [attendance, setAttendance] = useState({})
  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false)
  const [isYesterdayModalOpen, setIsYesterdayModalOpen] = useState(false)
  // const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false)
  const [isModalOpens, setIsModalOpens] = useState(false)
  const [remark, setRemark] = useState("")
  const [yesterdayRemark, setYesterdayRemark] = useState("")
  const [date, setDate] = useState(new Date())
  const currentMonth = date.getMonth()
  const currentYear = date.getFullYear()
  const [attData, setAttData] = useState([])
  const [employeeDatas, setEmployeeDatas] = useState([])
  const [holiday, setHoliday] = useState({})
  const [relode, setReLoad] = useState(1)
  const { profile, companyInfo } = useAuth()
  const { exportAppointmentData } = useExport()
  const navigate = useNavigate()
  const emp_id = localStorage.getItem("empId")
  const [previousDayUnchecked, setPreviousDayUnchecked] = useState(false);

  //Location Modal state and function
  const [coords, setCoords] = useState({ lat: null, lng: null, label: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const mapUrl = (coords.lat !== null && coords.lng !== null)
    ? `https://maps.google.com/maps?q=${encodeURIComponent(coords.lat)},${encodeURIComponent(coords.lng)}${coords.label ? `(${encodeURIComponent(coords.label)})` : ''}&z=15&output=embed`
    : '';
  const hasCoordinates = (geoPoint) => {
    const latitude = geoPoint?.latitude_id
    const longitude = geoPoint?.longitude_id
    return (
      latitude !== null && latitude !== undefined && latitude !== '' &&
      longitude !== null && longitude !== undefined && longitude !== ''
    )
  }

  const getGeoByType = (geoData, type) => {
    return Array.isArray(geoData) ? geoData.find((g) => g.geo_type === type) : null
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const parseGeoLocationString = (geoString) => {
    if (!geoString || geoString === '' || geoString === null) {
      return { latitude: null, longitude: null };
    }
    const parts = geoString.split(',').map(s => s.trim());
    if (parts.length === 2) {
      const latitude = parseFloat(parts[0]);
      const longitude = parseFloat(parts[1]);
      if (!isNaN(latitude) && !isNaN(longitude)) {
        return { latitude, longitude };
      }
    }
    return { latitude: null, longitude: null };
  };

  const initializeGeoLocationConfig = (companyData, profileData) => {
    try {
      const companyAllowedDistance = companyData?.geo_allowed_distance;
      let companyOriginLat = null;
      let companyOriginLon = null;

      if (companyData?.geo_location_data) {
        const { latitude, longitude } = parseGeoLocationString(companyData.geo_location_data);
        companyOriginLat = latitude;
        companyOriginLon = longitude;
      }

      let finalOriginLat = companyOriginLat;
      let finalOriginLon = companyOriginLon;

      if (profileData) {
        const profile = profileData;
        if (profile.geo_location_data) {
          const { latitude, longitude } = parseGeoLocationString(profile.geo_location_data);
          if (latitude !== null && longitude !== null) {
            finalOriginLat = latitude;
            finalOriginLon = longitude;
          }
        }
      }

      return {
        // isEnabled: !!companyGeoEnabled && !!companyAllowedDistance,
        allowedRadius: companyAllowedDistance,
        originLatitude: finalOriginLat,
        originLongitude: finalOriginLon,
      };
    } catch (error) {
      console.error("Error initializing geolocation config:", error);
      return null;
    }
  };

  const geoConfig = initializeGeoLocationConfig(companyInfo, profile);

const isWithinAllowedRange = (geoPoint, geoConfig) => {
  if (!geoPoint || !hasCoordinates(geoPoint)) return "outline";

  const { originLatitude, originLongitude, allowedRadius, } = geoConfig || {};

  if ((allowedRadius && (!originLatitude || !originLongitude)) || 
      ((!allowedRadius || allowedRadius === 0) && (originLatitude && originLongitude)) ||
      (!allowedRadius && !originLatitude && !originLongitude)) { 
    return "outline";
  }

  const distance = calculateDistance(
    originLatitude,
    originLongitude,
    geoPoint.latitude_id,
    geoPoint.longitude_id
  );


  return distance <= allowedRadius ? "outline" : "outlines";
};

  const openMapFromGeo = (geoPoint, label) => {
    if (hasCoordinates(geoPoint)) {
      setCoords({ lat: geoPoint.latitude_id, lng: geoPoint.longitude_id, label: label || '' });
      setModalOpen(true);
    } else {
      alert("No location data available");
    }
  };

  const getLocationDisplay = (statusDisplay, showCheckIn, showCheckOut) => {
    if (statusDisplay === "Leave") {
      return { type: "message", content: "Employee is on leave" };
    }
    
    if (!showCheckIn && !showCheckOut) {
      return { type: "message", content: "Location data not available" };
    }
    
    return { type: "buttons", showCheckIn, showCheckOut };
  };

  // In the component, add these state variables after the existing state declarations
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [filteredAttendanceData, setFilteredAttendanceData] = useState([])
  const urlParams = new URLSearchParams(window.location.search)
  const empidParam = urlParams.get("empid")
  const empnoidParam = urlParams.get("empnoid")
  const empName = urlParams.get("name")
  const grade = urlParams.get("employeegrade")
  const profileimage = decodeURIComponent(urlParams.get("image"));
  const department = urlParams.get("department")
  const [error, setError] = useState('')
  const [yesterdayError, setYesterdayError] = useState('')
  const setdatatime = async () => {
    let time = moment().format("hh:mm A")
    if (
      moment().isBetween(
        moment().startOf("day").add(12, "hours").add(1, "minute"),
        moment().startOf("day").add(13, "hours"),
      )
    ) {
      time = time.replace(/^12/, "00")
    }
    return time
  }

  const employeeData = {
    id: empidParam||profile?.emp_id,
    name:empName|| profile?.name,
    emp_id: empidParam||profile?.emp_id,
    grade_name:grade|| profile?.grade_name,
    department:department|| profile?.department_name,
    image:department?profileimage: profile?.image ,
  }

  const monthNameMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  }
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [date])

      const checkPreviousDayAttendance = (attendanceData) => {
        if (profile) {
            if (!profile?.is_shift_applicable) {
                setPreviousDayUnchecked(false);
                return;
            }
        }

        const yesterday = moment().subtract(1, 'day').format('DD-MM-YYYY');
        const yesterdayAttendance = attendanceData.find(item =>
            item.a_date === yesterday &&
            item.attendance_type !== "L" &&
            item.end_time === null
        );

        setPreviousDayUnchecked(!!yesterdayAttendance);
    };

  const fetchAttendanceDetails = (data) => {
    getEmpAttendance(data).then((res) => {
      setEmployeeDatas(res.data)
      processAttendanceData(res.data)
      checkPreviousDayAttendance(res.data)
    })
    getEmpHoliday(data).then((res) => {
      processHolidayData(res.data)
    })
  }
  const processAttendanceData = (data) => {
    const attendanceMap = {}
    data.forEach((item) => {
      const day = Number.parseInt(item.a_date.split("-")[0], 10)
      attendanceMap[day] = item.attendance_type
    })
    setAttData(attendanceMap)
    const currentDate = `${currentTime.getDate().toString().padStart(2, "0")}-${(currentTime.getMonth() + 1).toString().padStart(2, "0")}-${currentTime.getFullYear()}`
    const todayAttendance = data.find((item) => item.a_date === currentDate)
    if (todayAttendance) {
      setAttendance(todayAttendance)
      setCheckedIn(todayAttendance.end_time === null)
    } else {
      setAttendance({
        start_time: null,
        end_time: null,
        geo_status: "N",
      })
    }
  }
  useEffect(() => {
    fetchAttendanceDetails({
      month: currentMonth + 1,
      year: currentYear,
      empId:empnoidParam || localStorage.getItem("empNoId"),
    })
  }, [currentMonth, currentYear, relode])

  // After the useEffect that fetches attendance data, add this effect to handle filtering
  useEffect(() => {
    if (employeeDatas.length > 0) {
      let filtered = [...employeeDatas]

      // Filter by status
      if (statusFilter !== "All Status") {
        filtered = filtered.filter((item) => {
          const dateObj = new Date(item.year, item.month - 1, item.day)
          const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6
          const isHoliday = holiday[item.day]

          if (statusFilter === "Present" && item.attendance_type_display === "Present") {
            return true
          } else if (statusFilter === "Leave" && item.attendance_type_display === "On Leave") {
            return true
          } else if (statusFilter === "Holiday" && (isHoliday || isWeekend)) {
            return true
          } else if (
            statusFilter === "Absent" &&
            item.attendance_type_display !== "Present" &&
            item.attendance_type_display !== "On Leave" &&
            !isHoliday &&
            !isWeekend
          ) {
            return true
          }
          return false
        })
      }
      setFilteredAttendanceData(filtered)
    } else {
      setFilteredAttendanceData([])
    }
  }, [employeeDatas, statusFilter, holiday])

  const processHolidayData = (data) => {
    const holidayMap = {}

    // Process holiday_list
    if (data.holiday_list && Array.isArray(data.holiday_list)) {
      data.holiday_list.forEach((holidayDate) => {
        if (holidayDate) {
          const [day, monthName, year] = holidayDate.split("-")
          const month = monthNameMap[monthName]

          if (month !== undefined && month === currentMonth && Number.parseInt(year, 10) === currentYear) {
            holidayMap[Number.parseInt(day, 10)] = "C"
          } else {
            // console.log(`Skipping holiday: ${holidayDate} (month mismatch or invalid month)`);
          }
        } else {
          // console.log('Skipping empty holiday date');
        }
      })
    }

    // Process holiday_saturday_list
    if (data.holiday_saturday_list) {
      const saturdayDates = data.holiday_saturday_list.split("|")

      saturdayDates.forEach((saturdayDate) => {
        if (saturdayDate) {
          const [day, monthName] = saturdayDate.split("-")
          const month = monthNameMap[monthName]

          if (month !== undefined && month === currentMonth) {
            holidayMap[Number.parseInt(day, 10)] = "H"
          } else {
            // console.log(`Skipping Saturday holiday: ${saturdayDate} (month mismatch or invalid month)`);
          }
        } else {
          // console.log('Skipping empty Saturday holiday date');
        }
      })
    }

    // Mark all Sundays in the current month as 'H'
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)

      // Check if the day is Sunday (0 represents Sunday)
      if (date.getDay() === 0) {
        holidayMap[day] = "H" // Mark this day as a holiday
        // console.log(`Marking ${day}-${currentMonth + 1}-${currentYear} as holiday (Sunday)`);
      }
    }

    setHoliday(holidayMap)
    // console.log('Processed Holiday Map:', holidayMap);
  }

  const confirmCheckOut = (isYesterday = false) => {
    const currentRemark = isYesterday ? yesterdayRemark : remark;
    const currentError = isYesterday ? setYesterdayError : setError;
    const currentModal = isYesterday ? setIsYesterdayModalOpen : setIsRemarkModalOpen;
    const currentRemarkState = isYesterday ? setYesterdayRemark : setRemark;
    
    if (!currentRemark.trim()) {
      currentError("Remarks are required");
      return;
    }
    currentError("");
    
    if (!isYesterday) {
      setCheckedIn(false);
    }
    
    handleCheck("UPDATE", isYesterday);
    
    currentModal(false);
    currentRemarkState("");
  }

  const changeMonth = (direction) => {
    setDate(new Date(date.getFullYear(), date.getMonth() + direction, 1))
  }

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay()
  }

  const daysInMonth = getDaysInMonth(date.getMonth(), date.getFullYear())
  const firstDayOfMonth = getFirstDayOfMonth(date.getMonth(), date.getFullYear())

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"]

  const isCurrentDay = (day) => {
    const today = new Date()
    return day === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
  }

  const isWeekend = (day) => {
    const dateObj = new Date(date.getFullYear(), date.getMonth(), day)
    return dateObj.getDay() === 0 || dateObj.getDay() === 6
  }

  const getStatusForDay = (day) => {
    // Check attendance data first - this should override holiday status
    if (attData[day]) {
      return attData[day]
    }

    // Then check if it's a holiday
    if (holiday[day]) {
      return holiday[day]
    }

    // Default to not submitted if it's a past day
    const today = new Date()
    const dateObj = new Date(date.getFullYear(), date.getMonth(), day)
    return dateObj < today ? "N" : ""
  }
  const handleCheck = async (mode, isYesterday = false) => {
    const currentDate = `${currentTime.getDate().toString().padStart(2, "0")}-${(currentTime.getMonth() + 1).toString().padStart(2, "0")}-${currentTime.getFullYear()}`
    const time = await setdatatime()
    try {
      const attendance = employeeDatas.find((item) => item.a_date === date)
      const attendanceId = attendance ? attendance.id : null

      const checkPayload = {
        emp_id: localStorage.getItem("empNoId"),
        call_mode: mode,
        time: time,
        geo_type: mode === "ADD" ? "I" : "O",
        [isYesterday ? 'e_date' : 'a_date']: currentDate, 
        latitude_id: ``,
        longitude_id: ``,
        remarks: mode === "ADD" ? "Check-in from Web" : (isYesterday ? yesterdayRemark : remark),
        id: attendanceId,
      }
      const Attdatarec = await postCheckIn(checkPayload)
      if (Attdatarec.status === 200) {
        toast.success(isYesterday ? "Yesterday's attendance processed successfully" : "Attendance processed successfully")
      }
    } catch (error) {
      console.log(`Error during ${isYesterday ? 'yesterday' : ''} check in/out:`, error)
      toast.error(`Failed to process ${isYesterday ? "yesterday's" : ""} attendance`)
    }
    setReLoad(relode + 1)
  }

  // const handleAttendanceSubmit = async (attendanceData) => {
  //   try {
  //     const response = await postCheckIn(attendanceData)
  //     if (response.status === 200) {
  //       toast.success("Attendance added successfully")
  //       setReLoad(relode + 1) // Refresh the data
  //     }
  //   } catch (error) {
  //     console.error("Error adding attendance:", error)
  //     toast.error("Failed to add attendance")
  //     throw error // Re-throw to let modal handle the error state
  //   }
  // }

  // Button states
  const isCheckInDisabled = checkedIn || attendance.geo_status === "O" || !!attendance.start_time || previousDayUnchecked
  const isCheckOutDisabled = !checkedIn || attendance.geo_status !== "I" || !!attendance.end_time 

  // Update the handleFilter function
 
  const handleExport = (data) => {
        const result = exportAppointmentData(data, "Attendance_data")
        if (result.success) {
        toast.success("Exported successfully")
        } else {
          toast.error("Export failed: " + result.message)
        }
      }
        const navigates = () => {
    navigate("/employees")
  }

    const handleSuccess = () => {
      toast.success("Request submitted successfully!")
      setIsModalOpens(false)
    }
  return (
    <Layout title="Attendance Tracking">
      <AttendanceHeader>
        <p>Track your daily attendance and view your history</p>
        <HeaderActions>
         {empName ? 
           <Button variant="outline" style={{ marginRight: "0.5rem" }} onClick={navigates}>
             <FaUserCircle /> {empName}
           </Button>:
          <Button variant="primary" onClick={() => setIsModalOpens(true)}>
            <FaPlus style={{ marginRight: "0.5rem" }} />
            Add Attendance Request
          </Button>}
        </HeaderActions>
      </AttendanceHeader>

      {/* Current Time Display */}
      <CurrentTimeContainer>
        <CurrentTime>
          {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </CurrentTime>
        <CurrentDate>
          {currentTime.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </CurrentDate>
      </CurrentTimeContainer>
      <ProfileCard>
        <ProfileImage src={employeeData.image} alt={employeeData.name} />
        <ProfileInfo>
          <EmployeeName>{employeeData.name}</EmployeeName>
          {previousDayUnchecked ? 
          <StatusBadge $status="absent">You did not Check out For Yesterday</StatusBadge> : 
          attendance.start_time ? (
            <StatusBadge $status="present">Checked In at {attendance.start_time}</StatusBadge>
          ) : attendance.end_time ? (
            <StatusBadge $status="leave">Checked Out at {attendance.end_time}</StatusBadge>
          ) : (
            <StatusBadge $status="absent">Not Checked In Today</StatusBadge>
          )}
        </ProfileInfo>
        <ProfileDetails>
          <DetailItem>
            <DetailLabel>My Id</DetailLabel>
            <DetailValue>{employeeData.emp_id}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Designation</DetailLabel>
            <DetailValue>{employeeData.grade_name}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Department</DetailLabel>
            <DetailValue>{employeeData.department}</DetailValue>
          </DetailItem>
        </ProfileDetails>
      </ProfileCard>
     {(companyInfo.is_geo_location_enabled !== "T" && companyInfo.is_geo_location_enabled !== "A") &&
      (!empName &&  
     <AttendanceActions>
        <ActionButton onClick={() => handleCheck("ADD")} disabled={isCheckInDisabled}>
          <ActionIcon>
            <FaSignInAlt style={{ color: isCheckInDisabled ? "#ccc" : "#4CAF50" }} />
          </ActionIcon>
          <ActionText>
            {previousDayUnchecked 
              ? "Check In" 
              : isCheckInDisabled 
                ? `Checked In • ${attendance.start_time}` 
                : "Check In"
            }
          </ActionText>
        </ActionButton>

        <ActionButton 
          onClick={() => previousDayUnchecked ? setIsYesterdayModalOpen(true) : setIsRemarkModalOpen(true)} 
          disabled={previousDayUnchecked ? false : isCheckOutDisabled}
        >
          <ActionIcon>
            <FaSignOutAlt style={{ color: (previousDayUnchecked ? false : isCheckOutDisabled) ? "#ccc" : "#F44336" }} />
          </ActionIcon>
          <ActionText>
           {previousDayUnchecked
              ? "Check Out for Yesterday"
              : isCheckOutDisabled
                ? attendance.end_time
                  ? `Checked Out • ${attendance.end_time}`
                  : "Check Out"
                : "Check Out"}
          </ActionText>
        </ActionButton>
      </AttendanceActions>
    )}
      
      <Card title="Monthly Attendance">
        {/* <CalendarContainer>
          <Button variant="ghost" onClick={() => changeMonth(-1)}>
            <FaChevronLeft />
          </Button>
          <MonthText>{date.toLocaleDateString([], { month: "long", year: "numeric" })}</MonthText>
          <Button variant="ghost" onClick={() => changeMonth(1)}>
            <FaChevronRight />
          </Button>
        </CalendarContainer> */}
{/* 
        <WeekDays>
          {weekDays.map((day, index) => (
            <div key={index}>{day}</div>
          ))}
        </WeekDays> */}

        {/* <CalendarGrid>
          Empty cells for days before the first day of the month
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <DayCell key={`empty-${index}`} />
          ))}

          Days of the month
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1
            const status = getStatusForDay(day)

            return (
              <DayCell
                key={day}
                $isCurrent={isCurrentDay(day)}
                $isHoliday={holiday[day]}
                $isWeekend={isWeekend(day) && !holiday[day]}
              >
                <DayNumber>{day}</DayNumber>
                {status && <DayStatus $status={status === "A" ? "P" : status}>{status === "A" ? "P" : status}</DayStatus>}
              </DayCell>
            )
          })}
        </CalendarGrid> */}
        <CalenderGridView
            getCellProps={({ day }) => ({
              $isCurrent: isCurrentDay(day),
              $isHoliday: holiday[day],
              $isWeekend: isWeekend(day) && !holiday[day]
            })}

            renderBelowDate={({ day }) => {
              const status = getStatusForDay(day)

              return (
                status && (
                  <DayStatus $status={status === "A" ? "P" : status}>
                    {status === "A" ? "P" : status}
                  </DayStatus>
                )
              )
            }}
          />

        <StatusGuide>
          <StatusGuideTitle>Status Guide</StatusGuideTitle>
          <StatusGuideItem $status="P">P - Present</StatusGuideItem>
          <StatusGuideItem $status="L">L - On Leave</StatusGuideItem>
          <StatusGuideItem $status="C">C - Company Holiday</StatusGuideItem>
          <StatusGuideItem $status="H">H - Weekly Holiday</StatusGuideItem>
          <StatusGuideItem $status="N">N - Not Submitted</StatusGuideItem>
        </StatusGuide>
      </Card>

      {/* History Button */}
      {/* <HistoryButton>
        <FaHistory /> View Attendance History
      </HistoryButton> */}
      <Card title="Monthly Attendance Record">
        <FilterContainer>
          {/* <FilterSelect value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
            <option>All Time</option>
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </FilterSelect> */}
          <FilterSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>All Status</option>
            <option>Present</option>
            <option>Leave</option>
            <option>Holiday</option>
            <option>Absent</option>
          </FilterSelect>
        </FilterContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendanceData.length > 0 ? (
                filteredAttendanceData.map((data, index) => {
                  const dateObj = new Date(data.year, data.month - 1, data.day)
                  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6
                  const isHoliday = holiday[data.day]
                  const startTime = data.start_time || "N/A"
                  const endTime = data.end_time || "N/A"
                  const statusDisplay =
                    data.attendance_type_display === "Present"
                      ? "Present"
                      : data.attendance_type_display === "On Leave"
                        ? "Leave"
                        : isHoliday
                          ? "Holiday"
                          : isWeekend
                            ? "Weekend"
                            : "Absent"
                  const checkInData = getGeoByType(data.geo_data, "I")
                  const checkOutData = getGeoByType(data.geo_data, "O")
                  const showLocation = statusDisplay === "Present"
                  const showCheckIn = showLocation && hasCoordinates(checkInData) 
                  const showCheckOut = showLocation && hasCoordinates(checkOutData)
                  const locationDisplay = getLocationDisplay(statusDisplay, showCheckIn, showCheckOut)

                  return (
                    <tr key={index}>
                      <td>
                        {new Date(
                          data.a_date.split("-")[2], // Year
                          data.a_date.split("-")[1] - 1, // Month (0-based)
                          data.a_date.split("-")[0], // Day
                        ).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}
                      </td>
                      <td>{startTime}</td>
                      <td>{endTime}</td>
                      <td>
                        <Badge
                          variant={
                            data.attendance_type_display === "Present"
                              ? "success"
                              : data.attendance_type_display === "On Leave"
                                ? "warning"
                                : statusDisplay === "Absent"
                                  ? "error"
                                  : isHoliday || isWeekend
                                    ? "secondary"
                                    : "error"
                          }
                        >
                          {statusDisplay}
                        </Badge>
                      </td>
                      <td>
                        {locationDisplay.type === "message" ? (
                          <span style={{ color: "#666", fontStyle: "italic" }}>
                            <Badge
                              variant={
                                data.attendance_type_display === "Present"
                                  ? "success"
                                  : data.attendance_type_display === "On Leave"
                                    ? "warning"
                                    : statusDisplay === "Absent"
                                      ? "error"
                                      : isHoliday || isWeekend
                                        ? "secondary"
                                        : "error"
                              }
                            >
                              {locationDisplay.content}
                            </Badge>
                          </span>
                        ) : (
                          <div style={{ display: "flex", gap: "1rem" }}>
                            {locationDisplay.showCheckIn ?
                              <Button
                                variant={isWithinAllowedRange(checkInData, geoConfig)}
                                size="sm"
                                onClick={() => openMapFromGeo(checkInData, "Check In")}
                              >
                                <FaLocationDot />
                                View check-in location
                              </Button> : "Checked-in location data not available"
                            }
                            {locationDisplay.showCheckOut ?
                              <Button
                                variant={isWithinAllowedRange(checkOutData, geoConfig)}
                                size="sm"
                                onClick={() => openMapFromGeo(checkOutData, "Check Out")}
                              >
                                <FaLocationDot />
                                View checked-out location
                              </Button> : "Checked-out location data not available"
                            }
                          </div>
                        )
                        }
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "1rem" }}>
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div style={{ marginTop: "1rem", textAlign: "right" }}>
            <Button variant="primary" size="sm" onClick={() => handleExport(filteredAttendanceData)}>
              <FaFileExport /> Export
            </Button>
          </div>
        </TableContainer>
      </Card>
      {isRemarkModalOpen && (
        <Modal isOpen={isRemarkModalOpen} onClose={() => setIsRemarkModalOpen(false)} title="Check Out Remarks">
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Remarks</label>
            <Input
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter check-out remark"
              as="textarea"
              rows={4}
            />
          </div>
          {error && <ErrorText>{error}</ErrorText>}
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <Button variant="outline" onClick={() => setIsRemarkModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => confirmCheckOut(false)}>Confirm Check Out</Button>
          </div>
        </Modal>
      )}

      {isYesterdayModalOpen && (
        <Modal isOpen={isYesterdayModalOpen} onClose={() => setIsYesterdayModalOpen(false)} title="Check Out Yesterday Remarks">
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Remarks</label>
            <Input
              value={yesterdayRemark}
              onChange={(e) => setYesterdayRemark(e.target.value)}
              placeholder="Enter yesterday's check-out remark"
              as="textarea"
              rows={4}
            />
          </div>
          {yesterdayError && <ErrorText>{yesterdayError}</ErrorText>}
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <Button variant="outline" onClick={() => setIsYesterdayModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => confirmCheckOut(true)}>Confirm Yesterday Check Out</Button>
          </div>
        </Modal>
      )}

      {/* New Add Attendance Modal */}
      {/* <AttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        onSubmit={handleAttendanceSubmit}
      /> */}
      {isModalOpens && (
        <RequestModal call_type="R" empId={emp_id} onClose={() => setIsModalOpens(false)} onSuccess={handleSuccess} />
      )}

      {modalOpen &&
        <Modal onClose={() => setModalOpen(false)}>
          <h3>{coords.label === "Check In" ? "Check In" : "Check out"} Location</h3>
          <iframe
            src={mapUrl}
            width="100%"
            height="500"
            allowFullScreen=""
            loading="lazy"
            title="map"
          ></iframe>
        </Modal>}
    </Layout>
  )
}

export default AttendanceTracking
