import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { Plus, Sparkles } from 'lucide-react'
import { updateTaskStatus, bulkUpdateTasks, selectKanbanTasks } from '@/store/slices/taskSlice'
import { setAiAnalyzing } from '@/store/slices/uiSlice'
import { aiService } from '@/services/aiService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toaster'
import TaskDialog from '@/components/TaskDialog'
import TaskCard from '@/components/TaskCard'
import { Task } from '@/types'
import { deleteTask } from '@/store/slices/taskSlice'

interface DraggableTaskProps {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
}

// Draggable Task Item
function DraggableTask({ task, onEdit, onDelete }: DraggableTaskProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: task.id 
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
    </div>
  )
}

interface DroppableColumnProps {
  column: { id: string; title: string; color: string }
  tasks: Task[]
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
}

// Droppable Column
function DroppableColumn({ column, tasks, onEdit, onDelete }: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`border-l-4 ${column.color} min-h-[600px]`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{column.title}</span>
            <span className="text-sm font-normal text-muted-foreground">
              {tasks.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={setNodeRef} className="space-y-3 min-h-[500px]">
            <SortableContext
              items={tasks.map(t => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {tasks.map((task) => (
                <DraggableTask
                  key={task.id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </SortableContext>

            {tasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Drop tasks here
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'border-l-slate-500' },
  { id: 'in-progress', title: 'In Progress', color: 'border-l-blue-500' },
  { id: 'done', title: 'Done', color: 'border-l-green-500' },
]

export default function KanbanBoard() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const tasks = useAppSelector(selectKanbanTasks)
  const aiAnalyzing = useAppSelector((state) => state.ui.aiAnalyzing)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task: Task) => task.status === status)
  }

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: any) => {
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
        description: `Task moved to ${COLUMNS.find(col => col.id === newStatus)?.title || newStatus}`,
      })
    }

    setActiveId(null)
  }

  const handleEdit = (task: Task) => {
    setSelectedTask(task)
    setDialogOpen(true)
  }

  const handleDelete = (taskId: string) => {
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
          estimatedTime: String(item.estimatedTime),
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Kanban Board</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Drag and drop tasks to manage your workflow
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={analyzeWithAI} variant="outline" disabled={aiAnalyzing} className="w-full sm:w-auto">
            <Sparkles className="mr-2 h-4 w-4" />
            {aiAnalyzing ? 'Analyzing...' : 'AI Prioritize'}
          </Button>
          <Button onClick={handleAddNew} className="w-full sm:w-auto">
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
              <DroppableColumn
                key={column.id}
                column={column}
                tasks={columnTasks}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
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
        boardType="kanban"
      />
    </div>
  )
}
