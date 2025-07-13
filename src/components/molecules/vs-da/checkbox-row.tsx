import { Checkbox } from '@/components/atoms/checkbox'

interface CheckboxRowVsDAProps {
    table: any
    selectedRowsCount: number
    totalFilteredRowsCount: number
}

const CheckboxRowVsDA = ({
    table,
    selectedRowsCount,
    totalFilteredRowsCount
}: CheckboxRowVsDAProps) => {
    return (
        <>
            <div className="flex items-center justify-end space-x-2">
                <Checkbox
                    id="uncheckAll"
                    checked={selectedRowsCount > 0}
                    onCheckedChange={() => {
                        table.resetRowSelection()
                    }}
                />
                <div className="flex-1 text-sm text-muted-foreground">
                    {selectedRowsCount} of {totalFilteredRowsCount} row(s)
                    selected.
                </div>
            </div>
        </>
    )
}

export default CheckboxRowVsDA
