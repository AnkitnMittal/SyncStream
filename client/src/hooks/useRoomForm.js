import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomApi } from '../api/roomApi.js';

export function useRoomForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    roomId: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = (isJoining = false) => {
    if (!formData.username.trim().length) {
      alert('Please enter a display name!');
      return false;
    } else if (isJoining && !formData.roomId.trim().length) {
      alert('Please enter a valid Room ID to join!');
      return false;
    }
    return true;
  };

  const createNewRoom = async () => {
    if (!isFormValid(false)) return;

    try {
      const data = await roomApi.provisionRoom(formData.password);

      navigate(`/room/${data.roomId}`, {
        state: { username: formData.username, password: formData.password },
      });
    } catch (err) {
      console.error('Failed to provision room:', err);
      alert('Failed to connect to the server. Please try again.');
    }
  };

  const joinExistingRoom = (e) => {
    e.preventDefault();

    if (!isFormValid(true)) return;

    navigate(`/room/${formData.roomId.trim()}`, {
      state: {
        username: formData.username.trim(),
        password: formData.password,
      },
    });
  };

  return {
    formData,
    handleInputChange,
    createNewRoom,
    joinExistingRoom,
  };
}
