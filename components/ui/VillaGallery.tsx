'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react'

// Define the two possible shapes for images
type ImageCategory = { category: string; images: string[] }
type VillaImages = string[] | ImageCategory[]

interface VillaGalleryProps {
    images: VillaImages
    featuredImage?: string | null
    name: string
}

export default function VillaGallery({ images, featuredImage, name }: VillaGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [activeSection, setActiveSection] = useState('All')

    // 1. Normalize data: Extract all images for Lightbox and Sections for Tabs
    const { allImages, sections } = useMemo(() => {
        let all: string[] = []
        let sects: string[] = []
        let categorized: Record<string, string[]> = {}

        if (Array.isArray(images) && images.length > 0 && typeof images[0] !== 'string') {
            // New structure: [{ category: 'Living', images: [] }]
            const imgData = images as ImageCategory[]
            sects = imgData.map(s => s.category)

            imgData.forEach(s => {
                categorized[s.category] = s.images
                all = [...all, ...s.images]
            })
        } else {
            // Legacy/Fallback: string[]
            all = images as string[]
            sects = [] // No sections available
        }

        // Add featured image to start of 'all' if exists and not duplicate
        if (featuredImage && !all.includes(featuredImage)) {
            all = [featuredImage, ...all]
        }

        return { allImages: all, sections: sects, categorized }
    }, [images, featuredImage])

    // 2. Filter images for the GRID view based on active section
    // If 'All', show featured + first few (mixed) using standard layout
    // If section active, show simple grid of ALL images in that section

    const displayImages = useMemo(() => {
        if (activeSection === 'All') {
            // Show secondary images only (main one is handled separately in layout)
            return allImages.filter(img => img !== featuredImage)
        }
        // If section selected, return ALL images in that section
        // We need to find them from the original prop or our parsed map
        if (Array.isArray(images) && typeof images[0] !== 'string') {
            const categoryData = (images as ImageCategory[]).find(c => c.category === activeSection)
            return categoryData ? categoryData.images : []
        }
        return []
    }, [activeSection, allImages, featuredImage, images])


    const openLightbox = (imgUrl: string) => {
        const index = allImages.indexOf(imgUrl)
        if (index >= 0) {
            setCurrentIndex(index)
            setLightboxOpen(true)
        }
    }

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        setCurrentIndex((prev) => (prev + 1) % allImages.length)
    }

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
    }

    return (
        <div id="gallery">
            {/* Section Tabs */}
            {sections.length > 0 && (
                <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
                    <button
                        onClick={() => setActiveSection('All')}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeSection === 'All'
                                ? 'bg-safari-olive text-white shadow-md'
                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400'
                            }`}
                    >
                        Overview
                    </button>
                    {sections.map(section => (
                        <button
                            key={section}
                            onClick={() => setActiveSection(section)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeSection === section
                                    ? 'bg-safari-olive text-white shadow-md'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400'
                                }`}
                        >
                            {section}
                        </button>
                    ))}
                </div>
            )}

            {/* Grid Layout - Changes structure based on view */}
            {activeSection === 'All' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                    {/* Main Featured Image (Always visible in Overview) */}
                    <div
                        className="md:row-span-2 relative h-96 md:h-full bg-neutral-200 dark:bg-neutral-800 rounded-2xl overflow-hidden group cursor-pointer"
                        onClick={() => featuredImage && openLightbox(featuredImage)}
                    >
                        {featuredImage ? (
                            <>
                                <Image
                                    src={featuredImage}
                                    alt={name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <span className="bg-white/90 text-safari-night px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                                        <Expand className="w-4 h-4" />
                                        View Photos
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-neutral-200 dark:bg-neutral-800">
                                <span className="text-neutral-400">No Featured Image</span>
                            </div>
                        )}
                    </div>

                    {/* Secondary Images (First 4) */}
                    {displayImages.slice(0, 4).map((img, i) => (
                        <div
                            key={i}
                            className="relative h-48 bg-neutral-200 dark:bg-neutral-800 rounded-xl overflow-hidden group cursor-pointer"
                            onClick={() => openLightbox(img)}
                        >
                            <Image
                                src={img}
                                alt={`${name} - view ${i + 1}`}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <Expand className="w-6 h-6 text-white drop-shadow-md" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Specific Section Grid - Just a simple flexible grid */
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                    {displayImages.map((img, i) => (
                        <div
                            key={i}
                            className="relative h-48 md:h-64 bg-neutral-200 dark:bg-neutral-800 rounded-xl overflow-hidden group cursor-pointer"
                            onClick={() => openLightbox(img)}
                        >
                            <Image
                                src={img}
                                alt={`${name} - ${activeSection} ${i + 1}`}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <Expand className="w-6 h-6 text-white drop-shadow-md" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Lightbox Modal (Same as before) */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
                        onClick={() => setLightboxOpen(false)}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 md:top-6 md:right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-50"
                            onClick={() => setLightboxOpen(false)}
                        >
                            <X className="w-6 h-6 md:w-8 md:h-8" />
                        </button>

                        {/* Prev Button */}
                        <button
                            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 md:p-3 rounded-full transition-colors z-50"
                            onClick={prevImage}
                        >
                            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                        </button>

                        {/* Next Button */}
                        <button
                            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 md:p-3 rounded-full transition-colors z-50"
                            onClick={nextImage}
                        >
                            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                        </button>

                        <motion.div
                            className="relative w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={allImages[currentIndex]}
                                    alt={`${name} - full view`}
                                    fill
                                    className="object-contain"
                                    quality={100}
                                />
                            </div>
                        </motion.div>

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 font-medium tracking-widest text-sm bg-black/20 px-4 py-2 rounded-full backdrop-blur-md">
                            {currentIndex + 1} / {allImages.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
