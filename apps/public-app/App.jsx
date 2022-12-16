import { AppProvider as PolarisProvider, Frame, Navigation, TopBar } from "@shopify/polaris";
import {
  HomeMajor,
  LegalMajor,
} from '@shopify/polaris-icons';
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";

import { HomePage } from "./components/HomePage";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { Link } from './components/Link';
import { useState, useCallback } from 'react';

export default function App() {
  return (
    <PolarisProvider i18n={translations} linkComponent={Link}>
      <BrowserRouter>
        <RoutedComponent />
      </BrowserRouter>
    </PolarisProvider>
  );
}

function RoutedComponent() {
  const location = useLocation();
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const toggleMobileNavigationActive = useCallback(
    () =>
      setMobileNavigationActive(
        (mobileNavigationActive) => !mobileNavigationActive,
      ),
    [],
  );
  return (<div>{location?.pathname?.split ? <Frame
    showMobileNavigation={mobileNavigationActive}
    onNavigationDismiss={toggleMobileNavigationActive}
    navigation={(<Navigation location={location?.pathname}>
      <Navigation.Section
        separator
        title="Serve My SW"
        items={[
          {
            label: 'Home',
            icon: HomeMajor,
            url: '/',
            selected: location.pathname == '/'
          },
          {
            label: 'Privacy Policy',
            icon: LegalMajor,
            url: '/privacy-policy',
            selected: location.pathname == '/privacy-policy'
          },
        ]}
      />
    </Navigation>)}
    topBar={( <TopBar
      showNavigationToggle
      onNavigationToggle={toggleMobileNavigationActive}
    />)}
  >
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    </Routes>
  </Frame> : null }</div>);
}