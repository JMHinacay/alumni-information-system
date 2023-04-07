import Modal from 'antd/lib/modal/Modal';
import { useState } from 'react';

export default function useModal(props) {
  const [modal, setModal] = useState(false);

  let bodyStyle = props.bodyStyle;
  let style = props.style;
  let width = props.width;

  if (props.allowFullScreen) {
    bodyStyle = { height: 'calc(100vh - 108px)', overflow: 'scroll' };
    style = { top: 0, height: '100vh' };
    width = '100%';
  }

  function showModal() {
    setModal(true);
  }

  function hideModal() {
    setModal(false);
  }

  const renderModal = (
    <Modal
      visible={modal}
      {...props}
      onCancel={hideModal}
      bodyStyle={bodyStyle}
      style={style}
      width={width}
    >
      {props.children}
    </Modal>
  );

  return [renderModal, showModal];
}
