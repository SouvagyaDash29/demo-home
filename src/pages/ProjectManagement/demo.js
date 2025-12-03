import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Building2,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  ChevronDown,
  Package,
  Timer,
  FileText,
  MapPin
} from 'lucide-react';
import { getCurrentDateTimeDefaults, getTodayApiDateStr } from './utils/utils';
import Button from '../../components/Button';
import { CalendarEvent } from 'react-bootstrap-icons';

// ====================== Styled Components with Theme ======================
const Container = styled.div`
  max-width: ${({ theme }) => 
    theme.layout?.containerWidth === 'narrow' ? '800px' :
    theme.layout?.containerWidth === 'wide' ? '1400px' : '1200px'};
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes?.xl || '1.5rem'};
  font-weight: ${({ theme }) => theme.fontWeights?.heading || '600'};
  color: ${({ theme }) => theme.colors?.primary || '#6C63FF'};
`;

const CardHover = styled.div`
  background: ${({ theme }) => theme.colors?.card || '#fff'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e0e0e0'};
  border-radius: ${({ theme }) => theme.cardStyle?.borderRadius || '12px'};
  padding: ${({ theme }) => theme.spacing?.lg || '1rem'};
  margin-bottom: ${({ theme }) => theme.spacing?.md || '1rem'};
  box-shadow: ${({ theme }) => theme.shadows?.md || '0 4px 6px rgba(0, 0, 0, 0.1)'};
  transition: ${({ theme }) => theme.transitions?.normal || 'all 0.3s ease'};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors?.primary || '#6C63FF'};
    box-shadow: ${({ theme }) => 
      theme.cardStyle?.shadow === 'heavy' ? '0 10px 20px rgba(108,99,255,0.2)' :
      theme.shadows?.lg || '0 4px 12px rgba(108,99,255,0.15)'};
    transform: ${({ theme }) => 
      theme.cardStyle?.animation ? 'translateY(-2px)' : 'none'};
  }
`;

const Flex = styled.div`
  display: grid;
 grid-template-columns: ${({ filterType }) => filterType === 'today' ? '5fr 1fr' : '1fr'};
  gap: ${({ theme }) => theme.spacing?.xl || '3rem'};
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing?.md || '1rem'};
  }
`;

const Info = styled.div`
  flex: 1;
  min-width: 0
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing?.sm || '0.5rem'};
  min-width: 180px;
  
  @media (max-width: 968px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
`;

const Company = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes?.lg || '1.125rem'};
  font-weight: ${({ theme }) => theme.fontWeights?.heading || '600'};
  margin: 0 0 ${({ theme }) => theme.spacing?.xs || '0.25rem'};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.sm || '0.5rem'};
  color: ${({ theme }) => theme.colors?.text || '#333'};
`;

const Order = styled.div`
  font-family: 'Courier New', monospace;
  font-size: ${({ theme }) => theme.fontSizes?.sm || '0.8rem'};
  color: ${({ theme }) => theme.colors?.textLight || '#666'};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.xs || '0.4rem'};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing?.md || '0.75rem'};
  margin: ${({ theme }) => theme.spacing?.md || '1rem'} 0;
`;

const Item = styled.div`
  font-size: ${({ theme }) => theme.fontSizes?.sm || '0.85rem'};
  color: ${({ theme }) => theme.colors?.text || '#000'};
`;

const Label = styled.div`
  color: ${({ theme }) => theme.colors?.textLight || '#666'};
  font-size: ${({ theme }) => theme.fontSizes?.xs || '0.75rem'};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.xs || '0.25rem'};
  margin-bottom: ${({ theme }) => theme.spacing?.xs || '0.2rem'};
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.xs || '0.25rem'};
  padding: ${({ theme }) => theme.spacing?.xs || '0.25rem'} ${({ theme }) => theme.spacing?.sm || '0.6rem'};
  border-radius: ${({ theme }) => theme.borderRadius?.md || '6px'};
  font-size: ${({ theme }) => theme.fontSizes?.xs || '0.75rem'};
  font-weight: 600;
  background: ${({ s, theme }) =>
    s === 'Started' || s === 'In Progress' ? theme.colors?.info || '#2196F3' :
    s === 'Completed' ? theme.colors?.success || '#00C853' :
    s === 'Pending' || s === 'Planned' ? theme.colors?.warning || '#FFD600' : '#666'};
  color: ${({ s }) => (s === 'Pending' || s === 'Planned' ? '#000' : '#fff')};
`;

const Progress = styled.div`
  margin: ${({ theme }) => theme.spacing?.md || '0.75rem'} 0;
`;

const Bar = styled.div`
  height: 6px;
  background: ${({ theme }) => theme.colors?.backgroundAlt || '#f0f2f8'};
  border-radius: ${({ theme }) => theme.borderRadius?.full || '999px'};
  overflow: hidden;
`;

const Fill = styled.div`
  height: 100%;
  width: ${({ p }) => p}%;
  background: ${({ theme }) => theme.colors?.primary || '#6C63FF'};
  transition: ${({ theme }) => theme.transitions?.normal || 'width 0.4s ease'};
`;

const LogsSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing?.md || '1rem'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e0e0e0'};
  border-radius: ${({ theme }) => theme.borderRadius?.md || '8px'};
  overflow: hidden;
`;

const LogsHeader = styled.div`
  background: ${({ theme }) => theme.colors?.backgroundAlt || '#f8f9fc'};
  padding: ${({ theme }) => theme.spacing?.sm || '0.5rem'} ${({ theme }) => theme.spacing?.md || '0.75rem'};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSizes?.sm || '0.85rem'};
  transition: ${({ theme }) => theme.transitions?.fast || '0.2s ease'};
  
  &:hover {
    background: ${({ theme }) => theme.colors?.primaryLight || '#E8E6FF'};
  }
`;

const LogsToggle = styled.div`
color: "#666";
  transition: ${({ theme }) => theme.transitions?.normal || 'transform 0.3s ease'};
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const LogsContent = styled.div`
  max-height: ${({ isOpen }) => (isOpen ? '400px' : '0')};
  overflow: hidden;
  transition: ${({ theme }) => theme.transitions?.normal || 'max-height 0.3s ease'};
`;

const LogsGrid = styled.div`
  display: grid;
  gap: 1px;
  background-color: ${({ theme }) => theme.colors?.border || '#e0e0e0'};
`;

const LogRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
  gap: ${({ theme }) => theme.spacing?.md || '1rem'};
  align-items: center;
  padding: ${({ theme }) => theme.spacing?.sm || '0.5rem'} ${({ theme }) => theme.spacing?.md || '0.75rem'};
  background: ${({ theme }) => theme.colors?.card || '#fff'};
  font-size: ${({ theme }) => theme.fontSizes?.sm || '0.8rem'};
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing?.xs || '4px'};
  }
`;

const LogDate = styled.span`
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.xs || '4px'};
  color: ${({ theme }) => theme.colors?.textLight || '#666'};
`;

const LogTime = styled.span`
  color: ${({ theme }) => theme.colors?.textLight || '#666'};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.xs || '4px'};
`;

const LogStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing?.sm || '0.5rem'};
  align-items: center;
`;

const LogBadge = styled.span`
  background: ${({ theme }) => theme.colors?.backgroundAlt || '#f0f2f8'};
  color: ${({ theme }) => theme.colors?.text || '#333'};
  padding: 3px 8px;
  border-radius: ${({ theme }) => theme.borderRadius?.sm || '4px'};
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSizes?.xs || '0.75rem'};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.xs || '4px'};
`;

const LogRemark = styled.div`
  grid-column: 1 / -1;
  color: ${({ theme }) => theme.colors?.textLight || '#666'};
  font-style: italic;
  padding-top: ${({ theme }) => theme.spacing?.xs || '4px'};
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing?.xs || '4px'};
`;

const NoLogsMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing?.md || '1rem'};
  color: ${({ theme }) => theme.colors?.textLight || '#999'};
  background: ${({ theme }) => theme.colors?.card || '#fff'};
`;

const DetailValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes?.sm || '0.875rem'};
  color: ${({ theme }) => theme.colors?.text || '#333333'};
  font-weight: 500;
`;

const PrimaryBtn = styled(Button)`
  background: ${({ theme }) => theme.colors?.primary || '#6C63FF'};
  color: #fff;
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors?.primaryLight || '#5a52e0'};
  }
`;

const SuccessBtn = styled(Button)`
  background: ${({ theme }) => theme.colors?.success || '#00C853'};
  color: #fff;
  font-size: 16px;
  
  &:hover:not(:disabled) {
    background: #00b347;
  }
`;

const SecondaryBtn = styled(Button)`
  background: ${({ theme }) => theme.colors?.card || '#fff'};
  color: ${({ theme }) => theme.colors?.text || '#333'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#ddd'};
  font-size: 11px;
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors?.backgroundAlt || '#f5f5f5'};
  }
`;

export const ActivityCard = ({ activity, filterType, onAction }) => {
  const [isLogsOpen, setIsLogsOpen] = useState(false);

  const progress = activity.total_no_of_items || 0;
  const totalEffort = activity.original_P.no_of_items || 0;

  const isActivityStart = !!activity.original_A;

  // today's log (safe)
  const todayLog = activity.day_logs?.[getTodayApiDateStr()] || {};
  const todayCheckedIn = !!todayLog.check_in;
  const todayCheckedOut = !!todayLog.check_out;

  const {todayISO} = getCurrentDateTimeDefaults();

const TodayBtnComponent = activity.planned_end_date === getTodayApiDateStr() ? SuccessBtn : SecondaryBtn;
  console.log("activity", TodayBtnComponent );


  return (
    <CardHover>
      <Flex filterType={filterType}>
        <Info>
          <div>
            <Company><Building2 size={18} />{activity.customer_name}</Company>
            <Order><FileText size={14} />{activity.project_code || activity.order_item_key}</Order>
          </div>

          <Grid>
            <Item><Label><FileText size={14} />Audit Type</Label><DetailValue>{activity.audit_type}</DetailValue></Item>
            <Item><Label><Package size={14} />Total No. of Item Audit</Label><DetailValue>{activity.original_P.no_of_items || 0}</DetailValue></Item>
            <Item><Label>Project Status</Label><Badge s={activity.project_period_status || activity.todaysStatus}>
              <StatusIcon status={activity.project_period_status || activity.todaysStatus} />
              {activity.project_period_status || activity.todaysStatus}
            </Badge></Item>

              <Item><Label><CalendarEvent size={14} />Planned Date</Label><DetailValue>{activity.planned_start_date} to {activity.planned_end_date}</DetailValue></Item>
          </Grid>

          <ProgressBar completed={progress} total={totalEffort} label="Effort Progress" />

         {filterType === "past7" && 
          <ActivityLogs
            logs={activity.day_logs}
            isOpen={isLogsOpen}
            onToggle={() => setIsLogsOpen(!isLogsOpen)}
          />}
        </Info>

        {filterType === "today" && (
          <Actions>
            <TodayActionButtons
              activity={activity}
              todayCheckedIn={todayCheckedIn}
              todayCheckedOut={todayCheckedOut}
              isActivityStart={isActivityStart}
              hasPendingCheckout={activity.hasPendingCheckout}
              pendingCheckoutDate={activity.pendingCheckoutDate}
              complete={activity.complete}
              onAction={onAction}
              todayISO={todayISO}
              getTodayApiDateStr={getTodayApiDateStr}
            />
          </Actions>
        )}
      </Flex>
    </CardHover>
  );
};

//Status Icon
const StatusIcon = ({ status }) => {
  if (status === 'Started' || status === 'In Progress') return <TrendingUp size={16} />;
  if (status === 'Completed') return <CheckCircle2 size={16} />;
  return <PauseCircle size={16} />;
};

//ProgressBar for audit Items
const ProgressBar = ({ completed, total, label = 'Progress' }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <Progress>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.8rem' }}>
        <span style={{color: "#666"}}>{label}</span>
        {/* <strong style={{color: "#666"}}>{percentage}%</strong> */}
      </div>
      <Bar><Fill p={percentage} /></Bar>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>
        {/* <span>{completed}h spent</span> */}
        <span>{completed}</span>
        {/* <span>{total}h total</span> */}
        <span>{total}</span>
      </div>
    </Progress>
  );
};

//Yesterday Activity 
const ActivityLogs = ({ logs, isOpen, onToggle }) => {
  const logEntries = Object.values(logs || {});

  return (
    <LogsSection>
      <LogsHeader onClick={onToggle}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: "#666" }}>
          <FileText size={16} /> Activity Logs <span style={{ fontWeight: 400 }}>({logEntries.length})</span>
        </span>
        <LogsToggle isOpen={isOpen}><ChevronDown size={18}  /></LogsToggle>
      </LogsHeader>
      <LogsContent isOpen={isOpen}>
        {logEntries.length === 0 ? (
          <NoLogsMessage>No activity recorded yet</NoLogsMessage>
        ) : (
          <LogsGrid>
            {logEntries.map((log, i) => (
              <LogRow key={i}>
                <LogDate><Calendar size={14} />{log.date}</LogDate>
                <LogTime><Clock size={14} />{log.check_in?.time} - {log.check_out?.time || '—'}</LogTime>
                <LogStats>
                  <LogBadge><Timer size={12} />Effort : {log.effort}h</LogBadge>
                  <LogBadge><Package size={12} />No of item audit: {log.no_of_items}</LogBadge>
                </LogStats>
                {log.remarks && (
                  <LogRemark><FileText size={14} />{log.remarks || "No Remarks found"}</LogRemark>
                )}
              </LogRow>
            ))}
          </LogsGrid>
        )}
      </LogsContent>
    </LogsSection>
  );
};
const StatusMessage = ({ children }) => (
  <div style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
    <CheckCircle2 size={18} />
    {children}
  </div>
);

// Dedicated Today Action Buttons — Clean, Readable, No Nesting Hell
const TodayActionButtons = ({
  activity,
  todayCheckedIn,
  todayCheckedOut,
  isActivityStart,
  hasPendingCheckout,
  pendingCheckoutDate,
  complete,
  onAction,
  todayISO,
  getTodayApiDateStr,
}) => {
  const todayApiDate = getTodayApiDateStr();
  const plannedEnd = activity.planned_end_date || activity.original_P?.planned_end_date;
  const isPlannedEndToday = plannedEnd === todayISO;

  // 1. Fully complete
  if (complete) {
    return <StatusMessage>Project is complete</StatusMessage>;
  }

  // 2. Completed for today
  if (todayCheckedIn && todayCheckedOut) {
    return <StatusMessage>Project is completed for today</StatusMessage>;
  }

  // 3. Pending checkout from yesterday
  if (hasPendingCheckout && pendingCheckoutDate !== todayApiDate) {
    return (
      <PrimaryBtn size="md" onClick={() => onAction({ type: "checkout_yesterday", activity })}>
        <CheckCircle2 /> Checkout For Yesterday
      </PrimaryBtn>
    );
  }

  // 4. Checked in today → Show Complete / Continue Tomorrow
  if (todayCheckedIn && !todayCheckedOut) {
    return isPlannedEndToday ? (
      <>
        <SuccessBtn size="lg" onClick={() => onAction({ type: "complete", activity })}>
          <CheckCircle2 /> Completed
        </SuccessBtn>
        <SecondaryBtn size="sm" onClick={() => onAction({ type: "continue", activity })}>
          <PauseCircle /> Continue Tomorrow
        </SecondaryBtn>
      </>
    ) : (
      <>
        <SuccessBtn size="sm" onClick={() => onAction({ type: "continue", activity })}>
          <PauseCircle /> Continue Tomorrow
        </SuccessBtn>
        <SecondaryBtn size="lg" onClick={() => onAction({ type: "complete", activity })}>
          <CheckCircle2 /> Completed
        </SecondaryBtn>
      </>
    );
  }

  // 5. Not checked in today
  if (!todayCheckedIn) {
    if (isActivityStart) {
      return (
        <PrimaryBtn size="md" onClick={() => onAction({ type: "resume", activity })}>
          <PlayCircle /> Resume Activity
        </PrimaryBtn>
      );
    }
    return (
      <PrimaryBtn size="md" onClick={() => onAction({ type: "start", activity })}>
        <PlayCircle /> Start Activity
      </PrimaryBtn>
    );
  }

  // 6. Fallback: Awaiting start (future scheduled)
  return (
    <SecondaryBtn size="md" disabled>
      <Clock /> Awaiting Start
    </SecondaryBtn>
  );
};