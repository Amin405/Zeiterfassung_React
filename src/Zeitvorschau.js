import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import EntryModal from './EntryModal';
import html2canvas from 'html2canvas'; 
import './Zeitvorschau.css';

function Zeitvorschau() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [workEntries, setWorkEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const cachedData = JSON.parse(localStorage.getItem('workEntries')) || [];
    setWorkEntries(cachedData);
  }, []);

  const renderWorkEntries = () => {
    const filteredEntries = workEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getFullYear() === year && entryDate.getMonth() === month;
    });
  
    return filteredEntries.map((entry, index) => {
      const startTime = new Date();
      startTime.setHours(parseInt(entry.startHour));
      startTime.setMinutes(parseInt(entry.startMinute));
      const endTime = new Date();
      endTime.setHours(parseInt(entry.endHour));
      endTime.setMinutes(parseInt(entry.endMinute));
      const pause = parseInt(entry.pauseDuration) || 0;
      const diff = endTime - startTime - pause * 60 * 1000;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const totalWorkTime = `${hours} Stunden und ${minutes} Minuten`;
  
      const mandatoryHoursInMinutes = 8.4 * 60;
      const timeDiff = (diff - mandatoryHoursInMinutes * 60 * 1000) / (1000 * 60);
  
      return (
        <tr key={index}>
          <td>{entry.date}</td>
          <td>{entry.startHour}:{entry.startMinute}</td>
          <td>{entry.endHour}:{entry.endMinute}</td>
          <td>{entry.pauseDuration}</td>
          <td>{totalWorkTime}</td>
          <td>{entry.mandatoryWorkHours}</td>
          <td>{timeDiff}</td>
          <td>
            <button onClick={() => handleEditEntry(entry)}>Bearbeiten</button>
            <button onClick={() => handleDeleteEntry(entry)}>Löschen</button>
          </td>
        </tr>
      );
    });
  };

  const handleYearChange = (event) => {
    const newYear = parseInt(event.target.value);
    if (!isNaN(newYear)) {
      setYear(newYear);
    }
  };

  const handleMonthChange = (event) => {
    setMonth(parseInt(event.target.value));
  };

  const handleEditEntry = (entry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleDeleteEntry = (entry) => {
    const updatedEntries = workEntries.filter(item => item !== entry);
    setWorkEntries(updatedEntries);
    localStorage.setItem('workEntries', JSON.stringify(updatedEntries));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEntry(null);
  };

  const handleSaveEntry = (updatedEntry) => {
    const updatedEntries = workEntries.map(item =>
      item === selectedEntry ? updatedEntry : item
    );
    setWorkEntries(updatedEntries);
    localStorage.setItem('workEntries', JSON.stringify(updatedEntries));
  };

  const handleExportAsJPEG = () => {
    const table = document.querySelector('.work-entries-table');
    html2canvas(table)
      .then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'work_entries.jpg';
        link.click();
      });
  };

  return (
    <div className="zeitvorschau-container">
      <h2>Arbeitszeit Vorschau</h2>
      <div className="filter-container">
        <label htmlFor="yearInput">Jahr:</label>
        <input id="yearInput" type="number" value={year} onChange={handleYearChange} />
        <label htmlFor="monthInput">Monat:</label>
        <select id="monthInput" value={month} onChange={handleMonthChange}>
          <option value={0}>Januar</option>
          <option value={1}>Februar</option>
          <option value={2}>März</option>
          <option value={3}>April</option>
          <option value={4}>Mai</option>
          <option value={5}>Juni</option>
          <option value={6}>Juli</option>
          <option value={7}>August</option>
          <option value={8}>September</option>
          <option value={9}>Oktober</option>
          <option value={10}>November</option>
          <option value={11}>Dezember</option>
        </select>
        <button onClick={handleExportAsJPEG}>Exportieren als JPEG</button>
      </div>
      <table className="work-entries-table">
        <thead>
          <tr>
            <th>Datum</th>
            <th>Startzeit</th>
            <th>Endzeit</th>
            <th>Pausenzeit</th>
            <th>Gesamte Arbeitszeit</th>
            <th>Obligatorische Arbeitszeit</th>
            <th>Überzeit in min</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {renderWorkEntries()}
        </tbody>
      </table>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="Bearbeiten"
      >
        <EntryModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          entry={selectedEntry}
          onSave={handleSaveEntry}
        />
      </Modal>
    </div>
  );
}

export default Zeitvorschau;
