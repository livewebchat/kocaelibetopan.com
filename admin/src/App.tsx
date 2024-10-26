import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import HeroSlider from './pages/HeroSlider/HeroSlider';
import ContactInformation from './pages/ContactInformation/ContactInformation';

import SignIn from './pages/Authentication/SignIn';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import Dashboard from './pages/Dashboard/Dashboard';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Yönetim Paneli | Kocaeli Betopan" />
              <Dashboard />
            </>
          }
        />
        <Route
          path="/slaytlar"
          element={
            <>
              <PageTitle title="Ana Sayfa Slaytları | Kocaeli Betopan" />
              <HeroSlider />
            </>
          }
        />
        <Route
          path="/iletisim-bilgileri"
          element={
            <>
              <PageTitle title="İletişim Bilgileri | Kocaeli Betpoan" />
              <ContactInformation />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Yönetim Paneli | Kocaeli Betopan" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Yönetim Paneli | Kocaeli Betopan" />
              <Profile />
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Yönetim Paneli | Kocaeli Betopan" />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Yönetim Paneli | Kocaeli Betopan" />
              <FormLayout />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Yönetim Paneli | Kocaeli Betopan" />
              <Tables />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Yönetim Paneli | Kocaeli Betopan" />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Yönetim Paneli | Kocaeli Betopan" />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Yönetim Paneli | Kocaeli Betopan" />
              <Buttons />
            </>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Yönetim Paneli | Kocaeli Betopan" />
              <SignIn />
            </>
          }
        />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
