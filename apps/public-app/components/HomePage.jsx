import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Heading,
  Button,
  TextField,
  Caption,
} from "@shopify/polaris";
import { useState } from "react";

import mageImgUrl from "../assets/mage2.png";

export function HomePage() {
  const [storeUrl, setStoreUrl] = useState("");

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Card.Section>
              <Stack wrap={false} distribution="trailing" alignment="center">
                <Stack.Item fill>
                  <TextContainer spacing="loose">
                    <Heading> Serve Theme Assets Through App Proxy </Heading>
                    <p>
                     Serve service workers or partytown from your assets
                    </p>
                    <p>
                      Simply select file from assets and include it from <code>/a/sw/asset-name.js</code>
                    </p>
                  </TextContainer>
                </Stack.Item>
                <Stack.Item>
                  <div style={{ padding: "0 20px" }}>
                    <Image
                      source={mageImgUrl}
                      alt="Nice work on building a Shopify app"
                      width={240}
                    />
                    <Caption>
                      {" "}
                      Generated with{" "}
                      <Link url="https://app.freewayml.com/"> Freeway ML </Link>
                    </Caption>
                  </div>
                </Stack.Item>
              </Stack>
            </Card.Section>
            <Card.Section title="Makes sense? ">
              <Stack wrap={true} vertical={true}>
                <Stack.Item fill={true}>
                  <TextContainer>
                    {" "}
                    Install the app it is free until you collect meaningful data
                    and get results.{" "}
                  </TextContainer>
                </Stack.Item>
                <Stack wrap={false} alignment="trailing">
                  <Stack.Item>
                    <TextField
                      value={storeUrl}
                      onChange={(v) => setStoreUrl(v)}
                      placeholder={"Your myshopify url"}
                      align="left"
                    />
                  </Stack.Item>
                  <Stack.Item>
                    <TextContainer>.myshopify.com</TextContainer>
                  </Stack.Item>
                </Stack>
                <Stack.Item>
                  <Button
                    disabled={!storeUrl}
                    primary
                    url={`/app/install?shop=${storeUrl}.myshopify.com`}
                  >
                    Install the app
                  </Button>
                </Stack.Item>
              </Stack>
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
