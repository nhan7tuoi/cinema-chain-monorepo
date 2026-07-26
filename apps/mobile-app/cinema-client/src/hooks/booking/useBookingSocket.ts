import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@hooks/useAuth';

interface BookingSocketOptions {
  orderCode?: string;
  onPaymentSuccess?: () => void;
}

export const useBookingSocket = ({ orderCode, onPaymentSuccess }: BookingSocketOptions) => {
  const { accessToken } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  const onPaymentSuccessRef = useRef(onPaymentSuccess);
  useEffect(() => {
    onPaymentSuccessRef.current = onPaymentSuccess;
  }, [onPaymentSuccess]);

  useEffect(() => {
    if (!orderCode || !accessToken) return;

    const socket = io('http://192.168.1.92:3000/booking', {
      auth: { token: accessToken }
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_order', { orderCode });
    });

    socket.on('payment_success', () => {
      if (onPaymentSuccessRef.current) {
        onPaymentSuccessRef.current();
      }
    });

    return () => {
      socket.emit('leave_order', { orderCode });
      socket.disconnect();
    };
  }, [orderCode, accessToken]);

  return { socket: socketRef.current };
};
