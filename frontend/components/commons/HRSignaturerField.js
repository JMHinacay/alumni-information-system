import React, { forwardRef, useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { HRButton, HRModal } from '@components/commons';
import { Col, Row } from 'antd';
import styled from 'styled-components';

const initialState = {
  modal: false,
};

const HRSignatureField = (props, ref) => {
  const sigCanvas = useRef(null);
  const [state, setState] = useState({
    ...initialState,
    signature: props['data-__meta']?.initialValue || '',
  });
  const getSignature = () => {
    onChange(sigCanvas.current.getTrimmedCanvas().toDataURL('image/png'));
  };

  const closeOpenModal = () => {
    setState({
      ...state,
      modal: !state.modal,
    });
  };

  const clearSignatureState = () => {
    onChange('');
  };

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  function onChange(e) {
    setState({
      signature: e,
    });
    props?.onChange(e);
  }

  useEffect(() => {
    let signature = props?.value;
    setState({ signature });
  }, [props.value]);

  return (
    <Div>
      <HRModal
        visible={state.modal}
        title="Sign"
        footer={[
          <HRButton type="danger" onClick={clearSignature}>
            Clear
          </HRButton>,
          <HRButton type="primary" onClick={getSignature}>
            Done
          </HRButton>,
        ]}
        bodyStyle={{ backgroundColor: 'grey' }}
      >
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            style: {
              backgroundColor: 'white',
              width: '100%',
              height: '100%',
            },
          }}
        />
      </HRModal>
      <input ref={ref} type="hidden" onChange={onChange} />

      {props.error ? (
        <label htmlFor={props.field} className={'error'}>
          {props.error}
        </label>
      ) : (
        <label htmlFor={props.field} className={'label'}>
          {props.label}
        </label>
      )}

      {state.signature ? (
        <img
          alt="signature"
          src={state?.signature}
          style={{
            margin: '10px 0',
            border: '1px solid #8395a7',
            padding: '10px',
            width: '100%',
            height: '130px',
          }}
        />
      ) : (
        <div
          style={{
            margin: '10px 0',
            border: '1px solid #8395a7',
            padding: '10px',
            width: '100%',
            height: '130px',
          }}
        ></div>
      )}

      <HRButton onClick={closeOpenModal} style={{ marginRight: 10 }}>
        Sign
      </HRButton>
      <HRButton type="danger" onClick={clearSignatureState}>
        Clear
      </HRButton>
    </Div>
  );
};

export default forwardRef(HRSignatureField);

const Div = styled.div`
  .label {
    font-weight: bold;
    color: #222f3e;
  }

  .error {
    font-weight: bold;
    color: #d63031;
  }
`;
