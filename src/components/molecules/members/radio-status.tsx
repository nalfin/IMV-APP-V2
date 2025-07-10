'use client'

import { Label } from '@/components/atoms/label'
import { RadioGroup, RadioGroupItem } from '@/components/atoms/radio-group'

interface RadioStatusProps {
    value: string
    onChange: (value: string) => void
}

const RadioStatus = ({ value, onChange }: RadioStatusProps) => {
    return (
        <>
            <div>
                <RadioGroup value={value} onValueChange={onChange}>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 rounded-md border border-border px-4 py-3">
                            <RadioGroupItem value="ACTIVE" id="active" />
                            <Label htmlFor="active">ACTIVE</Label>
                        </div>
                        <div className="flex items-center gap-2 rounded-md border border-border px-4 py-3">
                            <RadioGroupItem value="INACTIVE" id="inactive" />
                            <Label htmlFor="inactive">INACTIVE</Label>
                        </div>
                    </div>
                </RadioGroup>
            </div>
        </>
    )
}

export default RadioStatus
