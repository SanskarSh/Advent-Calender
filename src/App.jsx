import { Routes, Route } from 'react-router-dom';
import EntryPage from './pages/EntryPage';
import FormPage from './pages/FormPage';
import EditorPage from './pages/EditorPage';
import DateCustomizationPage from './pages/DateCustomizationPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<EntryPage />} />
      <Route path="/create" element={<FormPage />} />
      <Route path="/calendar" element={<EditorPage />} />
      <Route path="/editor/day/:dayId" element={<DateCustomizationPage />} />
    </Routes>
  );
}

export default App;
