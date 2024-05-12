import { IndexedObject } from "./IndexedObject";

export interface Complaint extends IndexedObject{
    description: string;
    userId: string;
    assignedAdminName?: string;
    isResolved: boolean;
    dateIssued: Date;
    dateResolved?: Date;
}