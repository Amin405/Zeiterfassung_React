import React, { useState } from 'react';

function Zeitrechner() {
  const currentDate = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(currentDate);  
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');
  const [pauseDuration, setPauseDuration] = useState(0);
  const [totalWorkTime, setTotalWorkTime] = useState('');
  const [mandatoryWorkHours, setMandatoryWorkHours] = useState(8.4); 
  const [timeDifference, setTimeDifference] = useState(0);

  
  const handleCalculate = () => {
    const startTime = new Date(`${date}T${startHour.padStart(2, '0')}:${startMinute.padStart(2, '0')}:00`);
    const endTime = new Date(`${date}T${endHour.padStart(2, '0')}:${endMinute.padStart(2, '0')}:00`);
    const pause = parseInt(pauseDuration) || 0; 

    if (!isNaN(startTime) && !isNaN(endTime) && !isNaN(pause)) {
      const diff = endTime - startTime - pause * 60 * 1000; 
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTotalWorkTime(`${hours} Stunden und ${minutes} Minuten`);

      const mandatoryHoursInMinutes = mandatoryWorkHours * 60;
      const timeDiff = (diff - mandatoryHoursInMinutes * 60 * 1000) / (1000 * 60); 
      setTimeDifference(timeDiff);
    } else {
      setTotalWorkTime('Ungültige Eingaben');
    }
  };

  
  const handleSave = () => {
    if (!date || !startHour || !startMinute || !endHour || !endMinute || !pauseDuration || !mandatoryWorkHours) {
      alert('Bitte füllen Sie alle Felder aus.');
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

  return (
    <div>
      <h2>Arbeitszeit Rechner</h2>
      <form>
        <label>
          Datum:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <br />
        <label>
          Startzeit:
          <input type="number" min="0" max="23" value={startHour} onChange={(e) => setStartHour(e.target.value)} /> :
          <input type="number" min="0" max="59" value={startMinute} onChange={(e) => setStartMinute(e.target.value)} />
        </label>
        <br />
        <label>
          Endzeit:
          <input type="number" min="0" max="23" value={endHour} onChange={(e) => setEndHour(e.target.value)} /> :
          <input type="number" min="0" max="59" value={endMinute} onChange={(e) => setEndMinute(e.target.value)} />
        </label>
        <br />
        <label>
          Pausendauer (in Minuten):
          <input type="number" min="0" value={pauseDuration} onChange={(e) => setPauseDuration(e.target.value)} />
        </label>
        <br />
        <label>
          Obligatorische Arbeitszeit (in Stunden):
          <input type="number" min="0" step="0.1" value={mandatoryWorkHours} onChange={(e) => setMandatoryWorkHours(e.target.value)} />
        </label>
        <br />
        <button type="button" onClick={handleCalculate}>Berechnen</button>

        <button type="button" onClick={handleSave}>Speichern</button>
      </form>
      <div>
        <h3>Gesamte Arbeitszeit:</h3>
        <p>{totalWorkTime}</p>
        <h3>Zeitdifferenz zur obligatorischen Arbeitszeit:</h3>
        <p>{timeDifference} Minuten</p>
      </div>
    </div>
  );
}

export default Zeitrechner;
