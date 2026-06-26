import { useState, useEffect, useRef } from 'react';
import * as Y from 'yjs';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export function usePlaybackSession(roomId) {
  const [events, setEvents] = useState([]);
  const [playbackLanguage, setPlaybackLanguage] = useState('javascript');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(150);
  const [activeAuthor, setActiveAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const editorRef = useRef(null);
  const playbackIntervalRef = useRef(null);
  const lastStepRef = useRef(0);

  const yDocRef = useRef(new Y.Doc());

  useEffect(() => {
    let isMounted = true;

    async function fetchSessionHistory() {
      try {
        const response = await fetch(`${BASE_URL}/api/rooms/${roomId}/playback`);
        const data = await response.json();

        if (data.success && isMounted) {
          setEvents(data.events);
          setPlaybackLanguage(data.language || 'javascript');
        }
      } catch (err) {
        console.error('Failed to load playback data stream:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchSessionHistory();
    return () => {
      isMounted = false;
    };
  }, [roomId]);

  useEffect(() => {
    if (!editorRef.current || events.length === 0) return;

    const targetStep = currentStep;
    const previousStep = lastStepRef.current;

    const unpackDelta = (eventItem) => {
      const raw = eventItem?.updateData;
      if (!raw) return new Uint8Array();
      if (raw.type === 'Buffer' && Array.isArray(raw.data)) {
        return new Uint8Array(raw.data);
      }
      return new Uint8Array(Array.isArray(raw) ? raw : Object.values(raw));
    };

    if (targetStep === 0) {
      yDocRef.current.destroy();
      yDocRef.current = new Y.Doc();
      editorRef.current.setValue('');
      lastStepRef.current = 0;
      setActiveAuthor('');
      return;
    }

    if (targetStep < previousStep || targetStep > previousStep + 1) {
      yDocRef.current.destroy();
      yDocRef.current = new Y.Doc();

      for (let i = 0; i < targetStep; i++) {
        Y.applyUpdate(yDocRef.current, unpackDelta(events[i]));
      }
    } else if (targetStep === previousStep + 1) {
      Y.applyUpdate(yDocRef.current, unpackDelta(events[previousStep]));
    }

    const currentText = yDocRef.current.getText('monaco-shared-text').toString();

    if (editorRef.current.getValue() !== currentText) {
      editorRef.current.setValue(currentText);
    }

    lastStepRef.current = targetStep;
    setActiveAuthor(events[targetStep - 1]?.username || 'Unknown');
  }, [currentStep, events]);

  useEffect(() => {
    if (isPlaying) {
      playbackIntervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= events.length) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    } else {
      clearInterval(playbackIntervalRef.current);
    }

    return () => clearInterval(playbackIntervalRef.current);
  }, [isPlaying, events.length, playbackSpeed]);

  return {
    events,
    playbackLanguage,
    currentStep,
    setCurrentStep,
    isPlaying,
    setIsPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    activeAuthor,
    isLoading,
    editorRef,
  };
}
