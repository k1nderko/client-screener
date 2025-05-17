import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useSocket({ onPriceUpdate, pair }) {
  const socketRef = useRef(null);
  const currentPairRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      const socket = io('http://localhost:3000');
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('🔌 Socket connected:', socket.id);
        socket.emit('subscribe', pair);
        currentPairRef.current = pair;
      });

      socket.on('priceUpdate', (data) => {
        if (onPriceUpdate && typeof onPriceUpdate === 'function') {
          onPriceUpdate(data);
        }
      });

      socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
      });
    }

    if (socketRef.current && currentPairRef.current !== pair) {
      console.log(`📡 Re-subscribing from ${currentPairRef.current} to ${pair}`);
      socketRef.current.emit('subscribe', pair);
      currentPairRef.current = pair;
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        currentPairRef.current = null;
      }
    };
  }, [pair, onPriceUpdate]);
}
