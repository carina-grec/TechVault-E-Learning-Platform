import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import UniversalLogin from '../pages/UniversalLogin.jsx';
import GuardianDashboard from '../pages/GuardianDashboard.jsx';
import ListOfVaults from '../pages/ListOfVaults.jsx';
import AdminContentCMS from '../pages/AdminContentCMS.jsx';
import AnalyticsReport from '../pages/AnalyticsReport.jsx';
import AssignmentControls from '../pages/AssignmentControls.jsx';
import CodeDojo from '../pages/CodeDojo.jsx';
import CodeReviewer from '../pages/CodeReviewer.jsx';
import CoppaAgeVerification from '../pages/CoppaAgeVerification.jsx';

import LessonChallengeEditor from '../pages/LessonChallengeEditor.jsx';
import ParentalConsentForm from '../pages/ParentalConsentForm.jsx';
import ParentalConsentRequest from '../pages/ParentalConsentRequest.jsx';
import QuestEditor from '../pages/QuestEditor.jsx';
import UserSettings from '../pages/UserSettings.jsx';
import VaultCreationForm from '../pages/VaultCreationForm.jsx';
import VaultMapOne from '../pages/VaultMapOne.jsx';
import VaultMapTwo from '../pages/VaultMapTwo.jsx';
import VaultMapThree from '../pages/VaultMapThree.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import QuestList from '../pages/QuestList.jsx';
import VaultDetail from '../pages/VaultDetail.jsx';
import QuestDetail from '../pages/QuestDetail.jsx';
import AdminUsers from '../pages/AdminUsers.jsx';

import LessonEditor from '../pages/LessonEditor.jsx';
import QuizEditor from '../pages/QuizEditor.jsx';
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute roles={['LEARNER']}><Navigate to="/vaults" replace /></ProtectedRoute>} />
        <Route path="/login" element={<UniversalLogin initialMode="login" key="login" />} />
        <Route path="/register" element={<UniversalLogin initialMode="register" key="register" />} />
        <Route path="/guardian" element={<ProtectedRoute roles={['GUARDIAN']}><GuardianDashboard /></ProtectedRoute>} />
        <Route path="/vaults" element={<ProtectedRoute><ListOfVaults /></ProtectedRoute>} />
        <Route path="/vaults/:vaultId" element={<ProtectedRoute><VaultDetail /></ProtectedRoute>} />
        <Route path="/quests" element={<ProtectedRoute roles={['LEARNER']}><QuestList /></ProtectedRoute>} />
        <Route path="/quests/:questId" element={<ProtectedRoute roles={['LEARNER']}><QuestDetail /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/cms" element={<ProtectedRoute roles={['ADMIN']}><AdminContentCMS /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />
        <Route path="/quest-editor" element={<ProtectedRoute roles={['ADMIN']}><QuestEditor /></ProtectedRoute>} />
        <Route path="/lesson-editor" element={<ProtectedRoute roles={['ADMIN']}><LessonEditor /></ProtectedRoute>} />
        <Route path="/quiz-editor" element={<ProtectedRoute roles={['ADMIN']}><QuizEditor /></ProtectedRoute>} />
        <Route path="/vault/create" element={<ProtectedRoute roles={['ADMIN']}><VaultCreationForm /></ProtectedRoute>} />
        <Route path="/lesson/challenge/editor" element={<ProtectedRoute roles={['ADMIN']}><LessonChallengeEditor /></ProtectedRoute>} />

        {/* Learner Routes */}
        <Route path="/analytics" element={<ProtectedRoute roles={['LEARNER']}><AnalyticsReport /></ProtectedRoute>} />
        <Route path="/dojo" element={<ProtectedRoute roles={['LEARNER']}><CodeDojo /></ProtectedRoute>} />

        {/* Shared/Other */}
        <Route path="/assignments" element={<ProtectedRoute roles={['GUARDIAN']}><AssignmentControls /></ProtectedRoute>} />
        <Route path="/review" element={<ProtectedRoute><CodeReviewer /></ProtectedRoute>} />
        <Route path="/coppa-verification" element={<ProtectedRoute><CoppaAgeVerification /></ProtectedRoute>} />

        <Route path="/consent/form" element={<ProtectedRoute><ParentalConsentForm /></ProtectedRoute>} />
        <Route path="/consent/request" element={<ProtectedRoute><ParentalConsentRequest /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><UserSettings /></ProtectedRoute>} />

        <Route path="/vault/map/one" element={<ProtectedRoute><VaultMapOne /></ProtectedRoute>} />
        <Route path="/vault/map/two" element={<ProtectedRoute><VaultMapTwo /></ProtectedRoute>} />
        <Route path="/vault/map/three" element={<ProtectedRoute><VaultMapThree /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
