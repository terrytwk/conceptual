"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, FolderOpen, X, File as FileIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FolderUploadProps {
    onFolderSelect?: (files: FileList | null) => void
    disabled?: boolean
    className?: string
}

export function FolderUpload({ onFolderSelect, disabled, className }: FolderUploadProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [folderName, setFolderName] = useState<string>("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFiles = useCallback(
        (files: FileList | null) => {
            if (!files || files.length === 0) return

            const fileArray = Array.from(files)
            setSelectedFiles(fileArray)

            // Get folder name from the first file's path
            if (fileArray.length > 0) {
                const path = fileArray[0].webkitRelativePath || fileArray[0].name
                const folder = path.split("/")[0]
                setFolderName(folder || "Selected Folder")
            }

            if (onFolderSelect) {
                onFolderSelect(files)
            }
        },
        [onFolderSelect]
    )

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!disabled) {
            setIsDragging(true)
        }
    }, [disabled])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setIsDragging(false)

            if (disabled) return

            const files = e.dataTransfer.files
            if (files.length > 0) {
                handleFiles(files)
            }
        },
        [disabled, handleFiles]
    )

    const handleBrowseClick = () => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            handleFiles(files)
        }
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedFiles([])
        setFolderName("")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
        if (onFolderSelect) {
            onFolderSelect(null)
        }
    }

    return (
        <div className={cn("w-full", className)}>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleBrowseClick}
                className={cn(
                    "relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
                    isDragging
                        ? "border-primary bg-primary/5"
                        : "border-input hover:border-primary/50",
                    disabled && "opacity-50 cursor-not-allowed",
                    selectedFiles.length > 0 && "border-primary/50"
                )}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    {...({ webkitdirectory: "" } as any)}
                    onChange={handleFileInputChange}
                    disabled={disabled}
                    className="hidden"
                />

                {selectedFiles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                            <Upload className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-foreground">
                                Drag and drop a folder here
                            </p>
                            <p className="text-xs text-muted-foreground">
                                or click to browse
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FolderOpen className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        {folderName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {selectedFiles.length} file{selectedFiles.length !== 1 ? "s" : ""}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleClear}
                                disabled={disabled}
                                className="p-1 rounded-full hover:bg-muted transition-colors"
                            >
                                <X className="w-4 h-4 text-muted-foreground" />
                            </button>
                        </div>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                            {selectedFiles.slice(0, 10).map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 text-xs text-muted-foreground px-2 py-1 rounded bg-muted/50"
                                >
                                    <FileIcon className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">
                                        {file.webkitRelativePath || file.name}
                                    </span>
                                </div>
                            ))}
                            {selectedFiles.length > 10 && (
                                <p className="text-xs text-muted-foreground px-2">
                                    ... and {selectedFiles.length - 10} more file{selectedFiles.length - 10 !== 1 ? "s" : ""}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

