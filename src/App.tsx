import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import { ProgressProvider } from './hooks/useProgress';
import { CustomQuestionsProvider } from './hooks/useCustomQuestions';
import HomePage from './pages/HomePage';
import PracticePage from './pages/PracticePage';
import BookmarksPage from './pages/BookmarksPage';
import StatsPage from './pages/StatsPage';
import MockExamStartPage from './pages/MockExamStartPage';
import MockExamSessionPage from './pages/MockExamSessionPage';
import MockExamResultPage from './pages/MockExamResultPage';
import AiGeneratePage from './pages/AiGeneratePage';
import ReviewMistakesPage from './pages/ReviewMistakesPage';

export default function App() {
  return (
    <ProgressProvider>
      <CustomQuestionsProvider>
        <div className="min-h-screen bg-slate-50">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/practice/:subjectId" element={<PracticePage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/review-mistakes" element={<ReviewMistakesPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/mock-exam" element={<MockExamStartPage />} />
              <Route path="/mock-exam/session" element={<MockExamSessionPage />} />
              <Route path="/mock-exam/result" element={<MockExamResultPage />} />
              <Route path="/ai-generate" element={<AiGeneratePage />} />
            </Routes>
          </main>
        </div>
      </CustomQuestionsProvider>
    </ProgressProvider>
  );
}
