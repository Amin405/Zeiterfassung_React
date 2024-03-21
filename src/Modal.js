import React, { useState, useEffect } from 'react';
import './Modal.css'; 
function Modal({ isOpen, onClose, entry }) {
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');
  const [pauseDuration, setPauseDuration] = useState('');
  const [timeDifference, setTimeDifference] = useState(0);
  const [totalWorkTime, setTotalWorkTime] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStartHour(entry.startHour);
      setStartMinute(entry.startMinute);
      setEndHour(entry.endHour);
      setEndMinute(entry.endMinute);
      setPauseDuration(entry.pauseDuration);
    }
  }, [isOpen, entry]);

  const calculateWork = () => {
    const startTime = new Date();
    startTime.setHours(parseInt(startHour));
    startTime.setMinutes(parseInt(startMinute));
    const endTime = new Date();
    endTime.setHours(parseInt(endHour));
    endTime.setMinutes(parseInt(endMinute));
    const pause = parseInt(pauseDuration) || 0; 
    const diff = endTime - startTime - pause * 60 * 1000; 
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    setTotalWorkTime(`${hours} Stunden und ${minutes} Minuten`);

    const mandatoryHoursInMinutes = 8.4 * 60; 
    const timeDiff = (diff - mandatoryHoursInMinutes * 60 * 1000) / (1000 * 60); 
    setTimeDifference(timeDiff);
  };

  const handleSave = () => {
    calculateWork();

    const updatedEntry = {
      ...entry,
      startHour,
      startMinute,
      endHour,
      endMinute,
      pauseDuration,
      timeDifference,
      totalWorkTime
    };
    onClose();
  };

  return (
    <div className={isOpen ? "modal-overlay open" : "modal-overlay"}>
      <div className="modal">
        <h2>Bearbeiten</h2>
        <div className="input-group">
          <label>Startzeit:</label>
          <div className="time-input">
            <input type="number" value={startHour} onChange={(e) => setStartHour(e.target.value)} />
            <span>:</span>
            <input type="number" value={startMinute} onChange={(e) => setStartMinute(e.target.value)} />
          </div>
        </div>
        <div className="input-group">
          <label>Endzeit:</label>
          <div className="time-input">
            <input type="number" value={endHour} onChange={(e) => setEndHour(e.target.value)} />
            <span>:</span>
            <input type="number" value={endMinute} onChange={(e) => setEndMinute(e.target.value)} />
          </div>
        </div>
        <div className="input-group">
          <label>Pausendauer (in Minuten):</label>
          <input type="number" value={pauseDuration} onChange={(e) => setPauseDuration(e.target.value)} />
        </div>
        <button onClick={calculateWork}>Arbeitszeit berechnen</button>
        <button onClick={handleSave}>Speichern</button>
        <button onClick={onClose}>Abbrechen</button>
      </div>
    </div>
  );
}

export default Modal;
