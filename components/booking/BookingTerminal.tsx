'use client'

import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Button from '@/components/ui/Button'

interface BookingTerminalProps {
    villaId: string
    villaName: string
    houseNumber: string
    basePrice: number
    capacity: number
    appliedOffer?: {
        name: string
        discountType: 'percentage' | 'fixed' | 'nights_based'
        discountValue: number
    }
}

export default function BookingTerminal({
    villaId,
    villaName,
    houseNumber,
    basePrice,
    capacity,
    appliedOffer
}: BookingTerminalProps) {
    const [checkIn, setCheckIn] = useState<Date | null>(null)
    const [checkOut, setCheckOut] = useState<Date | null>(null)
    const [guests, setGuests] = useState(2)

    // Calculate nights
    const nights = checkIn && checkOut
        ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
        : 0

    // Calculate pricing
    const calculateTotal = () => {
        if (!nights || nights <= 0) return 0

        let total = basePrice * nights

        // Apply offer discount
        if (appliedOffer) {
            if (appliedOffer.discountType === 'percentage') {
                total = total * (1 - appliedOffer.discountValue / 100)
            } else if (appliedOffer.discountType === 'fixed') {
                total = total - appliedOffer.discountValue
            } else if (appliedOffer.discountType === 'nights_based') {
                // For "Stay 3 Pay 2" type offers
                const discountedNights = Math.floor(nights * (1 - appliedOffer.discountValue / 100))
                total = basePrice * discountedNights
            }
        }

        return Math.max(0, total)
    }

    const totalPrice = calculateTotal()

    // Generate booking reference
    const generateReference = () => {
        const date = new Date().toISOString().split('T')[0].replace(/-/g, '')
        const random = Math.random().toString(36).substring(2, 6).toUpperCase()
        return `LV-${date}-${random}`
    }

    // Generate WhatsApp message
    const handleWhatsAppBooking = () => {
        if (!checkIn || !checkOut || nights <= 0) {
            alert('Please select valid check-in and check-out dates')
            return
        }

        const reference = generateReference()
        const formatDate = (date: Date) => date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })

        const message = `Hi! I'd like to book ${houseNumber} at Lifestyle Villas Nanyuki.

📅 Check-in: ${formatDate(checkIn)}
📅 Check-out: ${formatDate(checkOut)}
🏠 Guests: ${guests}
🌙 Nights: ${nights}
💰 Total: KES ${totalPrice.toLocaleString()}${appliedOffer ? ` (${appliedOffer.name} applied)` : ''}

Booking Reference: ${reference}

Looking forward to hearing from you!`

        const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254718490351'
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

        // Log booking request (we could also save to database here)
        console.log('Booking request:', {
            villaId,
            reference,
            checkIn,
            checkOut,
            guests,
            nights,
            totalPrice
        })

        window.open(whatsappUrl, '_blank')
    }

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return (
        <div className="bg-white border-2 border-neutral-200 rounded-2xl p-8 sticky top-24 shadow-lg">
            <div className="mb-6">
                <div className="flex items-baseline justify-between mb-2">
                    <span className="text-4xl font-bold text-safari-night">
                        KES {basePrice.toLocaleString()}
                    </span>
                    <span className="text-neutral-600">/night</span>
                </div>
                {appliedOffer && (
                    <div className="bg-safari-olive/10 text-safari-olive px-3 py-1.5 rounded-full text-sm font-medium inline-block">
                        {appliedOffer.name}
                    </div>
                )}
            </div>

            <div className="space-y-4 mb-6">
                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Check-in
                        </label>
                        <DatePicker
                            selected={checkIn}
                            onChange={(date) => setCheckIn(date)}
                            minDate={today}
                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-safari-olive focus:border-transparent"
                            placeholderText="Select date"
                            dateFormat="dd MMM yyyy"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Check-out
                        </label>
                        <DatePicker
                            selected={checkOut}
                            onChange={(date) => setCheckOut(date)}
                            minDate={checkIn || tomorrow}
                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-safari-olive focus:border-transparent"
                            placeholderText="Select date"
                            dateFormat="dd MMM yyyy"
                        />
                    </div>
                </div>

                {/* Guests */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Guests
                    </label>
                    <select
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-safari-olive focus:border-transparent"
                    >
                        {Array.from({ length: capacity }, (_, i) => i + 1).map((num) => (
                            <option key={num} value={num}>
                                {num} {num === 1 ? 'guest' : 'guests'}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Calculation Summary */}
            {nights > 0 && (
                <div className="border-t border-neutral-200 pt-4 mb-6 space-y-2">
                    <div className="flex justify-between text-sm text-neutral-600">
                        <span>KES {basePrice.toLocaleString()} × {nights} nights</span>
                        <span>KES {(basePrice * nights).toLocaleString()}</span>
                    </div>
                    {appliedOffer && (
                        <div className="flex justify-between text-sm text-safari-olive">
                            <span>{appliedOffer.name}</span>
                            <span>-KES {((basePrice * nights) - totalPrice).toLocaleString()}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-safari-night pt-2 border-t">
                        <span>Total</span>
                        <span>KES {totalPrice.toLocaleString()}</span>
                    </div>
                </div>
            )}

            <Button
                onClick={handleWhatsAppBooking}
                variant="primary"
                size="lg"
                className="w-full"
            >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Book via WhatsApp
            </Button>

            <p className="text-xs text-neutral-500 text-center mt-4">
                You won't be charged yet. Final confirmation via WhatsApp.
            </p>
        </div>
    )
}
