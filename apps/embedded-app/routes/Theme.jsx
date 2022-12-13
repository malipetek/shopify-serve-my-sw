import {
  Card,
  ResourceList,
  Avatar,
  ResourceItem,
  Page,
  Layout,
} from "@shopify/polaris";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { userLoggedInFetch } from "../App";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";
import { useSelector, useDispatch } from 'react-redux';
import { on, off } from "../store/events";
import { show, hide } from '../store/savebar';

export function Theme() {
  const { id } = useParams();
  const [files, setFiles] = useState([]);
  const [assets, setAssets] = useState([]);
  const [jsAssets, setJsAssets] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);
  const dispatch = useDispatch()

  useEffect(() => {
    console.log('dispatching')
    if (selectedItems.length) {
      dispatch(show())
    } else {
      dispatch(hide())
    }
  }, [selectedItems]);

  useEffect(() => {
    (async () => {
      const resp = await fetch(`/app/api/assets/${id}`);

      const themesJson = await resp.json();
      setFiles(themesJson);
      setAssets(themesJson.filter(asset => {
        const { key } = asset;
        const [folder, filename] = key.split("/");
        if (folder != "assets") return false;
        return true;
      }));
      setJsAssets(themesJson.filter(asset => {
        const { key } = asset;
        const [folder, filename] = key.split("/");
        if (folder != "assets" || filename.indexOf('.js') < 0) return false;
        return true;
      }));
    })();
    return () => 1
  }, []);

  const save = useCallback(() => {
    console.log('saving');
  });
  
  const discard = useCallback(() => {
    console.log('discarding');

  });

  useEffect(() => {
    on("savebar:save", save);

    return () => {
      off("savebar:save", save);
    }
  }, []);

  useEffect(() => {
    on("savebar:discard", discard);

    return () => {
      off("savebar:discard", discard);
    }
  }, []);

  return (
    <Page fullWidth title={"Theme"}>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <ResourceList
              resourceName={{ singular: "Asset", plural: "Assets" }}
              items={jsAssets || []}
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
              selectable
              renderItem={(asset) => {
                const { key } = asset;
                const [folder, filename] = key.split("/");
                return (
                  <ResourceItem
                    id={key}
                    accessibilityLabel={`Select ${key} for serving from an app proxy`}
                  >
                    {filename}
                  </ResourceItem>
                );
              }}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
