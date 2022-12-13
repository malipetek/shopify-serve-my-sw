import { ContextualSaveBar } from '@shopify/polaris';
import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { trigger } from "../store/events";

function SaveBar() {
  const { loading, disabled, visible } = useSelector((state) => state.savebar);
  useEffect(() => {
    console.log('savebar rerender');
  })
  return (
    <div style={{ height: '50px' }}>
      {
        visible &&
        <ContextualSaveBar
          message="Unsaved changes"
          saveAction={{
            onAction: () => trigger('savebar:save'),
            loading: loading,
            disabled: disabled,
          }}
          discardAction={{
            onAction:  () => trigger('savebar:discard'),
          }}
        />
      }
    </div>
  );
}

export { SaveBar };
export default SaveBar;