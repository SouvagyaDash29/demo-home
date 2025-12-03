"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import styled from "styled-components"
import {
  FaHome,
  FaClock,
  FaCalendarAlt,
  FaCalendarCheck,
  FaFileAlt,
  FaMoneyBillWave,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaTicketAlt,
  FaUserCircle,
  FaComments,
  FaGift,
  FaFileInvoiceDollar,
  FaLifeRing,
  FaExchangeAlt,
  FaStethoscope,
  FaChartBar,
  FaUsers,
  FaFileInvoice,
  FaGraduationCap,
  FaKey,
  FaTasks,
} from "react-icons/fa"
import { SiGooglecalendar } from "react-icons/si"
import { PiListPlusFill } from "react-icons/pi"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { IoTicket } from "react-icons/io5"
import { RiDashboardFill } from "react-icons/ri"
const SidebarContainer = styled.div`
  width: ${(props) => {
    const { isOpen, uiPreferences } = props
    const sidebarStyle = uiPreferences?.layout?.sidebarStyle || "standard"

    if (!isOpen) {
      return "70px"
    }

    if (sidebarStyle === "compact") {
      return "200px"
    } else if (sidebarStyle === "expanded") {
      return "280px"
    } else {
      return "250px" // standard
    }
  }};
  height: 100vh;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  position: fixed;
  left: 0;
  top: 0;
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: ${(props) => {
    const { uiPreferences } = props
    const shadowIntensity = uiPreferences?.components?.shadowIntensity || "medium"

    if (shadowIntensity === "none") {
      return "none"
    } else if (shadowIntensity === "heavy") {
      return "3px 0 15px rgba(0, 0, 0, 0.2)"
    } else {
      return "2px 0 10px rgba(0, 0, 0, 0.1)" // medium
    }
  }};
  overflow-x: hidden;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    width: ${(props) => (props.isOpen ? "250px" : "0")};
    left: ${(props) => (props.isOpen ? "0" : "-70px")};
    box-shadow: ${(props) => (props.isOpen ? "2px 0 10px rgba(0, 0, 0, 0.1)" : "none")};
  }
`

const SidebarHeader = styled.div`
  padding: ${(props) => {
    const { uiPreferences } = props
    const layoutDensity = uiPreferences?.layout?.density || "comfortable"

    if (layoutDensity === "compact") {
      return "15px"
    } else if (layoutDensity === "spacious") {
      return "25px"
    } else {
      return "20px" // comfortable
    }
  }};
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isOpen ? "space-between" : "center")};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const Logo = styled.div`
  font-size: ${(props) => {
    const { uiPreferences } = props
    const fontSize = uiPreferences?.typography?.fontSize || "medium"

    if (fontSize === "small") {
      return "1.3rem"
    } else if (fontSize === "large") {
      return "1.7rem"
    } else {
      return "1.5rem" // medium
    }
  }};
  font-weight: bold;
  color: white;
  display: ${(props) => (props.isOpen ? "block" : "none")};
  font-family: ${(props) => {
    const { uiPreferences } = props
    const fontFamily = uiPreferences?.typography?.fontFamily || "Poppins"
    return `${fontFamily}, sans-serif`
  }};
`

const ToggleButton = styled.button`
  background: transparent;
  color: white;
  border: none;
  font-size: ${(props) => {
    const { uiPreferences } = props
    const iconSize = uiPreferences?.components?.iconSize || "medium"

    if (iconSize === "small") {
      return "1rem"
    } else if (iconSize === "large") {
      return "1.4rem"
    } else {
      return "1.2rem" // medium
    }
  }};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${(props) => {
    const { uiPreferences } = props
    const animations = uiPreferences?.components?.animations !== false
    return animations ? "all 0.3s ease" : "none"
  }};
  
  &:hover {
    transform: ${(props) => {
      const { uiPreferences } = props
      const animations = uiPreferences?.components?.animations !== false
      return animations ? "scale(1.1)" : "none"
    }};
  }
`

const SidebarMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: ${(props) => {
    const { uiPreferences } = props
    const layoutDensity = uiPreferences?.layout?.density || "comfortable"

    if (layoutDensity === "compact") {
      return "15px"
    } else if (layoutDensity === "spacious") {
      return "25px"
    } else {
      return "20px" // comfortable
    }
  }};
  height: calc(100vh - 140px);
  overflow-y: auto;
  padding-bottom: 48px;
  
  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
`

const SidebarMenuItem = styled.li`
  margin-bottom: ${(props) => {
    const { uiPreferences } = props
    const layoutDensity = uiPreferences?.layout?.density || "comfortable"

    if (layoutDensity === "compact") {
      return "3px"
    } else if (layoutDensity === "spacious") {
      return "8px"
    } else {
      return "5px" // comfortable
    }
  }};
`

const SidebarLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: ${(props) => {
    const { uiPreferences } = props
    const layoutDensity = uiPreferences?.layout?.density || "comfortable"

    if (layoutDensity === "compact") {
      return "10px 15px"
    } else if (layoutDensity === "spacious") {
      return "14px 25px"
    } else {
      return "12px 20px" // comfortable
    }
  }};
  color: white;
  text-decoration: none;
  transition: ${(props) => {
    const { uiPreferences } = props
    const animations = uiPreferences?.components?.animations !== false
    return animations ? "all 0.3s ease" : "none"
  }};
  border-left: 3px solid transparent;
  font-family: ${(props) => {
    const { uiPreferences } = props
    const fontFamily = uiPreferences?.typography?.fontFamily || "Poppins"
    return `${fontFamily}, sans-serif`
  }};
  font-size: ${(props) => {
    const { uiPreferences } = props
    const fontSize = uiPreferences?.typography?.fontSize || "medium"

    if (fontSize === "small") {
      return "0.9rem"
    } else if (fontSize === "large") {
      return "1.1rem"
    } else {
      return "1rem" // medium
    }
  }};
  
  ${(props) =>
    props.active &&
    `
    background: rgba(255, 255, 255, 0.1);
    border-left-color: ${props.theme.colors.secondary};
  `}
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  svg {
    margin-right: ${(props) => (props.isOpen ? "10px" : "0")};
    font-size: ${(props) => {
      const { uiPreferences } = props
      const iconSize = uiPreferences?.components?.iconSize || "medium"

      if (iconSize === "small") {
        return "1rem"
      } else if (iconSize === "large") {
        return "1.4rem"
      } else {
        return "1.2rem" // medium
      }
    }};
  }
  
  span {
    display: ${(props) => (props.isOpen ? "block" : "none")};
    white-space: nowrap;
  }
`

const SidebarFooter = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: ${(props) => {
    const { uiPreferences } = props
    const layoutDensity = uiPreferences?.layout?.density || "comfortable"

    if (layoutDensity === "compact") {
      return "10px"
    } else if (layoutDensity === "spacious") {
      return "20px"
    } else {
      return "15px" // comfortable
    }
  }};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isOpen ? "space-between" : "center")};
  background: ${({ theme }) => theme.colors.primary};
`

const UserInfo = styled.div`
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  align-items: center;
`

const UserAvatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-weight: bold;
  font-family: ${(props) => {
    const { uiPreferences } = props
    const fontFamily = uiPreferences?.typography?.fontFamily || "Poppins"
    return `${fontFamily}, sans-serif`
  }};
`

const UserName = styled.span`
  font-size: ${(props) => {
    const { uiPreferences } = props
    const fontSize = uiPreferences?.typography?.fontSize || "medium"

    if (fontSize === "small") {
      return "0.8rem"
    } else if (fontSize === "large") {
      return "1rem"
    } else {
      return "0.9rem" // medium
    }
  }};
  font-family: ${(props) => {
    const { uiPreferences } = props
    const fontFamily = uiPreferences?.typography?.fontFamily || "Poppins"
    return `${fontFamily}, sans-serif`
  }};
`

const LogoutButton = styled.button`
  background: transparent;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${(props) => {
    const { uiPreferences } = props
    const animations = uiPreferences?.components?.animations !== false
    return animations ? "all 0.3s ease" : "none"
  }};
  
  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
    transform: ${(props) => {
      const { uiPreferences } = props
      const animations = uiPreferences?.components?.animations !== false
      return animations ? "scale(1.1)" : "none"
    }};
  }
  
  svg {
    font-size: ${(props) => {
      const { uiPreferences } = props
      const iconSize = uiPreferences?.components?.iconSize || "medium"

      if (iconSize === "small") {
        return "1rem"
      } else if (iconSize === "large") {
        return "1.4rem"
      } else {
        return "1.2rem" // medium
      }
    }};
  }
`
// Add new styled components for grouped menu items
const MenuGroup = styled.div`
  margin-bottom: 5px;
`

const MenuGroupHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: ${(props) => {
    const { uiPreferences } = props
    const fontFamily = uiPreferences?.typography?.fontFamily || "Poppins"
    return `${fontFamily}, sans-serif`
  }};
  font-size: ${(props) => {
    const { uiPreferences } = props
    const fontSize = uiPreferences?.typography?.fontSize || "medium"
    if (fontSize === "small") return "0.9rem"
    if (fontSize === "large") return "1.1rem"
    return "1rem" // medium
  }};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  svg {
    margin-right: 10px;
    font-size: ${(props) => {
      const { uiPreferences } = props
      const iconSize = uiPreferences?.components?.iconSize || "medium"
      if (iconSize === "small") return "1rem"
      if (iconSize === "large") return "1.4rem"
      return "1.2rem" // medium
    }};
  }
  
  span {
    flex-grow: 1;
    white-space: nowrap;
  }
  
  .arrow {
    transition: transform 0.3s ease;
    transform: ${({ isOpen }) => (isOpen ? "rotate(0deg)" : "rotate(-90deg)")};
  }
`

const SubMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
  max-height: ${({ isOpen, itemCount }) => (isOpen ? `${itemCount * 44}px` : "0")};
  transition: max-height 0.3s ease;
`

const SubMenuItem = styled.li`
  margin-bottom: 2px;
`

const SubMenuLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 10px 20px 10px 50px;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  font-family: ${(props) => {
    const { uiPreferences } = props
    const fontFamily = uiPreferences?.typography?.fontFamily || "Poppins"
    return `${fontFamily}, sans-serif`
  }};
  font-size: 0.9rem;
  
  ${(props) =>
    props.active &&
    `
    background: rgba(255, 255, 255, 0.1);
    border-left: 3px solid ${props.theme.colors.secondary};
    padding-left: 47px;
  `}
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  svg {
    margin-right: 10px;
    font-size: 1rem;
  }
`
const Sidebar = ({ onToggle, initialOpen = true }) => {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const [expandedGroups, setExpandedGroups] = useState({})
  const location = useLocation()
  const { companyInfo, logout, profile,  iscoustomerLogin } = useAuth()
  const { theme, uiPreferences } = useTheme()
  const customerdata = localStorage.getItem("customerUser")
  const fmsdata = localStorage.getItem("fmsUser")
  const sidebarStyle = uiPreferences?.layout?.sidebarStyle || "standard"
  // Grouped menu items structure
  const menuGroups = customerdata
  ? [
      {
        name: "Customer Portal",
        icon: <FaUserCircle />,
        items: [
          { path: "/invoices", name: "Invoices", icon: <FaFileInvoiceDollar /> },
          { path: "/tickets", name: "Support Tickets", icon: <FaLifeRing /> },
          { path: "/appointments", name: "Book Appointments", icon: <FaStethoscope /> },
          { path: "/appointmentlist", name: "My Appointments", icon: <FaCalendarAlt /> },
        ],
      },
    ]
  : fmsdata
  ? [
    {
        name: "Facility Management Portal",
        icon: <FaUserCircle />,
        items: [
          { path: "/fmsdashboard", name: "Overall", icon: <FaHome /> },
          { path: "/tasks", name: "Task List", icon: <FaTasks /> },
          { path: "/ticketList", name: "Ticket List", icon: <IoTicket /> },
          ...(profile?.is_manager ? [{ path: "/customerList", name: "Customer List", icon: <FaUsers /> }] : [] )
        ],
      },
  ]
  : [
        {
          name: "Dashboard",
          icon: <FaHome />,
          items: [{ path: "/dashboard", name: "Overview", icon: <FaHome /> }],
        },
        {
          name: "Time Management",
          icon: <FaClock />,
          items: [
            { path: "/attendance-tracking", name: "Attendance", icon: <FaClock /> },
            { path: "/timesheet", name: "Timesheet", icon: <FaChartBar /> },
            ...(companyInfo.business_type === "APM" && profile?.is_manager ? [{ path: "/managers/timesheet/dashboard", name: "Manager Dashboard", icon: <RiDashboardFill /> }] : []),

            ...(profile?.is_shift_applicable
              ? [{ path: "/shift-detail", name: "My Shifts", icon: <FaExchangeAlt /> }]
              : []),
            ...(profile?.is_manager ? [{ path: "/shifts", name: "Shift Scheduling", icon: <SiGooglecalendar /> }] : []),
          ],
        },
        {
          name: "Leave & Holidays",
          icon: <FaCalendarAlt />,
          items: [
            { path: "/leave-management", name: "Leave Management", icon: <FaCalendarAlt /> },
            { path: "/holidays", name: "Holiday Calendar", icon: <FaCalendarCheck /> },
          ],
        },
        {
          name: "Learning & Development",
          icon: <FaGraduationCap />,
          items: [{ path: "/my-training", name: "My Training", icon: <FaGraduationCap /> }],
        },
        {
          name: "Finance",
          icon: <FaMoneyBillWave />,
          items: [
            ...(profile?.is_manager
              ? [{ path: "/claims", name: "My Claims", icon: <FaMoneyBillWave /> }]
              : [{ path: "/claims", name: "My Claims", icon: <FaMoneyBillWave /> }]),
            { path: "/payslip", name: "Pay Slip", icon: <FaFileAlt /> },
          ],
        },
        {
          name: "Projects",
          icon: <PiListPlusFill />,
          items: profile?.is_manager
            ? [
                { path: "/projectmanagement", name: "Project List", icon: <PiListPlusFill /> },
                { path: "/project-report", name: "Project Report", icon: <FaFileInvoice /> },
              ]
            : [],
        },
        {
          name: "Employee Management",
          icon: <FaUsers />,
          items: profile?.is_manager ? [{ path: "/employees", name: "Employees", icon: <FaUsers /> }] : [],
        },
        {
          name: "Support",
          icon: <FaComments />,
          items: [
            { path: "/helpdesk", name: "Help Desk", icon: <FaComments /> },
            { path: "/requestdesk", name: "Request Desk", icon: <FaTicketAlt /> },
            { path: "/resolvedesk", name: "Resolve Desk", icon: <FaKey /> },
            // { path: "/patient-admission", name: "Patient Admission", icon: <FaHome /> },
          ],
        },
        {
          name: "Personal",
          icon: <FaUserCircle />,
          items: [
            { path: "/wishes", name: "My Wishes", icon: <FaGift /> },
            { path: "/profile", name: "My Profile", icon: <FaUserCircle /> },
            // { path: "/DoctorDashboard", name: "Dashboard", icon: <FaHome /> },
            // { path: "/OPDappointments", name: "Out-patients", icon: <FaUserFriends /> },
            // { path: "/IPDappointments", name: "In-patients", icon: <FaUserFriends /> },
          ],
        },
      ]

        // If company is APM, hide specific paths
  const apmBlockedPaths = new Set([
    "/dashboard",
    "/attendance-tracking",
    "/leave-management",
    "/holidays",
    "/my-training",
    "/helpdesk",
    "/requestdesk",
    "/resolvedesk",
    "/payslip",
    "/shift-detail",
    "/projectmanagement",
    "/project-report",
    "/wishes"
  ])

  const shouldHideForAPM = companyInfo?.business_type === "APM"
const finalMenuGroups = shouldHideForAPM
  ? menuGroups
      .map(g => ({ ...g, items: g.items.filter(i => !apmBlockedPaths.has(i.path)) }))
      .filter(g => g.items && g.items.length > 0)
  : menuGroups

  useEffect(() => {
    setIsOpen(initialOpen)
    // Initialize expanded groups based on current path
    const initialExpanded = {}
    menuGroups.forEach((group) => {
      const hasActiveItem = group.items.some((item) => location.pathname.startsWith(item.path))
      initialExpanded[group.name] = hasActiveItem
    })
    setExpandedGroups(initialExpanded)
  }, [initialOpen, location.pathname])

  const toggleSidebar = () => {
    const newState = !isOpen
    setIsOpen(newState)
    if (onToggle) onToggle(newState)
  }

  const toggleGroup = (groupName) => {
    if (!isOpen) {
      toggleSidebar()
    }
    setTimeout(() => {
      setExpandedGroups((prev) => ({
        ...prev,
        [groupName]: !prev[groupName],
      }))
    }, 100)
  }
  const menuItems = customerdata
    ? [
        { path: "/invoices", name: "Invoices", icon: <FaFileInvoiceDollar /> },
        { path: "/tickets", name: "Support Tickets", icon: <FaLifeRing /> },
        { path: "/appointments", name: "Book Appointments", icon: <FaStethoscope /> },
        { path: "/appointmentlist", name: "My Appointments", icon: <FaCalendarAlt /> },
      ]
    : fmsdata
    ? [
      { path: "/fmsdashboard", name: "Overall", icon: <FaHome /> },
      { path: "/tasks", name: "Task List", icon: <FaTasks /> },
      { path: "/ticketList", name: "Ticket List", icon: <IoTicket /> },
      // { path: "/customerList", name: "Customer List", icon: <FaUsers /> },
      ...(profile?.is_manager ? [{ path: "/customerList", name: "Customer List", icon: <FaUsers /> }] : [] )
    ]: 
    [
        { path: "/dashboard", name: "Dashboard", icon: <FaHome /> },
        ...(profile?.is_manager ? [{ path: "/employees", name: "Employees", icon: <FaUsers /> }] : []),
        { path: "/attendance-tracking", name: "Attendance", icon: <FaClock /> },
        ...(companyInfo.business_type === "APM" && profile?.is_manager ? [{ path: "/managers/timesheet/dashboard", name: "Manager Dashboard", icon: <RiDashboardFill /> }] : []),
        { path: "/timesheet", name: `${companyInfo.business_type === "APM" ? "Dashboard" : "Timesheet"}`, icon: <FaChartBar /> },
        { path: "/leave-management", name: "Leave Management", icon: <FaCalendarAlt /> },
        { path: "/holidays", name: "Holiday Calendar", icon: <FaCalendarCheck /> },
        { path: "/my-training", name: "My Training", icon: <FaGraduationCap /> },
        // { path: "/appraisal", name: "Appraisal", icon: <BsGraphUpArrow /> },
        ...(profile?.is_manager ? [{ path: "/shifts", name: "Shift Scheduling", icon: <SiGooglecalendar /> }] : []),
        ...(profile?.is_manager
          ? [{ path: "/claims", name: "Claims Management", icon: <FaMoneyBillWave /> }]
          : [{ path: "/claims", name: "My Claims", icon: <FaMoneyBillWave /> }]),
        // { path: "/appointees", name: "Appointees", icon: <FaUserPlus /> },
        // { path: "/analytics", name: "Analytics", icon: <FaChartBar /> },
        { path: "/helpdesk", name: "Help Desk", icon: <FaComments /> },
        { path: "/requestdesk", name: "Request Desk", icon: <FaTicketAlt /> },
        { path: "/resolvedesk", name: "Resolve Desk", icon: <FaKey /> },
        { path: "/payslip", name: "Pay Slip", icon: <FaFileAlt /> },
        ...(profile?.is_shift_applicable
          ? [{ path: "/shift-detail", name: "My Shifts", icon: <FaExchangeAlt /> }]
          : []),
        ...(profile?.is_manager
          ? [
              { path: "/projectmanagement", name: "Project List", icon: <PiListPlusFill /> },
              { path: "/project-report", name: "Project Report", icon: <FaFileInvoice /> },
            ]
          : []),
        { path: "/wishes", name: "My Wishes", icon: <FaGift /> },
        { path: "/profile", name: "My Profile", icon: <FaUserCircle />, section: "Account" },
      ]

const finalMenuItems = shouldHideForAPM
  ? menuItems.filter(i => !apmBlockedPaths.has(i.path))
  : menuItems

  return (
    <SidebarContainer isOpen={isOpen} theme={theme} uiPreferences={uiPreferences}>
      <SidebarHeader isOpen={isOpen} uiPreferences={uiPreferences}>
        {iscoustomerLogin ? (
          <Logo isOpen={isOpen} uiPreferences={uiPreferences}>
            <img
              src={profile.image || "/placeholder.svg"}
              alt="Company Logo"
              style={{ width: "70px", height: "70px", marginRight: "1rem", borderRadius: "50%" }}
            />
          </Logo>
        ) : (
          <Logo isOpen={isOpen} uiPreferences={uiPreferences}>
            <img
              src={"https://atomwalk.com/static/office/image/Atom_walk_logo.jpg"}
              alt="Company Logo"
              style={{ width: "80px", marginRight: "1rem", borderRadius: "10px" }}
            />{" "}
           {fmsdata? "FMS": "HRMS"}
          </Logo>
        )}
        <ToggleButton onClick={toggleSidebar} uiPreferences={uiPreferences}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </ToggleButton>
      </SidebarHeader>

      {sidebarStyle === "standard" ? (
        <SidebarMenu uiPreferences={uiPreferences}>
          {finalMenuItems.map((item) => (
            <SidebarMenuItem key={item.path} uiPreferences={uiPreferences}>
              <SidebarLink
                to={item.path}
                active={location.pathname === item.path ? 1 : 0}
                isOpen={isOpen}
                theme={theme}
                uiPreferences={uiPreferences}
              >
                {item.icon}
                <span>{item.name}</span>
              </SidebarLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      ) : (
        <SidebarMenu uiPreferences={uiPreferences}>
          {finalMenuGroups.map((group) => (
            <MenuGroup key={group.name}>
              <MenuGroupHeader
                onClick={() => toggleGroup(group.name)}
                isOpen={isOpen}
                expanded={expandedGroups[group.name]}
                uiPreferences={uiPreferences}
              >
                {group.icon}
                <span>{isOpen ? group.name : ""}</span>
                {/* {isOpen && (
                  <span className="arrow">
                    {expandedGroups[group.name] ? <FaChevronDown /> : <FaChevronRight />}
                  </span>
              )} */}
              </MenuGroupHeader>

              <SubMenu isOpen={expandedGroups[group.name] && isOpen} itemCount={group.items.length}>
                {group.items.map((item) => (
                  <SubMenuItem key={item.path}>
                    <SubMenuLink
                      to={item.path}
                      active={location.pathname.startsWith(item.path) ? 1 : 0}
                      isOpen={isOpen}
                      theme={theme}
                      uiPreferences={uiPreferences}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </SubMenuLink>
                  </SubMenuItem>
                ))}
              </SubMenu>
            </MenuGroup>
          ))}
        </SidebarMenu>
      )}

      <SidebarFooter isOpen={isOpen} theme={theme} uiPreferences={uiPreferences}>
        <UserInfo isOpen={isOpen}>
          <UserAvatar theme={theme} uiPreferences={uiPreferences}>
            {profile?.name?.charAt(0) || "U"}
          </UserAvatar>
          <UserName uiPreferences={uiPreferences}>{profile?.name || "User"}</UserName>
        </UserInfo>
        <LogoutButton onClick={logout} title="Logout" theme={theme} uiPreferences={uiPreferences}>
          <FaSignOutAlt />
        </LogoutButton>
      </SidebarFooter>
    </SidebarContainer>
  )
}

export default Sidebar
