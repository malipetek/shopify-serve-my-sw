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
import { setOpenTheme, setAssets } from '../store/themes';

export function Theme() {
  const { id } = useParams();
  const [selectedItems, setSelectedItems] = useState([]);
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);
  const dispatch = useDispatch();
  const [ theme ] = useSelector(state => {
    return state.themes.themes.slice().filter(t => t.id == id);
  });

  useEffect(() => {
    if (selectedItems.length) {
      dispatch(show())
    } else {
      dispatch(hide())
    }
  }, [selectedItems]);

  useEffect(() => {
    // dispatch(setOpenTheme(id));

    (async () => {
      const resp = await fetch(`/app/api/assets/${id}`);

      const allAssets = await resp.json();
      
      const assets = allAssets.filter(asset => {
        const { key } = asset;
        const [folder, filename] = key.split("/");
        if (folder != "assets" || filename.indexOf('.js') < 0) return false;
        return true;
      })
      dispatch(setAssets({id, assets}));
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
    <Page
      fullWidth
      title={ theme?.name || "Theme" }
      breadcrumbs={[{content: 'Homepage', url: '/app'}]}
    >
      <h1> { theme?.assets?.length || 'no assets' } </h1>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <ResourceList
              resourceName={{ singular: "Asset", plural: "Assets" }}
              items={theme?.assets || []}
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
