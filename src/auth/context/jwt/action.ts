import axios, { endpoints } from 'src/lib/axios';

import { setSession } from './utils';

// ----------------------------------------------------------------------

export type SignInParams = {
  cpf: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  cpf: string;
};

export type ForgotPasswordParams = {
  email: string;
};

export type ResetPasswordParams = {
  token: string;
  newPassword: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ cpf, password }: SignInParams): Promise<void> => {
  try {
    const res = await axios.post(endpoints.auth.signIn, {
      cpf,
      senha: password,
    });

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    setSession(accessToken);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
  cpf,
}: SignUpParams): Promise<void> => {
  const params = {
    email,
    senha: password,
    nome: `${firstName} ${lastName}`.trim(),
    cpf,
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    await setSession(accessToken);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};

/** **************************************
 * Forgot password
 *************************************** */
export const forgotPassword = async ({ email }: ForgotPasswordParams): Promise<void> => {
  try {
    await axios.post('/auth/forgot-password', { email });
  } catch (error) {
    console.error('Error during forgot password:', error);
    throw error;
  }
};

/** **************************************
 * Reset password
 *************************************** */
export const resetPassword = async ({ token, newPassword }: ResetPasswordParams): Promise<void> => {
  try {
    await axios.post('/auth/reset-password', { token, senha: newPassword });
  } catch (error) {
    console.error('Error during reset password:', error);
    throw error;
  }
};
