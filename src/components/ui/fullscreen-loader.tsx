'use client'

import { Loader2 } from 'lucide-react'

export function FullScreenLoader() {
    return (
        <div className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-sm">
            <div className="absolute bottom-16 left-16">
                <div className="flex items-center gap-2 text-white">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-md loading-dots font-mono">
                        Loading data
                    </span>
                </div>
            </div>
        </div>
    )
}
