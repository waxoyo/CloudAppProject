import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Reportado',
    'No. Reportes': 46,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'En Proceso',
    'No. Reportes': 38,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Finalizado',
    'No. Reportes': 74,
    pv: 9800,
    amt: 2290,
  },

];

export default class BarCharHorizontal extends PureComponent {

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%" aspect={2}>
        <BarChart
        //   width={500}
        //   height={400}
          layout="vertical"
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >

          <YAxis
            yAxisId={0}
            dataKey={'name'}
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{fontSize: 15}}
          />

          <XAxis type="number" tick={{fontSize: 10}} />

          <Tooltip />
          <Legend />
          {/* <Bar dataKey="pv" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} /> */}
          <Bar dataKey='No. Reportes' fill="rgb(119, 111, 156)" activeBar={<Rectangle fill="gold" stroke="purple"/>} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
