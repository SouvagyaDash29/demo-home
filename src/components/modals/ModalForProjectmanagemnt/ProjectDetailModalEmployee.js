import React from 'react';
import styled from 'styled-components';
import { X, User, Calendar, Clock, FileText, Activity, Hash, Package } from 'lucide-react';
import { FaIdBadge, FaRegIdBadge, FaRegIdCard } from "react-icons/fa";
import { AiTwotoneIdcard } from "react-icons/ai";
import Button from '../../Button';
import { FiCheck } from 'react-icons/fi';

// Styled Components
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
  padding: 20px;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;

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

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 95vh;
    margin: 10px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}15 0%, ${({ theme }) => theme.colors.primaryLight} 100%);
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
  color: ${({ theme }) => theme.colors.textLight};

  &:hover {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const ModalBody = styled.div`
  padding: 28px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const StatusBanner = styled.div`
  background: ${({ status, theme }) => {
    switch (status) {
      case 'S':
      case 'SUBMITTED':
        return `linear-gradient(135deg, ${theme.colors.info}20 0%, ${theme.colors.info}10 100%)`;
      case 'A':
      case 'APPROVED':
        return `linear-gradient(135deg, ${theme.colors.success}20 0%, ${theme.colors.success}10 100%)`;
      case 'R':
      case 'REJECTED':
        return `linear-gradient(135deg, ${theme.colors.error}20 0%, ${theme.colors.error}10 100%)`;
      default:
        return `linear-gradient(135deg, ${theme.colors.warning}20 0%, ${theme.colors.warning}10 100%)`;
    }
  }};
  border-left: 4px solid ${({ status, theme }) => {
    switch (status) {
      case 'S':
      case 'SUBMITTED':
        return theme.colors.info;
      case 'A':
      case 'APPROVED':
        return theme.colors.success;
      case 'R':
      case 'REJECTED':
        return theme.colors.error;
      default:
        return theme.colors.warning;
    }
  }};
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatusText = styled.div`
  font-weight: 700;
  font-size: 1rem;
  color: ${({ status, theme }) => {
    switch (status) {
      case 'S':
      case 'SUBMITTED':
        return theme.colors.info;
      case 'A':
      case 'APPROVED':
        return theme.colors.success;
      case 'R':
      case 'REJECTED':
        return theme.colors.error;
      default:
        return theme.colors.warning;
    }
  }};
`;

const Section = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const InfoIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textLight};
  font-weight: 500;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  line-height: 1.4;
`;

const RemarksBox = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 16px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
  min-height: 60px;
  font-style: ${({ isEmpty }) => isEmpty ? 'italic' : 'normal'};
  color: ${({ isEmpty, theme }) => isEmpty ? theme.colors.textLight : theme.colors.text};
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 24px 0;
`;

const ActivityTypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${({ theme, type }) => 
    type === 'P' ? `${theme.colors.primary}15` : `${theme.colors.warning}15`
  };
  color: ${({ theme, type }) => 
    type === 'P' ? theme.colors.primary : theme.colors.warning
  };
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 8px;
`;
const ModalFooter = styled.div`
  padding: 1rem 0rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    button { width: 100%; }
  }
`;

// Modal Component
const ProjectDetailModalEmployee = ({ data, onClose, theme, onMarkComplete, isSubmitting }) => {
  if (!data) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleMarkCompleteClick = () => {
    if (typeof onMarkComplete === "function") {
      onMarkComplete(data);
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer theme={theme}>
        <ModalHeader theme={theme}>
          <ModalTitle theme={theme}>Activity Details</ModalTitle>
          <CloseButton onClick={onClose} theme={theme}>
            <X />
          </CloseButton>
        </ModalHeader>

        <ModalBody theme={theme}>
          <StatusBanner status={data.status} theme={theme}>
            {/* <Activity size={24} /> */}
            <StatusText status={data.status} theme={theme}>
              Status: {data.status_display}
            </StatusText>
          </StatusBanner>

          <Section>
            <SectionTitle theme={theme}>
              {/* <User /> */}
              <FaRegIdCard />
              Employee Information
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoIconWrapper theme={theme}>
                  <User />
                </InfoIconWrapper>
                <InfoContent>
                  <InfoLabel theme={theme}>Employee Name</InfoLabel>
                  <InfoValue theme={theme}>{data.original_P.employee_name}</InfoValue>
                </InfoContent>
              </InfoItem>

              <InfoItem>
                <InfoIconWrapper theme={theme}>
                  {/* <FaIdBadge /> */}
                  <FaRegIdBadge />
                </InfoIconWrapper>
                <InfoContent>
                  <InfoLabel theme={theme}>Employee ID</InfoLabel>
                  <InfoValue theme={theme}>{data.original_P.emp_id}</InfoValue>
                </InfoContent>
              </InfoItem>
            </InfoGrid>
          </Section>

          <Divider theme={theme} />

          <Section>
            <SectionTitle theme={theme}>
              <FileText />
              Project & Activity
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoIconWrapper theme={theme}>
                  <FileText />
                </InfoIconWrapper>
                <InfoContent>
                  <InfoLabel theme={theme}>Project Name</InfoLabel>
                  <InfoValue theme={theme}>{data.project_name}</InfoValue>
                </InfoContent>
              </InfoItem>

              <InfoItem>
                <InfoIconWrapper theme={theme}>
                  <Activity />
                </InfoIconWrapper>
                <InfoContent>
                  <InfoLabel theme={theme}>Activity Name</InfoLabel>
                  <InfoValue theme={theme}>
                    {data.activity_name}
                    <ActivityTypeBadge type={data.activity_type} theme={theme}>
                    </ActivityTypeBadge>
                  </InfoValue>
                </InfoContent>
              </InfoItem>

              <InfoItem>
                <InfoIconWrapper theme={theme}>
                  <Hash />
                </InfoIconWrapper>
                <InfoContent>
                  <InfoLabel theme={theme}>Activity ID</InfoLabel>
                  <InfoValue theme={theme}>{data.activity_id}</InfoValue>
                </InfoContent>
              </InfoItem>

              <InfoItem>
                <InfoIconWrapper theme={theme}>
                  <Package />
                </InfoIconWrapper>
                <InfoContent>
                  <InfoLabel theme={theme}>Order Item Key</InfoLabel>
                  <InfoValue theme={theme}>{data.original_P.order_item_key}</InfoValue>
                </InfoContent>
              </InfoItem>
            </InfoGrid>
          </Section>

          <Divider theme={theme} />

          <Section>
            <SectionTitle theme={theme}>
              <Calendar />
              Timeline & Effort
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoIconWrapper theme={theme}>
                  <Calendar />
                </InfoIconWrapper>
                <InfoContent>
                  <InfoLabel theme={theme}>Planned Start Date</InfoLabel>
                  <InfoValue theme={theme}>{data.planned_start_date || "Not Available"}</InfoValue>
                </InfoContent>
              </InfoItem>

              <InfoItem>
                <InfoIconWrapper theme={theme}>
                  <Calendar />
                </InfoIconWrapper>
                <InfoContent>
                  <InfoLabel theme={theme}>Planned End Date</InfoLabel>
                  <InfoValue theme={theme}>{data.planned_end_date || "Not Available"}</InfoValue>
                </InfoContent>
              </InfoItem>

              {/* {<InfoItem>
                <InfoIconWrapper theme={theme}>
                  <Calendar />
                </InfoIconWrapper>
                <InfoContent>
                  <InfoLabel theme={theme}>Actual Start Date</InfoLabel>
                  <InfoValue theme={theme}>{data.actual_start_date || "Not Available"}</InfoValue>
                </InfoContent>
              </InfoItem>} */}

              {/* <InfoItem>
                <InfoIconWrapper theme={theme}>
                  <Calendar />
                </InfoIconWrapper>
                <InfoContent>
                  <InfoLabel theme={theme}>Actual End Date</InfoLabel>
                  <InfoValue theme={theme}>{data.actual_end_date || "Not Available"}</InfoValue>
                </InfoContent>
              </InfoItem> */}

              <InfoItem>
                <InfoIconWrapper theme={theme}>
                  <Clock />
                </InfoIconWrapper>
                <InfoContent>
                  <InfoLabel theme={theme}>Effort</InfoLabel>
                  <InfoValue theme={theme}>
                    {data.effort} {data.effort_unit || ''}
                  </InfoValue>
                </InfoContent>
              </InfoItem>

              <InfoItem>
                <InfoIconWrapper theme={theme}>
                  <Package />
                </InfoIconWrapper>
                <InfoContent>
                  <InfoLabel theme={theme}>No. of Items</InfoLabel>
                  <InfoValue theme={theme}>{data.original_P.no_of_items}</InfoValue>
                </InfoContent>
              </InfoItem>
            </InfoGrid>
          </Section>

          {/* <Divider theme={theme} /> */}

           <ModalFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                      variant="primary"
                      onClick={handleMarkCompleteClick}
                      disabled={isSubmitting}
                    >
                      <FiCheck style={{ marginRight: 8 }} />
                      {isSubmitting ? "Completing..." : "Mark As Activity Complete"}
                    </Button>
                  </ModalFooter>

          {/* <Section>
            <SectionTitle theme={theme}>
              <FileText />
              Remarks
            </SectionTitle>
            <RemarksBox theme={theme} isEmpty={!data.remarks}>
              {data.remarks || 'No remarks provided'}
            </RemarksBox>
          </Section> */}
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ProjectDetailModalEmployee;