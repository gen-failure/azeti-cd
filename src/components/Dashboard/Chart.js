import React from 'react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';

const parseDate = (date) => {
  return moment(date).format('YYYY-MM-DD hh:mm')
}

const Chart = ({title, data}) =>{
  let options = {
    title: [
      {left: 'center', text: title} 
    ],
    xAxis: { type: 'category', boundaryGap: false, data: data.series[0].values.map((value) => { return parseDate(value[0])})},
    yAxis: { type: 'value'},
    tooltip: {
      trigger: 'axis'
    },
    series: data.series.map((serie) => {
      return {
        data: serie.values.map((value) => {return value[1]}),
        type: 'line'
      }
    }),
    calculable : true,
    dataZoom : {
      show : true,
      realtime : true,
      start : 0,
      end : 100
    }
  }
  return <ReactEcharts option={options} style={{width:'100%', height: '500px'}} />
};

export default Chart;
