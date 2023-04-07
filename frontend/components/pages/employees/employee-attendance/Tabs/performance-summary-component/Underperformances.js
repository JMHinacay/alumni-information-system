import NumeralFormatter from '@components/utils/NumeralFormatter';
import { Card, Col, Row, Typography } from 'antd';

const Underperformances = ({ performance, ...props }) => {
  return (
    <Card
      title={<Typography.Title level={5}>Underperformances</Typography.Title>}
      style={{ marginBottom: 20 }}
    >
      <Row>
        <Col xs={24} lg={12} xl={6}>
          <Typography.Text strong style={{ marginRight: 10 }}>
            Number of Late:
          </Typography.Text>
          <Typography.Text type={performance?.countLate > 0 && 'danger'}>
            <NumeralFormatter withPesos={false} format="0,0.[0000]" value={performance?.countLate} />
          </Typography.Text>
        </Col>
        <Col xs={24} lg={12} xl={6}>
          <Typography.Text strong style={{ marginRight: 10 }}>
            Hours of Late:
          </Typography.Text>
          <Typography.Text type={performance?.late > 0 && 'danger'}>
            <NumeralFormatter withPesos={false} format="0,0.[0000]" value={performance?.late} />
          </Typography.Text>
        </Col>
        <Col xs={24} lg={12} xl={6}>
          <Typography.Text strong style={{ marginRight: 10 }}>
            Number of Undertime:
          </Typography.Text>
          <Typography.Text type={performance?.countUndertime > 0 && 'danger'}>
            <NumeralFormatter
              withPesos={false}
              format="0,0.[0000]"
              value={performance?.countUndertime}
            />
          </Typography.Text>
        </Col>
        <Col xs={24} lg={12} xl={6}>
          <Typography.Text strong style={{ marginRight: 10 }}>
            Hours of Undertime:
          </Typography.Text>
          <Typography.Text type={performance?.undertime > 0 && 'danger'}>
            <NumeralFormatter withPesos={false} format="0,0.[0000]" value={performance?.undertime} />
          </Typography.Text>
        </Col>
        <Col xs={24} lg={12} xl={6}>
          <Typography.Text strong style={{ marginRight: 10 }}>
            Number of Absent:
          </Typography.Text>
          <Typography.Text type={performance?.countAbsent > 0 && 'danger'}>
            <NumeralFormatter
              withPesos={false}
              format="0,0.[0000]"
              value={performance?.countAbsent}
            />
          </Typography.Text>
        </Col>
        <Col xs={24} lg={12} xl={6}>
          <Typography.Text strong style={{ marginRight: 10 }}>
            Hours of Absent:
          </Typography.Text>
          <Typography.Text type={performance?.countAbsent > 0 && 'danger'}>
            <NumeralFormatter
              withPesos={false}
              format="0,0.[0000]"
              value={performance?.hoursAbsent}
            />
          </Typography.Text>
        </Col>
      </Row>
    </Card>
  );
};

export default Underperformances;
