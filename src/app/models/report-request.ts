import { Employee, ReportParams } from '.';

export class ReportRequest {
  id: string;
  type: string;
  provider: string;
  name: string;

  requestedAt: string;
  startedAt: string;
  completedAt: string;

  filePath: string;
  fileUrl: string;

  error: string;
  status: string;
  reportParams: any = {};
  employee: Employee;
}
