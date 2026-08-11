/** * @license * SPDX-License-Identifier: Apache-2.0 */
import { Routes, Route } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import ReactGA from 'react-ga4';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Layout } from './Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Repurpose } from './pages/Repurpose';
import { Results } from './pages/Results';
import { Pricing } from './pages/Pricing';
import { NotFound } from './pages/NotFound';


function RouteTracker() {
  const location = useLocation();
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
  }, [location]);
  return null;
}

export default function App() {
  useEffect(() => {
    ReactGA.initialize('G-XXXXXXXXXX'); // Replace with your GA4 Measurement ID
  }, []);

  return (
    <HelmetProvider>
      <RouteTracker />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="repurpose" element={<Repurpose />} />
          <Route path="results/:id" element={<Results />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HelmetProvider>
  );
}
