import React, { useEffect, useState } from 'react';
import { FiCalendar, FiClock, FiPackage, FiFileText, FiCheck} from 'react-icons/fi';
import { FaTimes, FaUpload } from 'react-icons/fa';
import styled from 'styled-components';
import { useTheme } from '../../../context/ThemeContext';
import Button from '../../Button';
import Badge from '../../Badge';
import {
  getStatusVariant,
  getCurrentDateTimeDefaults,
  getYesterday
} from '../../../pages/ProjectManagement/utils/utils';

// ── Styled Components (now correctly receive theme) ─────────────────────
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 16px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
`

const ModalHeader = styled.div`
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.primaryLight};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.2s;

  &:hover {
    color: ${props => props.theme.colors.error || '#ff3d00'};
    transform: rotate(90deg);
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`

const ModalFooter = styled.div`
  padding: 1.5rem 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    button { width: 100%; }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const Required = styled.span`
  color: ${props => props.theme.colors.error};
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primaryLight};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primaryLight};
  }
`;

const ActivityInfoCard = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primaryLight} 0%, #ffffff 100%);
  border: 1px solid ${props => props.theme.colors.primary}20;
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1.8rem;
  box-shadow: 0 4px 15px ${props => props.theme.colors.shadow || 'rgba(108,99,255,0.1)'};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 6px;
    height: 100%;
    background: ${props => props.theme.colors.primary};
  }
`;

const ActivityTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1px;
  font-size: 0.92rem;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.textLight};
  min-width: 110px;
`;

const InfoValue = styled.span`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;
const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`
const FileUploadContainer = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primaryLight}22;
  }
`

const FileUploadIcon = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`

const FileUploadText = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.5rem;
`

const FileInput = styled.input`
  display: none;
`

const UploadedFile = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: 0.5rem;
  
  span {
    flex: 1;
    margin-left: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  button {
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.error};
    cursor: pointer;
  }
`
const WarningBox = styled.div`
  background: #fdecea;
  padding: 12px;
  border-left: 5px solid red;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text}
`

// Reusable wrapper for icon inside input
// const IconInputWrapper = ({ icon: Icon, children }) => (
//   <div style={{ position: 'relative' }}>
//     {children}
//     {Icon && <Icon style={{ position: 'absolute', left: '12px', top: '14px', color: '#666', pointerEvents: 'none' }} />}
//   </div>
// );

const ProjectManagementAddForm = ({
  isOpen,
  onClose,
  activity,
  onSubmit,
  onActivitySubmit,
  isSubmitting,
  modalContext,
  forceMode
}) => {
  const theme = useTheme(); // This line is now safe
    const {
    todayISO,
    dayLogKey: todayDayLogKey,
    apiDate: todayApiDate,
    currentTime
  } = getCurrentDateTimeDefaults()
  const [formData, setFormData] = useState({
  date: "",
  startTime: "",
  endTime: "",
  noOfItems: 0,
  remarks: "",
  file: null
})

console.log(formData)

  const yesterday = getYesterday()

  const dayLogToday = activity?.day_logs?.[todayDayLogKey]
  const dayLogYesterday = activity?.day_logs?.[yesterday.dayLogKey]

  const isActivityCompleted =
    activity?.status_display === "COMPLETED" ||
    activity?.project_period_status === "COMPLETED"

  const forcedUpdateYesterday =
    !!dayLogYesterday?.check_in && !dayLogYesterday?.check_out

  const derivedUpdateMode =
    !isActivityCompleted &&
    (forcedUpdateYesterday || (dayLogToday?.check_in && !dayLogToday?.check_out))

  const isUpdateMode = forceMode
    ? forceMode === "UPDATE"
    : derivedUpdateMode

const forcedDate = modalContext?.forcedDate;

const activeDate = forcedDate
  ? forcedDate     // forced YYYY-MM-DD for yesterday
  : forcedUpdateYesterday
  ? yesterday.input
  : todayISO;

const activeAPIDate = forcedDate
  ? forcedDate     // same for API date
  : forcedUpdateYesterday
  ? yesterday.apiDate
  : todayApiDate;

  // console.log("activity", activity)


useEffect(() => {
  if (!isActivityCompleted && isOpen) {
    setFormData({
      date: activeDate,
      startTime: currentTime,
      endTime: currentTime,
      noOfItems: 0,
      remarks: "",
      file: null
    })
  }
}, [isOpen, activeDate, activity, isActivityCompleted, currentTime])

  if (!isOpen || !activity) return null;

    if (isActivityCompleted) {
    return (
      <ModalOverlay>
        <ModalContainer>
          <ModalHeader>
            <h2>Activity Completed</h2>
            <CloseButton onClick={onClose}><FaTimes /></CloseButton>
          </ModalHeader>
          <ModalBody>
            ✅ This activity is already completed.
          </ModalBody>
        </ModalContainer>
      </ModalOverlay>
    )
  }


  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleChange('file', file);
  };

    const removeFile = () => {
    setFormData((prev) => ({
      ...prev,
      file: null,
    }))
  }


const handleSubmit = async () => {
  if (!onActivitySubmit) return

  const extraFields = {}
  if (modalContext?.type === "complete") {
    extraFields.is_completed = 1
  }

  const success = await onActivitySubmit({
    project: activity,
    mode: "UPDATE" ,
    data: {
      activityDate: activeAPIDate,
      // startTime: formData.startTime,
      endTime: formData.endTime,
      noOfItems: formData.noOfItems,
      remarks: formData.remarks,
      file: formData.file
    },
    extraFields
  })

  if (success) {
    onSubmit()
    onClose()
  }
}

  const isDisabled =
    (isUpdateMode && (!formData.endTime || !formData.noOfItems || !formData.remarks)) ||
    (!isUpdateMode && !formData.startTime) ||
    isSubmitting
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
           {activity.modalContext.type === "continue" ? "End Today's Activity" : "Complete activity"}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
           {forcedUpdateYesterday && (
            <WarningBox>
              ⚠️ Yesterday is still open. You must close it first.
            </WarningBox>
          )}
          {/* Activity Info Card */}
          <ActivityInfoCard>
            <ActivityTitle>Activity Details</ActivityTitle>
            <InfoGrid>
              <InfoItem>
                {/* <IconInputWrapper icon={FiHash} /> */}
                <InfoLabel>Company:</InfoLabel>
                <InfoValue>{activity.original_A.customer_name || "Company Name"}</InfoValue>
              </InfoItem>

              <InfoItem>
                {/* <FiActivity /> */}
                <InfoLabel>Activity Type:</InfoLabel>
                <InfoValue>{activity.original_A.product_name}</InfoValue>
              </InfoItem>

              <InfoItem>
                {/* <FiPackage /> */}
                <InfoLabel>Code:</InfoLabel>
                <InfoValue>{activity.original_A.order_item_key || '-'}</InfoValue>
              </InfoItem>

              <InfoItem>
                {/* <FiCalendar /> */}
                <InfoLabel>Planned:</InfoLabel>
                <InfoValue>
                  {activity.planned_start_date} → {activity.planned_end_date}
                </InfoValue>
              </InfoItem>

              <InfoItem>
                {/* <FiClock /> */}
                <InfoLabel>Status:</InfoLabel>
                <Badge variant={getStatusVariant(activity.todaysStatus || activity.project_period_status)}>{activity.todaysStatus || activity.project_period_status}</Badge>
              </InfoItem>

              <InfoItem>
                {/* <FiCheck /> */}
                <InfoLabel>Items Assigned:</InfoLabel>
                <InfoValue>{ activity.original_P?.no_of_items || 0}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </ActivityInfoCard>

          {/* Form Fields */}
          <FormGroup>
            <Label> Date <Required>*</Required></Label>
            {/* <IconInputWrapper icon={FiCalendar}> */}
              <Input type="date" value={formData.date} onChange={(e) => handleChange("date", e.target.value)}/>
            {/* </IconInputWrapper> */}
          </FormGroup>

          {!isUpdateMode && (
            <>
              <Label>Start Time</Label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => handleChange("startTime", e.target.value)}
              />
            </>
          )}

          {isUpdateMode && (
            <>
              <Label>End Time *</Label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => handleChange("endTime", e.target.value)}
              />

              <Label>Number of Items *</Label>
              <Input
                type="number"
                value={formData.noOfItems}
                onChange={(e) => handleChange("noOfItems", e.target.value)}
              />
            </>
          )}

          {/* <FormRow>

          <FormGroup>
            <Label>
               Start Time {hasCheckIn && '(Checked In at ' + dayLog.check_in.time + ')'}
            </Label>
            <IconInputWrapper icon={FiClock}>
              <Input
                type="time"
                value={formData.startTime}
                onChange={e => handleChange('startTime', e.target.value)}
                readOnly={hasCheckIn}
                required={!isUpdateMode}
                style={{ paddingLeft: '40px' }}
              />
            </IconInputWrapper>
          </FormGroup>

          {isUpdateMode && (
            <FormGroup>
              <Label> End Time <Required>*</Required></Label>
              <IconInputWrapper icon={FiClock}>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={e => handleChange('endTime', e.target.value)}
                  required
                  style={{ paddingLeft: '40px' }}
                />
              </IconInputWrapper>
            </FormGroup>
          )}

          <FormGroup>
            <Label> Number of Items <Required>*</Required></Label>
            <IconInputWrapper icon={FiPackage}>
              <Input
                type="number"
                min="0"
                value={formData.noOfItems}
                onChange={e => handleChange('noOfItems', e.target.value)}
                placeholder="0"
                required
                style={{ paddingLeft: '40px' }}
              />
            </IconInputWrapper>
          </FormGroup>
          </FormRow> */}

         {isUpdateMode &&
          <FormGroup>
            <Label><FiFileText /> Remarks (Optional)</Label>
            <TextArea
              value={formData.remarks}
              onChange={e => handleChange('remarks', e.target.value)}
              placeholder="Add any notes..."
            />
          </FormGroup>}

           <FormGroup>
                        <Label>Receipts/Attachments</Label>
                        <FileUploadContainer onClick={() => document.getElementById("file-upload").click()}>
                          <FileInput id="file-upload" name="file" type="file"  onChange={handleFileChange}/>
                          <FileUploadIcon>
                            <FaUpload />
                          </FileUploadIcon>
                          <FileUploadText>Click to upload or drag and drop files here</FileUploadText>
                          <div style={{ fontSize: "0.8rem", color: "#666" }}>Supported formats: JPG, PNG, PDF (Max 5MB)</div>
                        </FileUploadContainer>
                        {/* <ErrorMessage show={isFileError && isReceiptRequired}>please upload or drag and drop files here</ErrorMessage> */}
          
                        {formData.file && (
                          <div style={{ marginTop: "1rem" }}>
                            <div style={{ fontWeight: "500", marginBottom: "0.5rem" }}>
                              Uploaded Files (1)
                            </div>
                              <UploadedFile >
                                <FaUpload />
                                <span>{formData?.file.name}</span>
                                <button type="button" onClick={() => removeFile(1)}>
                                  <FaTimes />
                                </button>
                              </UploadedFile>
                          </div>
                        )}
                      </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isDisabled}
          >
            <FiCheck style={{ marginRight: 8 }} />
            {isUpdateMode ? "Submit & Close" : "Check In"}
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ProjectManagementAddForm;