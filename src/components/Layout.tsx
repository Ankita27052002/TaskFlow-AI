import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, KanbanSquare, BarChart3, CheckSquare, LogOut, Calendar, Zap, Menu, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from './ui/button'
import ThemeToggle from './ThemeToggle'
import { useToast } from './ui/toaster'
import { useState } from 'react'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/kanban', label: 'Kanban', icon: KanbanSquare },
    { path: '/sprint-planning', label: 'Sprint Planning', icon: Calendar },
    { path: '/scrum-board', label: 'Scrum Board', icon: Zap },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ]

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      })
      navigate('/login')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 dark:from-slate-950 dark:to-emerald-950 transition-colors">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <CheckSquare className="h-6 w-6 sm:h-8 sm:w-8 text-primary" strokeWidth={2.5} />
                <motion.div
                  className="absolute -top-1 -right-1 h-2 w-2 sm:h-3 sm:w-3 bg-primary rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary via-emerald-500 to-green-600 bg-clip-text text-transparent">
                TaskFlow AI
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className="gap-2"
                      size="sm"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden xl:inline">{item.label}</span>
                    </Button>
                  </Link>
                )
              })}
              
              <div className="h-6 w-px bg-border mx-2" />
              
              {user && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-2">
                    <img 
                      src={user.photoURL || undefined} 
                      alt={user.displayName || undefined} 
                      className="h-8 w-8 rounded-full ring-2 ring-primary/20" 
                    />
                    <div className="hidden xl:block text-sm">
                      <p className="font-medium">{user.displayName}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              <ThemeToggle />
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden pt-4 pb-2 space-y-2"
            >
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className="w-full justify-start gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
              
              {user && (
                <>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex items-center gap-3 px-3 py-2">
                      <img 
                        src={user.photoURL || undefined} 
                        alt={user.displayName || undefined} 
                        className="h-10 w-10 rounded-full ring-2 ring-primary/20" 
                      />
                      <div className="flex-1 text-sm">
                        <p className="font-medium">{user.displayName}</p>
                        <p className="text-muted-foreground text-xs">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}
