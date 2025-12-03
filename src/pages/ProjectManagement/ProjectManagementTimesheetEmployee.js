import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import styled from 'styled-components'
import Button from '../../components/Button'
import { FaDumpster, FaFilter, FaUserCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getEmpAllocationData, postAllocationData } from '../../services/productServices'
import { normalizeProjects, formatToDDMMYYYY, getMonthRange } from './utils/utils'
import { useTheme } from '../../context/ThemeContext'
import Card from '../../components/Card'
import AuditActivityList, { ActivityCard } from './demo'
import { addDays, constructFrom, endOfWeek, isAfter, isBefore, isSameDay, isWithinInterval, parse, startOfWeek } from 'date-fns'
import { formatAPITime } from './utils/utils'
import { getCurrentDateTimeDefaults } from './utils/utils'
import ConfirmPopup from '../../components/modals/ConfirmPopup'
import { getYesterday } from './utils/utils'
import ProjectManagementAddForm from '../../components/modals/ModalForProjectmanagemnt/ProjectManagementAddForm'

const Tagline = styled.p`
 color: ${({ theme }) => theme.colors.textLight};
`
const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  color: ${({ theme }) => theme.colors.text};
`
const DateInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background: white;
`
const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background: white;
`

const Container = styled.div`
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes?.xl || '1.5rem'};
  font-weight: ${({ theme }) => theme.fontWeights?.heading || '600'};
  color: ${({ theme }) => theme.colors?.primary || '#6C63FF'};
`;

const ClaimsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`
// Helper: Parse date safely (dd-MMM-yyyy format)
const parseDateSafe = (dateStr) => {
  if (!dateStr) return null;
  return parse(dateStr, "dd-MMM-yyyy", new Date());
};

// Get next week's Monday → Sunday
const getNextWeekRange = () => {
  const today = new Date();
  const nextMonday = addDays(startOfWeek(addDays(today, 7), { weekStartsOn: 1 }), 0);
  const nextSunday = endOfWeek(nextMonday, { weekStartsOn: 1 });
  return { start: nextMonday, end: nextSunday };
};

// Check if project date range overlaps with given range
const hasOverlap = (projStart, projEnd, rangeStart, rangeEnd) => {
  if (!projStart || !projEnd) return false;
  return isWithinInterval(projStart, { start: rangeStart, end: rangeEnd }) ||
         isWithinInterval(projEnd, { start: rangeStart, end: rangeEnd }) ||
         (isBefore(projStart, rangeStart) && isAfter(projEnd, rangeEnd));
};


const ProjectManagementTimesheetEmployee = () => {
  const theme = useTheme();
  const [employeeActivity, setEmployeeActivity] = useState([]);
  const [dayFilter, setDayFilter] = useState("today");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [isFormModalOpen, setIsFromModalOpen] = useState(false);
  const [selectedProject, setSelectdeProject] = useState(null);
  const { todayISO, dayLogKey } = getCurrentDateTimeDefaults();

  const [confirmPopup, setConfirmPopup] = useState({
  isOpen: false,
  title: "",
  message: "",
  onConfirm: null,
});

  // console.log(dayFilter)

  const [dateRange, setDateRange] = useState(() => {
    const { start, end } = getMonthRange("current")
    return { start, end }
  })

  const emp_id = localStorage.getItem('empId');
  const urlParams = new URLSearchParams(window.location.search)
  const empidParam = urlParams.get("empid");
  const empName = urlParams.get("name");
  const navigate = useNavigate()

  useEffect(() => {
    if (emp_id) {
      fetchEmpAllocationData()
    }
  }, [emp_id, empidParam])

  const fetchEmpAllocationData = async (startOverride, endOverride) => {
    const emp_id = localStorage.getItem("empId")
    const start = startOverride || dateRange.start
    const end = endOverride || dateRange.end

    const startDateObj = new Date(start)
    const endDateObj = new Date(end)

    if (endDateObj < startDateObj) {
      toast.info("End date cannot be earlier than start date")
      return
    }
    const payload = {
      emp_id: empidParam || emp_id,
      start_date: formatToDDMMYYYY(start),
      end_date: formatToDDMMYYYY(end),
    }

    try {
      const response = await getEmpAllocationData(payload);
      setEmployeeActivity(normalizeProjects(response.data))
      console.log("normalizeProjects(response.data)", JSON.stringify(normalizeProjects(response.data)))
    } catch (error) {

      toast.error("No data found...")
    }
  }

    const handleActivitySubmit = async ({ project, mode, data = {}, extraFields = {} }) => {
      if (!project) return false
  
      const isAddMode = mode === "ADD"
      const empIdentifier = project.original_P?.emp_id || project.original_A?.emp_id || empidParam || emp_id
  
      if (!empIdentifier) {
        toast.error("Employee not found")
        return false
      }
  
      if (isAddMode && !project?.original_P?.id) {
        toast.error("Unable to start this activity")
        return false
      }
  
      if (!isAddMode && !project?.original_A?.id) {
        toast.error("Unable to complete this activity")
        return false
      }
  
      // if (!isAddMode && !data.endTime) {
      //   toast.error("End time is required")
      //   return false
      // }
  
      try {
        // setSubmittingProjectId(project.id)
        const { apiDate: defaultApiDate, currentTime } = getCurrentDateTimeDefaults()
        const formData = new FormData()
  
        const activityDate = data.activityDate || defaultApiDate
        // For UPDATE, we only want to send start_time when it's explicitly provided
        const explicitStartTime = data.startTime || null
  
        formData.append("emp_id", empIdentifier)
        formData.append("activity_date", activityDate)
        formData.append("remarks", data.remarks ?? (isAddMode ? "Project Started from Web" : ""))
        formData.append("longitude_id", "")
        formData.append("latitude_id", "")
        
        if (data.file) {
          formData.append("submitted_file", data.file)
        }
        
        if (isAddMode) {
          // ADD (Start Activity) → always send start_time, defaulting to current time
          const startTimeForAdd = explicitStartTime || currentTime
          formData.append("call_mode", "ADD")
          formData.append("p_id", project.original_P.id)
          formData.append("start_time", formatAPITime(startTimeForAdd))
          formData.append("geo_type", "I")
        } else {
          formData.append("no_of_items", Number(data.noOfItems || 0))
          formData.append("call_mode", "UPDATE")
          formData.append("a_id", project.original_A.id)
          if(data.endTime){
            formData.append("end_time", formatAPITime(data.endTime))
          }
          // For UPDATE:
          // - Resume Activity (from card) sends an explicit startTime → include start_time + resume remark + geo_type = "I"
          // - Complete / Continue from modal should NOT send start_time at all (only end_time) → geo_type = "O"
          if(explicitStartTime){
            formData.append("start_time", formatAPITime(explicitStartTime))
            formData.append("remarks", "Project resume from Web")
            formData.append("geo_type", "I")
          } else {
            formData.append("geo_type", "O")
          }
        }
  
        Object.entries(extraFields).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value)
          }
        })
        for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }
  
        // const res = await postAllocationData(formData)
  
        // if (res?.status === 200) {
        //   toast.success(isAddMode ? "Check-in Successful" : "Activity Completed")
        //   return true
        // }
        // return false
      } catch (error) {
        toast.error("Unable to submit activity. Try again later..")
        // toast.error("Something went wrong")
        return false
      } finally {
        // setSubmittingProjectId(null)
      }
    }

//     const handleActivityAction = ({ type, activity }) => {
//   if (type === "start") {
//     setConfirmPopup({
//       isOpen: true,
//       title: "Start Activity",
//       message: "Are you sure you want to start this activity?",
//       onConfirm: async () => {
//         await handleActivitySubmit({ project: activity, mode: "ADD" });
//         setConfirmPopup(prev => ({ ...prev, isOpen: false }));
//         fetchEmpAllocationData();
//       },
//     });
//     return;
//   }

//   if (type === "resume") {
//   setConfirmPopup({
//     isOpen: true,
//     title: "Resume Activity",
//     message: "Do you want to resume this activity?",
//     onConfirm: async () => {
//       await handleActivitySubmit({
//         project: activity,
//         mode: "UPDATE",     // resume goes in update mode
//         data: { startTime: getCurrentDateTimeDefaults().currentTime }
//       });

//       setConfirmPopup(prev => ({ ...prev, isOpen: false }));
//       fetchEmpAllocationData();
//     },
//   });
//   return;
// }

//   if (type === "continue") {
//     setSelectdeProject({
//       ...activity,
//       modalContext: { type: "continue" }
//     });
//     setIsFromModalOpen(true);
//     return;
//   }

//   if (type === "complete") {
//     setSelectdeProject({
//       ...activity,
//       modalContext: { type: "complete" }
//     });
//     setIsFromModalOpen(true);
//     return;
//   }

//   if (type === "checkout_yesterday") {
//   const yesterday = getYesterday(); // you already use this in ProjectAddForm

//   setSelectdeProject({
//     ...activity,
//     modalContext: {
//       type: "checkout_yesterday",
//       forceMode: "UPDATE",
//       forcedDate: yesterday.apiDate   // <-- IMPORTANT
//     }
//   });

//   setIsFromModalOpen(true);
//   return;
// }
// };

// utils/activityActions.js
const refreshActivities = async () => {
  // Always fetch current month (your original behavior)
  await fetchEmpAllocationData(); 
  
  // Optional: close modal & popup automatically
  setIsFromModalOpen(false);
  setConfirmPopup(prev => ({ ...prev, isOpen: false }));
  
  // Optional: scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const ACTIVITY_ACTIONS = {

start: {
    title: "Start Activity",
    message: "Are you sure you want to start this activity?",
    handler: async (activity, submit, refresh) => {
      return submit({ project: activity, mode: "ADD" });
    },
  },

  resume: {
    title: "Resume Activity",
    message: "Do you want to resume this activity?",
    handler: async (activity, submit, refresh) => {
      const { currentTime } = getCurrentDateTimeDefaults();
      return submit({
        project: activity,
        mode: "UPDATE",
        data: { startTime: currentTime }
      });
    },
  },

  continue: {
    modal: true,
    modalContext: { type: "continue" }
  },
  
  complete: {
    modal: true,
    modalContext: { type: "complete" }
  },

  checkout_yesterday: {
    modal: true,
    modalContext: {
      type: "checkout_yesterday",
      forceMode: "UPDATE",
      forcedDate: getYesterday().apiDate
    }
  }

};

// In your component — SUPER CLEAN
const handleActivityAction = ({ type, activity }) => {
  const action = ACTIVITY_ACTIONS[type];

  if (action?.modal) {
    setSelectdeProject({
      ...activity,
      modalContext: action.modalContext
    });
    setIsFromModalOpen(true);
    return;
  }

  if (action?.handler) {
    setConfirmPopup({
      isOpen: true,
      title: action.title,
      message: action.message,
      onConfirm: async () => {
        const success = await action.handler(activity, handleActivitySubmit, refreshActivities);
        if (success) {
          await refreshActivities(); // This does everything
        }
        setConfirmPopup(prev => ({ ...prev, isOpen: false }));
      }
    });
  }
};

const getFilteredAndSortedActivities = () => {
  const today = new Date();
  const todayISODate = today.toISOString().split('T')[0];
  const nextWeek = getNextWeekRange();

  return employeeActivity
    .filter(activity => {
      const startDate = parseDateSafe(activity.planned_start_date);
      const endDate = parseDateSafe(activity.planned_end_date);
      const isIncomplete = !activity.complete;
      const status = activity.project_period_status || "Pending";

      // 1. Status Filter (you said you’ll add dropdown later — placeholder)
      // if (selectedStatus !== "All" && status !== selectedStatus) return false;
      if (selectedStatus !== "All" && activity.project_period_status !== selectedStatus) return false;

      // 2. Period Filter Rules
      if (dayFilter === "today") {
        const isTodayInRange = startDate && endDate &&
          (isSameDay(today, startDate) || 
           isSameDay(today, endDate) || 
           (isAfter(today, startDate) && isBefore(today, endDate)));

        return isIncomplete || isTodayInRange;
      }

      if (dayFilter === "next7") {
        if (isIncomplete) return false; // Critical Rule: Incomplete → NEVER in Next7

        if (!startDate || !endDate) return false;

        return hasOverlap(startDate, endDate, nextWeek.start, nextWeek.end);
      }

      if (dayFilter === "past7") {
        // Show past activities (you already handle logs separately)
        return isBefore(startDate, today) || isBefore(endDate, today);
      }

      if (dayFilter === "custom") {
        if (isIncomplete) return true;
        if (!startDate || !endDate) return false;

        const rangeStart = new Date(dateRange.start);
        const rangeEnd = new Date(dateRange.end);
        return hasOverlap(startDate, endDate, rangeStart, rangeEnd);
      }

      return true; // fallback
    })
    .sort((a, b) => {
      // Rule: In "Today" tab → Completed projects go to bottom
      if (dayFilter === "today") {
        if (a.complete && !b.complete) return 1;
        if (!a.complete && b.complete) return -1;
      }
      return 0;
    });
};

const filteredActivities = getFilteredAndSortedActivities();

  return (
    <Layout title="My Audit Activities">
      <ClaimsHeader>
        <Tagline>Track and manage your assigned audit tasks</Tagline>
        {empName &&
          <Button variant="outline" style={{ marginRight: "0.5rem" }} onClick={() => navigate("/employees")}>
            <FaUserCircle /> {empName}
          </Button>}
      </ClaimsHeader>
    <Card hoverable={false} >      
     <Container>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
           {/* <Title>My Audit Activities</Title> */}
           <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}><span style={{ textAlign: 'center', color: '#999' }}>Today:</span><Title style={{padding: "0rem", marginBottom: "0rem"}}>
            {dayLogKey}
            </Title></div>
 <FilterContainer>
        <FilterSelect
          name="selectedStatus"
          value={selectedStatus}
          onChange={(e) => {
            const value = e.target.value
            setSelectedStatus(value)
          }}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Planned">Planned</option>
          <option value="Complete">Complete</option>
        </FilterSelect>
        <FilterSelect
          name="dayFilter"
          value={dayFilter}
          onChange={(e) => {
            const value = e.target.value
            setDayFilter(value)
            if (value === "custom") {
              setShowCustomRange(true)
            } else {
              setShowCustomRange(false)
            }
          }}
        >
          <option value="past7">Past Activity Logs</option>
          <option value="today">Today</option>
          <option value="next7">Upcoming 7 Days Activity Logs</option>
          <option value="custom">Custom Range</option>
        </FilterSelect>

        {showCustomRange && (
          <>
            <DateInput type="date" value={dateRange.start} onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))} />
            <span>to</span>
            <DateInput type="date" value={dateRange.end} onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))} />

            <Button variant="outline" size="sm" onClick={() => {
              if (dayFilter === "custom") {
                fetchEmpAllocationData(dateRange.start, dateRange.end)
              }
            }}>
              <FaFilter /> Filter
            </Button>
          </>
        )}
            <Button variant="outline" size="sm" onClick={() => {
              setDayFilter("today"); setSelectedStatus("All")
            }}>
              <FaDumpster /> Clear Filter
            </Button>
      </FilterContainer>
      </div>
          {filteredActivities.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
            No activities found for selected filter.
          </Card>
        ) : (
          filteredActivities.map(activity => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              filterType={dayFilter}
              onAction={handleActivityAction}
            />
          ))
        )}
         </Container>
    </Card>

    {isFormModalOpen && selectedProject && (
            <ProjectManagementAddForm
              isOpen={isFormModalOpen}
              onClose={() => setIsFromModalOpen(false)}
              activity={selectedProject}
              onSubmit={() => {refreshActivities() }}
              onActivitySubmit={handleActivitySubmit}
              // isSubmitting={submittingProjectId === selectedProject?.id}
              modalContext={selectedProject?.modalContext}
              forceMode={selectedProject?.modalContext?.forceMode}
            />
          )}

<ConfirmPopup
  isOpen={confirmPopup.isOpen}
  title={confirmPopup.title}
  message={confirmPopup.message}
  onConfirm={confirmPopup.onConfirm}
  confirmLabel="Yes"
  onClose={() =>
    setConfirmPopup(prev => ({ ...prev, isOpen: false }))
  }
/>



    </Layout>
  )
}

export default ProjectManagementTimesheetEmployee