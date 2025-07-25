export interface User {
  id: string;
  name: string;
  email: string;
  role: 'police' | 'citizen';
  department?: string;
  badge?: string;
}

export interface FIR {
  id: string;
  firNumber: string;
  complaint: string;
  complainantName: string;
  complainantContact: string;
  status: 'registered' | 'under_investigation' | 'closed' | 'pending';
  predictedActs: string[];
  predictedSections: string[];
  assignedOfficer?: string;
  dateRegistered: string;
  lastUpdated: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
}

export interface LegalKnowledge {
  id: string;
  title: string;
  section: string;
  act: string;
  description: string;
  keywords: string[];
}

export interface AnalyticsData {
  totalFIRs: number;
  pendingFIRs: number;
  resolvedFIRs: number;
  actWiseData: Record<string, number>;
  dailyData: Record<string, number>;
  monthlyData: Record<string, number>;
}

export interface Complaint {
  id: number;
  name: string;
  aadhar: string;
  address: string;
  type: string;
  description: string;
  datetime: string;
  location: string;
  status: string;
  policeMessage?: string;
}