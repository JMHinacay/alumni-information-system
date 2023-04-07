import React from 'react';
import { Card, Col, InputNumber, PageHeader, Row, Tag, Typography, Spin, message } from 'antd';
import Head from 'next/head';
import { HRButton, HRDivider, HRForm, HRInputNumberNiAyingzkie } from '@components/commons';
import { Controller, useForm } from 'react-hook-form';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';

const GET_SALARY_RATE_MULTIPLIER = gql`
  query {
    salarRateMultiplier: getSalaryRateMultiplier {
      id
      regular
      restday
      specialHoliday
      specialHolidayAndRestDay
      regularHoliday
      regularHolidayAndRestDay
      doubleHoliday
      doubleHolidayAndRestDay
      regularOvertime
      restdayOvertime
      specialHolidayOvertime
      specialHolidayAndRestDayOvertime
      regularHolidayOvertime
      regularHolidayAndRestDayOvertime
      doubleHolidayOvertime
      doubleHolidayAndRestDayOvertime
      nightDifferential
    }
  }
`;

const SAVE_SALARY_RATE_MULTIPLIER = gql`
  mutation($fields: Map_String_ObjectScalar) {
    data: updateSalaryRateMultiplier(fields: $fields) {
      payload {
        id
        regular
        restday
        specialHoliday
        specialHolidayAndRestDay
        regularHoliday
        regularHolidayAndRestDay
        doubleHoliday
        doubleHolidayAndRestDay
        regularOvertime
        restdayOvertime
        specialHolidayOvertime
        specialHolidayAndRestDayOvertime
        regularHolidayOvertime
        regularHolidayAndRestDayOvertime
        doubleHolidayOvertime
        doubleHolidayAndRestDayOvertime
        nightDifferential
      }
      success
      message
    }
  }
`;

function SalaryCalculationRatesPage(props) {
  const methods = useForm();
  const { data, loading, refetch } = useQuery(GET_SALARY_RATE_MULTIPLIER, {
    onCompleted: (result) => {
      let { salarRateMultiplier } = result || {};
      methods.reset({ ...salarRateMultiplier });
    },
  });

  const [saveSalaryRateMultiplier, { loading: loadingSaveSalaryRateMultiplier }] = useMutation(
    SAVE_SALARY_RATE_MULTIPLIER,
    {
      onCompleted: (result) => {
        let { data } = result || {};
        if (data?.success) {
          message.success(data?.message ?? 'Successfully updated salary rate multiplier.');
          methods.reset({
            ...data?.payload,
          });
        } else message.error(data?.message ?? 'Failed to update salary rate multiplier.');
      },
    },
  );

  const scheduledWorkFields = [
    {
      title: 'Regular Day',
      name: 'regular',
    },
    {
      title: 'Rest Day',
      name: 'restday',
    },
    {
      title: 'Special Holiday',
      name: 'specialHoliday',
    },
    {
      title: 'Special Holiday and Restday',
      name: 'specialHolidayAndRestDay',
    },
    {
      title: 'Regular Holiday',
      name: 'regularHoliday',
    },
    {
      title: 'Regular Holiday and Restday',
      name: 'regularHolidayAndRestDay',
    },
    {
      title: 'Double Holiday',
      name: 'doubleHoliday',
    },
    {
      title: 'Double Holiday and Restday',
      name: 'doubleHolidayAndRestDay',
    },
  ];

  const handleSubmit = (fields) => {
    saveSalaryRateMultiplier({
      variables: {
        fields,
      },
    });
  };

  return (
    <div>
      <Head>
        <title>salary calculation rates</title>
      </Head>
      <HRForm onSubmit={handleSubmit} methods={methods}>
        <PageHeader
          title="Salary Calculation Rates"
          extra={[
            <HRButton
              type="primary"
              htmlType="submit"
              key="submit-button"
              loading={loadingSaveSalaryRateMultiplier}
            >
              Save Changes
            </HRButton>,
          ]}
        />
        <Row gutter={[12, 12]}>
          <Col span={12}>
            <Spin spinning={loading}>
              <Card>
                <Typography.Title level={5}>Scheduled Work Multiplier</Typography.Title>
                <HRDivider />
                <Row gutter={[10, 12]} key={name}>
                  {scheduledWorkFields.map(({ title, name }) => {
                    return (
                      <>
                        <Col
                          span={12}
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                          }}
                        >
                          <Typography.Text style={{ fontSize: 16 }}>
                            <strong>{title} :</strong>
                          </Typography.Text>
                        </Col>
                        <Col
                          span={8}
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                          }}
                        >
                          {/* TODO: make the custom input required */}
                          <Controller
                            control={methods.control}
                            name={name}
                            render={(inputProps) => (
                              <HRInputNumberNiAyingzkie
                                {...inputProps}
                                placeholder={title}
                                as={<InputNumber />}
                                containerStyle={{ width: '100%', margin: 0 }}
                                onChange={(e) => inputProps.onChange(e)}
                              />
                            )}
                          />
                        </Col>
                      </>
                    );
                  })}
                </Row>
              </Card>
            </Spin>
          </Col>
          <Col span={12}>
            <Spin spinning={loading}>
              <Card>
                <Typography.Title level={5}>Overtime Work Multiplier</Typography.Title>
                <HRDivider />
                <Row gutter={[10, 12]} key={name + '_overtime'}>
                  {scheduledWorkFields.map(({ title, name }) => {
                    return (
                      <>
                        <Col
                          span={12}
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                          }}
                        >
                          <Typography.Text style={{ fontSize: 16 }}>
                            <strong>{title} :</strong>
                          </Typography.Text>
                        </Col>
                        <Col
                          span={8}
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                          }}
                        >
                          <Controller
                            control={methods.control}
                            name={name + 'Overtime'}
                            render={(inputProps) => (
                              <HRInputNumberNiAyingzkie
                                {...inputProps}
                                placeholder={title}
                                as={<InputNumber />}
                                containerStyle={{ width: '100%', margin: 0 }}
                                onChange={(e) => inputProps.onChange(e)}
                              />
                            )}
                          />
                        </Col>
                      </>
                    );
                  })}
                </Row>
              </Card>
            </Spin>
          </Col>
          <Col span={24}>
            <Spin spinning={loading}>
              <Card>
                <Typography.Title level={5}>Night Shift Differential</Typography.Title>
                <HRDivider />
                <Row gutter={[50, 12]}>
                  <Col span={8}>
                    <Row gutter={[10, 12]}>
                      <Col
                        span={12}
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                        }}
                      >
                        <Typography.Text style={{ fontSize: 16 }}>
                          <strong>Addon Multiplier :</strong>
                        </Typography.Text>
                      </Col>
                      <Col
                        span={12}
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                        }}
                      >
                        <Controller
                          control={methods.control}
                          name="nightDifferential"
                          render={(inputProps) => (
                            <HRInputNumberNiAyingzkie
                              {...inputProps}
                              placeholder="Value"
                              as={<InputNumber />}
                              containerStyle={{ width: '100%', margin: 0 }}
                              onChange={(e) => inputProps.onChange(e)}
                            />
                          )}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col span={8}>
                    <Typography.Text>
                      If you have &#8369;50 calculated hourly rate, within 10pm-6am, your hourly
                      rate will be
                      <Tag color="blue" style={{ marginLeft: 10 }}>
                        &#8369;55
                      </Tag>
                      Formula: &#8369;50 + (&#8369;50 x 0.1)
                    </Typography.Text>
                  </Col>
                </Row>
              </Card>
            </Spin>
          </Col>
        </Row>
      </HRForm>
    </div>
  );
}

export default SalaryCalculationRatesPage;
