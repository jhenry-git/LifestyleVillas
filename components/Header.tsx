'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronRight, Phone, Instagram, Facebook, MapPin } from 'lucide-react'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
    { name: 'Villas', href: '/villas' },
    { name: 'Experiences', href: '/experiences' },
    { name: 'Nanyuki', href: '/destinations/nanyuki' },
    { name: 'About', href: '/about' },
    { name: 'Reviews', href: '/reviews' },
]

const LUXURY_EASE = [0.23, 1, 0.32, 1]

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()
    const isHome = pathname === '/'

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset'
    }, [isMobileMenuOpen])

    const menuVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.15, ease: LUXURY_EASE }
        },
        exit: {
            opacity: 0,
            transition: { staggerChildren: 0.05, staggerDirection: -1 }
        }
    }

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: LUXURY_EASE } },
        exit: { y: 30, opacity: 0 }
    }

    // Header styling based on scroll and page
    const headerBg = isScrolled
        ? 'bg-white/70 backdrop-blur-xl border-b border-neutral-200/50 shadow-sm'
        : isHome
            ? 'bg-transparent border-b border-white/10'
            : 'bg-white/90 backdrop-blur-md border-b border-neutral-100'

    const textColor = isScrolled || !isHome ? 'text-safari-night' : 'text-white'
    const logoColor = isScrolled || !isHome ? 'text-safari-night' : 'text-white'
    const subLogoColor = isScrolled || !isHome ? 'text-safari-olive' : 'text-white/70'

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${headerBg}`}>
            {/* Expansive Navigation Container */}
            <nav className="w-full max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16">
                <div className="flex items-center justify-between h-20 md:h-24">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group z-50 relative">
                        <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                            <Image
                                src="/logo.png"
                                alt="Lifestyle Villas Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-lg md:text-xl font-serif font-bold leading-none tracking-tight ${logoColor} transition-colors duration-500`}>
                                Lifestyle Villas
                            </span>
                            <span className={`text-[9px] md:text-[10px] font-sans uppercase tracking-[0.4em] mt-0.5 ${subLogoColor} transition-all duration-500 group-hover:tracking-[0.5em]`}>
                                Nanyuki
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation - Expanded Spacing */}
                    <div className="hidden lg:flex items-center space-x-12 xl:space-x-16">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`text-[13px] font-medium uppercase tracking-[0.15em] hover:text-safari-olive transition-colors duration-300 relative group ${textColor}`}
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-safari-olive transition-all duration-500 ease-out group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    {/* CTA & Mobile Toggle */}
                    <div className="flex items-center gap-6 z-50 relative">
                        <a
                            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254718490351'}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`hidden lg:inline-flex items-center px-7 py-3 rounded-full text-[13px] font-medium tracking-wide transition-all duration-500 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
                                ${isScrolled || !isHome
                                    ? 'bg-safari-olive text-white hover:bg-safari-night'
                                    : 'bg-white/95 text-safari-night hover:bg-white'
                                }`}
                        >
                            <Phone className="w-4 h-4 mr-2.5" strokeWidth={1.5} />
                            Book Now
                        </a>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`lg:hidden p-2.5 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'bg-safari-night text-white' : `${textColor} hover:bg-white/10`}`}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" strokeWidth={1.5} />
                            ) : (
                                <Menu className="w-6 h-6" strokeWidth={1.5} />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: LUXURY_EASE }}
                        className="fixed inset-0 bg-neutral-50 z-40 flex flex-col pt-28 px-8 lg:hidden overflow-y-auto"
                    >
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={menuVariants}
                            className="flex-1 flex flex-col justify-between pb-12"
                        >
                            <nav className="flex flex-col space-y-1">
                                {NAV_ITEMS.map((item) => (
                                    <motion.div key={item.name} variants={itemVariants}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-between text-3xl md:text-4xl font-serif font-bold text-safari-night py-5 border-b border-neutral-100 hover:text-safari-olive transition-colors"
                                        >
                                            {item.name}
                                            <ChevronRight className="w-5 h-5 text-safari-olive/50" strokeWidth={1.2} />
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            <motion.div variants={itemVariants} className="mt-16 space-y-10">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-sans uppercase tracking-[0.3em] text-safari-olive font-semibold">Contact</h4>
                                    <a href="tel:+254718490351" className="block text-2xl font-light text-safari-night">+254 718 490 351</a>
                                    <a href="mailto:info@lifestylevillas.co.ke" className="block text-lg text-neutral-500 font-light">info@lifestylevillas.co.ke</a>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-sans uppercase tracking-[0.3em] text-safari-olive font-semibold">Follow</h4>
                                    <div className="flex space-x-4">
                                        <a href="https://www.instagram.com/lifestyle_villas_nanyuki?igsh=MXNkb2Nia2ZsbHNpdQ==" target="_blank" rel="noopener noreferrer" className="p-3.5 bg-white rounded-full text-safari-night shadow-sm border border-neutral-100 hover:border-safari-olive transition-colors">
                                            <Instagram className="w-5 h-5" strokeWidth={1.2} />
                                        </a>
                                        <a href="https://www.facebook.com/share/1AKhBKKEu6/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="p-3.5 bg-white rounded-full text-safari-night shadow-sm border border-neutral-100 hover:border-safari-olive transition-colors">
                                            <Facebook className="w-5 h-5" strokeWidth={1.2} />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
