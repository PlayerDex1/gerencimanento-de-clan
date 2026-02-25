/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Events from './pages/Events';
import ConstantParties from './pages/ConstantParties';
import Apply from './pages/Apply';
import Applications from './pages/Applications';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateClan from './pages/CreateClan';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-clan" element={<CreateClan />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/apply/:clanId" element={<Apply />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="members" element={<Members />} />
            <Route path="cps" element={<ConstantParties />} />
            <Route path="events" element={<Events />} />
            <Route path="applications" element={<Applications />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
