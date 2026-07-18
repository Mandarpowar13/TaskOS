import { useQuery } from '@tanstack/react-query'
import { format, subDays } from 'date-fns'
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BarChart3, CircleAlert, LoaderCircle } from 'lucide-react'
import { getAnalytics } from '../../services/analyticsService'

function buildWeeklyChartData(trend) {
  const completedByDate = new Map(trend.map(({ _id, completed }) => [_id, completed]))

  return Array.from({ length: 7 }, (_, index) => {
    const date = subDays(new Date(), 6 - index)
    const dateKey = format(date, 'yyyy-MM-dd')

    return {
      date: format(date, 'EEE'),
      completed: completedByDate.get(dateKey) ?? 0,
    }
  })
}

export default function AnalyticsPage() {
  const { data, isLoading, isError, error } = useQuery({ queryKey: ['analytics'], queryFn: getAnalytics })

  if (isLoading)
    return <div className="grid min-h-96 place-items-center text-slate-400"><LoaderCircle className="animate-spin" /></div>

  if (isError)
    return <div className="card grid min-h-96 place-items-center text-center"><div><CircleAlert className="mx-auto mb-3 text-rose-500" /><p className="font-semibold dark:text-white">Analytics are unavailable</p><p className="mt-1 text-xs text-slate-500">{error?.message}</p></div></div>

  const metrics = data?.metrics || { total: 0, completed: 0, pending: 0, overdue: 0, completionRate: 0 }
  const priority = (data?.byPriority || []).map((item) => ({ name: item._id, value: item.count }))
  const weeklyData = buildWeeklyChartData(data?.weeklyTrend || [])
  const monthlyData = data?.monthlyTrend || []

  return (
    <div className="mx-auto max-w-[1180px]">
      <section className="mb-7">
        <p className="mb-2 text-sm font-medium text-blue-600 dark:text-blue-400">Work intelligence</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Analytics</h1>
        <p className="mt-2 text-sm text-slate-500">Understand the momentum behind your work.</p>
      </section>

      <section className="mb-6 grid gap-4 sm:grid-cols-4">
        {[['Completion rate', `${metrics.completionRate}%`], ['Completed', metrics.completed], ['Pending', metrics.pending], ['Overdue', metrics.overdue]].map(
          ([label, value]) => (
            <div key={label} className="card p-5">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
            </div>
          )
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <div className="mb-5 flex items-center gap-2">
            <BarChart3 size={19} className="text-blue-600" />
            <div>
              <h2 className="font-semibold dark:text-white">Weekly productivity</h2>
              <p className="text-xs text-slate-500">Tasks completed this week</p>
            </div>
          </div>
          <div className="h-64">
            {data?.weeklyTrend?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="weekly-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity=".3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="completed" stroke="#10b981" fill="url(#weekly-area)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                <p className="text-sm">No tasks completed this week</p>
              </div>
            )}
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-5 flex items-center gap-2">
            <BarChart3 size={19} className="text-blue-600" />
            <div>
              <h2 className="font-semibold dark:text-white">Monthly activity</h2>
              <p className="text-xs text-slate-500">Tasks completed this month</p>
            </div>
          </div>
          <div className="h-64">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="analytics-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity=".3" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="_id" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="completed" stroke="#2563eb" fill="url(#analytics-area)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                <p className="text-sm">No tasks completed this month</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6">
        <div className="card p-5">
          <h2 className="font-semibold dark:text-white">Work by priority</h2>
          <p className="mt-1 text-xs text-slate-500">Your current workload distribution</p>
          <div className="mt-5 h-64">
            {priority.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priority}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                <p className="text-sm">No tasks by priority</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
