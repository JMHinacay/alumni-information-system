import { CheckOutlined, LockOutlined } from '@ant-design/icons';
import { gql, useMutation, useQuery } from '@apollo/react-hooks';
import {
  EmployeeComponent,
  HRButton,
  HRDivider,
  HRForm,
  HRInput,
  HRPageHeader,
} from '@components/commons';
import { Input, message, Modal, Spin, Tag } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const { Search } = Input;

const GET_USER = gql`
  query ($id: UUID) {
    employee(id: $id) {
      id
      employeeId
      fullName
      lastName
      firstName
      middleName
      nameSuffix
      gender
      dob
      address
      country
      stateProvince
      cityMunicipality
      barangay
      gender
      zipCode
      address2
      excludePayroll
      titleInitials
      excludePayroll
      isSpecialtyBoardCertified
      department {
        id
        departmentName
      }
      departmentOfDuty {
        id
        departmentName
      }
      user {
        login
        password
        permissions {
          description
          name
        }
        roles: authorities {
          name
        }
      }
    }
  }
`;

const SAVE_USER = gql`
  mutation ($id: UUID, $fields: Map_String_ObjectScalar) {
    createLogin(id: $id, fields: $fields) {
      message
      success
      payload {
        id
      }
    }
  }
`;

const CHANGE_PASSWORD = gql`
  mutation ChangePassword($username: String) {
    newPassword: changePassword(username: $username)
  }
`;

const REMOVE_PERMISSION_ROLE = gql`
  mutation ($id: UUID, $type: String, $name: String) {
    data: removeEmployeePermissionOrRole(id: $id, type: $type, name: $name) {
      success
      message
    }
  }
`;

export default function EmployeeRolesAndPermissionPage() {
  const router = useRouter();
  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      excludePayroll: false,
    },
  });
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const { loading, data, refetch } = useQuery(GET_USER, {
    variables: {
      id: router?.query?.id,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      let user = data?.employee?.user || {};
      methods.reset({
        login: user?.login,
        password: user?.password,
      });
      setRoles(data?.employee?.user?.roles || []);
      setPermissions(data?.employee?.user?.permissions || []);
    },
  });
  const [saveUser, { loading: loadingSaveUser }] = useMutation(SAVE_USER, {
    onCompleted: (data) => {
      if (data?.createLogin?.success) {
        message.success(data?.createLogin?.message || 'Successfully saved employee information.');
      } else {
        message.error(data?.upsertEmployee?.message || 'Failed to create user for the employee.');
      }
    },
  });
  const [removePermissionOrRole, { loading: loadingRemovePermissionOrRole }] = useMutation(
    REMOVE_PERMISSION_ROLE,
    {
      onCompleted: (result) => {
        let { data = {} } = result || {};
        if (data?.success) {
          message.success(data?.createLogin?.message || 'Success! Operation has completed!');
        } else {
          message.error(
            data?.upsertEmployee?.message || 'Something went wrong: Failed to do operation.',
          );
        }
        refetch();
      },
    },
  );

  const [changePasswordNow, { loading: changePasswordLoading }] = useMutation(CHANGE_PASSWORD, {
    ignoreResults: false,
    onCompleted: (data) => {
      Modal.info({
        title: 'Success',
        content:
          'The temporary password is ' +
          data.newPassword +
          '. Please copy and email this to the user',
        onOk() {},
        onCancel() {},
      });
    },
  });

  const handleSubmit = (values) => {
    saveUser({
      variables: {
        fields: { ...values },
        id: employeeId,
      },
    });
  };

  const changePassword = (login) => {
    Modal.confirm({
      title: 'Change Password Confirmation?',
      content: 'Please Confirm to reset Password',
      onOk() {
        changePasswordNow({
          variables: {
            username: login,
          },
        });
      },
      onCancel() {},
    });
  };

  const onSearch = (value, list, setter, conditionFunction) => {
    setter(list.filter(conditionFunction));
  };

  const onSearchRole = (value) => {
    onSearch(value, data?.employee?.user?.roles, setRoles, ({ name }, index) => {
      return name?.toLowerCase().includes(value?.toLowerCase());
    });
  };
  const onSearchPermissions = (value) => {
    onSearch(value, data?.employee?.user?.permissions, setPermissions, ({ description }, index) => {
      return description?.toLowerCase().includes(value?.toLowerCase());
    });
  };

  const resetOnClear = (e, type) => {
    if (e.target.value == '') {
      if (type === 'ROLES') {
        setRoles(data?.employee?.user?.roles || []);
      } else if (type === 'PERMISSIONS') {
        setPermissions(data?.employee?.user?.permissions || []);
      }
    }
  };

  const onRemovePermissionOrRole = (name, type, typePlaceholder, title) => {
    Modal.confirm({
      title: 'Are you sure?',
      content: (
        <>
          Are you sure you want to remove the {typePlaceholder}:{' '}
          <strong>{title ? title : name}</strong>
        </>
      ),
      onOk: () => {
        removePermissionOrRole({ variables: { id: employeeId, type, name } });
      },
    });
  };

  const employeeId = router.query?.id;
  return (
    <div style={{ margin: '20px 0' }}>
      <Head>
        <title>Employee Roles & Permissions</title>
      </Head>
      <HRPageHeader
        title="Employee Roles & Permissions"
        onBack={router.back}
        extra={
          <HRButton
            type="primary"
            allowedPermissions={['permission_to_assign_roles_and_permissions']}
            onClick={() => router?.push(`/roles-permissions/${employeeId}/assign`)}
          >
            Assign Roles & Permission
          </HRButton>
        }
      />

      {employeeId && (
        <Spin spinning={loading || loadingRemovePermissionOrRole}>
          <HRPageHeader title={'User Info'} />
          <EmployeeComponent
            fullName={data?.employee?.fullName}
            departmentName={data?.employee?.department?.departmentName}
            link={`/employees/manage/${employeeId}`}
            target="_blank"
            loading={loading}
          />

          <HRForm onSubmit={handleSubmit} methods={methods}>
            <HRInput
              label={'Username'}
              name={'login'}
              disabled={!!_.get(data, 'employee.user.login', false)}
              rules={{
                required: false,
                validate: async (value) => {
                  try {
                    if (value)
                      if (!data?.employee?.user?.login) {
                        client
                          .query({
                            query: gql`
                                          {
                                            isLoginUnique(login: "${value}")
                                          }
                                          `,
                            fetchPolicy: 'network-only',
                          })
                          .then((response) => {
                            const data = response?.data || {};
                            if (!data?.isLoginUnique)
                              methods.setError('login', {
                                message: '(Username is already taken!)',
                              });
                          });
                      }
                  } catch (err) {}
                },
              }}
            />

            <HRInput
              label={'Password'}
              name={'password'}
              type={'password'}
              autoComplete={'new-password'}
              disabled={!!_.get(data, 'employee.user.password', false)}
              rules={{ required: false }}
              allowClear
            />

            {!_.get(data, 'employee.user.password') ? (
              <>
                <HRInput
                  label={'Confirm Password'}
                  name={'confirmPassword'}
                  type={'password'}
                  autoComplete={'new-password'}
                  disabled={!!_.get(data, 'employee.user.password', false)}
                  rules={{
                    required: false,
                    validate: (value) =>
                      value
                        ? methods.getValues('password') == value || '(Password does not match)'
                        : true,
                  }}
                  allowClear
                />
                <HRButton
                  allowedPermissions={['edit_employee', 'manage_employee']}
                  type="primary"
                  style={{ width: '100%' }}
                  icon={<CheckOutlined />}
                  loading={loadingSaveUser}
                  htmlType="submit"
                >
                  Save Credentials
                </HRButton>
              </>
            ) : null}

            {_.get(data, 'employee.user.login') ? (
              <HRButton
                allowedPermissions={['edit_employee', 'manage_employee']}
                type="danger"
                style={{ width: '100%', marginTop: 5 }}
                loading={changePasswordLoading}
                icon={<LockOutlined />}
                onClick={() => {
                  changePassword(_.get(data, 'employee.user.login'));
                }}
              >
                Reset Password
              </HRButton>
            ) : null}
          </HRForm>
        </Spin>
      )}
      <HRDivider />
      <Spin spinning={loading || loadingRemovePermissionOrRole}>
        <HRPageHeader title={'Roles'} />
        <label>Search Roles</label>
        <Search
          placeholder="ROLE_XXXXXX"
          onChange={(e) => resetOnClear(e, 'ROLES')}
          onSearch={onSearchRole}
          enterButton
          allowClear
        />
        <div style={{ marginTop: 20 }}>
          {roles?.map(({ name }) => (
            <Tag
              key={name}
              color="blue"
              style={{ marginTop: 8 }}
              closable
              onClose={(e) => {
                e.preventDefault();
                onRemovePermissionOrRole(name, 'ROLE', 'Role');
              }}
            >
              {name}
            </Tag>
          ))}
        </div>
        <HRDivider />
        <HRPageHeader title={'Permissions'} />
        <label>Search Permissions</label>
        <Search
          placeholder="Permission to XXXXX"
          onChange={(e) => resetOnClear(e, 'PERMISSIONS')}
          onSearch={onSearchPermissions}
          enterButton
        />
        <div style={{ marginTop: 20 }}>
          {permissions?.map(({ description, name }) => (
            <Tag
              key={name}
              color="blue"
              style={{ marginTop: 8 }}
              closable
              onClose={(e) => {
                e.preventDefault();
                onRemovePermissionOrRole(name, 'PERMISSION', 'Permission', description);
              }}
            >
              {description}
            </Tag>
          ))}
        </div>
      </Spin>
    </div>
  );
}
