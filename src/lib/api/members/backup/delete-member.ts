import { NextResponse } from 'next/server' // Import NextResponse for API responses
import { getSheetsClient } from '@/lib/sheets/init' // Import Google Sheets client
import { validateSheetID } from '@/lib/sheets/sheet-utils' // Import sheet utilities

/**
 * Handler for deleting a member from the Google Sheet.
 * This function is designed for use in Next.js App Router.
 *
 * @param {Request} request - The standard Web API Request object (not used directly for body, but required by signature).
 * @param {string} id - The ID of the member to be deleted, extracted from the URL parameters.
 * @returns {Promise<NextResponse>} A JSON response indicating the success or failure of the operation.
 */
export async function handleDeleteMember(request: Request, id: string) {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    const error = validateSheetID(spreadsheetId)
    if (error) {
        console.error('Spreadsheet ID validation error:', error)
        // Return NextResponse with status 500 if there's a spreadsheet ID validation issue
        return NextResponse.json(
            { success: false, message: error },
            { status: 500 }
        )
    }

    // Validate the ID received from the URL parameter
    if (!id || typeof id !== 'string') {
        return NextResponse.json(
            { success: false, message: 'Missing or invalid member ID in URL' },
            { status: 400 }
        )
    }

    const sheets = await getSheetsClient() // Get an instance of the Google Sheets client

    try {
        // Find the row index based on the ID
        const readRes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'DB_MEMBERS!A2:A' // Assume column A contains the member IDs
        })

        const rows = readRes.data.values || []
        // Find the 0-indexed row position in the fetched array
        const rowIndex = rows.findIndex((row) => row[0] === id) // row[0] is the ID column

        if (rowIndex === -1) {
            // Return a 404 response if the member is not found
            return NextResponse.json(
                { success: false, message: `Member with ID ${id} not found` },
                { status: 404 }
            )
        }

        // targetRowIndex is the 1-indexed row number in the Google Sheet.
        // Since the range started from A2 (which is index 0 in the `rows` array),
        // `rowIndex + 2` will give the correct 1-indexed row number in the sheet.
        const targetRowIndex = rowIndex + 2

        // Get the numeric sheetId (needed for batchUpdate operations like deleteDimension)
        const meta = await sheets.spreadsheets.get({ spreadsheetId })
        const sheetId = meta.data.sheets?.find(
            (s) => s.properties?.title === 'DB_MEMBERS'
        )?.properties?.sheetId

        if (sheetId === undefined) {
            console.error('Sheet ID for DB_MEMBERS not found.')
            // Return a 500 response if the sheet ID cannot be determined
            return NextResponse.json(
                {
                    success: false,
                    message: 'Sheet ID for DB_MEMBERS not found'
                },
                { status: 500 }
            )
        }

        // Physically delete the row using batchUpdate
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
                requests: [
                    {
                        deleteDimension: {
                            range: {
                                sheetId,
                                dimension: 'ROWS',
                                startIndex: targetRowIndex - 1, // startIndex is 0-indexed for Google Sheets API
                                endIndex: targetRowIndex // endIndex is exclusive
                            }
                        }
                    }
                ]
            }
        })

        // Return a success response
        return NextResponse.json(
            {
                success: true,
                message: `Member with ID ${id} deleted successfully`
            },
            { status: 200 }
        )
    } catch (err: any) {
        console.error('Error deleting member from Google Sheet:', err)
        // Return an error response if an issue occurs during the deletion operation
        return NextResponse.json(
            {
                success: false,
                message: 'Internal Server Error during deletion.'
            },
            { status: 500 }
        )
    }
}
