import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { GlobalStyles } from './styles/GlobalStyles';
import { Layout } from './components/layout/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// Lazy load pages for code splitting
const HomePage = React.lazy(() =>
  import('./pages/HomePage').then(module => ({ default: module.HomePage }))
);

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <GlobalStyles />
        <Router>
          <Layout>
            <Suspense fallback={<LoadingSpinner size="lg" />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
