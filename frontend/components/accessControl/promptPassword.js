import { AccountContext } from './AccountContext';
import { useModal } from 'react-modal-hook';

import React, { useState, useContext, useEffect } from 'react';
import bcrypt from 'bcryptjs';

import { devpassword } from '../../shared/devsettings';

const PromptPassword = ({ account, hide, onSuccess }) => {
  const passwordRef = React.createRef();
  const [password, setPassword] = useState(devpassword || '');
  const [errorLogin, setErrorLogin] = useState(false);
  useEffect(() => {
    passwordRef.current.focus();
    passwordRef.current.select();
  }, []);

  const process = (e) => {
    if (e.keyCode === 13) {
      bcrypt.compare(password, account.user.password, function (err, res) {
        if (res) {
          if (hide) hide();
          if (onSuccess) onSuccess();
        } else {
          setErrorLogin(true);
        }
      });
    }
  };
  return (
    <Modal open size={'small'} onClose={hide}>
      <Modal.Header>Password Confirmation </Modal.Header>
      <Modal.Content>
        <Grid
          divided={'vertically'}
          columns={16}
          style={{ backgroundColor: '#3fc59d' }}
          celled={'internally'}
        >
          <Grid.Row>
            <Grid.Column width={5}>
              <Image fluid src={'/rfid.png'} />
            </Grid.Column>

            <Grid.Column width={5}>
              <Image fluid src={'/line.png'} />
            </Grid.Column>

            <Grid.Column width={5}>
              <Image fluid src={'/password.png'} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <Form error={errorLogin}>
                <Input
                  error={errorLogin}
                  ref={passwordRef}
                  onKeyDown={process}
                  focus={true}
                  fluid
                  type={'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Message error header="Wrong password authentication" content="Please try again." />
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Content>
    </Modal>
  );
};

export const confirmationPasswordHook = () => {
  const accountContext = useContext(AccountContext);
  const [successCallback, setSuccessCallback] = useState({
    callback: () => {
      alert('Please specify Success Callback');
    },
  });

  const [showPasswordConfirmation, hidePasswordConfirmation] = useModal(
    () => (
      <PromptPassword
        hide={hidePasswordConfirmation}
        onSuccess={successCallback.callback}
        account={accountContext}
      />
    ),
    [successCallback],
  );

  return [
    (onSuccess) => {
      if (onSuccess)
        setSuccessCallback({
          callback: () => {
            onSuccess();
          },
        });
      showPasswordConfirmation();
    },
  ];
};
