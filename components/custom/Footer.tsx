'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function Footer({ footerClasses, linkClasses }: { footerClasses: string, linkClasses: string }) {
  return (
    <footer className={cn(footerClasses)}>
      Developed by{' '}
      <Link href="https://pigeonic.com" target="_blank" className={linkClasses}>
        Pigeonic
      </Link>
    </footer>
  )
}
