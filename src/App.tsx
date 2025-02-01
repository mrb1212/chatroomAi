import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from './redux/stores/store';
import { AppDispatch } from './redux/stores/store';
import { checkToken, loadUser } from './redux/actions/authActions';
import { AuthForm } from './components/auth/AuthForm';
import { Sidebar } from './components/layout/Sidebar';
import { ChatInterface } from './components/chat/ChatInterface';
import { LegalTemplates } from './components/templates/LegalTemplates';
import { LegalServices } from './components/services/LegalServices';
import { SubscriptionPlans } from './components/subscriptions/SubscriptionPlans';
import { ProfilePage } from './components/profile/ProfilePage';
import { SettingsPage } from './components/settings/SettingsPage';
import { Loading } from './components/common/Loading';
import { enqueueSnackbar } from 'notistack';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const auth = useSelector((state: RootState) => state.auth);
  const infoAuthUserStatus = auth.infoAuthUserStatus;

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const startTime = Date.now();

      try {
        if (isMounted && !isAuthenticated) {
          await dispatch(await loadUser());
          console.log("loadUser"); 
        }
      } finally {
        const endTime = Date.now();
        const timeElapsed = endTime - startTime;
        const minimumLoadTime = 2000;

        if (timeElapsed < minimumLoadTime && isMounted) {
          await new Promise(resolve =>
            setTimeout(resolve, minimumLoadTime - timeElapsed)
          );
        }

        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (infoAuthUserStatus === 'REQUEST') {
      setIsLoading(true);
    }

    if (infoAuthUserStatus === 'SUCCESS' && auth.user?.firstName && auth.user?.lastName) {
      enqueueSnackbar(`${auth.user?.firstName} ${auth.user?.lastName} عزیز خوش آمدید`, {
        variant: 'success'
      });
      const initializeApp = async () => {
        const startTime = Date.now();


        const endTime = Date.now();
        const timeElapsed = endTime - startTime;
        const minimumLoadTime = 2000; // 2 seconds in milliseconds

        if (timeElapsed < minimumLoadTime) {
          // Wait for the remaining time to complete 2 seconds
          await new Promise(resolve =>
            setTimeout(resolve, minimumLoadTime - timeElapsed)
          );
        }

        setIsLoading(false);
      };
      initializeApp();
    }
  }, [infoAuthUserStatus]);

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return (
    <div id="root" className="app-container">
      {isAuthenticated && <Sidebar />}
      <div className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <Navigate to="/chat" />
            }
          />
          {/* <Route path="/auth" element={<AuthForm />} /> */}
          <Route
            path="/chat"
            element={
              <ChatInterface />
            }
          />
          <Route
            path="/profile"
            element={
              <ProfilePage />
            }
          />
          {/* <Route
            path="/templates"
            element={
              isAuthenticated ? <LegalTemplates /> : <Navigate to="/auth" />
            }
          />
          <Route
            path="/services"
            element={
              isAuthenticated ? <LegalServices /> : <Navigate to="/auth" />
            }
          />
          <Route
            path="/plans"
            element={
              isAuthenticated ? <SubscriptionPlans /> : <Navigate to="/auth" />
            }
          />
        
          <Route
            path="/settings"
            element={
              isAuthenticated ? <SettingsPage /> : <Navigate to="/auth" />
            }
          />  */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
