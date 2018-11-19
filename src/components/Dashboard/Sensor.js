import React from 'react';

import { Col, Alert } from 'antd';
import Chart from './Chart';

export default ({data, title}) => {
  return (
    <Col>
      {data.series && <Chart data={data} title={title} />} 
      {(!data.series && !data.error) && <Alert type="warning" message={`No data available for ${title} description="There are no data available for this time range`} /> }
      {(!data.series && data.error) && <Alert type="error" message="There is nothing wrong with your computer" description={data.error} /> }
    </Col>
  )
}
