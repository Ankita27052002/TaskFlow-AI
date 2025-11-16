import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { motion } from 'framer-motion'
import { Plus, Sparkles } from 'lucide-react'
import { updateTaskStatus, bulkUpdateTasks } from '@/store/slices/taskSlice'
import { setAiAnalyzing } from '@/store/slices/uiSlice'
import { aiService } from '@/services/aiService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toaster'
import TaskDialog from '@/components/TaskDialog'
import TaskCard from '@/components/TaskCard'
import { deleteTask } from '@/store/slices/taskSlice'

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'border-l-slate-500' },
  { id: 'in-progress', title: 'In Progress', color: 'border-l-blue-500' },
  { id: 'done', title: 'Done', color: 'border-l-green-500' },
]

export default function KanbanBoard() {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const tasks = useSelector((state) => state.tasks.tasks)
  const aiAnalyzing = useSelector((state) => state.ui.aiAnalyzing)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status)
  }

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      return
    }

    const taskId = active.id
    const newStatus = over.id

    if (COLUMNS.find(col => col.id === newStatus)) {
      dispatch(updateTaskStatus({ id: taskId, status: newStatus }))
      toast({
        title: 'Task moved',
        description: `Task moved to ${COLUMNS.find(col => col.id === newStatus).title}`,
      })
    }

    setActiveId(null)
  }

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

  const analyzeWithAI = async () => {
    const pendingTasks = tasks.filter(t => t.status !== 'done')

    if (pendingTasks.length === 0) {
      toast({
        title: 'No tasks to analyze',
        description: 'Add some tasks to use AI prioritization.',
        variant: 'destructive',
      })
      return
    }

    dispatch(setAiAnalyzing(true))
    try {
      const analysis = await aiService.analyzeBulkTasks(pendingTasks)
      
      const updates = analysis.map(item => {
        const task = pendingTasks[item.index]
        return {
          id: task.id,
          priority: item.priority,
          estimatedTime: item.estimatedTime,
        }
      })

      dispatch(bulkUpdateTasks(updates))

      toast({
        title: 'AI Analysis Complete',
        description: `${updates.length} tasks analyzed and prioritized!`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to analyze tasks. Check your API key.',
        variant: 'destructive',
      })
    } finally {
      dispatch(setAiAnalyzing(false))
    }
  }

  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kanban Board</h2>
          <p className="text-muted-foreground">
            Drag and drop tasks to manage your workflow
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={analyzeWithAI} variant="outline" disabled={aiAnalyzing}>
            <Sparkles className="mr-2 h-4 w-4" />
            {aiAnalyzing ? 'Analyzing...' : 'AI Prioritize'}
          </Button>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* Kanban Columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((column) => {
            const columnTasks = getTasksByStatus(column.id)

            return (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`border-l-4 ${column.color} min-h-[600px]`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{column.title}</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {columnTasks.length}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SortableContext
                      id={column.id}
                      items={columnTasks.map(t => t.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {columnTasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                          />
                        ))}

                        {columnTasks.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            No tasks yet
                          </div>
                        )}
                      </div>
                    </SortableContext>

                    {/* Drop Zone */}
                    <SortableContext id={column.id} items={[column.id]} strategy={verticalListSortingStrategy}>
                      <div
                        className="h-20 mt-3 border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center text-sm text-muted-foreground"
                        style={{ pointerEvents: 'all' }}
                      >
                        Drop tasks here
                      </div>
                    </SortableContext>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="opacity-80 rotate-3 cursor-grabbing">
              <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={selectedTask}
      />
    </div>
  )
}
