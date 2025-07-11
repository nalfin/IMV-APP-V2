// // app/api/members/[id]/route.ts
// import { NextResponse } from 'next/server'

// // Handler untuk PUT /api/members/:id
// export async function PUT(
//     request: Request,
//     { params }: { params: { id: string } }
// ) {
//     const { id } = params // Ambil ID dari params
//     return handleUpdateMember(request, id) // Panggil handler yang sudah diadaptasi
// }

// // Handler untuk DELETE /api/members/:id
// export async function DELETE(
//     request: Request,
//     { params }: { params: { id: string } }
// ) {
//     const { id } = params // Ambil ID dari params
//     return handleDeleteMember(request, id) // Panggil handler yang sudah diadaptasi
// }

// // Metode lain tidak didukung di rute ini
// export async function GET() {
//     return NextResponse.json(
//         {
//             success: false,
//             message:
//                 'Method Not Allowed for /api/members/[id]. Use /api/members for GET all.'
//         },
//         { status: 405 }
//     )
// }

// export async function POST() {
//     return NextResponse.json(
//         {
//             success: false,
//             message:
//                 'Method Not Allowed for /api/members/[id]. Use /api/members for POST.'
//         },
//         { status: 405 }
//     )
// }
