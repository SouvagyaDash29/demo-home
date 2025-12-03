import React, { useState } from "react"
import styled from "styled-components"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { format } from "date-fns"
import { CheckCircle2, Clock, Calendar, AlertCircle } from "lucide-react"

/* ============================== STYLES ============================== */

const Wrapper = styled.div`
  width: 100%;
`

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`

const IconBtn = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
`

const MonthText = styled.h3`
  margin: 0;
`

const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  font-weight: 600;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  position: relative;
  overflow: visible;
`

const DayCell = styled.div`
  position: relative;
  padding: 8px;
  min-height: 75px;
  border-radius: 10px;
  z-index: 10;
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  background: ${({ $isCurrent, $isHoliday, $isWeekend, theme }) =>
    $isCurrent
      ? theme.colors.primaryLight
      : $isHoliday
      ? theme.colors.secondaryLight
      : $isWeekend
      ? theme.colors.backgroundAlt
      : "#fff"};
  color: ${({ $isCurrent, $isHoliday, theme }) =>
    $isCurrent
      ? theme.colors.primary
      : $isHoliday
      ? theme.colors.secondary
      : theme.colors.text};

  &:hover {
    transform: translateY(-2px);
    transition: 0.2s ease;
  }
`

const DayNumber = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
`

/* ============================ TOOLTIP ============================ */

// const STATUS_CONFIG = {
//   completed: { color: "#10b981", Icon: CheckCircle2, label: "Completed" },
//   "in-progress": { color: "#f59e0b", Icon: Clock, label: "In Progress" },
//   planned: { color: "#3b82f6", Icon: Calendar, label: "Planned" },
//   pending: { color: "#ef4444", Icon: AlertCircle, label: "Pending" },
// }

const STATUS_CONFIG = {
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

const TooltipWrapper = styled.div`
  position: absolute;
    bottom: 110%;
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  color: #fff;
  padding: 14px;
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
  min-width: 280px;
  max-width: 340px;
  z-index: 9;  
 pointer-events: none;

  /* ✅ KEEP INSIDE SCREEN (SATURDAY FIX) */
  @media (max-width: 600px) {
    left: 0;
    transform: translateX(0);
  }
`

const Tooltip = ({ date, tasks }) => {
  if (!tasks?.length) return null

  const grouped = tasks.reduce((acc, task) => {
    acc[task.status] = acc[task.status] || []
    acc[task.status].push(task)
    return acc
  }, {})

  return (
    <TooltipWrapper>
      <div
        style={{
          textAlign: "center",
          fontWeight: 700,
          marginBottom: "10px",
        }}
      >
        {format(date, "EEEE, dd MMMM yyyy")}
      </div>

      {Object.entries(grouped).map(([status, list]) => {
        const cfg = STATUS_CONFIG[status]
        if (!cfg || !list.length) return null

        return (
          <div key={status} style={{ marginBottom: "10px" }}>
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                color: cfg.color,
              }}
            >
              <cfg.Icon size={16} />
              <b>
                {cfg.label} ({list.length})
              </b>
            </div>

            <div style={{ marginLeft: "20px", fontSize: "0.85rem" }}>
              {list.map(task => (
                <div key={task.id} style={{ marginBottom: "6px" }}>
                  • {task.name}
                  {task.checkIn && (
                    <div>🟢 Check-in: {task.checkIn}</div>
                  )}
                  {task.checkOut && (
                    <div>🔴 Check-out: {task.checkOut}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </TooltipWrapper>
  )
}

/* ============================ MAIN ============================ */

const CalendarGridView = ({
  renderBelowDate,
  getCellProps,
  getTooltipData,
  weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
}) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [activeDay, setActiveDay] = useState(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDayIndex = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()

  const changeMonth = (step) => {
    setCurrentDate(new Date(year, month + step, 1))
    setActiveDay(null)
  }

  return (
    <Wrapper>
      {/* HEADER */}
      <CalendarHeader>
        <IconBtn onClick={() => changeMonth(-1)}>
          <FaChevronLeft />
        </IconBtn>

        <MonthText>
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </MonthText>

        <IconBtn onClick={() => changeMonth(1)}>
          <FaChevronRight />
        </IconBtn>
      </CalendarHeader>

      {/* WEEK DAYS */}
      <WeekDays>
        {weekDays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </WeekDays>

      {/* CALENDAR GRID */}
      <Grid>
        {/* EMPTY CELLS */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* DAYS */}
        {Array.from({ length: totalDays }, (_, i) => {
          const day = i + 1
          const fullDate = new Date(year, month, day)

          const dayData = {
            day,
            fullDate,
            month,
            year,
            currentDate,
          }

          const cellProps = getCellProps?.(dayData) || {}

          return (
            <DayCell
              key={day}
              {...cellProps}
              onMouseEnter={() => {
                if (!getTooltipData) return
                const data = getTooltipData(dayData)
                if (data?.tasks?.length) setActiveDay(data)
              }}
              onMouseLeave={() => setActiveDay(null)}
            >
              <DayNumber>{day}</DayNumber>

              {renderBelowDate?.(dayData)}

              {activeDay?.date?.getTime() === fullDate.getTime() && (
                <Tooltip date={fullDate} tasks={activeDay.tasks} />
              )}
            </DayCell>
          )
        })}
      </Grid>
    </Wrapper>
  )
}

export default CalendarGridView
