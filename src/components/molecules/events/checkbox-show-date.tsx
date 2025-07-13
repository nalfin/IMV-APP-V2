import { Checkbox } from '@/components/atoms/checkbox'
import { Label } from '@/components/atoms/label'

interface CheckboxShowDateEventProps {
    showDateHeader: boolean
    setShowDateHeader: (value: boolean) => void
}

const CheckboxShowDateEvent = ({
    showDateHeader,
    setShowDateHeader
}: CheckboxShowDateEventProps) => {
    return (
        <>
            <div className="flex items-center gap-3">
                <Checkbox
                    id="showDateHeader"
                    checked={showDateHeader}
                    onCheckedChange={(checked) => setShowDateHeader(!!checked)}
                />
                <Label htmlFor="showDateHeader">Show Date Header</Label>
            </div>
        </>
    )
}

export default CheckboxShowDateEvent
