import React from 'react';
import { useState, useEffect } from 'react';
import { Transition } from 'react-transition-group';
import { useRouter } from 'next/router';

const initialState = {
  loaded: false,
};

const ComponentTransition = ({ in: inProps, ...props }) => {
  const [state, setState] = useState(initialState);
  const { key } = useRouter();
  useEffect(() => {
    setState({
      ...state,
      loaded: true,
    });
  }, []);

  const duration = 300;

  const defaultStyle = {
    transition: `transform ${duration}ms, opacity ${300}ms ease-in-out`,
    opacity: 1,
  };

  const transitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
  };

  return (
    <Transition
      key={key}
      in={inProps != null ? inProps : state.loaded}
      timeout={duration}
      appear
      unmountOnExit
    >
      {(state) => (
        <div
          style={{
            ...defaultStyle,
            ...transitionStyles[state],
          }}
        >
          {props.children}
        </div>
      )}
    </Transition>
  );
};

export default ComponentTransition;
