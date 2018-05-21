import { Employee, ReportParams } from ".";

export class ReportRequest{
    id: string;
    type: string;
    requestedAt: string;
    startedAt: string;
    completedAt: string;
    filePath: string;
    fileUrl: string;
    error: string;
    status: string;
    reportParams: ReportParams = new ReportParams();
    employee: Employee;
}
