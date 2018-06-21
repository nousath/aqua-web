import { IRemoteData } from '.';

export class RemoteDataModel implements IRemoteData {
  isSuccess: boolean;
  code: string;
  message: string;
  error: string;
}
