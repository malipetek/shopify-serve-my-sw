import {
  Card,
  ResourceList,
  ResourceItem,
  Page,
  Layout,
  TextField
} from "@shopify/polaris";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { userLoggedInFetch } from "../App";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";
import { useSelector, useDispatch } from 'react-redux';
import { on, off } from "../store/events";
import { show, hide } from '../store/savebar';
import { setOpenTheme, setAssets } from '../store/themes';

const compareArrays = (array1, array2) => {
  return (
    array1.length === array2.length && 
    array1.every((el) => array2.includes(el))
  );
};

export function Theme() {
  const { id } = useParams();
  const [selectedItems, setSelectedItems] = useState([]);
  const [initialSelectedItems, setInitialSelectedItems] = useState([]);
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);
  const dispatch = useDispatch();
  const [ theme ] = useSelector(state => {
    return state.themes.themes.slice().filter(t => t.id == id);
  });
  const { shop } = useSelector(state => state.shop);

  useEffect(() => {
    (async () => {
      console.log('theme');
      if(shop && theme && theme.assets) {
        const filesres = await fetch(`/app/api/files/${shop}/${theme.name}`);
        const filesjson = await filesres.json();
        const items = theme.assets.slice().filter(a => filesjson.some(f => a.key.split('/').pop() == f)).map(asset => asset.key)
        setInitialSelectedItems(items);
        setSelectedItems(items)
      }
    })();
  }, [shop, theme]);

  useEffect(() => {
    if (selectedItems && initialSelectedItems && !compareArrays(selectedItems, initialSelectedItems)) {
      dispatch(show())
    } else {
      dispatch(hide())
    }
  }, [selectedItems, initialSelectedItems]);

  useEffect(() => {
    // dispatch(setOpenTheme(id));
    if (theme && theme.assets === undefined) {
      // loading assets for once
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
    }
      
    return () => 1
  }, []);

  const save = useCallback(() => {    
    console.log('savinggg');
    const newFiles = selectedItems.filter(item => !initialSelectedItems.includes(item));
    const removedFiles = initialSelectedItems.filter(item => !selectedItems.includes(item));
    Promise.all(newFiles.map(async (asset_key) => {
      const filename = asset_key.split('/').pop();
      return fetch(`/app/api/files/${shop}/${theme.name}/${filename}?theme_id=${theme.id}`, {
        method: 'post',
        body: "{}"
      });
    })).then(results => {
      setInitialSelectedItems(selectedItems);
    });
    Promise.all(removedFiles.map(async (asset_key) => {
      const filename = asset_key.split('/').pop();
      return fetch(`/app/api/files/${shop}/${theme.name}/${filename}?theme_id=${theme.id}`, {
        method: 'delete',
        body: "{}"
      });
    })).then(results => {
      setInitialSelectedItems(selectedItems);
    });
  }, [selectedItems, initialSelectedItems]);
  
  const discard = useCallback(() => {
    console.log('discarding');

  });

  useEffect(() => {
    on("savebar:save", save);

    return () => {
      off("savebar:save", save);
    }
  }, [selectedItems, initialSelectedItems]);

  useEffect(() => {
    on("savebar:discard", discard);

    return () => {
      off("savebar:discard", discard);
    }
  }, [selectedItems, initialSelectedItems]);

  const itemClicked = useCallback((asset) => {
    if (selectedItems.includes(asset.key)) {
      setSelectedItems(
        selectedItems.slice().filter(i => i != asset.key)
      );
    } else {
      setSelectedItems([
        ...selectedItems,
        asset.key
      ]);
    }
  }, [selectedItems, theme]);

  return (
    <Page
      fullWidth
      title={ theme?.name || "Theme" }
      breadcrumbs={[{content: 'Homepage', url: '/app'}]}
    >
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <ResourceList
              resourceName={{ singular: "Asset", plural: "Assets" }}
              items={theme?.assets || []}
              selectedItems={selectedItems}
              selectable
              renderItem={(asset) => {
                const { key } = asset;
                const [folder, filename] = key.split("/");
                return (
                  <ResourceItem
                    id={key}
                    accessibilityLabel={`Select ${key} for serving from an app proxy`}
                  >
                    <div onClick={(e) => {
                      if (e.target.tagName != 'INPUT' && e.target.type != 'text') {
                        itemClicked(asset);
                      }
                    }}
                    style={{
                      padding: "1em 2em 1em 4em",
                      margin: "-1em -2em -1em -4em",
                      position: "relative",
                      zIndex: 3
                    }}>
                    {filename}
                    {
                      selectedItems.includes(key) ? 
                        <TextField
                          selectTextOnFocus
                          label="include with this"
                          value={`/a/sw/${encodeURIComponent(theme.name)}/${encodeURIComponent(filename)}`}
                        />
                        : null}
                    </div>
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
