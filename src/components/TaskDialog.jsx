import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { X, Calendar, Clock, Zap, Sparkles } from 'lucide-react'
import { addTask, updateTask, updateStoryPoints } from '@/store/slices/taskSlice'
import { generateId } from '@/lib/utils'
import { estimateStoryPoints } from '@/services/aiService'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { useToast } from './ui/toaster'

export default function TaskDialog({ open, onOpenChange, task = null, sprintId = null, boardType = 'kanban' }) {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const isEditing = !!task

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    estimatedTime: '',
    storyPoints: 0,
  })

  const [isEstimating, setIsEstimating] = useState(false)

  const storyPointOptions = [0, 1, 2, 3, 5, 8, 13, 21]

  // Update form data when task prop changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'todo',
        dueDate: task.dueDate || '',
        estimatedTime: task.estimatedTime || '',
        storyPoints: task.storyPoints || 0,
      })
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: '',
        estimatedTime: '',
        storyPoints: 0,
      })
    }
  }, [task, open])

  const handleAIEstimate = async () => {
    if (!formData.title || !formData.description) {
      toast({
        title: 'Missing Information',
        description: 'Please add a title and description for AI estimation.',
        variant: 'destructive',
      })
      return
    }

    setIsEstimating(true)
    try {
      const points = await estimateStoryPoints(formData.title, formData.description)
      setFormData({ ...formData, storyPoints: points })
      toast({
        title: 'AI Estimation Complete',
        description: `Suggested ${points} story points`,
      })
    } catch (error) {
      console.error('AI estimation error:', error)
      toast({
        title: 'Estimation Failed',
        description: 'Could not estimate story points. Please select manually.',
        variant: 'destructive',
      })
    } finally {
      setIsEstimating(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title.trim()) return

    const taskData = {
      ...formData,
      id: task?.id || generateId(),
      createdAt: task?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sprintId: sprintId || task?.sprintId || null,
      boardType: boardType,
    }

    if (isEditing) {
      dispatch(updateTask(taskData))
      toast({
        title: 'Task Updated',
        description: 'Your task has been updated successfully.',
      })
    } else {
      dispatch(addTask(taskData))
      toast({
        title: 'Task Created',
        description: 'Your task has been created successfully.',
      })
    }

    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      dueDate: '',
      estimatedTime: '',
      storyPoints: 0,
    })
  }

  const handleClose = () => {
    onOpenChange(false)
    if (!isEditing) resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update your task details below.' : 'Add a new task to your workflow.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="Enter task title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add task description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Story Points Estimation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Story Points
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAIEstimate}
                disabled={isEstimating}
              >
                <Sparkles className="h-4 w-4 mr-1" />
                {isEstimating ? 'Estimating...' : 'AI Estimate'}
              </Button>
            </div>
            <div className="grid grid-cols-8 gap-2">
              {storyPointOptions.map(points => (
                <button
                  key={points}
                  type="button"
                  onClick={() => setFormData({ ...formData, storyPoints: points })}
                  className={`h-10 rounded-md border-2 transition-all ${
                    formData.storyPoints === points
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input hover:border-primary/50'
                  }`}
                >
                  {points}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Fibonacci scale: 1=very small, 21=very large
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedTime" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Est. Time (hrs)
              </Label>
              <Input
                id="estimatedTime"
                type="number"
                placeholder="0"
                value={formData.estimatedTime}
                onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                min="0"
                step="0.5"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
