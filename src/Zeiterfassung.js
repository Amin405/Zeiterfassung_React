import React, { useState } from 'react';

function Zeiterfassung() {
  const currentDate = new Date().toISOString().split('T')[0];
  const [date] = useState(new Date().toISOString().split('T')[0]);  
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');
  const [pauseStartHour, setPauseStartHour] = useState('');
  const [pauseStartMinute, setPauseStartMinute] = useState('');
  const [pauseEndHour, setPauseEndHour] = useState('');
  const [pauseEndMinute, setPauseEndMinute] = useState('');
  const [pauseDuration, setPauseDuration] = useState(0);
  const [totalWorkTime, setTotalWorkTime] = useState('');
  const [mandatoryWorkHours, setMandatoryWorkHours] = useState(8.4); // Default mandatory work hours
  const [timeDifference, setTimeDifference] = useState(0);

  const handleStartWork = () => {
    resetState();
    const startTime = new Date();
    setStartHour(startTime.getHours().toString().padStart(2, '0'));
    setStartMinute(startTime.getMinutes().toString().padStart(2, '0'));
  };
  

  const resetState = () => {
    setStartHour('');
    setStartMinute('');
    setEndHour('');
    setEndMinute('');
    setPauseStartHour('');
    setPauseStartMinute('');
    setPauseEndHour('');
    setPauseEndMinute('');
    setPauseDuration(0);
    setTotalWorkTime('');
    setTimeDifference(0);
  };


  const handleSave = () => {
    if (!startHour || !startMinute || !endHour || !endMinute) {
      alert(`Bitte füllen Sie alle Felder aus. ${startHour},${startMinute}${endHour}${endHour}`);
      return;
    }

    const startTime = new Date(`${date}T${startHour.padStart(2, '0')}:${startMinute.padStart(2, '0')}:00`);
    const endTime = new Date(`${date}T${endHour.padStart(2, '0')}:${endMinute.padStart(2, '0')}:00`);
    const pause = parseInt(pauseDuration) || 0; 
  
    if (!isNaN(startTime) && !isNaN(endTime) && !isNaN(pause)) {
      const diff = endTime - startTime - pause * 60 * 1000; 
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const totalWorkTimeString = `${hours} Stunden und ${minutes} Minuten`;
      setTotalWorkTime(totalWorkTimeString);

      const mandatoryHoursInMinutes = mandatoryWorkHours * 60;
      const timeDiff = (diff - mandatoryHoursInMinutes * 60 * 1000) / (1000 * 60); 
      setTimeDifference(timeDiff);

      const newEntry = { date, startHour, startMinute, endHour, endMinute, pauseDuration, totalWorkTime: totalWorkTimeString, mandatoryWorkHours, timeDifference };
      const cachedData = JSON.parse(localStorage.getItem('workEntries')) || [];
      localStorage.setItem('workEntries', JSON.stringify([...cachedData, newEntry]));

      alert('Eintrag erfolgreich gespeichert!');
    } else {
      alert('Ungültige Eingaben. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.');
    }
  };


const handleEndWork = () => {
    if (startHour === '' && startMinute === '' ) {
        alert('Bitte starten Sie zuerst die Arbeit.');
        return;
    }
    const endTime = new Date();
    setEndHour(endTime.getHours().toString().padStart(2, '0'));
    setEndMinute(endTime.getMinutes().toString().padStart(2, '0'));
    calculateWork(); 
};

const handleStartPause = () => {
    if ( startHour=== '' && startMinute === '' ) {
        alert('Bitte starten Sie zuerst die Arbeit.');
        return;
    }
    const pauseStartTime = new Date();
    setPauseStartHour(pauseStartTime.getHours().toString().padStart(2, '0'));
    setPauseStartMinute(pauseStartTime.getMinutes().toString().padStart(2, '0'));
    calculatePauseDuration(); 
};

const handleEndPause = () => {
    if (pauseStartHour === '' && pauseStartMinute === '' ) {
        alert('Bitte starten Sie zuerst die Pause.');
        return;
    }
    const pauseEndTime = new Date();
    setPauseEndHour(pauseEndTime.getHours().toString().padStart(2, '0'));
    setPauseEndMinute(pauseEndTime.getMinutes().toString().padStart(2, '0'));
    calculatePauseDuration(); // Berechnen der Pausendauer
};


  const calculateWork = () => {
    const startTime = new Date(`${date}T${startHour.padStart(2, '0')}:${startMinute.padStart(2, '0')}:00`);
    const endTime = new Date(`${date}T${endHour.padStart(2, '0')}:${endMinute.padStart(2, '0')}:00`);
    const pause = parseInt(pauseDuration) < 0 ? parseInt(pauseDuration) : 0;
  
    if (!isNaN(startTime) && !isNaN(endTime) && !isNaN(pause)) {
      const diff = endTime - startTime - pause * 60 * 1000; 
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
      if (startTime.getMinutes() === endTime.getMinutes()) {
        setTotalWorkTime('0 Stunden und 0 Minuten');
      } else {
        setTotalWorkTime(`${hours} Stunden und ${minutes} Minuten`);
      }
  
      const mandatoryHoursInMinutes = mandatoryWorkHours * 60;
      const timeDiff = (diff - mandatoryHoursInMinutes * 60 * 1000) / (1000 * 60); 
      setTimeDifference(timeDiff);
    } else {
      setTotalWorkTime('Ungültige Eingaben');
    }
  };
  

  const calculatePauseDuration = () => {
    const pauseStartTime = new Date(`${date}T${pauseStartHour.padStart(2, '0')}:${pauseStartMinute.padStart(2, '0')}:00`);
    const pauseEndTime = new Date(`${date}T${pauseEndHour.padStart(2, '0')}:${pauseEndMinute.padStart(2, '0')}:00`);
  
    if (!isNaN(pauseStartTime) && !isNaN(pauseEndTime)) {
      if (pauseEndTime.getMinutes() === pauseStartTime.getMinutes()) {
        setPauseDuration(0);
      } else {
        const diff = pauseEndTime - pauseStartTime; // Difference in milliseconds
        const minutes = Math.floor(diff / (1000 * 60));
        setPauseDuration(minutes);
      }
    } else {
      setPauseDuration('Ungültige Eingaben');
    }
  };
  

  return (
    <div>
      <h2>Arbeitszeit Rechner</h2>
      <div>
        <button onClick={handleStartWork}>Start Arbeit</button>
        <button onClick={handleEndWork}>Ende Arbeit</button>
        <button onClick={handleStartPause}>Start Pause</button>
        <button onClick={handleEndPause}>Ende Pause</button>
      </div>
      <div>
        <h3>Arbeitszeiten:</h3>
        <p>Startzeit: {startHour}:{startMinute}</p>
        <p>Endzeit: {endHour}:{endMinute}</p>
        <p>Pause Start: {pauseStartHour}:{pauseStartMinute}</p>
        <p>Pause Ende: {pauseEndHour}:{pauseEndMinute}</p>
        <p>Pausendauer: {pauseDuration} Minuten</p>
        <h3>Gesamte Arbeitszeit:</h3>
        <p>{totalWorkTime}</p>
        <h3>Zeitdifferenz zur obligatorischen Arbeitszeit:</h3>
        <p>{timeDifference} Minuten</p>
        <button onClick={resetState}>Daten löschen</button>
        <button onClick={handleSave}>Zeiterfassung speichern</button>
      </div>
    </div>
  );
}

export default Zeiterfassung;
