import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Juan',
    'No. Reportes': 46,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Pedro',
    'No. Reportes': 38,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Alberto',
    'No. Reportes': 74,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Edgar',
    'No. Reportes': 60,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Carlos',
    'No. Reportes': 74,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Ana',
    'No. Reportes': 40,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Guadalupe',
    'No. Reportes': 57,
    pv: 4300,
    amt: 2100,
  },
  {
    name: 'Alonso',
    'No. Reportes': 74,
    pv: 4300,
    amt: 2100,
  },
];

export default class BarCharPerTec extends PureComponent {

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%" aspect={3}>
        <BarChart
        //   width={500}
        //   height={400}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{fontSize: 10}}/>
          <YAxis tick={{fontSize: 10}} tickCount={5} interval={0} domain={[0, 100]}/>
          <Tooltip />
          <Legend />
          {/* <Bar dataKey="pv" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} /> */}
          <Bar dataKey="No. Reportes" fill="#2A9EB3" activeBar={<Rectangle fill="gold" stroke="purple"/>} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
