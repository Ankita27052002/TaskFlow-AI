import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckCircle, Circle, AlertCircle, Zap, BarChart3, Trophy, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TaskCard from '@/components/TaskCard'
import TaskDialog from '@/components/TaskDialog'
import { updateTaskStatus, selectSprintTasks, deleteTask } from '@/store/slices/taskSlice'
import { selectActiveSprint, completeSprint } from '@/store/slices/sprintSlice'
import { useToast } from '@/components/ui/toaster'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const statusConfig = {
  todo: { label: 'To Do', icon: Circle, color: 'text-gray-500' },
  'in-progress': { label: 'In Progress', icon: AlertCircle, color: 'text-blue-500' },
  review: { label: 'In Review', icon: AlertCircle, color: 'text-yellow-500' },
  done: { label: 'Done', icon: CheckCircle, color: 'text-green-500' },
}

function DroppableColumn({ id, title, tasks, icon: Icon, count, onEdit, onDelete }) {
  const { setNodeRef } = useSortable({ id })

  return (
    <div ref={setNodeRef} className="flex-1 min-w-[280px]">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="flex items-center gap-2">
              <Icon className={`h-5 w-5 ${statusConfig[id]?.color || 'text-gray-500'}`} />
              {title}
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              {count}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3 min-h-[400px]">
              {tasks.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                  No tasks
                </div>
              ) : (
                tasks.map(task => <TaskCard key={task.id} task={task} showStoryPoints onEdit={onEdit} onDelete={onDelete} />)
              )}
            </div>
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ScrumBoard() {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const activeSprint = useSelector(selectActiveSprint)
  
  // Get ALL tasks and filter strictly for this sprint's ID
  const allTasks = useSelector(state => state.tasks.tasks)
  const sprintTasks = activeSprint 
    ? allTasks.filter(task => task.sprintId === activeSprint.id)
    : []

  const [activeTask, setActiveTask] = useState(null)
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [retrospective, setRetrospective] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const tasksByStatus = {
    todo: sprintTasks.filter(t => t.status === 'todo'),
    'in-progress': sprintTasks.filter(t => t.status === 'in-progress'),
    review: sprintTasks.filter(t => t.status === 'review'),
    done: sprintTasks.filter(t => t.status === 'done'),
  }

  const getTotalStoryPoints = (tasks) => {
    return tasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0)
  }

  const completedPoints = getTotalStoryPoints(tasksByStatus.done)
  const totalPoints = getTotalStoryPoints(sprintTasks)
  const progress = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0

  const handleDragStart = (event) => {
    const task = sprintTasks.find(t => t.id === event.active.id)
    setActiveTask(task)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id
    const newStatus = over.id

    if (['todo', 'in-progress', 'review', 'done'].includes(newStatus)) {
      dispatch(updateTaskStatus({ id: taskId, status: newStatus }))
      toast({
        title: 'Task Updated',
        description: `Task moved to ${statusConfig[newStatus].label}`,
      })
    }
  }

  const handleCompleteSprint = () => {
    if (!activeSprint) return

    dispatch(completeSprint({
      id: activeSprint.id,
      completedStoryPoints: completedPoints,
      velocity: completedPoints,
      retrospective,
    }))

    toast({
      title: 'Sprint Completed! 🎉',
      description: `Completed ${completedPoints} story points`,
    })

    setIsCompleteDialogOpen(false)
    setRetrospective('')
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsTaskDialogOpen(true)
  }

  const handleDeleteTask = (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(taskId))
      toast({
        title: 'Task Deleted',
        description: 'Task has been removed from the sprint.',
      })
    }
  }

  const handleAddTask = () => {
    setEditingTask(null)
    setIsTaskDialogOpen(true)
  }

  if (!activeSprint) {
    return (
      <div className="p-4 sm:p-6">
        <Card>
          <CardContent className="py-12 sm:py-16 text-center px-4">
            <Zap className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold mb-2">No Active Sprint</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">
              Start a sprint from Sprint Planning to begin working
            </p>
            <Button asChild className="w-full sm:w-auto">
              <a href="/sprint-planning">Go to Sprint Planning</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const daysLeft = Math.ceil(
    (new Date(activeSprint.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Sprint Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              {activeSprint.name}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">{activeSprint.goal}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleAddTask} variant="outline" size="lg" className="w-full sm:w-auto">
              <Plus className="h-5 w-5 mr-2" />
              Add Task
            </Button>
            <Button onClick={() => setIsCompleteDialogOpen(true)} size="lg" className="w-full sm:w-auto">
              <Trophy className="h-5 w-5 mr-2" />
              Complete Sprint
            </Button>
          </div>
        </div>

        {/* Sprint Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{progress}%</div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Story Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {completedPoints} / {totalPoints}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalPoints - completedPoints} remaining
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tasksByStatus.done.length} / {sprintTasks.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Days Left
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{daysLeft}</div>
              <p className="text-xs text-muted-foreground mt-1">
                until {new Date(activeSprint.endDate).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          <DroppableColumn
            id="todo"
            title="To Do"
            tasks={tasksByStatus.todo}
            icon={Circle}
            count={tasksByStatus.todo.length}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
          <DroppableColumn
            id="in-progress"
            title="In Progress"
            tasks={tasksByStatus['in-progress']}
            icon={AlertCircle}
            count={tasksByStatus['in-progress'].length}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
          <DroppableColumn
            id="review"
            title="In Review"
            tasks={tasksByStatus.review}
            icon={AlertCircle}
            count={tasksByStatus.review.length}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
          <DroppableColumn
            id="done"
            title="Done"
            tasks={tasksByStatus.done}
            icon={CheckCircle}
            count={tasksByStatus.done.length}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} showStoryPoints /> : null}
        </DragOverlay>
      </DndContext>

      {/* Complete Sprint Dialog */}
      <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Sprint</DialogTitle>
            <DialogDescription>
              Review your sprint and add retrospective notes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Story Points Completed</p>
                <p className="text-2xl font-bold">{completedPoints} / {totalPoints}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tasks Completed</p>
                <p className="text-2xl font-bold">
                  {tasksByStatus.done.length} / {sprintTasks.length}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="retrospective">Retrospective (Optional)</Label>
              <Textarea
                id="retrospective"
                placeholder="What went well? What could be improved?"
                value={retrospective}
                onChange={(e) => setRetrospective(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCompleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteSprint}>
              <Trophy className="h-4 w-4 mr-2" />
              Complete Sprint
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Dialog */}
      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={(open) => {
          setIsTaskDialogOpen(open)
          if (!open) setEditingTask(null)
        }}
        task={editingTask}
        sprintId={activeSprint?.id}
        boardType="scrum"
      />
    </div>
  )
}
