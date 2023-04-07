import { HRButton, HRForm, HRInput } from '@components/commons';
import { Col, Row } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { post } from '../shared/global';

export default function ResetPassword({ account }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const methods = useForm({
    defaultValues: {},
  });

  const onSubmit = async ({ confirmationPassword, ...values }) => {
    // if (formData.newPassword !== formData.confirmationPassword) {
    //   showAlert('Error', 'Password and Confirmation Password did not match');
    //   return;
    // }
    setLoading(true);
    post('/reset-password', {}, { params: { ...values } })
      .then(() => {
        setLoading(false);
        router.replace('/');
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className={'forbiddencontainer'}>
        <Row>
          <Col>
            <HRForm size="small" onSubmit={onSubmit} methods={methods}>
              <HRInput
                name={'username'}
                label={'Username'}
                rules={{
                  required: 'Enter Username',
                }}
              />
              <HRInput
                name={'password'}
                type={'password'}
                label={'Password'}
                rules={{
                  required: 'Enter Password',
                }}
              />
              <HRInput
                label="New Password"
                allowClear
                autoCapitalize={'off'}
                type="password"
                autoComplete={'false'}
                name="newPassword"
                placeholder="New Password"
              />
              <HRInput
                name={'confirmationPassword'}
                type={'password'}
                label={'Confirm Password'}
                rules={{
                  required: false,
                  validate: (value) =>
                    value
                      ? methods.getValues('newPassword') == value || '(Password does not match)'
                      : true,
                }}
                allowClear
              />
              <HRButton type="primary" htmlType="submit" loading={loading}>
                Set New Password
              </HRButton>
            </HRForm>
          </Col>
        </Row>
      </div>

      <style jsx>{`
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;

        > * {
          margin-bottom: 16px;
        }

        .login-form-button {
          width: 100%;
        }
      `}</style>
    </>
  );
}
