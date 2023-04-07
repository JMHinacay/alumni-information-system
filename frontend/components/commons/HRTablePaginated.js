import { Pagination, Table } from 'antd';
import _ from 'lodash';
import HRTable from './HRTable';

const HRTablePaginated = (props) => {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <Pagination
          defaultCurrent={1}
          total={props?.total}
          pageSize={props?.pageSize}
          onChange={props?.onChange}
          current={props?.current}
        />
      </div>
      <HRTable {...props} pagination={false} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <Pagination
          defaultCurrent={1}
          total={props?.total}
          pageSize={props?.pageSize}
          onChange={props?.onChange}
          current={props?.current}
        />
      </div>
    </>
  );
};

export default HRTablePaginated;
