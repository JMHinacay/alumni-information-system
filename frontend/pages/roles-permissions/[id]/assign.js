import { CheckOutlined } from '@ant-design/icons';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import { EmployeeComponent, HRButton, HRForm, HRPageHeader, HRSelect } from '@components/commons';
import useHasPermission from '@hooks/useHasPermission';
import { Result, Spin } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';

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
        access
        roles
        permissions {
          description
          name
        }
        authorities {
          name
        }
      }
    }

    authorities {
      name
      label: name
      value: name
    }
    permissions {
      name
      label: description
      value: name
    }
    groupPolicies {
      id
      value: id
      label: description
    }
  }
`;

const USER_ROLES_PERMISSION_UPDATE = gql`
  mutation ($id: UUID, $roles: [String], $permissions: [String]) {
    setEmployeeRolesAndPermissions(id: $id, roles: $roles, permissions: $permissions) {
      payload
      success
    }
  }
`;

function AssignRolesPermissionsEmployeePage() {
  const router = useRouter();
  const methods = useForm();
  const { loading, data, refetch } = useQuery(GET_USER, {
    variables: {
      id: router?.query?.id,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      let user = data?.employee?.user || {};
      console.log(user.permissions);
      methods.reset({
        login: user?.login,
        password: user?.password,
        authorities: user?.roles,
        permissions: user?.access,
        groupPolicies: user?.groupPolicies,
      });
    },
  });

  const [getGroupPolicyPermissions, { loading: groupPolicyLoading, data: groupPolicyData }] =
    useLazyQuery(
      gql`
        query ($groupPolicyId: [UUID]) {
          groupPolicy: getGroupPolicyById(groupPolicyId: $groupPolicyId) {
            id
            name
            description
            permissions
          }
        }
      `,
      {
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
        onCompleted: (result) => {
          let { groupPolicy = [] } = result || {};
          let permissions = groupPolicy?.reduce(
            (acc, value) => acc.concat(value?.permissions || []),
            [],
          );

          methods.setValue('permissions', [...new Set(permissions)]);
        },
      },
    );

  const [updateUserRolesAndPermissions, { loading: loadingUpdateRolesAndPermissions }] =
    useMutation(USER_ROLES_PERMISSION_UPDATE, {
      notifyOnNetworkStatusChange: true,
    });
  let hasPermissionToEdit = useHasPermission(['edit_employee', 'manage_employee']);
  let hasPermissionToAssignRolesAndPermissions = useHasPermission([
    'permission_to_assign_roles_and_permissions',
  ]);

  const onSubmit = (values) => {
    console.log(values);
    updateUserRolesAndPermissions({
      variables: {
        id: router?.query?.id,
        roles: values?.authorities || [],
        permissions: values?.permissions || [],
      },
    });
  };
  const employeeId = router.query?.id;

  const onChangeGroupPolicy = (groupPolicyId) => {
    getGroupPolicyPermissions({ variables: { groupPolicyId } });
  };

  if (!hasPermissionToAssignRolesAndPermissions) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <HRButton onClick={() => router.back()} type="primary">
            Go Back
          </HRButton>
        }
      />
    );
  }

  return (
    <div style={{ margin: '20px 0' }}>
      <Head>
        <title>Assign Roles & Permissions to Employee</title>
      </Head>
      <HRForm methods={methods} onSubmit={onSubmit}>
        <HRPageHeader
          title="Assign Roles & Permissions to Employee"
          onBack={router.back}
          extra={
            hasPermissionToEdit && (
              <HRButton type="primary" htmlType="submit" loading={loadingUpdateRolesAndPermissions}>
                Save Roles & Permission
              </HRButton>
            )
          }
        />
        <Spin spinning={loading || loadingUpdateRolesAndPermissions}>
          <EmployeeComponent
            fullName={data?.employee?.fullName}
            departmentName={data?.employee?.department?.departmentName}
            link={`/employees/manage/${employeeId}`}
            target="_blank"
            loading={loading}
          />
        </Spin>

        <Spin spinning={loading || loadingUpdateRolesAndPermissions}>
          <HRSelect
            label={'Roles'}
            name={'authorities'}
            mode="multiple"
            options={data?.authorities}
          />

          <HRSelect
            label={'Group Policy'}
            name={'groupPolicy'}
            mode="multiple"
            onChange={onChangeGroupPolicy}
            options={data?.groupPolicies}
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          />

          <HRSelect
            label={'Permissions'}
            name={'permissions'}
            mode="multiple"
            options={data?.permissions}
          />
        </Spin>
      </HRForm>
    </div>
  );
}

export default AssignRolesPermissionsEmployeePage;
