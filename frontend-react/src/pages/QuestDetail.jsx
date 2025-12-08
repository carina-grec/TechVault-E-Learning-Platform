import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import CodeChallenge from '../components/quests/CodeChallenge.jsx';
import LessonView from '../components/quests/LessonView.jsx';
import QuizView from '../components/quests/QuizView.jsx';

export default function QuestDetail() {
  const { questId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [quest, setQuest] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!questId) return;
    api
      .getQuest(questId, token)
      .then(setQuest)
      .catch((err) => setError(err.message));
  }, [questId, token]);

  if (error) {
    return (
      <MainLayout>
        <div className="py-10 text-center text-red-500">{error}</div>
      </MainLayout>
    );
  }

  if (!quest) {
    return (
      <MainLayout>
        <div className="py-10 text-center text-gray-500">Loading quest...</div>
      </MainLayout>
    );
  }

  // Dispatch based on quest type
  // Note: Enum values are typically CODE_CHALLENGE, LESSON, QUIZ
  switch (quest.questType) {
    case 'LESSON':
      return <LessonView quest={quest} />;
    case 'QUIZ':
      return <QuizView quest={quest} />;
    case 'CODE_CHALLENGE':
    default:
      return <CodeChallenge quest={quest} />;
  }
}
