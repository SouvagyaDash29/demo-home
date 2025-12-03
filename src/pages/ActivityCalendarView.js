import React, { useState } from 'react';
import styled from 'styled-components';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, Calendar, AlertCircle } from 'lucide-react';

// ────────────────────────────── Dummy Data ──────────────────────────────
const tasksByDate = {
  '2025-11-10': [
    { id: 1, name: 'Morning Standup', status: 'completed' },
    { id: 2, name: 'Fix Login Bug', status: 'completed' },
    { id: 3, name: 'Deploy to Staging', status: 'in-progress' },
  ],
  '2025-11-15': [
    { id: 4, name: 'Design New Dashboard', status: 'in-progress' },
    { id: 5, name: 'Client Call', status: 'planned' },
    { id: 6, name: 'Write Unit Tests', status: 'pending' },
  ],
  '2025-11-18': [
    { id: 7, name: 'Code Review PR#123', status: 'completed' },
    { id: 8, name: 'API Documentation', status: 'planned' },
    { id: 9, name: 'Database Migration', status: 'pending' },
    { id: 10, name: 'Feature: Dark Mode', status: 'in-progress' },
  ],
  '2025-11-25': [
    { id: 11, name: 'Sprint Planning', status: 'planned' },
    { id: 12, name: 'Retrospective Meeting', status: 'planned' },
  ],
};

// ────────────────────────────── Status Config (DRY) ──────────────────────────────
const STATUS_CONFIG = {
  completed: { color: '#10b981', Icon: CheckCircle2, label: 'Completed' },
  'in-progress': { color: '#f59e0b', Icon: Clock, label: 'In Progress' },
  planned: { color: '#3b82f6', Icon: Calendar, label: 'Planned' },
  pending: { color: '#ef4444', Icon: AlertCircle, label: 'Pending' },
};

// ────────────────────────────── Styled Components ──────────────────────────────
const CalendarWrapper = styled.div`
  max-width: 1000px;
  margin: 20px auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f9fafb;
  padding: 16px;
  border-radius: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  margin-bottom: 12px;
`;

const NavButton = styled.button`
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
  &:hover { background: rgba(255,255,255,0.3); transform: scale(1.1); }
`;

const MonthTitle = styled.h2`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
`;

const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 4px;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #d1d5db;
  border-radius: 12px;
  overflow: hidden;
`;

const DayCell = styled.div`
  background: ${({ isCurrentMonth }) => (isCurrentMonth ? '#ffffff' : '#f9fafb')};
  min-height: 76px;
  padding: 6px 4px;
  cursor: ${({ hasTasks }) => (hasTasks ? 'pointer' : 'default')};
  transition: all 0.2s ease;
  position: relative;

  ${({ isToday }) => isToday && `
    outline: 2px solid #6366f1;
    outline-offset: -2px;
  `}

  ${({ hasTasks }) => hasTasks && `
    &:hover {
      transform: translateY(-4px) scale(1.06);
      z-index: 10;
      box-shadow: 0 12px 24px rgba(0,0,0,0.18);
    }
  `}

  opacity: ${({ isCurrentMonth }) => (isCurrentMonth ? 1 : 0.45)};
`;

const DayNumber = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ hasTasks }) => (hasTasks ? '#6366f1' : '#374151')};
  margin-bottom: 4px;
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  background: #f3f4f6;
  padding: 2px 5px;
  border-radius: 6px;
  font-size: 0.65rem;
  font-weight: 600;
  color: ${({ color }) => color};

  svg {
    width: 10px;
    height: 10px;
  }
`;

const Tooltip = styled.div`
  position: fixed;
  background: #1f2937;
  color: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.3);
  z-index: 9999;
  min-width: 300px;
  max-width: 380px;
  pointer-events: none;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.25s ease;
`;

const TooltipTitle = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #374151;
`;

// ────────────────────────────── Component ──────────────────────────────
const ActivityCalendarView= () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tooltip, setTooltip] = useState({ visible: false, date: null, tasks: [] });

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstWeekday = getDay(monthStart);
  const cells = Array(42).fill(null);
  days.forEach((day, i) => {
    cells[firstWeekday + i] = day;
  });

  const getTasks = (date) => {
    if (!date) return [];
    const key = format(date, 'yyyy-MM-dd');
    return tasksByDate[key] || [];
  };

  const groupByStatus = (tasks) =>
    tasks.reduce((acc, task) => {
      acc[task.status] = acc[task.status] || [];
      acc[task.status].push(task);
      return acc;
    }, {});

  const handleMouseEnter = (e, date) => {
    const tasks = getTasks(date);
    if (tasks.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      date,
      tasks,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  return (
    <CalendarWrapper>
      <Header>
        <NavButton onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft size={20} />
        </NavButton>
        <MonthTitle>{format(currentMonth, 'MMMM yyyy')}</MonthTitle>
        <NavButton onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight size={20} />
        </NavButton>
      </Header>

      <WeekDays>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d}>{d}</div>
        ))}
      </WeekDays>

      <DaysGrid>
        {cells.map((date, i) => {
          const tasks = getTasks(date);
          const grouped = groupByStatus(tasks);
          const hasTasks = tasks.length > 0;
          const isToday = date && format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          const isCurrentMonth = date && date.getMonth() === currentMonth.getMonth();

          return (
            <DayCell
              key={i}
              hasTasks={hasTasks}
              isToday={isToday}
              isCurrentMonth={isCurrentMonth}
              onMouseEnter={(e) => handleMouseEnter(e, date)}
              onMouseLeave={handleMouseLeave}
            >
              {date && (
                <>
                  <DayNumber hasTasks={hasTasks}>{format(date, 'd')}</DayNumber>
                  {hasTasks && (
                    <BadgeContainer>
                      {Object.entries(grouped).map(([status, list]) => {
                        const cfg = STATUS_CONFIG[status];
                        if (!cfg) return null;
                        return (
                          <StatusBadge key={status} color={cfg.color}>
                            <cfg.Icon />
                            <span>{list.length}</span>
                          </StatusBadge>
                        );
                      })}
                    </BadgeContainer>
                  )}
                </>
              )}
            </DayCell>
          );
        })}
      </DaysGrid>

      {/* Hover Tooltip */}
      {tooltip.visible && tooltip.date && (
        <Tooltip $visible={tooltip.visible}>
          <TooltipTitle>
            {format(tooltip.date, 'EEEE, dd MMMM yyyy')}
          </TooltipTitle>
          {Object.entries(groupByStatus(tooltip.tasks)).map(([status, tasks]) => {
            const cfg = STATUS_CONFIG[status];
            if (!cfg || tasks.length === 0) return null;
            return (
              <div key={status} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: cfg.color }}>
                  <cfg.Icon size={16} />
                  <strong>{cfg.label} ({tasks.length})</strong>
                </div>
                <div style={{ marginLeft: '24px', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {tasks.map(t => (
                    <div key={t.id}>• {t.name}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </Tooltip>
      )}
    </CalendarWrapper>
  );
};

export default ActivityCalendarView;