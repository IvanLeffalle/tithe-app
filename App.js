import { AuthProvider } from './components/AuthProvider';
import Navigation from './components/Navigation';
export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
