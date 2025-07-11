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

interface FormLoginProps {
    handleLogin: (e: React.FormEvent<HTMLFormElement>) => void
    handleChange: (
        setState: React.Dispatch<React.SetStateAction<string>>
    ) => (e: React.ChangeEvent<HTMLInputElement>) => void
    username: string
    setUsername: React.Dispatch<React.SetStateAction<string>>
    password: string
    setPassword: React.Dispatch<React.SetStateAction<string>>
    showPassword: boolean
    handleTogglePassword: (e: React.MouseEvent<HTMLButtonElement>) => void
    isError: string
    isLoading: boolean
    isSuccess: boolean
}

const FormLogin = ({
    handleLogin,
    handleChange,
    setUsername,
    setPassword,
    showPassword,
    handleTogglePassword,
    isError,
    isLoading,
    isSuccess
}: FormLoginProps) => {
    return (
        <>
            <form onSubmit={handleLogin}>
                <Card className="w-full rounded-xl md:w-[400px]">
                    <CardHeader className="flex flex-col justify-center">
                        <CardTitle className="text-center text-2xl">
                            Login
                        </CardTitle>
                        <CardDescription className="text-center">
                            Silahkan masukan username dan password
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isError === '' ? (
                            <></>
                        ) : (
                            <p className="text-center text-sm text-yellow-500">
                                {isError}
                            </p>
                        )}
                        <div className="flex w-full flex-col gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    className="w-full"
                                    type="username"
                                    placeholder="admin"
                                    // onChange={(e) => setUsername(e.target.value)}
                                    onChange={handleChange(setUsername)}
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
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        placeholder="password"
                                        // onChange={(e) =>
                                        //     setPassword(e.target.value)
                                        // }
                                        onChange={handleChange(setPassword)}
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
                                    <span className="loading-dots">
                                        Loading ...
                                    </span>
                                </div>
                            ) : (
                                'Login'
                            )}
                        </Button>
                        <p className="text-center text-sm leading-relaxed text-muted-foreground">
                            Belum punya akun?{' '}
                            <Link
                                href="/auth/register"
                                className="underline underline-offset-4"
                            >
                                Register
                            </Link>{' '}
                            sekarang
                        </p>
                    </CardFooter>
                </Card>
            </form>
        </>
    )
}

export default FormLogin
