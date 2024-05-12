import { Complaint } from "../tables/Complaint";

export interface ComplaintMetrics {
    unresolvedComplaints: number;
    complaintsAssignedThisMonth: number;
    complaintsIssuedThisWeek: number;
    recentComplaints: Complaint[];
}