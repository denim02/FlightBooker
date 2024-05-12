import { LocalizationProvider } from '@mui/x-date-pickers';
import Routes from './routes/Routes';
import { AuthProvider } from './stores/auth-context';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function App() {

    return (
        <AuthProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Routes />
            </LocalizationProvider>
        </AuthProvider>
    );
}

export default App;