import { AppProvider as PolarisProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";

import { HomePage } from "./components/HomePage";

export default function App() {
  return (
    <PolarisProvider i18n={translations}>
      <HomePage />
    </PolarisProvider>
  );
}
