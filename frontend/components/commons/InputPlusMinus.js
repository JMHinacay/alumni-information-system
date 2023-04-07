import { HRInput } from '@components/commons';
import { Button } from 'antd';
import _ from 'lodash';
import Head from 'next/head';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

function InputPlusMinus({ text }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
      <Button type="link" size={'small'} icon={<MinusOutlined />} ghost danger></Button>
      {text}
      <Button type="link" size={'small'} icon={<PlusOutlined />} ghost></Button>
    </div>
  );
}

export default InputPlusMinus;
