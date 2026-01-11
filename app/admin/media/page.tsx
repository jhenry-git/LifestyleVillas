'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { Folder, Image as ImageIcon, Trash2, Upload, ExternalLink } from 'lucide-react'
import type { FileObject } from '@supabase/storage-js'

// Create client once outside component to prevent re-renders
const supabase = createClient()

export default function MediaLibraryPage() {
    const [files, setFiles] = useState<FileObject[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedBucket, setSelectedBucket] = useState('villa-images')

    const fetchFiles = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const { data, error: listError } = await supabase
                .storage
                .from(selectedBucket)
                .list('', {
                    limit: 100,
                    sortBy: { column: 'created_at', order: 'desc' }
                })

            if (listError) throw listError

            setFiles(data || [])
        } catch (err) {
            console.error('Error fetching files:', err)
            setError(err instanceof Error ? err.message : 'Failed to load media files')
        } finally {
            setLoading(false)
        }
    }, [selectedBucket]) // Removed supabase from dependencies

    useEffect(() => {
        fetchFiles()
    }, [fetchFiles])

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files
        if (!fileList || fileList.length === 0) return

        try {
            setUploading(true)
            setError(null)

            const file = fileList[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

            const { error: uploadError } = await supabase
                .storage
                .from(selectedBucket)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) throw uploadError

            // Refresh file list
            await fetchFiles()
        } catch (err) {
            console.error('Error uploading file:', err)
            setError(err instanceof Error ? err.message : 'Failed to upload file')
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (fileName: string) => {
        if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
            return
        }

        try {
            const { error: deleteError } = await supabase
                .storage
                .from(selectedBucket)
                .remove([fileName])

            if (deleteError) throw deleteError

            // Refresh file list
            await fetchFiles()
        } catch (err) {
            console.error('Error deleting file:', err)
            alert('Failed to delete file')
        }
    }

    const getPublicUrl = (fileName: string) => {
        const { data } = supabase
            .storage
            .from(selectedBucket)
            .getPublicUrl(fileName)

        return data.publicUrl
    }

    const copyUrlToClipboard = (url: string) => {
        navigator.clipboard.writeText(url)
        alert('URL copied to clipboard!')
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    const isImage = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase()
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-safari-night">Media Library</h1>
                    <p className="text-neutral-600 mt-1">Manage uploaded images and files</p>
                </div>
                <label className="bg-safari-olive text-white px-6 py-2.5 rounded-lg hover:bg-safari-sand transition-colors font-medium inline-flex items-center cursor-pointer">
                    <Upload className="w-5 h-5 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload File'}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                    />
                </label>
            </div>

            {/* Bucket Selector */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <label className="block text-sm font-medium text-safari-night mb-2">
                    Storage Bucket
                </label>
                <select
                    value={selectedBucket}
                    onChange={(e) => setSelectedBucket(e.target.value)}
                    className="w-full md:w-auto px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-safari-olive focus:border-transparent"
                >
                    <option value="villa-images">Villa Images</option>
                </select>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                    {error}
                </div>
            )}

            {/* Files Grid */}
            {loading ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <div className="w-12 h-12 border-4 border-safari-olive border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-neutral-600">Loading media files...</p>
                </div>
            ) : files.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <ImageIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-600 mb-4">No files found in this bucket</p>
                    <label className="text-safari-olive hover:text-safari-sand font-medium cursor-pointer">
                        Upload your first file
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={uploading}
                            className="hidden"
                        />
                    </label>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {files.map((file) => {
                        const publicUrl = getPublicUrl(file.name)
                        const isImageFile = isImage(file.name)

                        return (
                            <div
                                key={file.id}
                                className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                {/* Preview */}
                                <div className="aspect-video bg-neutral-100 relative">
                                    {isImageFile ? (
                                        <Image
                                            src={publicUrl}
                                            alt={file.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Folder className="w-12 h-12 text-neutral-400" />
                                        </div>
                                    )}
                                </div>

                                {/* File Info */}
                                <div className="p-4">
                                    <p className="text-sm font-medium text-safari-night truncate mb-1" title={file.name}>
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-neutral-500 mb-3">
                                        {formatFileSize((file.metadata as any)?.size || 0)}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between gap-2">
                                        <button
                                            onClick={() => copyUrlToClipboard(publicUrl)}
                                            className="flex-1 px-3 py-1.5 text-xs bg-safari-olive/10 text-safari-olive rounded hover:bg-safari-olive/20 transition-colors font-medium"
                                            title="Copy URL"
                                        >
                                            Copy URL
                                        </button>
                                        <a
                                            href={publicUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 text-safari-olive hover:bg-safari-olive/10 rounded transition-colors"
                                            title="Open in new tab"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                        <button
                                            onClick={() => handleDelete(file.name)}
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* File Count */}
            {!loading && files.length > 0 && (
                <div className="text-sm text-neutral-600">
                    Showing {files.length} file{files.length !== 1 ? 's' : ''}
                </div>
            )}
        </div>
    )
}
