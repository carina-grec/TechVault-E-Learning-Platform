import './App.css';
import HeaderBar from './components/HeaderBar';
import AuthPanel from './components/AuthPanel';
import ContentExplorer from './components/ContentExplorer';
import SubmissionsPanel from './components/SubmissionsPanel';
import GuardianPanel from './components/GuardianPanel';
import AdminPanel from './components/AdminPanel';
import CDNUploader from './components/CDNUploader';
import UserProfilePanel from './components/UserProfilePanel';
import { useAuth } from './context/AuthContext';

function App() {
  const { auth } = useAuth();

  return (
    <div className="app-shell">
      <HeaderBar />
      <main>
        <section className="section-grid">
          <AuthPanel />
          <UserProfilePanel />
          <ContentExplorer />
          <SubmissionsPanel />
          <GuardianPanel />
          <AdminPanel />
          <CDNUploader />
        </section>
      </main>
      {!auth?.token && (
        <footer className="hint">
          <p>
            Tip: start by creating or logging into a learner, guardian, or admin account.
            Once you log in, the panels above will automatically include the required headers for each request.
          </p>
        </footer>
      )}
    </div>
  );
}

export default App;
