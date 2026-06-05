/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useCallback } from 'react';

interface UseModalReturn {
  isOpen: boolean;
  data?: any;
  open: (data?: any) => void;
  close: () => void;
  toggle: () => void;
}

export function useModal(): UseModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>(undefined);

  const open = useCallback((modalData?: any) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(undefined);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
  };
}
