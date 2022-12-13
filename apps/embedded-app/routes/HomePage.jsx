import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Heading,
} from "@shopify/polaris";

import trophyImgUrl from "../assets/home-trophy.png";

import { ThemeList } from "../components/ThemeList";

export function HomePage() {
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
          </Card>
        </Layout.Section>
        <Layout.Section>
          <ThemeList />
        </Layout.Section>
        <Layout.Section></Layout.Section>
      </Layout>
    </Page>
  );
}
