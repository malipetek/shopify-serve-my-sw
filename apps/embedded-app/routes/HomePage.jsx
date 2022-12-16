import {
  Card,
  Page,
  Layout,
  TextContainer,
  Stack,
  Heading,
  Button,
  Banner
} from "@shopify/polaris";
import { useState, useEffect, useCallback } from "react";
import { userLoggedInFetch } from "../App";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";
import { ThemeList } from "../components/ThemeList";
import { hide } from '../store/savebar';
import { useDispatch } from 'react-redux';

export function HomePage() {
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState('');
  const [status, setStatus] = useState('');

  const syncFilesFromShopify = useCallback(() => {
    setLoading(true);
    (async () => {
      const resp = await fetch("/app/api/themes", {
        method: 'put'
      });
      setStatusCode(resp.status);
      return await resp.json();
    })().then((response) => {
      setLoading(false);
      setStatus(response?.status);
    });

    dispatch(hide())

  }, []);
  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Stack
              wrap={false}
              spacing="extraTight"
              distribution="trailing"
              alignment="center"
            >
              <Stack.Item fill>
                <TextContainer spacing="loose">
                  <Heading> Select assets to serve through app proxy </Heading>
                </TextContainer>
              </Stack.Item>
            </Stack>
            <Stack>
              <Stack.Item fill>
              <TextContainer spacing="loose">
                <Heading> Cache </Heading>
                {
                  `We will store the asset in a cache so it is not realtime from your assets.
                  If you want to refresh contents hit the button below.` }
              </TextContainer>
              </Stack.Item>
              <Stack.Item fill>
                <Button
                  primary
                  loading={loading}
                  onClick={syncFilesFromShopify}
                > Purge Cache </Button>
              </Stack.Item>
              {status ?
                <Stack.Item fill>
                  <Banner title="Sync Status" status={statusCode == '200' ? 'success' : 'critical'}>
                    <p>
                      {loading ? 'In progress...' : status}
                    </p>
                  </Banner>
                </Stack.Item>
                : null }
          </Stack>
        </Card>
      </Layout.Section>
      <Layout.Section>
        <ThemeList />
      </Layout.Section>
      <Layout.Section></Layout.Section>
    </Layout>
    </Page >
  );
}
