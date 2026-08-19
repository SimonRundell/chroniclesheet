import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { FaqPage } from './pages/FaqPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { CharacterSheetPage } from './pages/CharacterSheetPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { DMCharacterViewPage } from './pages/DMCharacterViewPage';
import CmFloatAd_SPR from './components/cmFloatAd_SPR';

/** Top-level route table. Public marketing pages live at the root paths;
 *  the authenticated app lives under /app so crawlers always have public,
 *  login-free content to index. */
export default function App() {
    return (
        <>
        <Routes>
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/how-it-works" element={<Layout><HowItWorksPage /></Layout>} />
            <Route path="/faq" element={<Layout><FaqPage /></Layout>} />
            <Route path="/privacy" element={<Layout><PrivacyPage /></Layout>} />
            <Route path="/terms" element={<Layout><TermsPage /></Layout>} />

            <Route path="/login" element={<Layout><LoginPage /></Layout>} />
            <Route path="/register" element={<Layout><RegisterPage /></Layout>} />

            <Route
                path="/app"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <DashboardPage />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/app/characters/:id"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <CharacterSheetPage />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/app/campaigns"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <CampaignsPage />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/app/campaigns/:campaignId/characters/:characterId"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <DMCharacterViewPage />
                        </Layout>
                    </ProtectedRoute>
                }
            />
        </Routes>
        <CmFloatAd_SPR bgColor="ebdbb3"/>
        </>
    );
}
