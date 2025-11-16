import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { Plus, Sparkles, TrendingUp, CheckCircle2, Clock } from 'lucide-react'
import { deleteTask } from '@/store/slices/taskSlice'
import { setAiAnalyzing } from '@/store/slices/uiSlice'
import { aiService } from '@/services/aiService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toaster'
import TaskDialog from '@/components/TaskDialog'
import TaskCard from '@/components/TaskCard'

export default function Dashboard() {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const tasks = useSelector((state) => state.tasks.tasks)
  const aiAnalyzing = useSelector((state) => state.ui.aiAnalyzing)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [summary, setSummary] = useState('')

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    todo: tasks.filter(t => t.status === 'todo').length,
  }

  const recentTasks = tasks.slice(0, 5)

  const handleEdit = (task) => {
    setSelectedTask(task)
    setDialogOpen(true)
  }

  const handleDelete = (taskId) => {
    dispatch(deleteTask(taskId))
    toast({
      title: 'Task deleted',
      description: 'Task has been removed successfully.',
    })
  }

  const handleAddNew = () => {
    setSelectedTask(null)
    setDialogOpen(true)
  }

  const generateSummary = async () => {
    if (tasks.length === 0) {
      toast({
        title: 'No tasks',
        description: 'Add some tasks to generate a summary.',
        variant: 'destructive',
      })
      return
    }

    dispatch(setAiAnalyzing(true))
    try {
      const result = await aiService.generateDailySummary(tasks)
      setSummary(result)
      toast({
        title: 'Summary generated',
        description: 'AI has analyzed your tasks!',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate summary. Check your API key.',
        variant: 'destructive',
      })
    } finally {
      dispatch(setAiAnalyzing(false))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your tasks with AI-powered insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateSummary} variant="outline" disabled={aiAnalyzing}>
            <Sparkles className="mr-2 h-4 w-4" />
            {aiAnalyzing ? 'Analyzing...' : 'AI Summary'}
          </Button>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">To Do</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todo}</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Summary */}
      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-emerald-500/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Daily Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{summary}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
          <CardDescription>Your latest tasks at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          {recentTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No tasks yet</p>
              <Button onClick={handleAddNew} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create your first task
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={selectedTask}
      />
    </div>
  )
}
