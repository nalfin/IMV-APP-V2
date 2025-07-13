'use client'

import { Label } from '@/components/atoms/label'
import { RadioGroup, RadioGroupItem } from '@/components/atoms/radio-group'

interface RadioVsDAProps {
    value: string
    onChange: (value: string) => void
}

const RadioVsDA = ({ value, onChange }: RadioVsDAProps) => {
    return (
        <div>
            <RadioGroup value={value} onValueChange={onChange}>
                <div className="grid grid-cols-1 gap-3">
                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex items-center gap-3 rounded-md border border-border px-2 py-3">
                            <RadioGroupItem value="7🎁" id="r7" />
                            <Label htmlFor="r7">7🎁 {'>'} 2.6m</Label>
                        </div>
                        <div className="flex items-center gap-3 rounded-md border border-border px-2 py-3">
                            <RadioGroupItem value="8🎁" id="r8" />
                            <Label htmlFor="r8">
                                <Label htmlFor="r8">8🎁 {'>'} 3.6m</Label>
                            </Label>
                        </div>
                        <div className="flex items-center gap-3 rounded-md border border-border px-2 py-3">
                            <RadioGroupItem value="9🎁" id="r9" />
                            <Label htmlFor="r9">9🎁 {'>'} 7.2m</Label>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex items-center gap-3 rounded-md border border-border px-2 py-3">
                            <RadioGroupItem value="4🎁" id="r4" />
                            <Label htmlFor="r4">4🎁 {'>'} 660k</Label>
                        </div>
                        <div className="flex items-center gap-3 rounded-md border border-border px-2 py-3">
                            <RadioGroupItem value="5🎁" id="r5" />
                            <Label htmlFor="r5">5🎁 {'>'} 1m</Label>
                        </div>
                        <div className="flex items-center gap-3 rounded-md border border-border px-2 py-3">
                            <RadioGroupItem value="6🎁" id="r6" />
                            <Label htmlFor="r6">6🎁 {'>'} 2.3m</Label>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex items-center gap-3 rounded-md border border-border px-2 py-3">
                            <RadioGroupItem value="1🎁" id="r1" />
                            <Label htmlFor="r1">1🎁 {'>'} 40k</Label>
                        </div>
                        <div className="flex items-center gap-3 rounded-md border border-border px-2 py-3">
                            <RadioGroupItem value="2🎁" id="r2" />
                            <Label htmlFor="r2">2🎁 {'>'} 150k</Label>
                        </div>
                        <div className="flex items-center gap-3 rounded-md border border-border px-2 py-3">
                            <RadioGroupItem value="3🎁" id="r3" />
                            <Label htmlFor="r3">3🎁 {'>'} 540k</Label>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-start-2 flex items-center gap-3 rounded-md border border-border px-2 py-3">
                            <RadioGroupItem value="0🎁" id="r0" />
                            <Label htmlFor="r0">0🎁 {'<'} 40k</Label>
                        </div>
                    </div>
                </div>
            </RadioGroup>
        </div>
    )
}

export default RadioVsDA
