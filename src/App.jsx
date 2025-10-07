import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import PassageListPage from "./pages/PassageListPage.jsx";
import PassageDetailPage from "./pages/PassageDetailPage.jsx";
import JournalPage from "./pages/JournalPage.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<PassageListPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/passages/:id" element={<PassageDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
