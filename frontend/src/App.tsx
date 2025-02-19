import Organigram from './components/organigram';
import { QueryProvider } from './providers/queryProvider';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  return (
    <QueryProvider>
        <CssBaseline />
        <div className="min-h-screen bg-gray-100">
          <Organigram />
        </div>
    </QueryProvider>
  );
}

export default App;
