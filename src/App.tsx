import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import SpacesDirectory from '@/pages/SpacesDirectory';
import SpaceDetail from '@/pages/SpaceDetail';
import LaunchBoard from '@/pages/LaunchBoard';
import DesignBoard from '@/pages/DesignBoard';
import DataSources from '@/pages/DataSources';
import RolesPlans from '@/pages/RolesPlans';
import Claims from '@/pages/Claims';

// ── App ───────────────────────────────────────────────────────────

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/spaces" element={<SpacesDirectory />} />
          <Route path="/spaces/:slug" element={<SpaceDetail />} />
          <Route path="/launch-board" element={<LaunchBoard />} />
          <Route path="/design-board" element={<DesignBoard />} />
          <Route path="/data-sources" element={<DataSources />} />
          <Route path="/roles-plans" element={<RolesPlans />} />
          <Route path="/claims" element={<Claims />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
