import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import styled, { useTheme } from 'styled-components'
import { Hourglass } from 'lucide-react'
import { FaFilter, FaHourglass, FaSearch, FaUserCircle } from 'react-icons/fa';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { getEmpAllocationData, postAllocationData } from '../../services/productServices';
import { toast } from 'react-toastify';
import Badge from '../../components/Badge';
import { FiActivity, FiCalendar, FiCheckCircle, FiClock, FiHash } from "react-icons/fi";
import StatsCard from '../../components/StatsCard';
import ProjectDetailModalEmployee from '../../components/modals/ModalForProjectmanagemnt/ProjectDetailModalEmployee';
import { useNavigate } from 'react-router-dom';
import CalenderGridView from '../../components/CalenderGridView';
import { format } from 'date-fns';
import {
  buildTasksByDate,
  formatToDDMMYYYY,
  getCurrentDateTimeDefaults,
  getMonthRange,
  getStatsFromData,
  getTodayApiDateStr,
  normalizeProjects,
  STATUS_CONFIG,
  formatAPITime,
  getStatusVariant
} from './utils/utils';
import ProjectManagementAddForm from '../../components/modals/ModalForProjectmanagemnt/ProjectManagementAddForm';

const Tagline = styled.p`
 color: ${({ theme }) => theme.colors.textLight};
`
const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  margin-top: 30px;
`
const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const SearchInput = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  padding: 0 1rem;
  
  svg {
    color: ${({ theme }) => theme.colors.textLight};
    margin-right: 0.5rem;
  }
  
  input {
    flex: 1;
    border: none;
    padding: 0.75rem 0;
    outline: none;
  }
`
const TabContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 25px;
  overflow-x: auto;
`

const Tab = styled.button`
  padding: 12px 24px;
  border: none;
  background: none;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.textSecondary)};
  border-bottom: 3px solid ${({ active, theme }) => (active ? theme.colors.primary : "transparent")};
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary}10;
  }
`
const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 300px;
    gap: 20px;
  }

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const ProjectCard = styled.div`
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${({ theme }) => theme.colors.textLight};
  
  svg {
    font-size: 48px;
    margin-bottom: 12px;
    opacity: 0.5;
  }
  
  p {
    font-size: 0.9rem;
  }
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

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  gap: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  line-height: 1.4;
  flex: 1;
`;

const InfoGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconWrapper = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bgColor};
  color: ${props => props.color};
  flex-shrink: 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const InfoContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const InfoLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 2px;
  font-weight: 500;
`;

const InfoValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CheckInOutBar = styled.div`
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.success}15 0%, ${theme.colors.error}15 100%)`};
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  border-left: 4px solid ${({ theme }) => theme.colors.success};
`;

const CheckInOutTitle = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textLight};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const CheckInOutGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const TimeChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${(props) => props.type === 'in' ? props.theme.colors.success : props.theme.colors.error};
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
`;

const ProjectManagementTimesheetEmployee = () => {
  const theme = useTheme();
  const [isFormModalOpen, setIsFromModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active")
  const [timePeriod, setTimePeriod] = useState("current")
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectdeProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [submittingProjectId, setSubmittingProjectId] = useState(null);
  const [dateRange, setDateRange] = useState(() => {
    const { start, end } = getMonthRange("current")
    return { start, end }
  })

  const emp_id = localStorage.getItem('empId');
  const urlParams = new URLSearchParams(window.location.search)
  const empidParam = urlParams.get("empid");
  const empName = urlParams.get("name");
  const navigate = useNavigate()

  const stats = getStatsFromData(projects)

  const StatCardContent = [
    {
      name: "Total hours worked",
      total: stats.totalHours,
      icon: <FaHourglass />,
      color: "primary"
    },
    {
      name: "Total Project Worked",
      total: stats.totalProjects,
      icon: <FaHourglass />,
      color: "success"
    },
    {
      name: "Pending Task For Today",
      total: stats.pendingTasks,
      icon: <FaHourglass />,
      color: "warning"
    }
  ]

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

      setProjects(normalizeProjects(response.data, { start, end }))

      
    } catch (error) {
      
      toast.error("No data found...")
    }
  }

  useEffect(() => {
    if (emp_id) {
      fetchEmpAllocationData()
    }
  }, [emp_id, empidParam])

  const tasksByDate = buildTasksByDate(projects)

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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }
  const filteredProjects = projects.filter(project => {
    const matchesTab =
      activeTab === "all" ||
      (project.project_status === activeTab);
    const matchesSearch = !searchTerm || ((project.project_name || "").toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTab && matchesSearch;
  });

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

    if (!isAddMode && !data.endTime) {
      toast.error("End time is required")
      return false
    }

    try {
      setSubmittingProjectId(project.id)
      const { apiDate: defaultApiDate, currentTime } = getCurrentDateTimeDefaults()
      const formData = new FormData()

      const activityDate = data.activityDate || defaultApiDate
      const startTime = data.startTime || currentTime

      formData.append("emp_id", empIdentifier)
      formData.append("activity_date", activityDate)
      formData.append("remarks", data.remarks ?? (isAddMode ? "Project Started from Web" : ""))
      formData.append("longitude_id", "")
      formData.append("latitude_id", "")
      
      if (data.file) {
        formData.append("submitted_file", data.file)
      }
      
      if (isAddMode) {
        formData.append("call_mode", "ADD")
        formData.append("p_id", project.original_P.id)
        formData.append("start_time", formatAPITime(startTime))
        formData.append("geo_type", "I")
      } else {
        formData.append("no_of_items", Number(data.noOfItems || 0))
        formData.append("call_mode", "UPDATE")
        formData.append("a_id", project.original_A.id)
        formData.append("end_time", formatAPITime(data.endTime))
        formData.append("geo_type", "O")
      }

      Object.entries(extraFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value)
        }
      })

      const res = await postAllocationData(formData)

      if (res?.status === 200) {
        toast.success(isAddMode ? "Check-in Successful" : "Activity Completed")
        return true
      }

      toast.error("Unable to submit activity")
      return false
    } catch (error) {
      toast.error("Something went wrong")
      return false
    } finally {
      setSubmittingProjectId(null)
    }
  }

  const handleStartProject = async (project) => {
    const activeProject = projects.find(
      (item) => item.show_end_button && item.id !== project.id
    )

    if (activeProject) {
      toast.error("Please end your ongoing project before starting another.")
      return
    }

    const success = await handleActivitySubmit({
      project,
      mode: "ADD"
    })

    if (success) {
      fetchEmpAllocationData()
    }
  }

  const handleMarkActivityComplete = async (project) => {
    if (!project) return

    const { currentTime } = getCurrentDateTimeDefaults()

    const success = await handleActivitySubmit({
      project,
      mode: "UPDATE",
      data: {
        endTime: currentTime,
        noOfItems: project?.original_A?.no_of_items || project?.original_P?.no_of_items || 0,
        remarks: "Marked as completed from Activity Details"
      },
      extraFields: { is_completed: 1 }
    })

    if (success) {
      fetchEmpAllocationData()
      setIsModalOpen(false)
    }
  }

  return (
    <Layout title="Employee Project Management TimeSheet">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Tagline>Track and manage the working hours</Tagline>
        {empName &&
          <Button variant="outline" style={{ marginRight: "0.5rem" }} onClick={() => navigate("/employees")}>
            <FaUserCircle /> {empName}
          </Button>}
      </div>

      <StatsContainer>
        {StatCardContent.map((item, index) => (
          <StatsCard key={index} icon={item.icon} label={item.name} value={item.total} color={item.color} />
        ))}
      </StatsContainer>

      <SearchContainer>
        <SearchInput>
          <FaSearch />
          <input type="text" placeholder="Search Project name..." value={searchTerm} onChange={handleSearch} />
        </SearchInput>
      </SearchContainer>

      <Card>

        <CalenderGridView
          getCellProps={({ fullDate }) => {
            const tasks = getTasks(fullDate)
            const isTodayDate =
              new Date(fullDate).toDateString() === new Date().toDateString()

            const task = tasks[0]

            return {
              $isWeekend: [0, 6].includes(fullDate.getDay()),

              style: {
                backgroundColor: task
                  ? task.status === "completed"
                    ? "#dcfce7"
                    : task.status === "in-progress"
                      ? "#fef3c7"
                      : isTodayDate && task.status === "planned"
                        ? "#dbeafe"    // BLUE (today planned)
                        : "#e5e7eb"    // GREY default
                  : undefined,
              },
            }
          }}

          renderBelowDate={({ fullDate }) => {
            const tasks = getTasks(fullDate)
            const grouped = groupByStatus(tasks)

            if (!tasks.length) return null

            return (
              <BadgeContainer>
                {Object.entries(grouped).map(([status, list]) => {
                  const cfg = STATUS_CONFIG[status]
                  if (!cfg) return null

                  return (
                    <StatusBadge key={status} color={cfg.color}>
                      <cfg.Icon />
                      <span>{list.length}</span>
                    </StatusBadge>
                  )
                })}
              </BadgeContainer>
            )
          }}

          // ONLY DATA - NOT DESIGN
          getTooltipData={({ fullDate }) => {
            const tasks = getTasks(fullDate)
            if (!tasks.length) return null

            return { date: fullDate, tasks }
          }}
        />
      </Card>
      <Card>
        <TabContainer>
          <Tab active={activeTab === "all"} onClick={() => setActiveTab("all")} theme={theme}>
            All Projects ({projects.length})
          </Tab>
          <Tab active={activeTab === "active"} onClick={() => setActiveTab("active")} theme={theme}>
            Active ({projects.filter((project) => project.project_status.toLowerCase() === "active").length})
          </Tab>
          <Tab active={activeTab === "planned"} onClick={() => setActiveTab("planned")} theme={theme}>
            Planned ({projects.filter((project) => project.project_status.toLowerCase() === "planned").length})
          </Tab>
          <Tab active={activeTab === "pending"} onClick={() => setActiveTab("pending")} theme={theme}>
            Pending ({projects.filter((project) => project.project_status.toLowerCase() === "pending").length})
          </Tab>
          <Tab active={activeTab === "completed"} onClick={() => setActiveTab("completed")} theme={theme}>
            Completed ({projects.filter((project) => project.project_status.toLowerCase() === "completed").length})
          </Tab>
        </TabContainer>

        <FilterContainer>
          <FilterSelect name="timePeriod" value={timePeriod} onChange={(e) => {
            const value = e.target.value;
            setTimePeriod(value);

            if (value === "current_month") {
              const { start, end } = getMonthRange("current")
              setDateRange({ start, end })
              fetchEmpAllocationData(start, end)
            }

            if (value === "previous_month") {
              const { start, end } = getMonthRange("previous")
              setDateRange({ start, end })
              fetchEmpAllocationData(start, end)
            }

            if (value === "next_month") {
              const { start, end } = getMonthRange("next")
              setDateRange({ start, end })
              fetchEmpAllocationData(start, end)
            }

          }}>
            <option value="current_month">Current Month</option>
            <option value="previous_month">Previous Month</option>
            <option value="next_month">Next Month</option>
          </FilterSelect>
          <DateInput type="date" value={dateRange.start} onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))} />
          <span>to</span>
          <DateInput type="date" value={dateRange.end} onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))} />

          <Button variant="outline" size="sm" onClick={() => { fetchEmpAllocationData(dateRange.start, dateRange.end) }}>
            <FaFilter /> Filter
          </Button>

        </FilterContainer>

        <ContentGrid>
          <div>
            {filteredProjects.length > 0 ? (
              <ProjectsGrid>
                {filteredProjects.map((project) => (
                  <ProjectCardComponent
                    key={project.id}
                    project={project}
                    setSelectdeProject={setSelectdeProject}
                    setIsModalOpen={setIsModalOpen}
                    setIsFromModalOpen={setIsFromModalOpen}
                    isUrlParamas={empName || empidParam}
                    onStartProject={handleStartProject}
                    submittingProjectId={submittingProjectId}
                  />
                ))}
              </ProjectsGrid>
            ) : (
              <EmptyState theme={theme}>
                <Hourglass />
                <p>No activity found</p>
              </EmptyState>
            )}
          </div>
        </ContentGrid>
      </Card>

      {isModalOpen && selectedProject && (
        <ProjectDetailModalEmployee
          data={selectedProject}
          onClose={() => setIsModalOpen(false)}
          theme={theme}
          onMarkComplete={handleMarkActivityComplete}
          isSubmitting={submittingProjectId === selectedProject?.id}
        />
      )}

      {isFormModalOpen && (
        <ProjectManagementAddForm
          isOpen={isFormModalOpen}
          onClose={() => setIsFromModalOpen(false)}
          activity={selectedProject}
          onSubmit={fetchEmpAllocationData}
          onActivitySubmit={handleActivitySubmit}
          isSubmitting={submittingProjectId === selectedProject?.id}
        />
      )}


    </Layout>
  )
}

export default ProjectManagementTimesheetEmployee;

const getTodayCheckInOut = (dayLogs) => {
  if (!dayLogs) return null;

  const todayKey = getTodayApiDateStr(); // uses dd-MMM-yyyy format like 25-Nov-2025

  // Return today's log only if present
  return dayLogs[todayKey] || null;
};

// Info Row Component
const InfoRowComponent = ({ icon: Icon, label, value, iconColor, iconBg }) => (
  <InfoRow>
    <IconWrapper bgColor={iconBg} color={iconColor}>
      <Icon />
    </IconWrapper>
    <InfoContent>
      <InfoLabel>{label}</InfoLabel>
      <InfoValue>{value || "Not Available"}</InfoValue>
    </InfoContent>
  </InfoRow>
);

const ProjectCardComponent = ({
  project,
  setSelectdeProject,
  setIsModalOpen,
  setIsFromModalOpen,
  isUrlParamas,
  onStartProject,
  submittingProjectId
}) => {
  const theme = useTheme();
  const handleDetailsClick = () => {
    setSelectdeProject(project);
    setIsModalOpen(true);
  };

  const statusLabel = project.project_period_status || project.project_status;
  const todayLog = getTodayCheckInOut(project.day_logs);

  return (
    <>
      <ProjectCard>
        <CardHeader>
          <Title>{project.project_name}</Title>
          <Badge variant={getStatusVariant(statusLabel)}>
            {statusLabel}
          </Badge>
        </CardHeader>

        <InfoGrid>
          <InfoRowComponent
            icon={FiHash}
            label="Project Code"
            value={project.project_code}
            iconColor={theme.colors.primary}
            iconBg={`${theme.colors.primary}20`}
          />

          <InfoRowComponent
            icon={FiActivity}
            label="Activity"
            value={project.activity_name}
            iconColor={theme.colors.info}
            iconBg={`${theme.colors.info}20`}
          />

          <InfoRowComponent
            icon={FiCalendar}
            label="Duration"
            value={
              `${project.planned_start_date} - ${project.planned_end_date}`
              // project.actual_start_date && project.actual_end_date
                // ? `${project.actual_start_date} - ${project.actual_end_date}`
                // : project.planned_start_date && project.planned_end_date
                  // ? `${project.planned_start_date} - ${project.planned_end_date}`
                  // : null
            }
            iconColor={theme.colors.success}
            iconBg={`${theme.colors.success}20`}
          />

          <InfoRowComponent
            icon={FiClock}
            label="Effort"
            value={`${project.effort || 0} ${project.effort_unit || "days"}`}
            iconColor={theme.colors.orange}
            iconBg={`${theme.colors.orange}20`}
          />
        </InfoGrid>

        {todayLog && (
          <CheckInOutBar>
            <CheckInOutTitle>Today's Activity</CheckInOutTitle>
            <CheckInOutGrid>
              {todayLog.check_in && (
                <TimeChip type="in">
                  <FiCheckCircle size={14} />
                  IN {todayLog.check_in.time}
                </TimeChip>
              )}
              {todayLog.check_out && (
                <TimeChip type="out">
                  <FiCheckCircle size={14} />
                  OUT {todayLog.check_out.time}
                </TimeChip>
              )}
            </CheckInOutGrid>
          </CheckInOutBar>
        )}

        <ButtonGroup>
          {!isUrlParamas &&
            <>
              {project.show_start_button && (
                <Button
                  variant="primary"
                  onClick={() => onStartProject(project)}
                  disabled={submittingProjectId === project.id}
                >
                  Start Project
                </Button>
              )}

              {project.show_end_button && (
                <Button variant="primary" onClick={() => { setIsFromModalOpen(true); setSelectdeProject(project); }}>
                  End Project
                </Button>
              )}
            </>
          }

          <Button variant="outline" onClick={handleDetailsClick}>
            View Details
          </Button>
        </ButtonGroup>
      </ProjectCard>
    </>
  );
};