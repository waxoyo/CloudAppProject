import React, { PureComponent } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';



export default class AccopmChart extends PureComponent {

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%" aspect={3}>
        {/* <div className='fit-chart'> */}
        <ComposedChart
            // width={800}
            // height={400}
          data={this.props.chartData}
           margin={{
             top: 0,
             right: 30,
             bottom: 0,
             left: 0,
           }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" textAnchor="middle" tick={{fontSize: 10}}/>
          <YAxis tick={{fontSize: 10}} label={{ value: '%', angle: 0,}} tickCount={5} interval={0} domain={[0, 100]}/>
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="Cumplimiento" fill="#C7D7DB" stroke="#82ca9d" />
          <Line type="monotone" dataKey="Objetivo" stroke="#8884d8" />
        </ComposedChart>
        {/* </div> */}
        </ResponsiveContainer>
    );//"#C7D7DB"
  }
}
