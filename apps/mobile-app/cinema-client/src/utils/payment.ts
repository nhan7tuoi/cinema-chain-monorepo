import { VIETQR_BANK_ID, VIETQR_ACCOUNT_NO, VIETQR_ACCOUNT_NAME } from '@constants/payment';

export const generateVietQRUrl = (amount: number, orderCode: string): string => {
  return `https://img.vietqr.io/image/${VIETQR_BANK_ID}-${VIETQR_ACCOUNT_NO}-compact2.jpg?amount=${amount}&addInfo=${orderCode}&accountName=${encodeURIComponent(VIETQR_ACCOUNT_NAME)}`;
};
