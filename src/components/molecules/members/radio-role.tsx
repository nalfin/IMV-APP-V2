'use client'

import { Label } from '@/components/atoms/label'
import { RadioGroup, RadioGroupItem } from '@/components/atoms/radio-group'

interface RadioRoleProps {
    value: string
    onChange: (value: string) => void
}

const RadioRole = ({ value, onChange }: RadioRoleProps) => {
    return (
        <>
            <div>
                <RadioGroup value={value} onValueChange={onChange}>
                    <div className="grid grid-cols-5 gap-2">
                        <div className="flex items-center justify-center gap-2 rounded-md border border-border py-2">
                            <RadioGroupItem value="R5" id="r5" />
                            <Label htmlFor="r5">R5</Label>
                        </div>
                        <div className="flex items-center justify-center gap-2 rounded-md border border-border py-2">
                            <RadioGroupItem value="R4" id="r4" />
                            <Label htmlFor="r4">R4</Label>
                        </div>
                        <div className="flex items-center justify-center gap-2 rounded-md border border-border py-2">
                            <RadioGroupItem value="R3" id="r3" />
                            <Label htmlFor="r3">R3</Label>
                        </div>
                        <div className="flex items-center justify-center gap-2 rounded-md border border-border py-2">
                            <RadioGroupItem value="R2" id="r2" />
                            <Label htmlFor="r2">R2</Label>
                        </div>
                        <div className="flex items-center justify-center gap-2 rounded-md border border-border py-2">
                            <RadioGroupItem value="R1" id="r1" />
                            <Label htmlFor="r1">R1</Label>
                        </div>
                    </div>
                </RadioGroup>
            </div>
        </>
    )
}

export default RadioRole
