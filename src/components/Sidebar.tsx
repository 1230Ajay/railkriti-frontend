'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import allowedSidebarPages from '@/lib/data/SidebarData'
import { useSession } from 'next-auth/react'

interface SidebarProps {
  sidebarOpen: boolean
  toggleSidebar: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, toggleSidebar }) => {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [pages, setPages] = useState<any[]>([])
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const { data: session, status } = useSession()

  useEffect(() => {

    if (status === 'authenticated' && session?.user) {
      setIsAdmin(session.user.role === 'admin')
    } else {
      setIsAdmin(false)
    }
  }, [session, status])

  useEffect(() => {
    const fetchPages = async () => {
      const pages = await allowedSidebarPages(isAdmin)
      setPages(pages)
    }

    fetchPages()
  }, [isAdmin])

  useEffect(() => {
    const handleMouseLeave = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.relatedTarget as Node)) {
        toggleSidebar()
      }
    }

    const currentRef = sidebarRef.current
    if (currentRef) {
      currentRef.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [toggleSidebar])

  if (status === 'loading') {
    return (
      <div className="flex bg-gray-800">
        <div className="fixed top-20 rounded-md z-10 w-64 h-64 bg-black border border-white flex items-center justify-center">
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex bg-gray-800">
      <div
        ref={sidebarRef}
        className={`fixed top-20 rounded-md z-10 transform transition-transform duration-300 ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
        aria-hidden={!sidebarOpen}
      >
        <ul className="font-semibold w-64 bg-black border border-white rounded-md">
          {pages.map((section, index) => (
            <li key={index}>
              <Link href={section.href} passHref>
                <div className="w-full text-left px-4 py-4 uppercase flex items-center text-white hover:bg-gray-700 cursor-pointer">
                  <span className="text-2xl mr-3 text-gray-400">
                    <section.icon />
                  </span>
                  {section.name}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Sidebar