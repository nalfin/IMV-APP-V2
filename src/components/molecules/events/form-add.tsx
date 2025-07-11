import {
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/atoms/dialog'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Button } from '@/components/atoms/button'

interface FormAddEventProps {
    eventName: string
    setEventName: React.Dispatch<React.SetStateAction<string>>
    hqStart: number
    setHqStart: React.Dispatch<React.SetStateAction<number>>
    hqEnd: number
    setHqEnd: React.Dispatch<React.SetStateAction<number>>
    submitStatus: 'idle' | 'loading' | 'success'
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

const FormAddEvents = ({
    eventName,
    setEventName,
    hqStart,
    setHqStart,
    hqEnd,
    setHqEnd,
    submitStatus,
    onSubmit
}: FormAddEventProps) => {
    return (
        <>
            <form onSubmit={onSubmit} className="space-y-6">
                <DialogHeader>
                    <DialogTitle>Tambah Event</DialogTitle>
                    <DialogDescription>
                        Tambah event mingguan anggota Indonesian Mafia
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="eventName">Event Name</Label>
                        <Input
                            id="eventName"
                            name="eventName"
                            placeholder="EVENT I"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-3">
                            <Label htmlFor="hqStart">Level HQ Terendah</Label>
                            <Input
                                id="hqStart"
                                name="hqStart"
                                placeholder="24"
                                type="number"
                                value={hqStart}
                                onChange={(e) =>
                                    setHqStart(Number(e.target.value))
                                }
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="hqEnd">Level HQ Tertinggi</Label>
                            <Input
                                id="hqEnd"
                                name="hqEnd"
                                placeholder="26"
                                type="number"
                                value={hqEnd}
                                onChange={(e) =>
                                    setHqEnd(Number(e.target.value))
                                }
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        className={`w-full ${
                            submitStatus === 'success'
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-indigo-500 hover:bg-indigo-600'
                        } text-white`}
                        disabled={submitStatus === 'loading'}
                    >
                        {submitStatus === 'loading' ? (
                            <div className="flex items-center space-x-1">
                                <LoadingSpinner className="size-4" />
                                <span>LOADING ...</span>
                            </div>
                        ) : submitStatus === 'success' ? (
                            <span>SUCCESS</span>
                        ) : (
                            'SUBMIT'
                        )}
                    </Button>
                </DialogFooter>
            </form>
        </>
    )
}

export default FormAddEvents
