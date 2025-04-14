'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';

type Crumb = {
  label: string;
  href?: string; // if undefined, it's the current page
};

type BreadcrumbProps = {
  items: Crumb[];
  title?: string;
  showTitle?: boolean;
};

export default function Breadcrumb({
  items,
  title = '',
  showTitle = true,
}: BreadcrumbProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-4 py-8">
      {showTitle && (
        <h1 className="text-lg md:text-xl font-bold text-gray-800">{title}</h1>
      )}
     {items.length > 0 && <nav className="flex items-center text-sm text-gray-800 flex-wrap gap-x-2">
        <Link
          href="/admin"
          className="hover:underline flex items-center gap-1"
        >
          <Home className="w-4 h-4" />
        </Link>

        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-gray-800/50">/</span>
            {item.href ? (
              <Link
                href={item.href}
                className="hover:underline text-gray-800/90"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-800 font-semibold">{item.label}</span>
            )}
          </div>
        ))}
      </nav>}
    </div>
  );
}
