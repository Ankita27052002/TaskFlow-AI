import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { Plus, Calendar, Target, Zap, ArrowRight } from 'lucide-react'
import { DndContext, closestCorners } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import TaskCard from '@/components/TaskCard'
import { selectBacklogTasks } from '@/store/slices/taskSlice'
import { selectAllSprints, selectActiveSprint, createSprint, addTaskToSprint, startSprint } from '@/store/slices/sprintSlice'
import { assignToSprint } from '@/store/slices/taskSlice'
import { useToast } from '@/components/ui/toaster'

export default function SprintPlanning() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const backlogTasks = useAppSelector(selectBacklogTasks)
  const allSprints = useAppSelector(selectAllSprints)
  const activeSprint = useAppSelector(selectActiveSprint)
  const plannedSprints = allSprints.filter(s => s.status === 'planned')
  const allTasks = useAppSelector(state => state.tasks.tasks)

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newSprint, setNewSprint] = useState({
    name: '',
    goal: '',
    startDate: '',
    endDate: '',
    capacity: 0,
  })

  const handleCreateSprint = () => {
    if (!newSprint.name || !newSprint.startDate || !newSprint.endDate) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      })
      return
    }

    dispatch(createSprint(newSprint))
    toast({
      title: 'Sprint Created',
      description: `${newSprint.name} has been created successfully.`,
    })
    
    setNewSprint({
      name: '',
      goal: '',
      startDate: '',
      endDate: '',
      capacity: 0,
    })
    setIsCreateDialogOpen(false)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over) return

    const taskId = active.id
    const sprintId = over.id

    if (sprintId.startsWith('sprint-')) {
      const actualSprintId = sprintId.replace('sprint-', '')
      dispatch(assignToSprint({ taskId, sprintId: actualSprintId }))
      dispatch(addTaskToSprint({ sprintId: actualSprintId, taskId }))
      
      toast({
        title: 'Task Added',
        description: 'Task added to sprint successfully.',
      })
    }
  }

  const handleStartSprint = (sprintId: string) => {
    dispatch(startSprint(sprintId))
    toast({
      title: 'Sprint Started',
      description: 'Sprint is now active!',
    })
  }

  const getTotalStoryPoints = (tasks: any[]) => {
    return tasks.reduce((sum: number, task: any) => sum + (task.storyPoints || 0), 0)
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Sprint Planning</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Plan and organize your sprints
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="h-5 w-5 mr-2" />
              Create Sprint
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Sprint</DialogTitle>
              <DialogDescription>
                Set up a new sprint with goals and timeline
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="sprint-name">Sprint Name *</Label>
                <Input
                  id="sprint-name"
                  placeholder="e.g., Sprint 1"
                  value={newSprint.name}
                  onChange={(e) => setNewSprint({ ...newSprint, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sprint-goal">Sprint Goal</Label>
                <Textarea
                  id="sprint-goal"
                  placeholder="What do you want to achieve in this sprint?"
                  value={newSprint.goal}
                  onChange={(e) => setNewSprint({ ...newSprint, goal: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date *</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newSprint.startDate}
                    onChange={(e) => setNewSprint({ ...newSprint, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date *</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={newSprint.endDate}
                    onChange={(e) => setNewSprint({ ...newSprint, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Team Capacity (Story Points)</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="40"
                  value={newSprint.capacity}
                  onChange={(e) => setNewSprint({ ...newSprint, capacity: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSprint}>Create Sprint</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Sprint Alert */}
      {activeSprint && (
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>Active Sprint: {activeSprint.name}</CardTitle>
              </div>
              <Button size="sm" variant="outline" asChild>
                <a href="/scrum-board">Go to Board <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
            </div>
            <CardDescription>{activeSprint.goal}</CardDescription>
          </CardHeader>
        </Card>
      )}

      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Backlog */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Product Backlog
              </CardTitle>
              <CardDescription>
                {backlogTasks.length} tasks • {getTotalStoryPoints(backlogTasks)} story points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                <SortableContext items={backlogTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  {backlogTasks.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No tasks in backlog
                    </p>
                  ) : (
                    backlogTasks.map(task => (
                      <div key={task.id} className="cursor-grab active:cursor-grabbing">
                        <TaskCard task={task} showStoryPoints />
                      </div>
                    ))
                  )}
                </SortableContext>
              </div>
            </CardContent>
          </Card>

          {/* Planned Sprints */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Planned Sprints ({plannedSprints.length})
            </h2>
            
            {plannedSprints.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No planned sprints. Create one to get started!
                  </p>
                </CardContent>
              </Card>
            ) : (
              plannedSprints.map(sprint => {
                const sprintTasks = allTasks.filter(t => t.sprintId === sprint.id)
                const totalPoints = getTotalStoryPoints(sprintTasks)
                const isOverCapacity = sprint.capacity > 0 && totalPoints > sprint.capacity

                return (
                  <SortableContext
                    key={sprint.id}
                    id={`sprint-${sprint.id}`}
                    items={sprintTasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <Card className={isOverCapacity ? 'border-destructive' : ''}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{sprint.name}</CardTitle>
                          <Button size="sm" onClick={() => handleStartSprint(sprint.id)}>
                            <Zap className="h-4 w-4 mr-1" />
                            Start Sprint
                          </Button>
                        </div>
                        <CardDescription>{sprint.goal}</CardDescription>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>📅 {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className={isOverCapacity ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                            {totalPoints} / {sprint.capacity || '∞'} story points
                          </span>
                          {isOverCapacity && <span className="text-destructive text-xs">⚠️ Over capacity</span>}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div 
                          id={`sprint-${sprint.id}`}
                          className="space-y-2 min-h-[100px] p-2 border-2 border-dashed rounded-lg"
                        >
                          {sprintTasks.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4 text-sm">
                              Drag tasks here from backlog
                            </p>
                          ) : (
                            sprintTasks.map(task => (
                              <TaskCard key={task.id} task={task} showStoryPoints />
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </SortableContext>
                )
              })
            )}
          </div>
        </div>
      </DndContext>
    </div>
  )
}
