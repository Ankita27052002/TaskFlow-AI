import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js'
import { Bar, Pie, Line } from 'react-chartjs-2'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function Analytics() {
  const tasks = useSelector((state) => state.tasks.tasks)

  // Priority Distribution
  const priorityData = {
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length,
  }

  const priorityChartData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Tasks by Priority',
        data: [priorityData.high, priorityData.medium, priorityData.low],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(251, 191, 36)',
          'rgb(34, 197, 94)',
        ],
        borderWidth: 2,
      },
    ],
  }

  // Status Distribution
  const statusData = {
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  }

  const statusChartData = {
    labels: ['To Do', 'In Progress', 'Done'],
    datasets: [
      {
        label: 'Tasks by Status',
        data: [statusData.todo, statusData.inProgress, statusData.done],
        backgroundColor: [
          'rgba(148, 163, 184, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
      },
    ],
  }

  // Completion Trend (Last 7 days)
  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      days.push(date.toISOString().split('T')[0])
    }
    return days
  }

  const last7Days = getLast7Days()
  const completionData = last7Days.map(day => {
    return tasks.filter(t => {
      if (!t.completedAt) return false
      return t.completedAt.split('T')[0] === day
    }).length
  })

  const trendChartData = {
    labels: last7Days.map(date => {
      const d = new Date(date)
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }),
    datasets: [
      {
        label: 'Tasks Completed',
        data: completionData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  // Estimated Time by Priority
  const timeByPriority = {
    high: tasks.filter(t => t.priority === 'high' && t.estimatedTime)
      .reduce((sum, t) => sum + parseFloat(t.estimatedTime || 0), 0),
    medium: tasks.filter(t => t.priority === 'medium' && t.estimatedTime)
      .reduce((sum, t) => sum + parseFloat(t.estimatedTime || 0), 0),
    low: tasks.filter(t => t.priority === 'low' && t.estimatedTime)
      .reduce((sum, t) => sum + parseFloat(t.estimatedTime || 0), 0),
  }

  const timeChartData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Estimated Hours',
        data: [timeByPriority.high, timeByPriority.medium, timeByPriority.low],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  }

  const completionRate = tasks.length > 0 
    ? ((statusData.done / tasks.length) * 100).toFixed(1)
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">
          Insights and metrics for your productivity
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completionRate}%</div>
              <p className="text-xs text-muted-foreground mt-2">
                {statusData.done} of {tasks.length} tasks completed
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Estimated Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {(timeByPriority.high + timeByPriority.medium + timeByPriority.low).toFixed(1)}h
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Across all pending tasks
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">High Priority Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{priorityData.high}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Requiring immediate attention
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <Tabs defaultValue="priority" className="space-y-4">
        <TabsList>
          <TabsTrigger value="priority">Priority</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="trend">Trend</TabsTrigger>
          <TabsTrigger value="time">Time Allocation</TabsTrigger>
        </TabsList>

        <TabsContent value="priority" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Priority Distribution</CardTitle>
                <CardDescription>
                  How your tasks are distributed across priority levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Pie data={priorityChartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Status Overview</CardTitle>
                <CardDescription>
                  Current state of all your tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Bar data={statusChartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="trend" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Completion Trend</CardTitle>
                <CardDescription>
                  Tasks completed over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Line data={trendChartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="time" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Time Allocation by Priority</CardTitle>
                <CardDescription>
                  Estimated hours for tasks grouped by priority
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Bar data={timeChartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
