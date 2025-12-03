import { useAuth } from "../context/AuthContext";
import ProjectManagementTimesheetEmployee from "../pages/ProjectManagement/ProjectManagementTimesheetEmployee";
import TimeSheetManagement from "../pages/TimeSheetManagement";

export default function TimesheetRouter() {
  const { companyInfo, profile } = useAuth();

  if (!companyInfo) return null; // or loader

  return companyInfo.business_type === "APM" ? <ProjectManagementTimesheetEmployee /> : <TimeSheetManagement />;
}