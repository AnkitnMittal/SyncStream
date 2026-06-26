import { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';

export function useCollaborativeEditor(socket, roomId, editorInstance) {
  const yDocRef = useRef(null);
  const bindingRef = useRef(null);

  useEffect(() => {
    if (!socket || !editorInstance || !editorInstance.getModel()) return;

    const yDoc = new Y.Doc();
    yDocRef.current = yDoc;
    const yText = yDoc.getText('monaco-shared-text');

    const handleLocalDocUpdate = (update, origin) => {
      if (origin !== 'network') {
        socket.emit('sync_doc_update', { update: Array.from(update) });
      }
    };
    yDoc.on('update', handleLocalDocUpdate);

    const parseBinaryData = (data) => {
      if (data instanceof Uint8Array) return data;
      if (data instanceof ArrayBuffer) return new Uint8Array(data);
      if (data?.type === 'Buffer' && Array.isArray(data.data)) return new Uint8Array(data.data);

      return new Uint8Array(Array.isArray(data) ? data : Object.values(data));
    };

    const handleRemoteDocUpdate = ({ update }) => {
      if (yDocRef.current && update) {
        const binaryData = parseBinaryData(update);
        yDocRef.current.transact(() => {
          Y.applyUpdate(yDocRef.current, binaryData, 'network');
        }, 'network');
      }
    };

    const handleInitialStateSync = (initialState) => {
      if (yDocRef.current && initialState) {
        const binaryData = parseBinaryData(initialState);
        yDocRef.current.transact(() => {
          Y.applyUpdate(yDocRef.current, binaryData, 'network');
        }, 'network');
      }
    };

    socket.on('sync_doc_update', handleRemoteDocUpdate);
    socket.on('sync_initial_state', handleInitialStateSync);

    const binding = new MonacoBinding(
      yText,
      editorInstance.getModel(),
      new Set([editorInstance]),
      null,
    );
    bindingRef.current = binding;

    socket.emit('request_initial_state', { roomId });

    return () => {
      socket.off('sync_doc_update', handleRemoteDocUpdate);
      socket.off('sync_initial_state', handleInitialStateSync);

      if (bindingRef.current) {
        bindingRef.current.destroy();
        bindingRef.current = null;
      }

      yDoc.off('update', handleLocalDocUpdate);
      yDoc.destroy();
      yDocRef.current = null;
    };
  }, [socket, roomId, editorInstance]);

  return { yDocRef };
}
