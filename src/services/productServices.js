import { addEmpLeave, getEmpLeavedata, addClaim, getEmpClaimdata, getExpenseItemList, getProjectList, getEmpAttendanceData, getEmpHolidayData, empCheckData, processClaim, getClaimApproverList, getfiletotext,  processAppointee, getEmployeeRequestList, getEmployeeRequestCategory, processEmployeeRequest, setuserpin, getEventList, getCompany, getpayslip, processbarthdaywish, getResponseList, forgetPin, getCustomerDetailListURL, userTaskListURL, addCustomerTicketURL, getTaskCategoryURL, getOrderListURL, getEmpShiftData, getAppointeeList, getbookedlist, doctorbooking, getactivityList, getProjectLists, addTimesheet, getTimesheetList, profileDtlURL, processProjectLists, getprojectTimesheetList, getCustomerListURL, getProcessListURL, processProjectList, createaddressURL, equipentTypeListURL, getAvailableRoomslistURL, getActivitylistURL, validateApproveLimit, getMyenrollmentlist, getenrollmentlist, processenrollments, getTravelRequest, getTravelModeList, postTravelRequest, employeeTaskAllocationData, processAllocation } from "../services/ConstantServies";
import { authAxios, authAxiosFilePost, authAxiosget, authAxiosPost } from "./HttpMethod";

export function getEmpLeave(leave_type, emp_id) {
  let data = {};
  if (leave_type) {
    data['leave_type '] = leave_type;
  }
  if (emp_id) {
    data['emp_id'] = emp_id;
  }
  // console.log('Epm leave payload service', data)
  return authAxios(getEmpLeavedata, data)
}

export function postEmpLeave(leave_type) {
  let data = {};
  if (leave_type) {
    data['leave_data'] = leave_type;
  }
  // console.log('Data to be sent for leave:', data);
  return authAxiosPost(addEmpLeave, data)

}

export function postClaim(claim_data) {
  return authAxiosFilePost(addClaim, claim_data)
}
export function postvent(claim_data) {
  return authAxiosFilePost(processbarthdaywish, claim_data)
}
export function postClaimAction(claim_type) {
  let data = {};
  if (claim_type) {
    data['claim_data'] = claim_type;
  }
  // console.log('Data to be sent:', data);
  return authAxiosPost(processClaim, data)

}
export function posttimelist(timedata) {
  let data = {};
  if (timedata) {
    data['ts_data'] = timedata;
  }
  // console.log('Data to be sent:', data);
  return authAxiosPost(addTimesheet, data)
}

export function getClaimApprover() {
  return authAxios(getClaimApproverList)
}
export function getemployeeList() {
  return authAxios (profileDtlURL)
}
export function getEmpClaim(call_type, emp_id) {
  let data = {};
  if (call_type) {
    data['call_mode'] = call_type;
  }
  if (emp_id) {
    data['emp_id'] = emp_id;
  }
  return authAxios(getEmpClaimdata, data)
}

export function getExpenseItem() {
  return authAxios(getExpenseItemList)
}


export function getExpenseProjectList() {
  return authAxios(getProjectList)
}

export function getEmpAttendance(res) {
  let data = {
    'emp_id':res.empId?res.empId: localStorage.getItem('empNoId'),
    'month': res.month,
    'year': res.year,
    'start_date': res.startdate,
    'end_date': res.enddate,
  };
  // console.log('Final response data', data)
  return authAxios(getEmpAttendanceData, data)
}
export function getTimesheetData(start_date, end_date,empid) {
  let data = {
    'start_date':start_date,
    'end_date': end_date,
    'emp_id': empid
  };

  return authAxios(getTimesheetList, data)
}
export function getprojectreport(start_date, end_date) {
  let data = {
    'start_date':start_date,
    'end_date': end_date,
  };

  return authAxios(getprojectTimesheetList, data)
}
export function getEmpHoliday(res) {
  let data = {
    'year': res.year,
    'emp_id': localStorage.getItem('empNoId'),
  };
  // console.log('Final response data', data)
  return authAxios(getEmpHolidayData, data)
}
export function getEventLists(datas) {
  let data = {
    'emp_id': datas,
    'date_range': "D7",
  };
  return authAxios(getEventList, data)
}
export function getCompanyName(isFms) {
  let data = {
    'mobile_app_type': isFms ? 'FMS_E' :'HRM_E',
  };
  return authAxiosget(getCompany, data)
}
export function getemppayslip(datas) {
  let data = {
    "m_year": datas,
    "emp_id": localStorage.getItem('empId'),
  };
  return authAxiosPost(getpayslip, data)
}
export function getResponseLists(event_id) {
  const data = {
    event_id: event_id,
  }
  return authAxios(getResponseList, data)
}
export function postCheckIn(checkin_data) {
  let data = {};
  if (checkin_data) {
    data['attendance_data'] = checkin_data;
    // data = checkin_data;
  }
  // console.log('Data to be sent:', data);
  return authAxiosPost(empCheckData, data)
}
export function empshiftData(empdat) {
  let data={
    'emp_id': localStorage.getItem('empId'),
    "w_start":empdat
 }
  return authAxiosPost(getEmpShiftData, data)
}
export function empshiftDatas(empdat) {
  let data={
    "w_start":empdat
 }
  return authAxiosPost(getEmpShiftData, data)
}

export function imagetotext(Uri) {
  // console.log('getUserList3434',Uri)
  let data = {};
  data = Uri
  return authAxiosFilePost(getfiletotext, data);
}
export function postAppointee(res) {
  let data = {};
  if (res) {
    data['emp_data'] = res;
  }
  // console.log('Data to be sent:', data);
  return authAxiosPost(processAppointee, data)

}
export function postProject(res) {
  let data = {};
  if (res) {
    data['project_data'] = res;
  }
  // console.log('Data to be sent:', data);
  return authAxiosPost(processProjectLists, data)

}
export function postProject2(res) {
  let data = {};
  if (res) {
    data['project_data'] = res;
  }
  // console.log('Data to be sent:', data);
  return authAxiosPost(processProjectList, data)

}

export function getEmployeeRequest(empId) {
  let data = {
    'emp_id':empId,
    // 'request_sub_type':"Technical Support",
    // 'request_type': "R"
  };
  return authAxios(getEmployeeRequestList, data)
}
export function getEmployeeclaimlist() {
  return authAxios(getClaimApproverList)
}
export function getRequestCategory() {
  return authAxios(getEmployeeRequestCategory)
}

export function postEmpRequest(request_data) {
  // let data = {};
  // if (claim_data) {
  //   data = claim_data;
  // }
  // console.log('Data to be sent:', request_data);
  return authAxiosFilePost(processEmployeeRequest, request_data)
}
export function forgetUserPinView(data, dbName) {
  return authAxiosPost(`${forgetPin + dbName}/`, data);
}
export function getCustomerDetailList(customerId) {
  let data = {}
  if (customerId) {
    data['customer_id'] = customerId;
  }
  return authAxios(getCustomerDetailListURL, data);
}
export function getTasksList(task_type, emp_id, customer_id) {
  let data = {};
  // const emp_id= localStorage.getItem('empId');
  if (task_type) {
    data['task_type'] = task_type;
  }
    if (emp_id) {
    data['emp_id'] = emp_id;
  }
  if (customer_id) {
    data['customer_id'] = customer_id;
  }
  return authAxios(userTaskListURL, data)
}
export function getInvoiceList() {
  let data = {};
  const customer_id = localStorage.getItem('custId');
  if (customer_id) {
    data['customer_id'] = customer_id;
  }
  return authAxios(getOrderListURL, data)
}
export async function setuserpinview(o_pin, n_pin) {
  try {
    const customerId = localStorage.getItem("empId");
    let data = {
      u_id: customerId,
      o_pin: o_pin,
      n_pin: n_pin,
      user_type: "EMP",
    };

    const response = await authAxiosPost(setuserpin, data);
    if (response.status === 200) {
    // console.log("Pin updated successfully")
    }
    return response;
  } catch (error) {
    return error;
  }
}

export async function addCustomerTicket(request_data) {
  return authAxiosFilePost(addCustomerTicketURL, request_data)
}

export async function getTaskCategory() {
  return authAxios(getTaskCategoryURL)
}
export async function getActivitylist() {
  return authAxios(getactivityList)
}
export async function getProjectlist(data) {
  return authAxios(getProjectLists,data)
}
export function getequipmentlistview() {
  return authAxios(equipentTypeListURL)
}
export function getbookedlistview() {
  return authAxios(getbookedlist)
}

export function getCustomerListView() {
  return authAxios(getCustomerListURL)
}

export function getProcessListView() {
  return authAxios(getProcessListURL)
}

export function getEquipmentListView() {
  return authAxios(getAppointeeList)
}

export function getEquipentTypeListView() {
  return authAxios(equipentTypeListURL)
}

export function getActivityListView(projectCode) {
  const data = {};
  if (projectCode) {
    data['project_code'] = projectCode;
  }
  return authAxios(getActivitylistURL, data)
}

export function getAvailableRoomslistView(equipment_type, no_of_days) {
  const data = {};
  if (equipment_type) data['equipment_type'] = equipment_type;
  if (no_of_days) data['no_of_days'] = no_of_days;
  return authAxios(getAvailableRoomslistURL, data)
}

export function getmyenrollmentLists() {
  const emp_id= localStorage.getItem('empId');
  const data = {
    'emp_id': emp_id, 
  }
  return authAxios(getMyenrollmentlist,data)
}
export function getenrollmentList() {
  return authAxios(getenrollmentlist)
}
export function processenrollment(data) {
  return authAxiosFilePost(processenrollments, data)
}
export function doctorBookingView(booking_data) {
  let data = {};
  if (booking_data) {
    data['booking_data'] = booking_data;
  }
  console.log('Data to be sent for bed booking:', data);
  return authAxiosPost(doctorbooking, data)

}

export async function validateClaimItem(res) {
    let data = {
      'a_emp_id': res.emp_id,
      'm_claim_id': res.m_claim_id,
    };
    return authAxios(validateApproveLimit, data);
  }

export function getTravelRequestList() {
    const emp_id= localStorage.getItem('empId');
  const data = {
    'emp_id': emp_id, 
  }
  return authAxios(getTravelRequest,data)
}

export function getTravelMode() {
  return authAxios(getTravelModeList)
}

export function postTravelRequests(res) {
  let data = {};
  if (res) {
    data['travel_data'] = res;
  }
  // console.log('Data to be sent:', data);
  return authAxiosPost(postTravelRequest, data)
}

export function createAddressPost(res) {
  let data = {};
  if (res) {
    data['address_data'] = res;
  }
  // console.log('Data to be sent:', data);
  return authAxiosPost(createaddressURL, data)
}

export function getEmpAllocationData({emp_id, start_date, end_date}) {
  let data = {
    'emp_id': emp_id,
    'start_date':start_date,
    'end_date': end_date,
  };

  return authAxios(employeeTaskAllocationData, data)
}


export function postAllocationData(activity_data) {
    return authAxiosFilePost(processAllocation, activity_data);
  }