import { clsx, ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { TaskPriority, TaskStatus } from "@/types"

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function getPriorityColor(priority: TaskPriority): string {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-100'
    case 'medium':
      return 'text-yellow-600 bg-yellow-100'
    case 'low':
      return 'text-green-600 bg-green-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function getStatusColor(status: TaskStatus): string {
  switch (status) {
    case 'backlog':
      return 'bg-gray-100'
    case 'todo':
      return 'bg-slate-100'
    case 'in-progress':
      return 'bg-blue-100'
    case 'review':
      return 'bg-purple-100'
    case 'done':
      return 'bg-green-100'
    default:
      return 'bg-gray-100'
  }
}
