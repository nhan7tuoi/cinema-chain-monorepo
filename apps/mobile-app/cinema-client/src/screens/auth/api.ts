import apiClient from '@api/apiClient';
import { IAuthResponse, ILoginRequest, IRegisterRequest } from '@cinema/types';

export const loginApi = async (payload: ILoginRequest): Promise<IAuthResponse> => {
  return apiClient.post('/client/auth/login', payload);
};

export const registerApi = async (payload: IRegisterRequest): Promise<IAuthResponse> => {
  return apiClient.post('/client/auth/register', payload);
};
