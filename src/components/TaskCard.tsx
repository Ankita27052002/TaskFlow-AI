import { motion } from 'framer-motion'
import { Calendar, Clock, Trash2, Edit, Zap } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { getPriorityColor, formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import type { Task } from '@/types'

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  showStoryPoints?: boolean;
}

export default function TaskCard({ task, onEdit, onDelete, showStoryPoints = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const priorityBadge = (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
      {task.priority?.toUpperCase() || 'NONE'}
    </span>
  )

  return (
    <div ref={setNodeRef} style={style}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="cursor-move hover:shadow-md transition-shadow" {...attributes} {...listeners}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base font-semibold line-clamp-2">
                {task.title}
              </CardTitle>
              {priorityBadge}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              )}
              {task.estimatedTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{task.estimatedTime}h</span>
                </div>
              )}
              {showStoryPoints && task.storyPoints !== undefined && task.storyPoints > 0 && (
                <div className="flex items-center gap-1 text-primary font-medium">
                  <Zap className="h-3 w-3" />
                  <span>{task.storyPoints} pts</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                  onEdit?.(task)
                }}
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                  onDelete?.(task.id)
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
