
export class Job {
  code: string;
  type: string;
  name: string;
  actions: {
    name: string,
    code: string
  }[];
  isProcessing?: boolean;
  icon?: string;
}
