'use client'

import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'

interface MobileBookingBarProps {
    price?: number
    offer?: string
    bookUrl?: string
}

import { LUXURY_EASE } from '@/lib/constants'

export default function MobileBookingBar({
    price = 20000,
    offer,
    bookUrl
}: MobileBookingBarProps) {
    const defaultUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254718490351'}?text=${encodeURIComponent('Hi! I would like to check availability for a villa.')}`
    const finalUrl = bookUrl || defaultUrl

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6, ease: LUXURY_EASE }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-neutral-100 px-5 py-4 safe-area-bottom shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.1)]"
        >
            <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
                <div className="flex-shrink-0">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-medium">From</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-safari-night tracking-tight">KES {price.toLocaleString()}</span>
                        <span className="text-xs text-neutral-400 font-light">/ night</span>
                    </div>
                    {offer && (
                        <span className="inline-block mt-1 text-[9px] font-semibold text-safari-olive uppercase tracking-wider bg-safari-olive/10 px-2 py-0.5 rounded-full">
                            {offer}
                        </span>
                    )}
                </div>

                <a
                    href={finalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 max-w-[160px] bg-safari-olive text-white h-12 rounded-full flex items-center justify-center text-sm font-medium tracking-wide shadow-lg hover:bg-safari-night transition-all duration-300 active:scale-95"
                >
                    <Calendar className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    Book Now
                </a>
            </div>
        </motion.div>
    )
}
