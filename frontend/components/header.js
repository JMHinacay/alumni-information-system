import _ from 'lodash';
import { getUrlPrefix, post } from '../shared/global';

import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useModal } from 'react-modal-hook';
//import {useEffect} from 'react'
//import useSWR from 'swr'
//import {get} from '../shared/global'
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import SockJsClient from 'react-stomp';
import { useToasts } from 'react-toast-notifications';

const profilePage = () => {
  const [parameters, setParameter] = useState(null);
  //  const { data, error } = useSWR(parameters ? '/ping':null, get);

  const { loading, error, data } = useQuery(
    gql`
      {
        account {
          id
          fullName
          user {
            activated
            access
            roles
          }
          department {
            id
            departmentName
          }
          departmentOfDuty {
            id
            departmentName
          }
        }
      }
    `,
    { errorPolicy: 'all' },
  );
  /*useEffect(()=>{
        if(parameters)
        console.log('loading...',parameters)
    },[parameters]);*/
  const [showProfilePage, hideProfilePage] = useModal(() => {
    //console.log(data)

    return (
      <Modal open>
        <Modal.Header>User Profile</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <Header>User Account Information</Header>

            <Card centered>
              <Image src="https://picsum.photos/400" wrapped ui={false} />
              <Card.Content>
                <Card.Header>{_.get(data, 'account.fullName', '')}</Card.Header>
                <Card.Meta>{_.get(data, 'account.departmentOfDuty.departmentName', '')}</Card.Meta>
                <Card.Description>
                  <List>
                    {_.get(data, 'account.user.roles', []).map((item, i) => {
                      return <List.Item key={i}>{item}</List.Item>;
                    })}
                  </List>
                </Card.Description>
              </Card.Content>
            </Card>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={hideProfilePage} color="red">
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }, [data]);

  const showWithParam = (param) => {
    setParameter(param);
    showProfilePage();
  };

  return [showWithParam, hideProfilePage];
};

const HeaderPage = ({ showNotificationBar, ...props }) => {
  const router = useRouter();
  const { addToast } = useToasts();
  const [confirmOpen, setconfirmOpen] = useState(false);
  const [showProfilePage] = profilePage();

  const onLogout = () => {
    setconfirmOpen(true);
  };

  const cancel = () => {
    setconfirmOpen(false);
  };

  const confirm = () => {
    post('/api/logout')
      .then((response) => {
        window.location = '/';
      })
      .catch((error) => {})
      .finally(() => {
        setconfirmOpen(false);
      });
  };

  function showWebSocketMessage(message) {
    //  console.log(message)
    let audio = new Audio('/notification.mp3');
    if (audio.currentTime !== 0) audio.currentTime = 0;
    audio.play();

    addToast(
      <Card>
        <Card.Content>
          <Card.Header>Notifications</Card.Header>
        </Card.Content>
        <Card.Content>
          <Card.Header> {message.title || ''}</Card.Header>
          <Card.Meta> {message.from || ''}</Card.Meta>
          <Card.Description>{message.message || ''}</Card.Description>
        </Card.Content>
      </Card>,
      {
        appearance: 'success',
        autoDismiss: true,
        autoDismissTimeout: 8000,
      },
    );
  }

  return (
    <div>
      <SockJsClient
        url={`${getUrlPrefix()}/ws`}
        topics={['/user/channel/notifications']}
        onMessage={showWebSocketMessage}
      />

      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item as="a" header>
            {/* <Image size='mini' src='/logo.png' style={{ marginRight: '1.5em' }} />*/}
            HISD3 Back Office Systems
          </Menu.Item>
          <Menu.Item as="a" href={'/'}>
            Main Dashboard
          </Menu.Item>
          <Menu.Menu position="right">
            <Dropdown item simple text={_.get(props, 'account.fullName')}>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    showProfilePage(props.account);
                  }}
                >
                  Profile
                </Dropdown.Item>

                <Dropdown.Divider />
                <Dropdown.Item onClick={onLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item
              as="a"
              icon={'alarm'}
              onClick={() => {
                showNotificationBar(true);
              }}
            />
          </Menu.Menu>
        </Container>
      </Menu>

      <Confirm
        open={confirmOpen}
        onConfirm={confirm}
        onCancel={cancel}
        header="Are you sure you wanted to logout?"
      />
    </div>
  );
};

export default HeaderPage;
