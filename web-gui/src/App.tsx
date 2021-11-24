import React from 'react';
import { RepositoryPicker } from "./repository/repository-picker"
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <RepositoryPicker></RepositoryPicker>
      </header>
    </div>
  );
}

export default App;
