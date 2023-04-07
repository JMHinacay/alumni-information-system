import { HRPageHeader, HRSteps } from '@components/commons';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Step1 from '@components/pages/allowance/employeeAllowance/step1';
import Step2 from '@components/pages/allowance/employeeAllowance/step2';
import Step3 from '@components/pages/allowance/employeeAllowance/step3';
import { Button, Result } from 'antd';
import useHasPermission from '@hooks/useHasPermission';

function AssignAllowance() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [selectedData, setSelectedData] = useState({
    selectedTemplate: '',
    selectedEmployee: [],
    selectedDepartment: [],
  });
  const steps = [
    {
      title: 'Step 1',
      content: (
        <Step1
          setCurrent={setCurrent}
          current={current}
          setSelectedData={setSelectedData}
          selectedData={selectedData}
        />
      ),
      description: 'Select Allowance Template',
    },
    {
      title: 'Step 2',
      content: (
        <Step2
          setCurrent={setCurrent}
          current={current}
          setSelectedData={setSelectedData}
          selectedData={selectedData}
        />
      ),
      description: 'Select Employees',
    },
    {
      title: 'Step 3',
      content: (
        <Step3
          setCurrent={setCurrent}
          setSelectedData={setSelectedData}
          current={current}
          selectedData={selectedData}
        />
      ),
      description: 'Final Checks',
    },
  ];

  if (!useHasPermission(['permission_to_assign_allowance_to_employees'])) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button onClick={() => router.back()} type="primary">
            Go Back
          </Button>
        }
      />
    );
  }
  return (
    <div>
      <Head>
        <title>Assign Allowance</title>
      </Head>
      <HRPageHeader onBack={router.back} title="Assign Allowance" />
      <HRSteps Step={steps} current={current} />
    </div>
  );
}

export default AssignAllowance;
