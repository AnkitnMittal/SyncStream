const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const roomApi = {
  async provisionRoom(password) {
    const response = await fetch(`${BASE_URL}/api/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      throw new Error('Failed to provision room');
    }

    return await response.json();
  },
};
