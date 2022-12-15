import { Card, ResourceList, Avatar, ResourceItem } from "@shopify/polaris";
import { useState, useEffect, useCallback } from "react";
import { userLoggedInFetch } from "../App";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";
import useAsync from "../hooks/useAsync";
import { setThemes } from "../store/themes";
import { useSelector, useDispatch } from 'react-redux';

export function ThemeList() {
  const { themes } = useSelector(state => state.themes);
  const { shop } = useSelector(state => state.shop);
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (themes && !themes.length) {
      (async () => {
        const resp = await fetch("/app/api/themes");
        console.log("resp", resp);
        return await resp.json();
      })().then(
        themesJson => dispatch(setThemes(themesJson)));
    }
  }, []);

  return (
    <Card>
      <ResourceList
        resourceName={{ singular: "Theme", plural: "Themes" }}
        items={themes}
        renderItem={(theme) => {
          const { id, name } = theme;
          // const media = <Avatar customer size="medium" name={name} />;

          return (
            <ResourceItem
              id={id}
              url={`/app/theme/${id}`}
              accessibilityLabel={`View details for ${id}`}
            >
              {name} ({id})
            </ResourceItem>
          );
        }}
      />
    </Card>
  );
}
