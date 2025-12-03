import { eachDayOfInterval, format, isBefore, isToday, parse } from "date-fns"
import { AlertCircle, Calendar, CheckCircle2, Clock } from "lucide-react"

const MONTH_SHORT_NAMES = [ "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec" ];
//   export const getStatsFromData = (data = []) => {
  
//   if (!data || data.length === 0) {
//     return {
//       totalHours: "0h",
//       totalProjects: 0,
//       pendingTasks: 0,
//     }
//   }

//   const totalHours = data.reduce(
//     (sum, item) => sum + Number(item.effort || 0),
//     0
//   )

//   const projectSet = new Set(data.map(item => item.project_name))
//   const totalProjects = projectSet.size

//   const pendingTasks = data.filter(
//     item => item.status_display === "SUBMITTED"
//   ).length

//   return {
//     totalHours: `${totalHours}h`,
//     totalProjects,
//     pendingTasks
//   }
// }

const MONTH_MAP = MONTH_SHORT_NAMES.reduce((acc, m, i) => {
  acc[m.toLowerCase()] = i;
  return acc;
}, {});

export const parseApiDate = (dateStr) => {
  if (!dateStr) return null
  const [day, mon, year] = dateStr.split("-")
  return new Date(`${mon} ${day}, ${year}`)
}

export const formatAPITime = (time24) => {
  if (!time24) return ""
  const [h, m] = time24.split(":")
  let hours = parseInt(h, 10)
  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12 || 12
  return `${hours.toString().padStart(2, "0")}:${m} ${ampm}`
}

export const getCurrentDateTimeDefaults = () => {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, "0")
  const yyyy = now.getFullYear()
  const mm = pad(now.getMonth() + 1)
  const dd = pad(now.getDate())
  const todayISO = `${yyyy}-${mm}-${dd}`
  const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`
  const dayLogKey = `${dd}-${MONTH_SHORT_NAMES[now.getMonth()]}-${yyyy}`
  const apiDate = formatToDDMMYYYY(todayISO)

  return { todayISO, dayLogKey, apiDate, currentTime }
}

export const getYesterday = () => {
  const date = new Date()
  date.setDate(date.getDate() - 1)

  const pad = (n) => String(n).padStart(2, "0")
  const yyyy = date.getFullYear()
  const mm = pad(date.getMonth() + 1)
  const dd = pad(date.getDate())

  return {
    apiDate: `${dd}-${mm}-${yyyy}`,
    input: `${yyyy}-${mm}-${dd}`,
    dayLogKey: `${dd}-${MONTH_SHORT_NAMES[date.getMonth()]}-${yyyy}`
  }
}

// ✅ Convert full ts_data_list into DATE OBJECT MAP
export const buildDayWiseGeo = (tsList = [], activityRemarks = "") => {
  if (!Array.isArray(tsList) || tsList.length === 0) return {}

  const result = {}

  tsList.forEach(item => {
    const geoString = item?.geo_data || ""
    const date = item?.a_date

    if (!date) return

    const [checkInPart, checkOutPart] = geoString.split("O|")

    let obj = {
      date,
      check_in: null,
      check_out: null,
      remarks: item?.remarks || activityRemarks || ""
    }

    if (checkInPart) {
      const inParts = checkInPart.replace("I|", "").split("|")
      obj.check_in = {
        time: inParts[0] || null,
        lat: inParts[1] ? Number(inParts[1]) : null,
        lng: inParts[2] ? Number(inParts[2]) : null,
      }
    }

    if (checkOutPart) {
      const outParts = checkOutPart.split("|")
      obj.check_out = {
        time: outParts[0] || null,
        lat: outParts[1] ? Number(outParts[1]) : null,
        lng: outParts[2] ? Number(outParts[2]) : null,
      }
    }

    result[date] = obj
  })

  return result
}

export const getTodayApiDateStr = () => {
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, "0")
  const mon = MONTH_SHORT_NAMES[d.getMonth()]
  const yyyy = d.getFullYear()
  return `${dd}-${mon}-${yyyy}`
}

//This function is user for Grouping by activity_id + order_item_key , Picking P / A,Status calculation, day_logs creation using buildDayWiseGeo
export const buildActivityGroupMap = (apiData = []) => {
  if (!Array.isArray(apiData) || apiData.length === 0) return []

  const grouped = {}

  apiData.forEach(item => {
    const key = `${item.activity_id}_${item.order_item_key}`

    if (!grouped[key]) {
      grouped[key] = {
        original_P: null,
        original_A: null
      }
    }

    if (item.activity_type === "P") {
      grouped[key].original_P = item
    }

    if (item.activity_type === "A") {
      grouped[key].original_A = item
    }
  })

  const today = new Date()

  return Object.values(grouped).map(group => {
    const P = group.original_P
    const A = group.original_A

    const planned_start_date = P?.start_date || null
    const planned_end_date   = P?.end_date || null

    const actual_start_date = A?.start_date || null
    const actual_end_date   = A?.end_date || null

    const activity_id = P?.activity_id || A?.activity_id
    const order_item_key = P?.order_item_key || A?.order_item_key

    const project_name = P?.project_name || A?.project_name
    const activity_name = P?.activity_name || A?.activity_name
    const no_of_items = P?.no_of_items || A?.no_of_items

    const day_logs = buildDayWiseGeo(
      A?.ts_data_list || [],
      P?.remarks || A?.remarks || ""
    )

    // Status calculation
    let project_status = "planned"
    let project_period_status = "Planned"

    if (A && (A.status === "C" || A.status_display === "COMPLETED")) {
      project_status = "completed"
      project_period_status = "Completed"
    }
    else if (A) {
      project_status = "active"
      project_period_status = "IN Progress"
    }
    else if (P && planned_end_date) {
      const end = new Date(planned_end_date.split("-").reverse().join("-"))
      if (today > end) {
        project_status = "pending"
        project_period_status = "Pending"
      }
    }

    return {
      // common identity
      activity_id,
      order_item_key,
      project_name,
      activity_name,

      // plan
      planned_start_date,
      planned_end_date,

      // actual
      actual_start_date,
      actual_end_date,

      // status
      project_status,
      project_period_status,

      // work logs
      day_logs,

      // effort
      effort: A?.effort || 0,
      effort_unit: A?.effort_unit || null,

      // originals
      original_P: P,
      original_A: A
    }
  })
}


export const normalizeProjects = (apiData = []) => {
  const groupedData = buildActivityGroupMap(apiData)
//   const grouped = {}
//   const today = new Date()
  const todayApiStr = getTodayApiDateStr()

//   apiData.forEach(item => {
//     const key = `${item.activity_id}_${item.order_item_key}`

//     if (!grouped[key]) {
//       grouped[key] = {
//         original_P: null,
//         original_A: null
//       }
//     }

//     if (item.activity_type === "P") {
//       grouped[key].original_P = item
//     }

//     if (item.activity_type === "A") {
//       grouped[key].original_A = item
//     }
//   })

//   return Object.values(grouped).map(group => {
//     const P = group.original_P
//     const A = group.original_A

//     const planned_start_date = P?.start_date || null
//     const planned_end_date = P?.end_date || null

//     const actual_start_date = A?.start_date || null
//     const actual_end_date = A?.end_date || null

//     const activity_id = P?.activity_id || A?.activity_id
//     const order_item_key = P?.order_item_key || A?.order_item_key

//     const project_name = P?.project_name || A?.project_name
//     const activity_name = P?.activity_name || A?.activity_name
//     const no_of_items = P?.no_of_items || A?.no_of_items

//     // ✅ DO NOT CHANGE day_logs LOGIC
//     const dayData = buildDayWiseGeo(A?.ts_data_list || [])

//     // ✅ Status calculation
//     let project_status = "planned"
//     let project_period_status = "Planned"

//     if (A && (A.status === "C" || A.status_display === "COMPLETED")) {
//       project_status = "completed"
//       project_period_status = "Completed"
//     }
//     else if (A) {
//       project_status = "active"
//       project_period_status = "IN Progress"
//     }
//     else if (P && planned_end_date) {
//       const end = parseApiDate(planned_end_date)
//       if (today > end) {
//         project_status = "pending"
//         project_period_status = "Pending"
//       }
//     }

 return groupedData.map(item => {

      const todayLog = item.day_logs[todayApiStr] || null
      const hasTodayCheckIn = !!todayLog?.check_in
      const hasTodayCheckOut = !!todayLog?.check_out

      const pendingCheckoutKey = Object.keys(item.day_logs || {}).find((key) => {
        const log = item.day_logs[key]
        return !!(log?.check_in && !log?.check_out)
      })

      const hasPendingCheckout = !!pendingCheckoutKey

      let show_start_button = false
      let show_end_button = false

      if (hasPendingCheckout) {
        show_end_button = true
      } else if (!hasTodayCheckIn) {
        show_start_button = true
      } else if (hasTodayCheckIn && !hasTodayCheckOut) {
        show_end_button = true
      }

      return {
        id: item.original_A?.id || item.original_P?.id,

        title: item.project_name,
        project_name: item.project_name,
        activity_id: item.activity_id,
        activity_name: item.activity_name,
        project_code: item.order_item_key,

        planned_start_date: item.planned_start_date,
        planned_end_date: item.planned_end_date,

        actual_start_date: item.actual_start_date,
        actual_end_date: item.actual_end_date,

        hasCheckIn: hasTodayCheckIn,
        hasCheckOut: hasTodayCheckOut,
        hasTodayCheckIn,
        hasTodayCheckOut,

        effort: item.effort,
        effort_unit: item.effort_unit,

        status: item.project_status,
        status_display: item.project_period_status,

        project_status: item.project_status,
        project_period_status: item.project_period_status,

        show_start_button,
        show_end_button,

        hasPendingCheckout,
        pendingCheckoutDate: pendingCheckoutKey || null,

        day_logs: item.day_logs,       // ✅ now reused
        original_P: item.original_P,
        original_A: item.original_A
      }
  })
}

export const parseDate = (ds) => parse(ds, "dd-MMM-yyyy", new Date())

export const buildTasksByDate = (apiData) => {
  const map = {}

  apiData.forEach((item) => {
    const start = parseDate(item.planned_start_date)
    const end = parseDate(item.planned_end_date)

    const plannedDates = eachDayOfInterval({ start, end })

    plannedDates.forEach((date) => {
      const key = format(date, "yyyy-MM-dd")
      const logKey = format(date, "dd-MMM-yyyy")
      const log = item.day_logs?.[logKey]

      let status = "planned"
      let label = "Planned"
      let color = "#3b82f6"
      let checkIn = null
      let checkOut = null

      /* ✅ COMPLETED */
      if (log?.check_in && log?.check_out) {
        status = "completed"
        label = "Completed"
        color = "#10b981"
        checkIn = log.check_in.time
        checkOut = log.check_out.time
      }

      else if (log?.check_in && !log?.check_out) {
        status = "in-progress"
        label = "In Progress"
        color = "#f59e0b"
        checkIn = log.check_in.time
      }

      /* ✅ IN PROGRESS (ONLY FOR TODAY) */
      else if (isToday(date) && log?.check_in && !log?.check_out) {
        status = "in-progress"
        label = "In Progress"
        color = "#f59e0b"
        checkIn = log.check_in.time
      }

      /* ✅ PAST DATE BUT NOT CHECKED IN (GREY) */
      else if (isBefore(date, new Date()) && !isToday(date)) {
        status = "planned-not-checked-in"
        label = "Planned but not checked in"
        color = "#9ca3af"
      }

      /* ✅ TODAY OR FUTURE DATE (PLANNED) */
      else {
        status = "planned"
        label = "Planned"
        color = "#3b82f6"
      }

      if (!map[key]) map[key] = []

      map[key].push({
        id: `${item.id}-${key}`,
        name: item.activity_name,
        project: item.project_name,
        status,
        label,
        color,
        checkIn,
        checkOut,
      })
    })

  // ADD OUT-OF-PLAN DAY_LOGS
  if (item.day_logs) {
      Object.keys(item.day_logs).forEach((logDateStr) => {
        const logDate = parseDate(logDateStr)

        // Only add if OUTSIDE planned range
        if (logDate < start || logDate > end) {
          const key = format(logDate, "yyyy-MM-dd")
          const log = item.day_logs[logDateStr]

          let status = "in-progress"
          let label = "In Progress"
          let color = "#f59e0b"
          let checkIn = log?.check_in?.time || null
          let checkOut = log?.check_out?.time || null

          if (log?.check_in && log?.check_out) {
            status = "completed"
            label = "Completed (Out of Plan)"
            color = "#10b981"
          }

          if (!map[key]) map[key] = []

          map[key].push({
            id: `${item.id}-${key}-EXTRA`,
            name: item.activity_name,
            project: item.project_name,
            status,
            label,
            color,
            checkIn,
            checkOut,
          })
        }
      })
    }
  })

  return map
}

export const STATUS_CONFIG = {
  completed: { color: "#10b981", label: "Completed", Icon: CheckCircle2,},
  "in-progress": {  color: "#f59e0b",  label: "In Progress",  Icon: Clock,
  },
  planned: {
    color: "#3b82f6",
    label: "Planned",
    Icon: Calendar,
  },
  pending: {
    color: "#9ca3af",
    label: "Planned (Not Checked-in)",
    Icon: AlertCircle,
  },
   "planned-not-checked-in": {
    color: "#9ca3af",
    label: "Planned (Not Checked-in)",
    Icon: AlertCircle,
  },
}

export const getMonthRange = (type = "current") => {
    const today = new Date()
    let start, end

    if (type === "current") {
      start = new Date(today.getFullYear(), today.getMonth(), 1)
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    }

    if (type === "previous") {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      end = new Date(today.getFullYear(), today.getMonth(), 0)
    }

    if (type === "next") {
      start = new Date(today.getFullYear(), today.getMonth() + 1, 1)
      end = new Date(today.getFullYear(), today.getMonth() + 2, 0)
    }

    const formatLocal = (d) => {
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, "0")
      const dd = String(d.getDate()).padStart(2, "0")
      return `${yyyy}-${mm}-${dd}`
    }

    return {
      start: formatLocal(start),
      end: formatLocal(end)
    }
  }

export const formatToDDMMYYYY = (dateValue) => {
    if (!dateValue) return ""

    if (dateValue instanceof Date) {
      const dd = String(dateValue.getDate()).padStart(2, "0")
      const mm = String(dateValue.getMonth() + 1).padStart(2, "0")
      const yyyy = dateValue.getFullYear()
      return `${dd}-${mm}-${yyyy}`
    }

    if (typeof dateValue === "string" && dateValue.includes("-")) {
      const [year, month, day] = dateValue.split("-")
      return `${day}-${month}-${year}`
    }

    return ""
  }

export const getRandomColor = () => {
  const colors = ["#5B8DEF", "#F45B69", "#52B788", "#F59E0B", "#8B5CF6"];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const mapAllocationData = (apiData = []) => {

  if (!Array.isArray(apiData) || apiData.length === 0) {
    return {
      projectsData: [],
      employeeData: []
    };
  }

  const projectMap = {}
  const employeeMap = {}

  /*
    Step 1: Group by
    activity_id + order_item_key + emp_id
    Prefer A over P
  */
  const grouped = {}

  apiData.forEach(item => {
    const key = `${item.activity_id}_${item.order_item_key}_${item.emp_id}`

    if (!grouped[key]) {
      grouped[key] = { P: null, A: null }
    }

    if (item.activity_type === "P") {
      grouped[key].P = item
    }

    if (item.activity_type === "A") {
      if (!grouped[key].A) {
        grouped[key].A = item
      } else {
        grouped[key].A.ts_data_list = [
          ...(grouped[key].A.ts_data_list || []),
          ...(item.ts_data_list || [])
        ]
      }
    }
  })

  /*
    Step 2: Build projectMap + employeeMap
  */
  Object.values(grouped).forEach(group => {

    const data = group.A || group.P
    if (!data) return

    const activity_id    = data.activity_id
    const order_item_key = data.order_item_key
    const project_name   = data.project_name

    const emp_id = data.emp_id
    const employee_name = data.employee_name

    const isWorking = !!group.A  // A = Working | P = Only Assigned

    const planned_start_date = group.P?.start_date || null
    const planned_end_date   = group.P?.end_date || null

    const actual_start_date  = group.A?.start_date || null
    const actual_end_date    = group.A?.end_date || null

    const effort      = group.A?.effort || 0
    const effort_unit = group.A?.effort_unit || null

    const day_logs = buildDayWiseGeo(
      group.A?.ts_data_list || [],
      group.A?.remarks || group.P?.remarks || ""
    )

    const projectKey = `${activity_id}_${order_item_key}`

    /* =================== EMPLOYEE MAP =================== */
    if (!employeeMap[emp_id]) {
      employeeMap[emp_id] = {
        emp_id,
        employee_name,
        color: getRandomColor(),   // ✅ Unique color per employee
        projects: []
      }
    }

    const employeeColor = employeeMap[emp_id].color

    /* =================== PROJECT DATA =================== */
    if (!projectMap[projectKey]) {
      projectMap[projectKey] = {
        activity_id,
        order_item_key,
        project_name,

        planned_start_date,
        planned_end_date,

        total_assigned_employees: 0,
        total_working_employees: 0,

        project_status: "planned",
        project_period_status: "Planned",

        teamMembers: []
      }
    }

    // ✅ Count assigned & working
    projectMap[projectKey].total_assigned_employees += 1
    if (isWorking) {
      projectMap[projectKey].total_working_employees += 1
    }

        // ✅ Update project status if ANY employee is working
    if (isWorking) {
      projectMap[projectKey].project_status = "active"
      projectMap[projectKey].project_period_status = "IN Progress"
    }

    projectMap[projectKey].teamMembers.push({
      emp_id,
      employee_name,
      color: employeeColor,      // ✅ same color everywhere

      type: isWorking ? "A" : "P",

      activity_id,
      order_item_key,
      project_name,

      planned_start_date,
      planned_end_date,

      actual_start_date,
      actual_end_date,

      effort,
      effort_unit,

      day_logs
    })


    /* =================== EMPLOYEE PROJECTS =================== */
    const alreadyAdded = employeeMap[emp_id].projects.some(
      p => p.activity_id === activity_id && p.order_item_key === order_item_key
    )

    if (!alreadyAdded) {
      employeeMap[emp_id].projects.push({
        activity_id,
        order_item_key,
        project_name,

        planned_start_date,
        planned_end_date,

        actual_start_date,
        actual_end_date,

        effort,
        effort_unit,

        project_status: isWorking ? "active" : "planned",
        project_period_status: isWorking ? "IN Progress" : "Planned",

        day_logs
      })
    }

  })


  return {
    projectsData: Object.values(projectMap),
    employeeData: Object.values(employeeMap)
  }
}

export const getStatusVariant = (status) => {
  if (!status) return "secondary";

  const key = status.toUpperCase().replace(/\s+/g, "_");
  const statusMap = {
    SUBMITTED: "info",
    APPROVED: "success",
    COMPLETE: "success",
    COMPLETED: "success",
    REJECTED: "error",
    CANCELLED: "error",
    PENDING: "warning",
    IN_PROGRESS: "primary",
    PLANNED: "notPlanned",
    NOT_PLANNED: "notPlanned"
  };

  return statusMap[key] || "secondary";
};