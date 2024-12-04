import crypto from 'crypto';

export const generateRandomId = () => Math.floor(Math.random() * 999) + 100;
export const generateRandomName = (text: string) => `${text}-${crypto.randomUUID()}`;
