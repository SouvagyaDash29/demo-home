import { ArrowRight, Building, Calendar, CheckCircle, Clock, MapPin, Play, Square, Target } from 'lucide-react';
import React from 'react';
import styled from 'styled-components';
import Badge from '../../components/Badge';
import { getStatusVariant } from './utils/utils';

// Styled Components
const CardContainer = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: 20px;
  align-items: flex-start;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 140px;
  align-items: flex-end;

  @media (max-width: 768px) {
    width: 100%;
    align-items: stretch;
    min-width: auto;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ActivityTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  line-height: 1.4;
`;

const CompanyFlow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const CompanyBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  color: ${({ theme }) => theme.colors.primary};
`;

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const InfoLabel = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
  font-weight: 500;
  text-transform: uppercase;
`;

const InfoValue = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const ProgressSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 6px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  width: ${({ progress }) => progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  font-weight: 500;
  min-width: 60px;
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: ${({ theme, status }) => 
    status === 'completed' ? `${theme.colors.success}15` :
    status === 'in-progress' ? `${theme.colors.primary}15` :
    `${theme.colors.warning}15`
  };
  color: ${({ theme, status }) => 
    status === 'completed' ? theme.colors.success :
    status === 'in-progress' ? theme.colors.primary :
    theme.colors.warning
  };
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  align-item: center;
  gap: 8px;
  width: 100%;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  
  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary};
          color: white;
          
          &:hover {
            background: ${theme.colors.primary}dd;
          }
        `;
      case 'success':
        return `
          background: ${theme.colors.success};
          color: white;
          
          &:hover {
            background: ${theme.colors.success}dd;
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${theme.colors.text};
          border: 1px solid ${theme.colors.border};
          
          &:hover {
            border-color: ${theme.colors.primary};
            color: ${theme.colors.primary};
          }
        `;
      default:
        return `
          background: ${theme.colors.backgroundAlt};
          color: ${theme.colors.text};
          
          &:hover {
            background: ${theme.colors.border};
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

// Main Component
const AuditProjectCard = ({ project, onStartActivity, onEndActivity, onMarkComplete }) => {
  const {
    id,
    activityName,
    clientCompany,
    project_name,
    shift,
    planned_start_date,
    planned_end_date,
    duration,
    durationUnit,
    original_P : {no_of_items: unitsToAudit},
    completedUnits,
    project_status,
    project_period_status,
    location,
  } = project;

  console.log("in audut project",project)
  console.log(unitsToAudit);

  const progress = unitsToAudit > 0 ? Math.round((completedUnits / unitsToAudit) * 100) : 0;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

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
    <CardContainer>
      {/* Left Section - Activity Information */}
      <LeftSection>
        {/* <Header>
          <ActivityTitle>{activityName}</ActivityTitle>
          <CompanyFlow>
            <CompanyBadge>
              <Building size={12} />
              {clientCompany || "Company Name"}
            </CompanyBadge>
            <ArrowRight size={12} color="#95A5A6" />
            <CompanyBadge>
              <Target size={12} />
              {project_name || "Not Available"}
            </CompanyBadge>
              <Badge variant={getStatusVariant(project_period_status)}>{project_period_status}</Badge>
          </CompanyFlow>
        </Header> */}
        <CompanyHeader>
                  <div>
                    <CompanyName>
                      {clientCompany || "Company Name"}
                      {/* <PriorityBadge priority={activity.priority}>
                        {getPriorityIcon(activity.priority)}
                        {activity.priority}
                      </PriorityBadge> */}
                  <Badge variant={getStatusVariant(project_period_status)}>{project_period_status}</Badge>
                    </CompanyName>
                    <ActivityTitle>{project_name || "Not Available"}</ActivityTitle>
                  </div>
                </CompanyHeader>

        <InfoGrid>
          <InfoItem>
            <IconWrapper>
              <MapPin size={16} />
            </IconWrapper>
            <InfoContent>
              <InfoLabel>Location</InfoLabel>
              <InfoValue>{location || "Not Found"}</InfoValue>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <IconWrapper>
              <Clock size={16} />
            </IconWrapper>
            <InfoContent>
              <InfoLabel>Shift</InfoLabel>
              <InfoValue>{shift || "No Shift Available"}</InfoValue>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <IconWrapper>
              <Calendar size={16} />
            </IconWrapper>
            <InfoContent>
              <InfoLabel>Planned Dates</InfoLabel>
              <InfoValue>
                {formatDate(planned_start_date) || "Not Found"} - {formatDate(planned_end_date) || "Not Found"}
              </InfoValue>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <IconWrapper>
              <Target size={16} />
            </IconWrapper>
            <InfoContent>
              <InfoLabel>Units to Audit</InfoLabel>
              <InfoValue>{unitsToAudit}</InfoValue>
            </InfoContent>
          </InfoItem>
          {/* <InfoItem>
            <IconWrapper>
              <Target size={16} />
            </IconWrapper>
            <InfoContent>
              <InfoLabel>Duration</InfoLabel>
              <InfoValue>{duration} {durationUnit}</InfoValue>
            </InfoContent>
          </InfoItem> */}
        </InfoGrid>
{/* 
        <ProgressSection>
          <ProgressBar>
            <ProgressFill progress={progress} />
          </ProgressBar>
          <ProgressText>
            {completedUnits}/{unitsToAudit} units
          </ProgressText>
        </ProgressSection> */}
      </LeftSection>

      {/* Right Section - Status & Actions */}
      <RightSection>

        <ActionButtons>
          {project_period_status === 'pending' && (
            <ActionButton variant="primary" onClick={handleStartActivity}>
              <Play size={14} />
              Start
            </ActionButton>
          )}
          {project_period_status === 'in-progress' && (
            <ActionButton variant="success" onClick={handleEndActivity}>
              <Square size={14} />
              End
            </ActionButton>
          )}
          {project_period_status !== 'completed' && (
            <ActionButton variant="outline" onClick={handleMarkComplete}>
              <CheckCircle size={14} />
              Complete
            </ActionButton>
          )}
        </ActionButtons>
      </RightSection>
    </CardContainer>
  );
};

export default AuditProjectCard;