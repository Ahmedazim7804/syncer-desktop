import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/schemas";
import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useLogin } from "@/hooks/useAuthentication";

export const Route = createFileRoute("/login")({
    component: LoginPage,
});

function LoginPage() {
    const { mutate, mutateAsync, isPending } = useLogin();

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
    });

    function onSubmit(values: z.infer<typeof loginSchema>) {
        mutateAsync(values);
    }

    return (
        <div className="flex flex-col justify-center items-center w-full h-full bg-background overflow-y-scroll text-foreground overflow-x-scroll py-8">
            <div className="bg-background-secondary rounded-lg flex flex-col gap-4 max-h-[600px] h-fit w-full max-w-[450px] items-center justify-start px-4 pb-4">
                <Banner className="w-[450px] rounded-t-lg" />
                <p className="self-start font-semibold text-2xl">Login</p>

                <Form {...loginForm}>
                    <form
                        onSubmit={loginForm.handleSubmit(onSubmit)}
                        className="w-full flex flex-col gap-4"
                    >
                        <FormField
                            control={loginForm.control}
                            name="serverUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Server Url</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="border-foreground/50"
                                            placeholder="https://syncer-server.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        ></FormField>
                        <FormField
                            control={loginForm.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="border-foreground/50"
                                            placeholder="e.g, mobile"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        ></FormField>
                        <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            className="border-foreground/50"
                                            placeholder="* * * * * * * * * *"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        ></FormField>
                        <div className="spinner"></div>
                        <Button type="submit" className="w-full mt-2">
                            {isPending ? (
                                <div className="spinner w-6 h-6"></div>
                            ) : (
                                "Log In"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
