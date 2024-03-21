import React, { useState } from 'react';
import { AppBar, Tab, Tabs } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Zeiterfassung from './Zeiterfassung';
import Zeitvorschau from './Zeitvorschau';
import Zeitrechner from './Zeitrechner';

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [savedData, setSavedData] = useState([]);
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSaveData = (data) => {
    setSavedData([...savedData, data]);
  };

  return (
    <div className="app">
      <AppBar position="static" color="primary" className="app-bar">
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Zeiterfassung" />
          <Tab label="Arbeitszeit Vorschau" />
          <Tab label="Arbeitszeit Rechner" />
        </Tabs>
      </AppBar>
      <div className="content">
        {activeTab === 0 && <Zeiterfassung />}
        {activeTab === 1 && <Zeitvorschau data={savedData} />}
        {activeTab === 2 && <Zeitrechner onSave={handleSaveData} />}
      </div>
    </div>
  );
}

export default App;
