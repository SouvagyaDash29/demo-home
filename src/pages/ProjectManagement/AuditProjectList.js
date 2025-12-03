import React from 'react';
import styled from 'styled-components';
import AuditProjectCard from './AuditProjectCard';

const ListContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  min-width: 120px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${({ theme }) => theme.colors.textLight};
  
  h3 {
    color: ${({ theme }) => theme.colors.textLight};
    margin-bottom: 8px;
    font-weight: 500;
  }
`;

const ProjectCount = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 14px;
  margin-top: 4px;
`;

const AuditProjectList = ({ 
  projects = [], 
  onStartActivity, 
  onEndActivity, 
  onMarkComplete,
//   filters = {},
//   onFilterChange 
}) => {
  
  const handleStartActivity = (projectId) => {
    console.log('Starting activity for project:', projectId);
    onStartActivity?.(projectId);
  };

  const handleEndActivity = (projectId) => {
    console.log('Ending activity for project:', projectId);
    onEndActivity?.(projectId);
  };

  const handleMarkComplete = (projectId) => {
    console.log('Marking project as complete:', projectId);
    onMarkComplete?.(projectId);
  };

  if (projects.length === 0) {
    return (
      <ListContainer>
        <EmptyState>
          <h3>No Audit Projects Found</h3>
          <p>There are currently no audit projects assigned to you.</p>
        </EmptyState>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      {/* <ListHeader>
        <div>
          <Title>Audit Projects</Title>
          <ProjectCount>{projects.length} project{projects.length !== 1 ? 's' : ''} assigned</ProjectCount>
        </div>
        <FilterSection>
          <FilterSelect 
            value={filters.status || ''} 
            onChange={(e) => onFilterChange?.('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </FilterSelect>
          
          <FilterSelect 
            value={filters.shift || ''} 
            onChange={(e) => onFilterChange?.('shift', e.target.value)}
          >
            <option value="">All Shifts</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
            <option value="night">Night</option>
          </FilterSelect>
        </FilterSection>
      </ListHeader> */}

      {projects.map((project) => (
        <AuditProjectCard
          key={project.id}
          project={project}
          onStartActivity={handleStartActivity}
          onEndActivity={handleEndActivity}
          onMarkComplete={handleMarkComplete}
        />
      ))}
    </ListContainer>
  );
};

export default AuditProjectList;