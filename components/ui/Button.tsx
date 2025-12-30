'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ButtonProps {
    children: ReactNode
    variant?: 'primary' | 'secondary' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    href?: string
    onClick?: () => void
    className?: string
    type?: 'button' | 'submit'
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    href,
    onClick,
    className = '',
    type = 'button'
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300'

    const variantStyles = {
        primary: 'bg-safari-olive text-white hover:bg-safari-sand shadow-md hover:shadow-lg',
        secondary: 'bg-safari-earth text-safari-night hover:bg-safari-stone',
        outline: 'border-2 border-safari-olive text-safari-olive hover:bg-safari-olive hover:text-white'
    }

    const sizeStyles = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-2.5 text-base',
        lg: 'px-8 py-3.5 text-lg'
    }

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

    if (href) {
        return (
            <motion.a
                href={href}
                className={combinedClassName}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {children}
            </motion.a>
        )
    }

    return (
        <motion.button
            type={type}
            onClick={onClick}
            className={combinedClassName}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {children}
        </motion.button>
    )
}
