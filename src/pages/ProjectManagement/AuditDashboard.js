import React, { useState } from 'react';
import AuditProjectList from './AuditProjectList';

// Sample data
const sampleProjects = [
  {
    id: 'AUD-001',
    projectName: 'Q1 Financial Audit',
    clientCompany: 'XYZ Corporation',
    auditCompany: 'ABC Auditors',
    activityName: 'Financial Statements Review',
    shift: 'morning',
    plannedStartDate: '2024-01-15',
    plannedEndDate: '2024-01-15',
    duration: 8,
    durationUnit: 'hours',
    unitsToAudit: 50,
    completedUnits: 0,
    status: 'pending',
    location: 'Head Office - Floor 5',
    auditType: 'Financial',
    priority: 'high',
    assignedAuditor: 'John Doe'
  },
  {
    id: 'AUD-002',
    projectName: 'Inventory Audit',
    clientCompany: 'XYZ Corporation',
    auditCompany: 'ABC Auditors',
    activityName: 'Stock Counting',
    shift: 'afternoon',
    plannedStartDate: '2024-01-16',
    plannedEndDate: '2024-01-19',
    duration: 4,
    durationUnit: 'days',
    unitsToAudit: 1000,
    completedUnits: 250,
    status: 'in-progress',
    location: 'Warehouse A',
    auditType: 'Operational',
    priority: 'medium',
    assignedAuditor: 'Jane Smith'
  },
  {
    id: 'AUD-003',
    projectName: 'Compliance Audit',
    clientCompany: 'XYZ Corporation',
    auditCompany: 'ABC Auditors',
    activityName: 'Regulatory Compliance Check',
    shift: 'evening',
    plannedStartDate: '2024-01-10',
    plannedEndDate: '2024-01-20',
    duration: 10,
    durationUnit: 'days',
    unitsToAudit: 200,
    completedUnits: 200,
    status: 'completed',
    location: 'Compliance Dept',
    auditType: 'Compliance',
    priority: 'low',
    assignedAuditor: 'Mike Johnson'
  }
];

const AuditDashboard = () => {
  const [filters, setFilters] = useState({});
  
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  const filteredProjects = sampleProjects.filter(project => {
    if (filters.status && project.status !== filters.status) return false;
    if (filters.shift && project.shift !== filters.shift) return false;
    return true;
  });

  return (
    <>
      <AuditProjectList 
        projects={filteredProjects}
        filters={filters}
        onFilterChange={handleFilterChange}
        onStartActivity={(id) => console.log('Start:', id)}
        onEndActivity={(id) => console.log('End:', id)}
        onMarkComplete={(id) => console.log('Complete:', id)}
      />
    </>
  );
};

export default AuditDashboard;