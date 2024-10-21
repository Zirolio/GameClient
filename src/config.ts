export const DEV_MODE = import.meta.env.DEV;

export const POINTER_IS_COARSE = window.matchMedia('(pointer: coarse)').matches;
export const POINTER_IS_FINE = window.matchMedia('(pointer: fine)').matches;
