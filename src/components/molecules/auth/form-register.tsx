import { Button } from '@/components/atoms/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/atoms/card'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { EyeIcon, EyeOff } from 'lucide-react'
import Link from 'next/link'

type FormRegisterProps = {
    handleRegister: (event: React.FormEvent<HTMLFormElement>) => void
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    setUsername: (username: string) => void
    setPassword: (password: string) => void
    showPassword: boolean
    handleTogglePassword: (e: React.MouseEvent<HTMLButtonElement>) => void
    isError: string
    isLoading: boolean
    isSuccess: boolean
}

const FormRegister = ({
    handleRegister,
    setUsername,
    setPassword,
    showPassword,
    handleTogglePassword,
    isError,
    isLoading,
    isSuccess
}: FormRegisterProps) => {
    return (
        <>
            <form onSubmit={handleRegister}>
                <Card className="w-full rounded-xl md:w-[400px]">
                    <CardHeader className="flex flex-col justify-center">
                        <CardTitle className="text-center text-2xl">
                            Register
                        </CardTitle>
                        <CardDescription className="text-center">
                            Silahkan masukan username dan password
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex w-full flex-col gap-4">
                        {isError === '' ? (
                            <></>
                        ) : (
                            <p className="text-center text-sm text-yellow-500">
                                {isError}
                            </p>
                        )}
                        <div className="space-y-1">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                className="w-full"
                                type="username"
                                placeholder="admin"
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    className="w-full"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="password"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    autoComplete="current-password"
                                    required
                                />
                                <Button
                                    variant="link"
                                    className="absolute right-1 top-1/2 z-10 -translate-y-1/2 cursor-pointer px-2"
                                    onClick={handleTogglePassword}
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-4 text-muted-foreground" />
                                    ) : (
                                        <EyeIcon className="size-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            className={`w-full text-white ${isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-1">
                                    <LoadingSpinner className="size-4" />
                                    <span>Loading ...</span>
                                </div>
                            ) : (
                                'Register'
                            )}
                        </Button>
                        <p className="text-center text-sm leading-relaxed text-muted-foreground">
                            Sudah punya akun?{' '}
                            <Link
                                href="/auth/login"
                                className="underline underline-offset-4"
                            >
                                Login
                            </Link>{' '}
                            sekarang
                        </p>
                    </CardFooter>
                </Card>
            </form>
        </>
    )
}

export default FormRegister
