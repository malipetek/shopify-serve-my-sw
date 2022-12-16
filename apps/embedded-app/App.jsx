import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import {
  Provider as AppBridgeProvider,
  useAppBridge,
} from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import {
  AppProvider as PolarisProvider,
  Frame
} from "@shopify/polaris";

import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Link from "./components/Link";
import SaveBar from "./components/SaveBar";

import { HomePage } from "./routes/HomePage";
import { Theme } from "./routes/Theme";

import { Provider as ReduxProvider, useDispatch } from 'react-redux';
import { useEffect } from "react";
import store from './store/store';
import { setShop } from './store/shop';

export default function App() {
  return (
    <PolarisProvider i18n={translations} linkComponent={Link}>
      <BrowserRouter>
        <AppBridgeProvider
          config={{
            apiKey: process.env.SHOPIFY_API_KEY,
            host: new URL(location.href).searchParams.get("host"),
            forceRedirect: true,
          }}
        >
          <ReduxProvider store={store}>
            <MyProvider>
              <Frame
              // logo={logo}
              // topBar={topBarMarkup}
              // navigation={navigationMarkup}
              // showMobileNavigation={mobileNavigationActive}
              // onNavigationDismiss={toggleMobileNavigationActive}
              // skipToContentTarget={skipToContentRef.current}
              >
                <SaveBar />
                <Routes>
                  <Route path="/app/" element={<HomePage />} />
                  <Route path="/app/theme/:id" element={<Theme />} />
                </Routes>
              </Frame>
            </MyProvider>
          </ReduxProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}

function MyProvider({ children }) {
  const app = useAppBridge();
  const baseurl = new URL(location.href);
  const shop = baseurl.searchParams.get("shop");
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(setShop(shop));
  }, []);
  
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      credentials: "include",
      fetch: userLoggedInFetch(app),
    }),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
let baseurl;

export function userLoggedInFetch(app) {
  baseurl = baseurl || new URL(location.href);

  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const [pathname, search] = uri.split('?');
    baseurl.pathname = pathname;
    baseurl.search += '&' + search;
    const response = await fetchFunction(baseurl.href, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}
