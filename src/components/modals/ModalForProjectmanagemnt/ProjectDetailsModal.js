import { Clock, Search, X } from 'lucide-react';
import React, { useState } from 'react'
import styled from 'styled-components';
import StatsCard from '../../StatsCard';
import { FaCheck, FaHashtag } from 'react-icons/fa';
import Card from '../../Card';
import { getRandomColor, getStatusVariant } from '../../../pages/ProjectManagement/utils/utils';
import Badge from '../../Badge';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.md};
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  width: 95%;
  height: 95vh;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-in-out;

  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 1024px) {
    max-height: 100vh;
    border-radius: 0;
  }

  @media (max-width: 768px) {
    height: 100vh;
    border-radius: 0;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textLight};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
  width: 40px;
  height: 40px;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundAlt};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${({ theme }) => theme.colors.textLight};
    }
  }
`;

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  font-family: ${({ theme }) => theme.fonts.body};
`;

// const Header = styled.div`
//   margin-bottom: ${({ theme }) => theme.spacing.xl};
// `;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// const Section = styled.div`
//  background: ${({ theme }) => theme.colors.card};
//   border-radius: ${({ theme }) => theme.borderRadius.xl};
//   padding: ${({ theme }) => theme.spacing.xl};
//   box-shadow: ${({ theme }) => theme.shadows.md};
//   height: 550px;
//   display: flex;
//   flex-direction: column;

//   @media (max-width: 768px) {
//     height: auto;
//     min-height: 550px;
//   }
// `;

const SectionHeader = styled.div`
display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xs};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.colors.card};
  z-index: 10;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: ${({ theme }) => theme.spacing.lg};
    padding-bottom: ${({ theme }) => theme.spacing.md};
  }
`;
// const ContentArea = styled.div`
//   flex: 1;
//   overflow-y: auto;
//   padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md};

//   @media (max-width: 768px) {
//     padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
//   }
// `;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const SearchBox = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;

  input {
    width: 100%;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    padding-left: 40px;
    border: 2px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textLight};
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const TeamMember = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
  }
`;

const MemberAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  flex-shrink: 0;
`;

const MemberInfo = styled.div`
  flex: 1;
`;

const MemberName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const MemberRole = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 2px;
`;

const MemberHours = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const EmployeeWorkCard = styled.div`
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const EmployeeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  background: ${({ isOpen, theme }) => isOpen ? theme.colors.backgroundAlt : theme.colors.card};
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundAlt};
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const EmployeeHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex: 1;
`;

const EmployeeHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-end;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const EmployeeHeaderAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  flex-shrink: 0;
`;

const EmployeeHeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const EmployeeHeaderName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const EmployeeHeaderRole = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 2px;
`;

const TotalHoursBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media (max-width: 768px) {
    align-items: flex-end;
  }
`;

const TotalHoursValue = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const TotalHoursLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textLight};
`;

const ExpandIcon = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textLight};
  transition: transform 0.3s ease;
  transform: ${({ isOpen }) => isOpen ? 'rotate(90deg)' : 'rotate(0deg)'};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const EmployeeWorkDetails = styled.div`
  max-height: ${({ isOpen }) => isOpen ? '1000px' : '0'};
  opacity: ${({ isOpen }) => isOpen ? '1' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  background: ${({ theme }) => theme.colors.card};
`;

const WorkDaysList = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const WorkDayItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const WorkDayHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px dashed ${({ theme }) => theme.colors.border};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const WorkDate = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const WorkHours = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  svg {
    width: 16px;
    height: 16px;
  }
`;

const WorkTime = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textLight};
`;

const FileStatus = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme, hasFile }) => 
    hasFile ? theme.colors.success : theme.colors.error};
  font-weight: ${({ hasFile }) => hasFile ? '600' : '500'};
`;

const WorkRemark = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.4;
  font-style: ${({ hasRemark }) => hasRemark ? 'normal' : 'italic'};
  opacity: ${({ hasRemark }) => hasRemark ? '1' : '0.6'};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xs};
  background: #ededed;
  border-radius: 7px;
`;
const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const ProjectDetailsModal = ({ project, onClose }) => {
const [searchQuery, setSearchQuery] = useState("");

console.log(project)

// ========= helpers (DRY) =========

const parseTimeToHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;

  const to24 = (time) => {
    const [t, modifier] = time.split(" ");
    let [hours, minutes] = t.split(":");
    if (modifier === "PM" && hours !== "12") hours = parseInt(hours) + 12;
    if (modifier === "AM" && hours === "12") hours = 0;
    return `${hours}:${minutes}`;
  };

  const start = new Date(`1970-01-01T${to24(checkIn)}`);
  const end = new Date(`1970-01-01T${to24(checkOut)}`);

  return Math.max(0, (end - start) / (1000 * 60 * 60)).toFixed(2);
};

const getDayStatus = (log) => {
  if (log?.check_in && !log?.check_out) return "In Progress";
  if (log?.check_in && log?.check_out) return "Completed";
  return "Not Started";
};

// ========= REAL mapping from YOUR API =========

const employeeWorkLogs = React.useMemo(() => {

  if (!project?.teamMembers) return [];

  return project.teamMembers.map((emp) => {

    const workDays = Object.values(emp.day_logs || {}).map((log) => {
      const hours = parseTimeToHours(
        log?.check_in?.time,
        log?.check_out?.time
      );

      return {
        date: log.date,
        hours,
        checkIn: log?.check_in?.time ?? null,
        checkOut: log?.check_out?.time ?? null,
        remark: log?.remarks || "No remarks",
        status: getDayStatus(log),
        is_file_uploaded: false, // ✅ added for future
      };
    });

    const totalHours = workDays.reduce(
      (sum, d) => sum + Number(d.hours),
      0
    );

    return {
      id: emp.emp_id,
      name: emp.employee_name,
      color: emp.color || getRandomColor(),
      totalHours,
      workDays
    };
  });

}, [project]);


const filteredTasks = employeeWorkLogs.filter(emp =>
  emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  emp.id.toLowerCase().includes(searchQuery.toLowerCase())
);


  // Close modal on escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

    const StatCardContent = [
      {
        name: "Activity Id",
        total: project.activity_id,
        icon: <FaHashtag />,
        color: "primary"
      },
      {
        name: "Project Planned Date",
        total: `${project.planned_start_date} to ${project.planned_end_date}`,
        icon: <FaCheck />,
        color: "success"
      }
    ]

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
              <TitleRow>
                <TitleSection>
                  <Title>{project.project_name} - {project.order_item_key}</Title>
                  <Badge variant={getStatusVariant(project.project_period_status)}>{project.project_period_status}</Badge>
                </TitleSection>
              </TitleRow>
          <CloseButton onClick={onClose} title="Close (Esc)">
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Container>
            <StatsGrid>
              {StatCardContent.map((item, index) => (
                        <StatsCard key={index} icon={item.icon} label={item.name} value={item.total} color={item.color} />
                      ))}
            </StatsGrid>

            <ContentGrid>
             <Card>
                <SectionHeader>
                  <SectionTitle>Employee Work Logs</SectionTitle>
                  <SearchBox>
                    <Search size={18} />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </SearchBox>
                </SectionHeader>

                {/* <ContentArea> */}
                <div style={{  height: "550px", overflowY: "auto" }}>

                  <EmployeeWorkLog workLogs={filteredTasks} />
                </div>
                {/* </ContentArea> */}
              </Card>

              <Card >
                <SectionTitle>Team Members ({employeeWorkLogs.length})</SectionTitle>
                <div style={{ height: "600px", overflowY: "auto" }}>
                  {employeeWorkLogs.map((member, index) => (
                    <TeamMember key={index}>
                      <MemberAvatar color={member.color}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </MemberAvatar>
                      <MemberInfo>
                        <MemberName>{member.name}</MemberName>
                        <MemberRole>{member.id}</MemberRole>
                      </MemberInfo>
                      <MemberHours>{member.totalHours} hrs</MemberHours>
                    </TeamMember>
                  ))}
                </div>
              </Card>
            </ContentGrid>
          </Container>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}

export default ProjectDetailsModal;

const EmployeeWorkLog = ({ workLogs }) => {
  const [openEmployees, setOpenEmployees] = useState({});

  const toggleEmployee = (employeeId) => {
    setOpenEmployees(prev => ({
      ...prev,
      [employeeId]: !prev[employeeId]
    }));
  };

  return (
    <div>
      {workLogs.length === 0 ? (
        <EmptyState>No employees found</EmptyState>
      ) : (
        workLogs.map((employee) => (
          <EmployeeWorkCard key={employee.id}>
            <EmployeeHeader
              isOpen={openEmployees[employee.id]}
              onClick={() => toggleEmployee(employee.id)}
            >
              <EmployeeHeaderLeft>
                <ExpandIcon isOpen={openEmployees[employee.id]}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </ExpandIcon>
                <EmployeeHeaderAvatar color={employee.color}>
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </EmployeeHeaderAvatar>
                <EmployeeHeaderInfo>
                  <EmployeeHeaderName>{employee.name}</EmployeeHeaderName>
                  <EmployeeHeaderRole>{employee.id}</EmployeeHeaderRole>
                </EmployeeHeaderInfo>
              </EmployeeHeaderLeft>
              <EmployeeHeaderRight>
                <TotalHoursBadge>
                  <TotalHoursValue>{employee.totalHours}h</TotalHoursValue>
                  <TotalHoursLabel>Total Hours</TotalHoursLabel>
                </TotalHoursBadge>
              </EmployeeHeaderRight>
            </EmployeeHeader>

            <EmployeeWorkDetails isOpen={openEmployees[employee.id]}>
              {employee.workDays.length === 0 ? 
                <WorkDaysList>
                    <EmptyState>No Logs Found for this Employee</EmptyState>
                </WorkDaysList> :
              
              <WorkDaysList>
                {employee.workDays.map((day, index) => (
                  <WorkDayItem key={index}>
                    <WorkDayHeader>
                      <WorkDate>{day.date}</WorkDate>
                      <WorkHours>
                        <Clock size={16} />
                        {day.hours} hours
                      </WorkHours>
                      <WorkTime>
                        {day.checkIn && `IN: ${day.checkIn}`}
                        {day.checkOut && ` OUT: ${day.checkOut}`}
                        {!day.checkIn && !day.checkOut && "No time record"}
                      </WorkTime>
                      <FileStatus hasFile={day.hasFile}>
                        {day.hasFile ? "File Attached" : "File Not Attached"}
                      </FileStatus>
                    </WorkDayHeader>
                    
                    <WorkRemark hasRemark={day.remark}>
                      {day.remark || "No remarks"}
                    </WorkRemark>
                  </WorkDayItem>
                ))}
              </WorkDaysList>
              }
            </EmployeeWorkDetails>
          </EmployeeWorkCard>
        ))
      )}
    </div>
  );
};