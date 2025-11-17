import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckSquare, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toaster'

export default function VerifyEmail() {
  const { verifyEmailLink } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [status, setStatus] = useState('verifying') // verifying, success, error
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const emailLink = window.location.href
        const email = window.localStorage.getItem('emailForSignIn')
        
        if (!email) {
          setStatus('error')
          setErrorMessage('Email not found. Please request a new sign-in link.')
          return
        }

        await verifyEmailLink(email, emailLink)
        setStatus('success')
        
        toast({
          title: 'Success!',
          description: 'You have been successfully signed in.',
        })
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/')
        }, 2000)
      } catch (error) {
        console.error('Verification error:', error)
        setStatus('error')
        
        let message = 'Failed to verify email. Please try again.'
        if (error.code === 'auth/invalid-action-code') {
          message = 'This link is invalid or has expired. Please request a new one.'
        } else if (error.code === 'auth/expired-action-code') {
          message = 'This link has expired. Please request a new sign-in link.'
        }
        
        setErrorMessage(message)
        toast({
          title: 'Verification Failed',
          description: message,
          variant: 'destructive',
        })
      }
    }

    verifyEmail()
  }, [verifyEmailLink, navigate, toast])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 dark:from-slate-950 dark:to-emerald-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[480px]"
      >
        <Card className="w-full shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <CheckSquare className="h-16 w-16 text-primary" strokeWidth={2.5} />
                <motion.div
                  className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full"
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
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-emerald-500 to-green-600 bg-clip-text text-transparent">
                TaskFlow AI
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                {status === 'verifying' && 'Verifying your email...'}
                {status === 'success' && 'Email verified successfully!'}
                {status === 'error' && 'Verification failed'}
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 py-8">
            <div className="flex justify-center">
              {status === 'verifying' && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="h-16 w-16 text-primary" />
                </motion.div>
              )}
              
              {status === 'success' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="rounded-full bg-primary/10 p-4"
                >
                  <CheckCircle2 className="h-16 w-16 text-primary" />
                </motion.div>
              )}
              
              {status === 'error' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="rounded-full bg-destructive/10 p-4"
                >
                  <XCircle className="h-16 w-16 text-destructive" />
                </motion.div>
              )}
            </div>

            <div className="text-center space-y-2">
              {status === 'verifying' && (
                <p className="text-muted-foreground">
                  Please wait while we verify your email address...
                </p>
              )}
              
              {status === 'success' && (
                <>
                  <p className="text-lg font-medium">Welcome to TaskFlow AI!</p>
                  <p className="text-muted-foreground">
                    Redirecting you to the dashboard...
                  </p>
                </>
              )}
              
              {status === 'error' && (
                <>
                  <p className="text-destructive font-medium">{errorMessage}</p>
                  <Button
                    onClick={() => navigate('/login')}
                    className="mt-4"
                  >
                    Back to Login
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
