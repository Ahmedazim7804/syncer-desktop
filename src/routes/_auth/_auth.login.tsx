import { createFileRoute, useRouter } from '@tanstack/react-router'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { LoginFormData, loginSchema } from '@/lib/zod/auth-schema'
import { useAuth } from '@/lib/providers/auth-context'

export const Route = createFileRoute('/_auth/_auth/login')({
  component: RouteComponent,
})

export default function RouteComponent() {
  const [showPassword, setShowPassword] = React.useState(false)
  const router = useRouter();
  const { login, loading: isPending, isLoggedIn } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      device: '',
      serverUrl: '',
      password: '',
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
    if (isLoggedIn) {
      router.navigate({ to: "/me" });
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 z-0">
      <Card className="w-full bg-background/95 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to Syncer
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {/* Device Name Field */}
              <FormField
                control={form.control}
                name="device"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device Name</FormLabel>
                    <FormControl>
                      <Input
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder="Enter your device name"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Server URL Field */}
              <FormField
                control={form.control}
                name="serverUrl"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Server URL</FormLabel>
                    <FormControl>
                      <Input
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder="Enter your server url"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          disabled={isPending}
                          name={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isPending}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 mt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isPending || form.formState.isSubmitting}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                <p>
                  Don't have an account?{' '}
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto font-normal"
                    disabled={isPending}
                  >
                    Sign up
                  </Button>
                </p>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}