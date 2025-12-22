'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

interface OverviewChartProps {
  data: {
    name: string
    total: number
  }[]
}

export function OverviewChart({ data }: OverviewChartProps) {
  return (
    // 👇 التعديل هنا: ضيفنا min-w-0 عشان يمنع الانهيار جوه الـ Grid
    <div className='md:h-[500px] h-[350px] w-full min-w-0'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#E5E7EB' />
          <XAxis
            dataKey='name'
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <YAxis
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            cursor={{ fill: 'transparent' }}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              backgroundColor: 'white',
              color: 'black',
            }}
            formatter={(value: number) => [`${value.toLocaleString()} ج.م`, 'الإيراد']}
          />
          <Bar
            dataKey='total'
            fill='currentColor'
            radius={[6, 6, 0, 0]}
            className='fill-primary'
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
