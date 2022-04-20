import { AxiosResponse } from 'axios';

export interface Response<T = any> {
  code: number;
  msg: string;
  data: T;
  success: boolean;
}
export type CommonResponse<T = any> = Response<T>;
