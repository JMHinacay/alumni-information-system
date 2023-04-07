import { useState } from 'react';
import { useModal } from 'react-modal-hook';

export default function useDialog(Component) {
  const [myProps, setMyProps] = useState({});

  const [show, hide] = useModal(() => {
    return (
      <Component
        hide={(args) => {
          hide();
          if (myProps.onCloseCallback) myProps.onCloseCallback(args);
        }}
        {...myProps}
      />
    );
  }, [myProps]);

  return (props, onCloseCallback) => {
    let tprops = props || {};
    if (onCloseCallback) tprops.onCloseCallback = onCloseCallback;

    setMyProps(tprops);

    show();
  };
}
