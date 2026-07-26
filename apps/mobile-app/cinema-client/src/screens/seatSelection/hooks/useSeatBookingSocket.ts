import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import { io, Socket } from 'socket.io-client';

interface UseSeatBookingSocketProps {
  showtimeId?: number;
  userId: number;
  token?: string; // Add token prop
  maxSeats?: number;
}

export const useSeatBookingSocket = ({ showtimeId, userId, token, maxSeats = 8 }: UseSeatBookingSocketProps) => {
  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
  const [heldByOthers, setHeldByOthers] = useState<number[]>([]);
  const [soldSeats, setSoldSeats] = useState<number[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!showtimeId || !token) return;

    const socket = io('http://192.168.1.92:3000/booking', {
      auth: { token }
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_showtime', { showtimeId });
    });

    socket.on('sync_held_seats', (data: {seatId: number, userId: number}[]) => {
      const others = data.filter(d => d.userId !== userId).map(d => d.seatId);
      setHeldByOthers(others);
      
      const mine = data.filter(d => d.userId === userId).map(d => d.seatId);
      if (mine.length > 0) {
        setSelectedSeatIds(prev => [...new Set([...prev, ...mine])]);
      }
    });

    socket.on('seat_held', (data: {seatId: number, userId: number}) => {
      if (data.userId !== userId) {
        setHeldByOthers(prev => [...new Set([...prev, data.seatId])]);
      }
    });

    socket.on('seat_released', (data: {seatId: number}) => {
      setHeldByOthers(prev => prev.filter(id => id !== data.seatId));
      setSelectedSeatIds(prev => prev.filter(id => id !== data.seatId));
    });

    socket.on('hold_success', (data: {seatId: number, userId: number}) => {
      if (data.userId === userId) {
        setSelectedSeatIds(prev => [...new Set([...prev, data.seatId])]);
      }
    });

    socket.on('hold_failed', (data: {seatId: number, reason: string}) => {
      Alert.alert('Lỗi', 'Ghế này đã được người khác chọn hoặc xảy ra lỗi.');
      setSelectedSeatIds(prev => prev.filter(id => id !== data.seatId));
    });

    socket.on('seat_sold', (data: {seatIds: number[]}) => {
      setSoldSeats(prev => [...new Set([...prev, ...data.seatIds])]);
      setHeldByOthers(prev => prev.filter(id => !data.seatIds.includes(id)));
      setSelectedSeatIds(prev => prev.filter(id => !data.seatIds.includes(id)));
    });

    return () => {
      socket.emit('leave_showtime', { showtimeId });
      socket.disconnect();
    };
  }, [showtimeId, userId, token]);

  const toggleSeat = useCallback((seatId: number) => {
    if (heldByOthers.includes(seatId) || soldSeats.includes(seatId)) return;

    setSelectedSeatIds(prev => {
      if (prev.includes(seatId)) {
        // Unselect
        socketRef.current?.emit('release_seat', { showtimeId, seatId });
        return prev.filter(id => id !== seatId);
      } else {
        // Select
        if (prev.length >= maxSeats) {
          Alert.alert('Giới hạn', `Bạn chỉ được chọn tối đa ${maxSeats} ghế.`);
          return prev;
        }
        socketRef.current?.emit('hold_seat', { showtimeId, seatId });
        return [...prev, seatId];
      }
    });
  }, [heldByOthers, soldSeats, maxSeats, showtimeId]);

  return {
    selectedSeatIds,
    heldByOthers,
    soldSeats,
    toggleSeat,
  };
};
