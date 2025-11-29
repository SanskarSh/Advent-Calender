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
      <Route path="/calendar/:token" element={<EditorPage />} />
      <Route path="/calendar/:token/editor" element={<EditorPage />} />
      <Route path="/calendar/:token/day/:dayId" element={<DateCustomizationPage />} />
      <Route path="/calendar/:token/edit/day/:dayId" element={<DateCustomizationPage />} />
    </Routes>
  );
}

export default App;
