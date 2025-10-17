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
import useLogin from '@/lib/hooks/useLogin'

import useGetAuthInfo from '@/lib/actions/getAuthData'

export const Route = createFileRoute('/_auth/_auth/login')({
  component: RouteComponent,
})

export default function RouteComponent() {
  const [showPassword, setShowPassword] = React.useState(false)
  const router = useRouter();
  const { setAuthData } = useGetAuthInfo();
  
  const { loginAsync, isPending: loggingIn, error } = useLogin(async (responseData) => {
    console.log('Login successful:', responseData);
    await setAuthData(
      {
        access_token: responseData?.access_token,
        refresh_token: responseData?.refresh_token,
      },
      form.getValues('serverUrl')
    );
  });

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      device: '',
      serverUrl: '',
      password: '',
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const loginResponse = await loginAsync({
        body: {
          device: data.device,
          platform: "linux",
          id: "12",
          ip: "127.0.0.1",
          password: data.password,
        },
        baseURL: data.serverUrl, // Pass server URL to the API call
      });
      
      if (loginResponse && !error) {
        // Login successful, navigate to dashboard
        router.navigate({ to: "/dashboard" });
      }
    } catch (err) {
      console.error('Login failed:', err);
      // Error handling is done by the mutation
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
                        disabled={loggingIn}
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
                        placeholder="https://your-server.com or http://localhost:8000"
                        disabled={loggingIn}
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
                          disabled={loggingIn}
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
                          disabled={loggingIn}
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
                disabled={loggingIn || form.formState.isSubmitting}
              >
                {loggingIn ? (
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
                    disabled={loggingIn}
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