import { Steps } from 'antd';
import _ from 'lodash';
const { Step } = Steps;

function HRSteps(props) {
  let step = _.map(props?.Step, (item) => {
    return <Step key={item.title} title={item.title} description={item.description} />;
  });
  return (
    <div>
      <Steps current={props.current}>{step}</Steps>
      {props.Step[props.current].content}
    </div>
  );
}

export default HRSteps;
