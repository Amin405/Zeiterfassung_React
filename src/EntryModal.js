import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './Modal.css'; // Importiere die CSS-Datei für benutzerdefinierte Stile

function EntryModal({ isOpen, onClose, entry, onSave }) {
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');
  const [pauseDuration, setPauseDuration] = useState('');

  useEffect(() => {
    if (isOpen && entry) {
      // Setze die Werte des Eintrags, wenn das Modal geöffnet wird
      setStartHour(entry.startHour);
      setStartMinute(entry.startMinute);
      setEndHour(entry.endHour);
      setEndMinute(entry.endMinute);
      setPauseDuration(entry.pauseDuration);
    }
  }, [isOpen, entry]);

  const handleSave = () => {
    const updatedEntry = {
      ...entry,
      startHour,
      startMinute,
      endHour,
      endMinute,
      pauseDuration,
      
    };
    onSave(updatedEntry);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Bearbeiten"
    >
      <h2>Bearbeiten</h2>
      <label>
        Startzeit:
        <input type="number" value={startHour} onChange={(e) => setStartHour(e.target.value)} />
        :
        <input type="number" value={startMinute} onChange={(e) => setStartMinute(e.target.value)} />
      </label>
      <br />
      <label>
        Endzeit:
        <input type="number" value={endHour} onChange={(e) => setEndHour(e.target.value)} />
        :
        <input type="number" value={endMinute} onChange={(e) => setEndMinute(e.target.value)} />
      </label>
      <br />
      <label>
        Pausendauer (in Minuten):
        <input type="number" value={pauseDuration} onChange={(e) => setPauseDuration(e.target.value)} />
      </label>
      <br />
      <button onClick={handleSave}>Speichern</button>
      <button onClick={onClose}>Abbrechen</button>
    </Modal>
  );
}

export default EntryModal;
