import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import WelcomeScreen from './components/WelcomeScreen';
import NavigationHub from './components/NavigationHub';
import PlayerDashboard from './components/PlayerDashboard';
import TournamentDashboard from './components/TournamentDashboard';
import ESPNPlayerResults from './components/ESPNPlayerResults';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/hub" element={<NavigationHub />} />
        <Route path="/player" element={<PlayerDashboard />} />
        <Route path="/player/:playerId" element={<ESPNPlayerResults />} />
        <Route path="/tournament" element={<TournamentDashboard />} />
        <Route path="/inside-ropes" element={
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Coming Soon</h2>
              <p className="text-gray-600">Inside the Ropes content is under development</p>
              <button
                onClick={() => window.history.back()}
                className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;