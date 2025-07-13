import { Checkbox } from '@/components/atoms/checkbox'
import { Label } from '@/components/atoms/label'

type ChexboxShowLastProps = {
    showFromLast: boolean
    setShowFromLast: (showFromLast: boolean) => void
}

const CheckboxShowLast = ({
    showFromLast,
    setShowFromLast
}: ChexboxShowLastProps) => {
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

export default CheckboxShowLast
