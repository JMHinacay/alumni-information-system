import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';

export default function HRModal(props) {
  let bodyStyle = props.bodyStyle;
  let style = props.style;
  let width = props.width;

  if (props.allowFullScreen) {
    bodyStyle = { height: 'calc(100vh - 108px)', overflow: 'scroll' };
    style = { top: 0, height: '100vh', margin: 0, width: '100%' };
    width = '100vw';
  }

  const hasCenteredProperty = props.hasOwnProperty('centered');
  return (
    <Modal
      {...props}
      title={<span>{props.title}</span>}
      destroyOnClose={true}
      bodyStyle={bodyStyle}
      style={style}
      width={width}
      centered={hasCenteredProperty ? props.centered : true}
      maskClosable={false}
    >
      {props.children}
    </Modal>
  );
}

HRModal.propTypes = {
  ...Modal.propTypes,
  allowFullScreen: PropTypes.bool,
};

HRModal.defaultProps = {
  allowFullScreen: false,
};
