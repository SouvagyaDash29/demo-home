import React, { useState } from 'react';
import styled from 'styled-components';

// Styled components
const CardContainer = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-left: 4px solid ${({ theme, status }) => 
    status === 'completed' ? theme.colors.success :
    status === 'in-progress' ? theme.colors.primary :
    status === 'pending' ? theme.colors.warning :
    theme.colors.border
  };
  transition: ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ProjectInfo = styled.div`
  flex: 1;
  min-width: 300px;
`;

const ProjectTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const CompanyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CompanyBadge = styled.span`
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
`;

const StatusBadge = styled.span`
  background: ${({ theme, status }) => 
    status === 'completed' ? theme.colors.success + '20' :
    status === 'in-progress' ? theme.colors.primary + '20' :
    status === 'pending' ? theme.colors.warning + '20' :
    theme.colors.border
  };
  color: ${({ theme, status }) => 
    status === 'completed' ? theme.colors.success :
    status === 'in-progress' ? theme.colors.primary :
    status === 'pending' ? theme.colors.warning :
    theme.colors.textLight
  };
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 600;
  border: 1px solid currentColor;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  transition: ${({ theme }) => theme.transitions.fast};
  border: none;
  cursor: pointer;
  
  ${({ variant, theme }) => 
    variant === 'primary' ? `
      background: ${theme.colors.primary};
      color: white;
      &:hover {
        background: ${theme.colors.primary}dd;
      }
    ` : variant === 'success' ? `
      background: ${theme.colors.success};
      color: white;
      &:hover {
        background: ${theme.colors.success}dd;
      }
    ` : variant === 'secondary' ? `
      background: ${theme.colors.backgroundAlt};
      color: ${theme.colors.text};
      &:hover {
        background: ${theme.colors.border};
      }
    ` : `
      background: transparent;
      color: ${theme.colors.text};
      border: 1px solid ${theme.colors.border};
      &:hover {
        background: ${theme.colors.backgroundAlt};
      }
    `
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CardBody = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const InfoLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textLight};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const DurationBadge = styled.span`
  background: ${({ theme, duration }) => 
    duration <= 1 ? theme.colors.accentLight :
    duration <= 3 ? theme.colors.primaryLight :
    theme.colors.secondaryLight
  };
  color: ${({ theme, duration }) => 
    duration <= 1 ? theme.colors.accent :
    duration <= 3 ? theme.colors.primary :
    theme.colors.secondary
  };
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ProgressSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ProgressBar = styled.div`
  height: 6px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  width: ${({ progress }) => progress}%;
  transition: width 0.3s ease;
`;

const ExtraInfoSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: 0;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary}dd;
  }
`;

// Main Component
const AuditProjectCard = ({ project, onStartActivity, onEndActivity, onMarkComplete }) => {
  const [showExtraInfo, setShowExtraInfo] = useState(false);
  
  const {
    id,
    projectName,
    clientCompany,
    auditCompany,
    activityName,
    shift,
    plannedStartDate,
    plannedEndDate,
    duration,
    durationUnit,
    unitsToAudit,
    completedUnits,
    status,
    location,
    auditType,
    priority,
    assignedAuditor
  } = project;

  const progress = unitsToAudit > 0 ? Math.round((completedUnits / unitsToAudit) * 100) : 0;
  
  const calculateDurationDays = () => {
    const start = new Date(plannedStartDate);
    const end = new Date(plannedEndDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const durationDays = calculateDurationDays();

  const handleStartActivity = () => {
    onStartActivity?.(id);
  };

  const handleEndActivity = () => {
    onEndActivity?.(id);
  };

  const handleMarkComplete = () => {
    onMarkComplete?.(id);
  };

  return (
    <CardContainer status={status}>
      {/* Header Section */}
      <CardHeader>
        <ProjectInfo>
          <ProjectTitle>{projectName}</ProjectTitle>
          <CompanyInfo>
            <CompanyBadge>{clientCompany}</CompanyBadge>
            <span>→</span>
            <CompanyBadge>{auditCompany}</CompanyBadge>
            <StatusBadge status={status}>
              {status?.replace('-', ' ') || 'Not Started'}
            </StatusBadge>
          </CompanyInfo>
        </ProjectInfo>
        
        <ActionButtons>
          {status === 'pending' && (
            <Button variant="primary" onClick={handleStartActivity}>
              Start Activity
            </Button>
          )}
          {status === 'in-progress' && (
            <Button variant="success" onClick={handleEndActivity}>
              End Activity
            </Button>
          )}
          {status !== 'completed' && (
            <Button variant="secondary" onClick={handleMarkComplete}>
              Mark Complete
            </Button>
          )}
        </ActionButtons>
      </CardHeader>

      {/* Main Information Grid */}
      <CardBody>
        <InfoGroup>
          <InfoLabel>Activity</InfoLabel>
          <InfoValue>{activityName}</InfoValue>
        </InfoGroup>
        
        <InfoGroup>
          <InfoLabel>Shift</InfoLabel>
          <InfoValue>{shift}</InfoValue>
        </InfoGroup>
        
        <InfoGroup>
          <InfoLabel>Planned Dates</InfoLabel>
          <InfoValue>
            {new Date(plannedStartDate).toLocaleDateString()} - {new Date(plannedEndDate).toLocaleDateString()}
          </InfoValue>
        </InfoGroup>
        
        <InfoGroup>
          <InfoLabel>Duration</InfoLabel>
          <DurationBadge duration={durationDays}>
            {duration} {durationUnit}
            {durationUnit === 'days' && ` (${durationDays} calendar days)`}
          </DurationBadge>
        </InfoGroup>
        
        <InfoGroup>
          <InfoLabel>Location</InfoLabel>
          <InfoValue>{location}</InfoValue>
        </InfoGroup>
        
        <InfoGroup>
          <InfoLabel>Assigned To</InfoLabel>
          <InfoValue>{assignedAuditor}</InfoValue>
        </InfoGroup>
      </CardBody>

      {/* Progress Section */}
      <ProgressSection>
        <ProgressInfo>
          <InfoLabel>Progress</InfoLabel>
          <InfoValue>{completedUnits}/{unitsToAudit} units ({progress}%)</InfoValue>
        </ProgressInfo>
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
      </ProgressSection>

      {/* Extra Information Section */}
      <ExtraInfoSection>
        <ToggleButton onClick={() => setShowExtraInfo(!showExtraInfo)}>
          {showExtraInfo ? '▲' : '▼'} {showExtraInfo ? 'Hide' : 'Show'} Details
        </ToggleButton>
        
        {showExtraInfo && (
          <CardBody style={{ marginTop: '1rem', marginBottom: 0 }}>
            <InfoGroup>
              <InfoLabel>Audit Type</InfoLabel>
              <InfoValue>{auditType}</InfoValue>
            </InfoGroup>
            
            <InfoGroup>
              <InfoLabel>Priority</InfoLabel>
              <InfoValue style={{ 
                color: priority === 'high' ? '#FF3D00' : 
                       priority === 'medium' ? '#FFD600' : 
                       '#00C853' 
              }}>
                {priority}
              </InfoValue>
            </InfoGroup>
            
            <InfoGroup>
              <InfoLabel>Project ID</InfoLabel>
              <InfoValue>{id}</InfoValue>
            </InfoGroup>
            
            {/* Add more fields here as needed in the future */}
            <InfoGroup>
              <InfoLabel>Created Date</InfoLabel>
              <InfoValue>{new Date().toLocaleDateString()}</InfoValue>
            </InfoGroup>
          </CardBody>
        )}
      </ExtraInfoSection>
    </CardContainer>
  );
};

export default AuditProjectCard;