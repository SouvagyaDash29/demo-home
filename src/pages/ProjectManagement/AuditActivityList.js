import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { MapPin, Clock, Calendar, Package, ClipboardList, Target, Play, Square, CheckCircle, AlertCircle, TrendingUp, ArrowRight } from 'lucide-react';
import { addDays, format, parse, subDays } from 'date-fns';

// Mock data for demonstration


const LOG_DATE_FORMAT = "dd-MMM-yyyy";

const parseLogDate = (dateStr) => {
  if (!dateStr) return null;
  try {
    return parse(dateStr, LOG_DATE_FORMAT, new Date());
  } catch (error) {
    return null;
  }
};

const buildPastLogs = (dayLogs = {}, windowStart, windowEnd) => {
  if (!dayLogs || !windowStart || !windowEnd) return [];

  return Object.entries(dayLogs)
    .map(([dateKey, log]) => {
      const dateObj = parseLogDate(dateKey);
      return { dateKey, dateObj, log };
    })
    .filter(({ dateObj }) => dateObj && dateObj >= windowStart && dateObj <= windowEnd)
    .sort((a, b) => a.dateObj - b.dateObj);
};

const parseISODate = (value) => {
  if (!value) return null;
  const dateObj = new Date(value);
  return Number.isNaN(dateObj.getTime()) ? null : dateObj;
};

const getUpcomingPlannedWindow = (activity, windowStart, windowEnd) => {
  const start = parseISODate(activity?.plannedStartDate);
  const end = parseISODate(activity?.plannedEndDate);
  if (!start || !end || !windowStart || !windowEnd) return null;

  const overlapStart = start < windowStart ? windowStart : start;
  const overlapEnd = end > windowEnd ? windowEnd : end;

  if (overlapStart > overlapEnd) {
    return { start, end, overlapStart: null, overlapEnd: null };
  }

  return { start, end, overlapStart, overlapEnd };
};

const formatDisplayDate = (dateObj, fallback = "-") => {
  if (!dateObj) return fallback;
  try {
    return format(dateObj, "dd MMM yyyy");
  } catch (error) {
    return fallback;
  }
};

// Styled Components
const Container = styled.div`
  padding-left: ${({ theme }) => theme.spacing?.lg || '1.5rem'};
  padding-right: ${({ theme }) => theme.spacing?.lg || '1.5rem'};
  padding-bottom: ${({ theme }) => theme.spacing?.lg || '1.5rem'};
  padding-top: ${({ theme }) => theme.spacing?.xs || '1.5rem'};
  background: ${({ theme }) => theme.colors?.background || '#F8F9FD'};


  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing?.md || '1rem'};
  }

  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing?.sm || '0.5rem'};
  }
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing?.xl || '2rem'};

  @media (max-width: 768px) {
    margin-bottom: ${({ theme }) => theme.spacing?.lg || '1.5rem'};
  }
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors?.text || '#333333'};
  font-size: ${({ theme }) => theme.fontSizes?.['3xl'] || '1.875rem'};
  margin-bottom: ${({ theme }) => theme.spacing?.sm || '0.5rem'};
  font-weight: 800;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes?.['2xl'] || '1.5rem'};
  }

  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.fontSizes?.xl || '1.25rem'};
  }
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors?.textLight || '#666666'};
  font-size: ${({ theme }) => theme.fontSizes?.md || '1rem'};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes?.sm || '0.875rem'};
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing?.sm || '0.5rem'};
  margin-bottom: ${({ theme }) => theme.spacing?.lg || '1.5rem'};
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: ${({ theme }) => theme.spacing?.sm || '0.5rem'} ${({ theme }) => theme.spacing?.md || '1rem'};
  background-color: ${({ theme, active }) => active ? theme.colors?.primary : theme.colors?.card};
  color: ${({ theme, active }) => active ? '#fff' : theme.colors?.text};
  border-radius: ${({ theme }) => theme.borderRadius?.md || '0.5rem'};
  font-size: ${({ theme }) => theme.fontSizes?.sm || '0.875rem'};
  font-weight: 600;
  transition: ${({ theme }) => theme.transitions?.normal || '0.3s ease'};
  box-shadow: ${({ theme }) => theme.shadows?.sm || '0 1px 3px rgba(0, 0, 0, 0.12)'};

  &:hover {
    transform: ${({ theme }) => theme.cardStyle?.animation ? 'translateY(-2px)' : 'none'};
    box-shadow: ${({ theme }) => theme.shadows?.md || '0 4px 6px rgba(0, 0, 0, 0.1)'};
  }

  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing?.xs || '0.375rem'} ${({ theme }) => theme.spacing?.sm || '0.5rem'};
    font-size: ${({ theme }) => theme.fontSizes?.xs || '0.75rem'};
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.md || '1rem'};
`;

const ActivityCard = styled.div`
  background: ${({ theme }) => theme.colors?.card || '#ffffff'};
  border-radius: ${({ theme }) => theme.cardStyle?.borderRadius || theme.borderRadius?.lg || '0.5rem'};
  box-shadow: ${({ theme }) => theme.shadows?.md || '0 4px 6px rgba(0, 0, 0, 0.1)'};
  transition: ${({ theme }) => theme.transitions?.normal || '0.3s ease'};
  display: flex;
  overflow: hidden;
  position: relative;
  border-left: 5px solid ${({ theme, status }) => 
    status === 'completed' ? theme.colors?.success || '#00C853' :
    status === 'in-progress' ? theme.colors?.info || '#2196F3' :
    theme.colors?.warning || '#FFD600'
  };

  &:hover {
    transform: ${({ theme }) => theme.cardStyle?.animation ? 'translateY(-4px)' : 'none'};
    box-shadow: ${({ theme }) => 
      theme.cardStyle?.animation 
        ? theme.shadows?.lg || '0 10px 15px rgba(0, 0, 0, 0.1)' 
        : theme.shadows?.md || '0 4px 6px rgba(0, 0, 0, 0.1)'
    };
  }

  @media (max-width: 968px) {
    flex-direction: column;
  }
`;

const CardLeft = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing?.lg || '1.5rem'};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.md || '1rem'};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing?.md || '1rem'};
    gap: ${({ theme }) => theme.spacing?.sm || '0.5rem'};
  }

  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing?.sm || '0.75rem'};
  }
`;

const CardRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing?.lg || '1.5rem'};
  background: ${({ theme }) => theme.colors?.backgroundAlt || '#F0F2F8'};
  border-left: 1px solid ${({ theme }) => theme.colors?.border || '#E0E0E0'};
  min-width: 220px;
  gap: ${({ theme }) => theme.spacing?.sm || '0.5rem'};

  @media (max-width: 968px) {
    border-left: none;
    border-top: 1px solid ${({ theme }) => theme.colors?.border || '#E0E0E0'};
    flex-direction: row;
    justify-content: flex-end;
    padding: ${({ theme }) => theme.spacing?.md || '1rem'};
    min-width: unset;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const CompanyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing?.md || '1rem'};
  margin-bottom: ${({ theme }) => theme.spacing?.sm || '0.5rem'};

  @media (max-width: 640px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing?.sm || '0.5rem'};
  }
`;

const CompanyName = styled.h3`
  color: ${({ theme }) => theme.colors?.primary || '#6C63FF'};
  font-size: ${({ theme }) => theme.fontSizes?.xl || '1.25rem'};
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.sm || '0.5rem'};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes?.lg || '1.125rem'};
  }

  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.fontSizes?.md || '1rem'};
  }
`;

const PriorityBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: ${({ theme }) => theme.spacing?.xs || '0.25rem'} ${({ theme }) => theme.spacing?.sm || '0.5rem'};
  background: ${({ theme, priority }) => 
    priority === 'high' ? theme.colors?.error + '20' || '#FF3D0020' :
    priority === 'medium' ? theme.colors?.warning + '20' || '#FFD60020' :
    theme.colors?.info + '20' || '#2196F320'
  };
  color: ${({ theme, priority }) => 
    priority === 'high' ? theme.colors?.error || '#FF3D00' :
    priority === 'medium' ? theme.colors?.warning || '#FFD600' :
    theme.colors?.info || '#2196F3'
  };
  border-radius: ${({ theme }) => theme.borderRadius?.md || '0.5rem'};
  font-size: ${({ theme }) => theme.fontSizes?.xs || '0.75rem'};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatusBadge = styled.span`
  padding: ${({ theme }) => theme.spacing?.xs || '0.25rem'} ${({ theme }) => theme.spacing?.md || '1rem'};
  background-color: ${({ theme, status }) => 
    status === 'completed' ? theme.colors?.success || '#00C853' :
    status === 'in-progress' ? theme.colors?.info || '#2196F3' :
    theme.colors?.warning || '#FFD600'
  };
  color: #fff;
  border-radius: ${({ theme }) => theme.borderRadius?.full || '9999px'};
  font-size: ${({ theme }) => theme.fontSizes?.xs || '0.75rem'};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  box-shadow: ${({ theme }) => theme.shadows?.sm || '0 2px 4px rgba(0, 0, 0, 0.1)'};

  @media (max-width: 480px) {
    font-size: 10px;
    padding: 2px ${({ theme }) => theme.spacing?.xs || '0.375rem'};
  }
`;

const ActivityTitle = styled.div`
  color: ${({ theme }) => theme.colors?.textLight || '#666666'};
  font-size: ${({ theme }) => theme.fontSizes?.md || '1rem'};
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing?.xs || '0.25rem'};
`;

const KeyInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing?.md || '1rem'};

  padding: ${({ theme }) => theme.spacing?.md || '1rem'};
  border-radius: ${({ theme }) => theme.borderRadius?.md || '0.5rem'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#E0E0E0'};
`;

const InfoBox = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.sm || '0.5rem'};
`;

// const IconWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 40px;
//   height: 40px;
//   border-radius: ${({ theme }) => theme.borderRadius?.md || '0.5rem'};
//   background: ${({ theme, iconColor }) => iconColor || theme.colors?.primary || '#6C63FF'};
//   color: white;
//   flex-shrink: 0;
//   box-shadow: ${({ theme }) => theme.shadows?.sm || '0 2px 4px rgba(0, 0, 0, 0.1)'};
// `;
const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: ${({ theme, iconColor }) => iconColor || theme.colors?.text || '#6C63FF'};
  flex-shrink: 0;

`;

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.xs || '0.25rem'};
`;

const InfoLabel = styled.span`
  color: ${({ theme }) => theme.colors?.textLight || '#666666'};
  font-size: ${({ theme }) => theme.fontSizes?.xs || '0.75rem'};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors?.text || '#333333'};
  font-size: ${({ theme }) => theme.fontSizes?.sm || '0.875rem'};
  font-weight: 700;
`;

const DateSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.md || '1rem'};
  padding: ${({ theme }) => theme.spacing?.sm || '0.5rem'} ${({ theme }) => theme.spacing?.md || '1rem'};

  border-radius: ${({ theme }) => theme.borderRadius?.md || '0.5rem'};
  border: 1px solid ${({ theme }) => theme.colors?.primary + '30' || '#6C63FF30'};

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing?.xs || '0.25rem'};
  }
`;

const DateBox = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.xs || '0.25rem'};
`;

const DateLabel = styled.span`
  color: ${({ theme }) => theme.colors?.primary || '#6C63FF'};
  font-size: ${({ theme }) => theme.fontSizes?.xs || '0.75rem'};
  font-weight: 700;

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const DateValue = styled.span`
  color: ${({ theme }) => theme.colors?.text || '#333333'};
  font-size: ${({ theme }) => theme.fontSizes?.sm || '0.875rem'};
  font-weight: 700;

  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.fontSizes?.xs || '0.75rem'};
  }
`;

const DateSeparator = styled.span`
  color: ${({ theme }) => theme.colors?.primary || '#6C63FF'};
  font-weight: 700;
  font-size: 1.25rem;

  @media (max-width: 640px) {
    display: none;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors?.backgroundAlt || '#F0F2F8'};
  border-radius: ${({ theme }) => theme.borderRadius?.full || '9999px'};
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors?.info || '#2196F3'};
  width: ${({ progress }) => progress}%;
  transition: width 0.5s ease;
  border-radius: ${({ theme }) => theme.borderRadius?.full || '9999px'};
  box-shadow: ${({ theme }) => theme.shadows?.sm || '0 2px 4px rgba(0, 0, 0, 0.1)'};
`;

const ProgressText = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors?.textLight || '#666666'};
  font-size: ${({ theme }) => theme.fontSizes?.xs || '0.75rem'};
  font-weight: 600;
  margin-top: ${({ theme }) => theme.spacing?.xs || '0.25rem'};
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing?.sm || '0.5rem'} ${({ theme }) => theme.spacing?.md || '1rem'};
  background-color: ${({ theme, variant }) => 
    variant === 'primary' ? theme.colors?.primary || '#6C63FF' :
    variant === 'success' ? theme.colors?.success || '#00C853' :
    variant === 'danger' ? theme.colors?.error || '#FF3D00' :
    theme.colors?.secondary || '#FF6584'
  };
  color: #fff;
  border-radius: ${({ theme }) => theme.buttons?.borderRadius || theme.borderRadius?.md || '0.5rem'};
  font-size: ${({ theme }) => theme.fontSizes?.sm || '0.875rem'};
  font-weight: 700;
  transition: ${({ theme }) => theme.transitions?.normal || '0.3s ease'};
  box-shadow: ${({ theme }) => theme.buttons?.shadow ? theme.shadows?.sm : 'none'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing?.xs || '0.25rem'};
  min-width: 160px;
  white-space: nowrap;

  &:hover:not(:disabled) {
    transform: ${({ theme }) => theme.buttons?.animation ? 'translateY(-2px)' : 'none'};
    box-shadow: ${({ theme }) => theme.buttons?.shadow ? theme.shadows?.md : 'none'};
    filter: brightness(1.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 968px) {
    min-width: 120px;
  }

  @media (max-width: 480px) {
    width: 100%;
    min-width: unset;
    padding: ${({ theme }) => theme.spacing?.sm || '0.5rem'};
    font-size: ${({ theme }) => theme.fontSizes?.xs || '0.75rem'};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing?.['3xl'] || '4rem'} ${({ theme }) => theme.spacing?.lg || '1.5rem'};
  background: ${({ theme }) => theme.colors?.card || '#ffffff'};
  border-radius: ${({ theme }) => theme.cardStyle?.borderRadius || theme.borderRadius?.lg || '0.5rem'};
  box-shadow: ${({ theme }) => theme.shadows?.md || '0 4px 6px rgba(0, 0, 0, 0.1)'};
  
  h3 {
    color: ${({ theme }) => theme.colors?.text || '#333333'};
    margin-bottom: ${({ theme }) => theme.spacing?.md || '1rem'};
    font-size: ${({ theme }) => theme.fontSizes?.xl || '1.25rem'};
  }

  p {
    color: ${({ theme }) => theme.colors?.textLight || '#666666'};
    font-size: ${({ theme }) => theme.fontSizes?.md || '1rem'};
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing?.xl || '2rem'} ${({ theme }) => theme.spacing?.md || '1rem'};
  }
`;

const HistoryList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.xs || '0.5rem'};
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing?.xs || '0.5rem'} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#E0E0E0'};

  &:last-child {
    border-bottom: none;
  }
`;

const HistoryDate = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.text || '#111827'};
`;

const HistoryTime = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  font-size: ${({ theme }) => theme.fontSizes?.xs || '0.75rem'};
  color: ${({ theme }) => theme.colors?.textLight || '#6B7280'};
  text-transform: uppercase;
  font-weight: 600;
`;

const HistoryEmpty = styled.div`
  font-size: ${({ theme }) => theme.fontSizes?.xs || '0.75rem'};
  color: ${({ theme }) => theme.colors?.textLight || '#6B7280'};
  font-weight: 600;
`;

const StatusHint = styled.div`
  font-size: ${({ theme }) => theme.fontSizes?.xs || '0.75rem'};
  color: ${({ theme }) => theme.colors?.textLight || '#6B7280'};
  font-weight: 600;
  text-align: center;
`;

// Main Component
const AuditActivityList =  ({ 
  projects, 
  onStart, 
  onComplete, 
  submittingProjectId,
  onContinue,
  isTodayView = false,
  dayFilter = "today"
}) => {
  const [activities, setActivities] = useState(projects);
  const [filter, setFilter] = useState('all');

  console.log("activities", JSON.stringify(activities))

  const isPastView = dayFilter === "past7";
  const isUpcomingView = dayFilter === "next7";
  const today = new Date();
  const pastWindowStart = subDays(today, 7);
  const upcomingWindowStart = addDays(today, 1);
  const upcomingWindowEnd = addDays(today, 7);


  useEffect(() => {
  if (!projects || !projects.length) {
    setActivities([])
    return
  }

  const transformed = projects.map((item) => ({
    id: item.id,
    activityId: item.activity_id,

    customerName: item?.original_A?.customer_name || "Customer Name",
    orderItemKey: item?.original_A?.order_item_key || "Order Item Key",
    AuditType: item?.original_A?.product_name || "Audit Type",
    companyName: item.company_name || "Company Name",
    activityName: item.project_name || "Not Found",

    plannedStartDate: item.planned_start_date,
    plannedEndDate: item.planned_end_date,

    actualStartDate: item.actual_start_date,
    actualEndDate: item.actual_end_date,

    location: item.location || "N/A",
    shift: item.shift || "N/A",

    // ✅ from nested object
    unitsToAudit: item?.original_P?.no_of_items || 0,
    completedUnits: item?.original_A?.no_of_items || 0,

    auditType: item?.original_P?.activity_type || "N/A",
    priority: "medium", // default since not in API

    duration: {
      value: item.effort || 0,
      unit: item.effort_unit || "hours"
    },

    status: item.project_status?.toLowerCase(),              // active | planned | completed
    statusText: item.project_period_status || item.status_display,

    show_start_button: item.show_start_button,
    show_end_button: item.show_end_button,

    original_P: item.original_P,
    original_A: item.original_A,
    day_logs: item.day_logs
  }))

  setActivities(transformed)
}, [projects])


  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.status === filter;
  });

  const getProgress = (activity) => {
    if (activity.status === 'completed') return 100;
    if (activity.status === 'pending') return 0;
    
    const start = new Date(activity.plannedStartDate);
    const end = new Date(activity.plannedEndDate);
    const now = new Date();
    const total = end - start;
    const elapsed = now - start;
    
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

const formatDuration = (duration = {}) => {
  const value = duration?.value ?? 0;
  const unit = duration?.unit ?? "unit";
  return `${value} ${unit}${value > 1 ? "s" : ""}`;
};

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isPlannedEndToday = (activity) => {
  if (!activity?.plannedEndDate) return false

  const today = new Date()
  const plannedEnd = new Date(activity.plannedEndDate)

  return today.toDateString() === plannedEnd.toDateString()
}


  return (
    <>
    <Container>
      <ActivityList>
        {filteredActivities.length === 0 ? (
          <EmptyState>
            <h3>No activities found</h3>
            <p>There are no audit activities matching your current filter.</p>
          </EmptyState>
        ) : (
          filteredActivities.map((activity) => {
            const pastLogs = isPastView
              ? buildPastLogs(activity.day_logs, pastWindowStart, today)
              : [];

            const upcomingPlan = isUpcomingView
              ? getUpcomingPlannedWindow(activity, upcomingWindowStart, upcomingWindowEnd)
              : null;
            const showStartActions = isTodayView && activity.show_start_button;
            const showEndActions = isTodayView && activity.show_end_button;
            const showCompletedNote =
              isTodayView && activity.hasTodayCheckIn && activity.hasTodayCheckOut;

            return (
            <ActivityCard key={activity.id} status={activity.status}>
              <CardLeft>
                <CompanyHeader>
                  <div>
                    <CompanyName>
                      {activity.customerName}
                      {/* <PriorityBadge priority={activity.priority}>
                        {getPriorityIcon(activity.priority)}
                        {activity.priority}
                      </PriorityBadge> */}
                  <StatusBadge status={activity.status}>
                    {activity.statusText}

                  </StatusBadge>
                    </CompanyName>
                    <ActivityTitle>{activity.orderItemKey}</ActivityTitle>
                  </div>
                </CompanyHeader>

                <KeyInfoGrid>
                  <InfoBox>
                    <IconWrapper iconColor="#10b981">
                      <MapPin size={20} />
                    </IconWrapper>
                    <InfoContent>
                      <InfoLabel>Audit Type</InfoLabel>
                      <InfoValue>{activity.AuditType}</InfoValue>
                    </InfoContent>
                  </InfoBox>
                  {/* <InfoBox>
                    <IconWrapper iconColor="#ef4444">
                      <MapPin size={20} />
                    </IconWrapper>
                    <InfoContent>
                      <InfoLabel>Location</InfoLabel>
                      <InfoValue>{activity.location}</InfoValue>
                    </InfoContent>
                  </InfoBox> */}

                  {/* <InfoBox>
                    <IconWrapper iconColor="#f59e0b">
                      <Clock size={20} />
                    </IconWrapper>
                    <InfoContent>
                      <InfoLabel>Shift</InfoLabel>
                      <InfoValue>{activity.shift}</InfoValue>
                    </InfoContent>
                  </InfoBox> */}

                  <InfoBox>
                    <IconWrapper iconColor="#3b82f6">
                      <Calendar size={20} />
                    </IconWrapper>
                    <InfoContent>
                      <InfoLabel>Planned Date</InfoLabel>
                      <InfoValue>{formatDate(activity.plannedStartDate)} - {formatDate(activity.plannedEndDate)}</InfoValue>
                    </InfoContent>
                  </InfoBox>

                  {/* <InfoBox>
                    <IconWrapper iconColor="#3b82f6">
                      <Calendar size={20} />
                    </IconWrapper>
                    <InfoContent>
                      <InfoLabel>Duration</InfoLabel>
                      <InfoValue>{formatDuration(activity?.duration)}</InfoValue>
                    </InfoContent>
                  </InfoBox> */}

                  <InfoBox>
                    <IconWrapper iconColor="#8b5cf6">
                      <Package size={20} />
                    </IconWrapper>
                    <InfoContent>
                      <InfoLabel>Units to Audit</InfoLabel>
                      <InfoValue>{activity.unitsToAudit} units</InfoValue>
                    </InfoContent>
                  </InfoBox>

                  {/* <InfoBox>
                    <IconWrapper iconColor="#10b981">
                      <ClipboardList size={20} />
                    </IconWrapper>
                    <InfoContent>
                      <InfoLabel>Audit Type</InfoLabel>
                      <InfoValue>{activity.auditType}</InfoValue>
                    </InfoContent>
                  </InfoBox> */}

                  {/* <InfoBox>
                    <IconWrapper iconColor="#ec4899">
                      <Target size={20} />
                    </IconWrapper>
                    <InfoContent>
                      <InfoLabel>Priority</InfoLabel>
                      <InfoValue>{activity.priority.toUpperCase()}</InfoValue>
                    </InfoContent>
                  </InfoBox> */}
                </KeyInfoGrid>

                {isPastView && (
                  <DateSection>
                    <HistoryList>
                      {pastLogs.length > 0 ? (
                        pastLogs.map(({ dateKey, dateObj, log }) => {
                          const checkInLabel = log?.check_in?.time ? `IN ${log.check_in.time}` : "NO CHECK-IN";
                          const checkOutLabel = log?.check_out?.time ? `OUT ${log.check_out.time}` : "NO CHECK-OUT";
                          return (
                            <HistoryItem key={dateKey}>
                              <HistoryDate>{formatDisplayDate(dateObj)}</HistoryDate>
                              <HistoryTime>
                                <span>{checkInLabel}</span>
                                <span>{checkOutLabel}</span>
                              </HistoryTime>
                            </HistoryItem>
                          )
                        })
                      ) : (
                        <HistoryEmpty>No check-in/out logs in this window</HistoryEmpty>
                      )}
                    </HistoryList>
                  </DateSection>
                )}

                {isUpcomingView && (
                  <DateSection>
                    {/* <DateBox>
                      <DateLabel>Planned Schedule</DateLabel>
                      <DateValue>
                        {activity.plannedStartDate && activity.plannedEndDate
                          ? `${formatDate(activity.plannedStartDate)} - ${formatDate(activity.plannedEndDate)}`
                          : "Schedule not available"}
                      </DateValue>
                    </DateBox> */}
                    {upcomingPlan?.overlapStart && upcomingPlan?.overlapEnd && (
                      <>
                        {/* <DateSeparator>→</DateSeparator> */}
                        <DateBox>
                          <DateLabel>Upcoming Activity Dates</DateLabel>
                          <DateValue>
                            {`${formatDisplayDate(upcomingPlan.overlapStart)} - ${formatDisplayDate(upcomingPlan.overlapEnd)}`}
                          </DateValue>
                        </DateBox>
                      </>
                    )}
                  </DateSection>
                )}

                {/* <DateSection>
                  <DateBox>
                    <DateLabel>Start:</DateLabel>
                    <DateValue>{formatDate(activity.plannedStartDate)}</DateValue>
                  </DateBox>
                  <DateSeparator>→</DateSeparator>
                  <DateBox>
                    <DateLabel>End:</DateLabel>
                    <DateValue>{formatDate(activity.plannedEndDate)}</DateValue>
                  </DateBox>
</DateSection> */}
            {/* {activity.status === 'in-progress' && (
              <>
                <ProgressBar>
                  <ProgressFill progress={getProgress(activity)} />
                </ProgressBar>
                <ProgressText>{Math.round(getProgress(activity))}% Complete</ProgressText>
              </>
            )} */}
          </CardLeft>

<CardRight>
  {isTodayView && (
    <>
      {showStartActions && (
        <Button
          variant="primary"
          onClick={() => onStart(activity)}
          disabled={submittingProjectId === activity.id}
        >
          <Play size={18} />
          Start Activity
        </Button>
      )}

      {showEndActions && (
        <>
          {isPlannedEndToday(activity) ? (
            <>
              <Button
                variant="success"
                onClick={() => onComplete && onComplete(activity)}
                disabled={submittingProjectId === activity.id}
              >
                <CheckCircle size={18} />
                Mark as Complete
              </Button>

              <Button
                variant="secondary"
                onClick={() => onContinue && onContinue(activity, true)}
                disabled={submittingProjectId === activity.id}
              >
                <ArrowRight size={18} />
                Continue Activity Tomorrow
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={() => onContinue && onContinue(activity, false)}
                disabled={submittingProjectId === activity.id}
              >
                <ArrowRight size={18} />
                Continue Activity Tomorrow
              </Button>

              <Button
                variant="success"
                onClick={() => onComplete && onComplete(activity)}
                disabled={submittingProjectId === activity.id}
              >
                <CheckCircle size={18} />
                Mark as Complete
              </Button>
            </>
          )}
        </>
      )}

      {/* {activity.status === "completed" &&
        !activity.show_start_button &&
        !activity.show_end_button && (
          <Button variant="success" disabled>
            <CheckCircle size={18} />
            Completed
          </Button>
        )} */}
      {!showStartActions && !showEndActions && showCompletedNote && (
        <StatusHint>Today's check-in and check-out are already completed</StatusHint>
      )}
    </>
  ) 
  // : (
  //   <Button variant="secondary" disabled>
  //     No act
  //   </Button>
  // )
  }
</CardRight>

            </ActivityCard>
            )
          })
    )}
  </ActivityList>
</Container>
</>
);
};
export default AuditActivityList;