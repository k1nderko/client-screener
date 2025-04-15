import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useSocket({ onPriceUpdate, pair }) {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io('http://localhost:3000');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('subscribe', pair);
    });

    socket.on('priceUpdate', (data) => {
      if (onPriceUpdate && typeof onPriceUpdate === 'function') {
        onPriceUpdate(data);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [pair, onPriceUpdate]);

  return socketRef.current;
}
