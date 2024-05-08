import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export default class BarChar extends PureComponent {

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%" aspect={3}>
        <BarChart
        //   width={500}
        //   height={400}
          data={this.props.chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{fontSize: 10}}/>
          <YAxis tick={{fontSize: 10}} label={{ value: '#', angle: 0,}} tickCount={5} interval={1} allowDecimals={false} domain={["dataMin", "dataMax"]}/>
          <Tooltip />
          <Legend />
          {/* <Bar dataKey="pv" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} /> */}
          <Bar dataKey="Realizados" fill="#59affa" activeBar={<Rectangle fill="gold" stroke="purple"/>} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
