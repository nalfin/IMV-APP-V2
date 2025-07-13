import { Checkbox } from '@/components/atoms/checkbox'
import { Label } from '@/components/atoms/label'

type ChexboxShowLastEventProps = {
    showFromLast: boolean
    setShowFromLast: (showFromLast: boolean) => void
}

const CheckboxShowLastEvent = ({
    showFromLast,
    setShowFromLast
}: ChexboxShowLastEventProps) => {
    return (
        <>
            <div className="flex items-center gap-3">
                <Checkbox
                    id="showLast"
                    checked={showFromLast}
                    onCheckedChange={(checked) => setShowFromLast(!!checked)}
                />
                <Label htmlFor="showLast">Show From Last</Label>
            </div>
        </>
    )
}

export default CheckboxShowLastEvent
