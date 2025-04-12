'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import Image from 'next/image'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { signInSchema, SignInSchemaType } from '@/lib/validations'
import Container from '@/components/custom/Container'

export default function SignInPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInSchemaType) => {
    setError(null)
  
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
  
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Login failed')
      }
  
      router.push('/admin')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#141e30] to-[#243b55] overflow-hidden">
      {/* Pattern Layer */}
      {/* Gradient & Light Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[160px] opacity-30 top-[-150px] left-[-100px]" />
        <div className="absolute w-[400px] h-[400px] bg-blue-400 rounded-full blur-[120px] opacity-20 bottom-[-120px] right-[-80px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
      </div>

      {/* Card & Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10"
      >
        <Container className="w-full max-w-sm md:max-w-lg lg:max-w-xl xl:max-w-2xl">
          <Card className="min-w-[340px] md:min-w-96 shadow-xl backdrop-blur-lg bg-white/90 border border-white/40 rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col items-center mb-6">
                <Image
                  src="/icons/icon-512x512.png"
                  alt="In-Parking Logo"
                  width={60}
                  height={60}
                  className="mb-2"
                />
                <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
                  In-Parking
                </h1>
              </div>

              <motion.form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div>
                  <Label htmlFor="email" className="text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="mt-1 border-gray-400"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    className="mt-1 border-gray-400"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {error && (
                  <motion.p
                    className="text-red-600 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {error}
                  </motion.p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-700 text-white transition duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </Button>
              </motion.form>
            </CardContent>
          </Card>
        </Container>
      </motion.div>
    </div>
  )
}
