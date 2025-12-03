import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet 
} from "react-router-dom";
import { GlobalStyles } from "./styles/GlobalStyles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Auth & Protected Routes
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext"
import { ExportProvider } from "./context/ExportContext";

// Shared Components
import { NavBar } from "./components/NavBar";
import Footer2 from "./components/Footer2";

// Public Pages
import HomePage from "./components/HomePage";
import Login from "./pages/Login";
import Product from "./components/Product";
import ContactUs from "./components/ContactUs";
import AbotUs from "./components/AbotUs";
import PricingRoute from "./components/PricingRoute";
import FormComponent from "./components/FormComponent";
import ContactSalesPage from "./components/ContactSalesPage";
import Blog from "./components/Blogs/Blog"
import Career from "./components/Career";
import ThankYouPage from "./components/ThankYouPage";
import TermsAndConditions from "./components/TermConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Disclaimer from "./components/Disclaimer";
import Commonfnadq from "./components/Commonfnadq";

//blog imports
import BlogDetails from "./components/Blogs/BlogDetails";

// Protected Pages
import Dashboard from "./pages/Dashboard";
import EmployeeManagement from "./pages/EmployeeManagement";
import AttendanceTracking from "./pages/AttendanceTracking";
import LeaveManagement from "./pages/LeaveManagement";
import HolidayCalendar from "./pages/HolidayCalendar";
import TimeSheetManagement from "./pages/TimeSheetManagement";
import ShiftScheduling from "./pages/ShiftScheduling";
import MyClaims from "./pages/MyClaims";
import Appointees from "./pages/Appointees";
import Analytics from "./pages/Analytics";
import HelpDesk from "./pages/HelpDesk";
import RequestDesk from "./pages/RequestDesk";
import FmsDashBoard from "./pages/fmsPages/FmsDashBoard";
import TaskScreen from "./pages/fmsPages/TaskScreen";
import CustomerList from "./pages/fmsPages/CustomerList";

// Domain Specific
import HrmComponent from "./components/hrm/HrmComponent";
import HrmFeaturesManagement from "./components/hrm/HrmFeaturesManagement";
import LeadManagement from "./components/crm/LeadManagement";
import HerosectionCrm from "./components/crm/HerosectionCrm";
import LmsHeroSection from "./components/lms/LmsHeroSection";
import LmsSytem from "./components/lms/LmsSytem";
import LabManagement from "./components/lms/LabManagement";
import LabEqupmentmanagement from "./components/lms/LabEqupmentmanagement";
import SalesHeroSection from "./components/sales/SalesHeroSection";
import SalesSytem from "./components/sales/SalesSystem";
import ProcessHeroPage from "./components/processproject/ProcessHeroPage";
import ProcessManagementSystem from "./components/processproject/ProjectManagementSystem";
import InventoryHeroPage from "./components/inventory/InventoryHeroPage";
import InventoryManagementSystem from "./components/inventory/InventoryManagementSystem";
import Assessment from "./components/Assessment";
import WasteManagementHeroPage from "./components/wasteManagement/WasteManagementHeroPage";
import Fmsheropage from "./components/fms/Fmsheropage";
import HmsHeroPage from "./components/hms/HmsHeroPage";
import PpeHeroPage from "./components/ppe/PpeHeroPage";
import Smsheropage from "./components/sms/Smsheropage";
import Profile from "./pages/Profile";
import Manual from "./components/Manual";
import ManualModuleDetails from "./components/ManualModuleDetails";
import ManualSteps from "./components/ManualSteps";
import MyPaySlip from "./pages/MyPaySlip";
import MyWishes from "./pages/MyWishes";
import BlogForm from "./components/Blogs/BlogForm";
import Logins from "./components/loginpage/Login";
import NewFeatures from "./components/hrm/NewFeatures";
import Invoices from "./pages/Invoices";
import Tickets from "./pages/Tickets";
import MyShiftDetail from "./pages/MyShiftDetail";
import MyAppointments from "./pages/MyAppointments";
import MyBookedAppointments from "./pages/MyAppointmentList";
import DoctorDashboard from "./pages/DoctorDashboard";
import Appointments from "./pages/OPDappointments";
import HRMRoleBasedAccessibility from "./components/hrm/HRMRoleBasedAccessibility";
import ProjectManagement from "./pages/ProjectManagement";
import ProjectReport from "./pages/ProjectReport";
import MyTraining from "./pages/MyTraining";
import NewsEventsList from "./components/NewsEvents/NewsEventsList";
import NewsEventDetail from "./components/NewsEvents/NewsEventDetail";
import NewsEventForm from "./components/NewsEvents/NewsEventForm";
import InPatients from "./pages/IPDappointments";
import PatientAdmission from "./pages/PatientAdmission";
import PatentPage from "./components/PatentPage";
import AwardsPage from "./components/AwardsPage";
import GlpHeroPage from "./components/glp/GlpHeroPage";
import TimesheetRouter from "./components/TimesheetRouter";
import ProjectManagementTimesheet from "./pages/ProjectManagement/ProjectManagementTimesheet";
// import MyAppriaisal from "./pages/MyAppriaisal";

function App() {
  const url = "https://www.atomwalk.com/rest-auth/login/";
  const data = {
    username: "ASHUTOSH@PMA_00001",
    password: "ashutosh@11",
  };

  useEffect(() => {
    if (!localStorage.getItem("apiResponse")) {
      loginAndStore();
    }
  }, []);

  const loginAndStore = async () => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const responseData = await response.json();
      localStorage.setItem("apiResponse", JSON.stringify(responseData));
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
      <AuthProvider>
        <ThemeProvider>
           <ExportProvider>
          <Router>
            <NavBar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/Product.html" element={<Product />} />
              <Route path="/contactUs.html" element={<ContactUs />} />
              <Route path="/aboutUs.html" element={<AbotUs />} />
              <Route path="/pricing.html" element={<PricingRoute />} />
              <Route path="/demo.html" element={<FormComponent />} />
              <Route path="/seals.html" element={<ContactSalesPage />} />
              <Route path="/customer/login.html" element={<Logins/>} />  
              <Route path="/careers.html" element={<Career />} />
              <Route path="/thankyou.html" element={<ThankYouPage />} />
              <Route path="/terms-and-conditions.html" element={<TermsAndConditions />} />
              <Route path="/privacy-policy.html" element={<PrivacyPolicy />} />
              <Route path="/disclaimer.html" element={<Disclaimer />} />
              <Route path="/faq.html" element={<Commonfnadq />} />
              {/* Domain Specific Routes */}
              <Route path="/crm.html" element={<HerosectionCrm />} />
              <Route path="/lms.html" element={<LmsHeroSection />} />
              <Route path="/hrm.html" element={<HrmComponent />} />
              <Route path="/leave.html" element={<HrmFeaturesManagement />} />
              <Route path="/claim.html" element={<HrmFeaturesManagement />} />
              <Route path="/employeehr.html" element={<HrmFeaturesManagement />} />
              <Route path="/payroll.html" element={<HrmFeaturesManagement />} />
              <Route path="/appraisal.html" element={<HrmFeaturesManagement />} />
              <Route path="/attendance.html" element={<HrmFeaturesManagement />} />
              <Route path="/emphelp.html" element={<HrmFeaturesManagement />} />
              <Route path="/empevent.html" element={<HrmFeaturesManagement />} />
              <Route path="/empliteapp.html" element={<NewFeatures />} />
              <Route path="/leadManagement.html" element={<LeadManagement />} />
              <Route path="/CustomerManagement.html" element={<LeadManagement />} />
              <Route path="/Channelpartner.html" element={<LeadManagement />} />
              <Route path="/aMCTracking.html" element={<LeadManagement />} />
              <Route path="/campaignManagement.html" element={<LeadManagement />} />
              <Route path="/userManagement.html" element={<LmsSytem />} />
              <Route path="/equipmentManagement.html" element={<LmsSytem />} />
              <Route path="/equipmentMaintenance.html" element={<LmsSytem />} />
              <Route path="/reportandDashboard.html" element={<LmsSytem />} />
              <Route path="/userroleManagement.html" element={<LmsSytem data={true} />} />
              <Route path="/labProcessemplate.html" element={<LmsSytem data={true} />} />
              <Route path="/labExperimentProject.html" element={<LmsSytem data={true} />} />
              <Route path="/pIwithReport.html" element={<LmsSytem data={true} />} />
              <Route path="/labmanagement.html" element={<LabManagement />} />
              <Route path="/labequipmentmangement.html" element={<LabEqupmentmanagement />} />
              <Route path="/sales.html" element={<SalesHeroSection />} />
              <Route path="/saleslifecycle.html" element={<SalesSytem />} />
              <Route path="/procurement.html" element={<SalesSytem />} />
              <Route path="/compliance.html" element={<SalesSytem />} />
              <Route path="/salesreport.html" element={<SalesSytem />} />
              <Route path="/processandproject.html" element={<ProcessHeroPage />} />
              <Route path="/process.html" element={<ProcessManagementSystem />} />
              <Route path="/project.html" element={<ProcessManagementSystem />} />
              <Route path="/activityreport.html" element={<ProcessManagementSystem />} />
              <Route path="/inventory.html" element={<InventoryHeroPage />} />
              <Route path="/inventoryop.html" element={<InventoryManagementSystem />} />
              <Route path="/warehouse.html" element={<InventoryManagementSystem />} />
              <Route path="/inventoryreport.html" element={<InventoryManagementSystem />} />
              <Route path="/assessment.html" element={<Assessment />} />
              <Route path="/wastemanagement.html" element={<WasteManagementHeroPage />} />
              <Route path="/glp.html" element={<GlpHeroPage />} />
              <Route path="/facilitymanagement.html" element={<Fmsheropage />} />
              <Route path="/hospitalmanagement.html" element={<HmsHeroPage />} />
              <Route path="/solarmanagement.html" element={<Smsheropage />} />
               <Route path="/projectmanual.html" element={<ManualModuleDetails/>} />
              <Route path="/salesmanual.html" element={<ManualModuleDetails/>} />
              <Route path="/employeehrmsmanual.html" element={<ManualModuleDetails/>} />
              <Route path="/aimanagement.html" element={<PpeHeroPage/>} />
              <Route path="/manual.html" element={<Manual/>} />
              <Route path="/hrmanual.html" element={<ManualModuleDetails/>} />
              <Route path="/crmanual.html" element={<ManualModuleDetails/>} />
              <Route path="/manualsteps.html" element={<ManualSteps/>} />
              <Route path="/employee-accessibility" element={<HRMRoleBasedAccessibility/>} />
              <Route path="/employee-manager-accessibility" element={<HRMRoleBasedAccessibility/>} />
              <Route path="/hr-manager-accessibility" element={<HRMRoleBasedAccessibility/>} />
              <Route path="/intellectual-property" element={<PatentPage/>} />
              <Route path="/awards" element={<AwardsPage/>} />

    
              {/* Login Route */}
              <Route path="/login" element={<Login />} />

              {/*Blog route*/}
              <Route path="/Blog.html" element={<Blog />} />
              <Route path="/Blog.html/:id" element={<BlogDetails />} />
              <Route path="/Blog.html/addblog" element={<BlogForm/>} />
              <Route path="/Blog.html/edit/:id?" element={<BlogForm />} />

              <Route path="/news-events.html" element={<NewsEventsList />} />
              <Route path="/news-events.html/:id" element={<NewsEventDetail />} />
              <Route path="/news-events.html/addEvents" element={<NewsEventForm/>} />
              <Route path="/news-events.html/edit/:id?" element={<NewsEventForm />} />
    
              {/* Protected Routes with GlobalStyles */}
              <Route
                element={
                  <ProtectedRoute>
                    <>
                      <GlobalStyles />
                      <Outlet />
                    </>
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/employees" element={<EmployeeManagement />} />
                <Route path="/attendance-tracking" element={<AttendanceTracking />} />
                <Route path="/leave-management" element={<LeaveManagement />} />
                <Route path="/holidays" element={<HolidayCalendar />} />
                {/* <Route path="/timesheet" element={<TimeSheetManagement />} /> */}
                <Route path="/timesheet" element={<TimesheetRouter />} />
                <Route path="/managers/timesheet/dashboard" element={<ProjectManagementTimesheet />} />
                {/* <Route path="/project-management-timesheet" element={<ProjectManagementTimesheet />} /> */}
                <Route path="/shifts" element={<ShiftScheduling />} />
                <Route path="/claims" element={<MyClaims />} />
                <Route path="/appointees" element={<Appointees />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/helpdesk" element={<HelpDesk />} />
                <Route path="/requestdesk" element={<RequestDesk />} />
                <Route path="/resolvedesk" element={<HelpDesk />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/payslip" element={<MyPaySlip />} />
                <Route path="/wishes" element={<MyWishes />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/appointments" element={<MyAppointments />} />
                <Route path="/shift-detail" element={<MyShiftDetail />} />
                <Route path="/appointmentlist" element={<MyBookedAppointments />} />
                <Route path="/doctordashboard" element={<DoctorDashboard />} />
                <Route path="/OPDappointments" element={<Appointments />} />
                <Route path="/projectmanagement" element={<ProjectManagement />} />
                <Route path="/project-report" element={<ProjectReport />} />
                <Route path="/my-training" element={<MyTraining />} />
                <Route path="/IPDappointments" element={<InPatients />} />
                <Route path="/patient-admission" element={<PatientAdmission />} />
                {/* <Route path="/appraisal" element={<MyAppriaisal />} /> */}

                {/* FMS PAGE ROUTES */}
                <Route path="/fmsdashboard" element={<FmsDashBoard />} />
                <Route path="/tasks" element={<TaskScreen />} />
                <Route path="/customerList" element={<CustomerList />} />
                <Route path="/ticketList" element={<TaskScreen />} />
              </Route>
    
              {/* Catch All */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer2 />
          </Router>
          <ToastContainer position="top-right" autoClose={3000} />
          </ExportProvider>
        </ThemeProvider>
      </AuthProvider>
    );
    
}

export default App;
