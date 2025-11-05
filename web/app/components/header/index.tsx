'use client'
import React, { useCallback, useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react'
import AccountDropdown from './account-dropdown'
import AppNav from './app-nav'
import DatasetNav from './dataset-nav'
import EnvNav from './env-nav'
import PluginsNav from './plugins-nav'
import ExploreNav from './explore-nav'
import ToolsNav from './tools-nav'
import { WorkspaceProvider } from '@/context/workspace-context'
import { useAppContext } from '@/context/app-context'
import OctoFlowLogo from '@/app/components/base/logo/dify-logo'
import WorkplaceSelector from '@/app/components/header/account-dropdown/workplace-selector'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'
import { useProviderContext } from '@/context/provider-context'
import { useModalContext } from '@/context/modal-context'
import PlanBadge from './plan-badge'
import LicenseNav from './license-env'
import { Plan } from '../billing/type'
import { useGlobalPublicStore } from '@/context/global-public-context'

const navClassName = `
  flex items-center relative px-3 h-8 rounded-xl
  font-medium text-sm
  cursor-pointer
`

const Header = () => {
  const { isCurrentWorkspaceEditor, isCurrentWorkspaceDatasetOperator } = useAppContext()
  const media = useBreakpoints()
  const isMobile = media === MediaType.mobile
  const { enableBilling, plan } = useProviderContext()
  const { setShowPricingModal, setShowAccountSettingModal } = useModalContext()
  const systemFeatures = useGlobalPublicStore(s => s.systemFeatures)
  const isFreePlan = plan.type === Plan.sandbox
  const handlePlanClick = useCallback(() => {
    if (isFreePlan)
      setShowPricingModal()
    else
      setShowAccountSettingModal({ payload: 'billing' })
  }, [isFreePlan, setShowAccountSettingModal, setShowPricingModal])

  // Draggable toolbar state - default to right center
  const [position, setPosition] = useState(() => {
    if (typeof window !== 'undefined') {
      return { 
        x: 24, // 24px from right edge
        y: (window.innerHeight - 300) / 2 // Vertically centered (assuming ~300px toolbar height)
      }
    }
    return { x: 24, y: 200 } // Fallback for SSR
  })
  const [isDragging, setIsDragging] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    }
    // Prevent text selection globally during drag
    document.body.style.userSelect = 'none'
    document.body.style.webkitUserSelect = 'none'
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragRef.current || !toolbarRef.current) return
    
    e.preventDefault()
    
    const deltaX = e.clientX - dragRef.current.startX
    const deltaY = e.clientY - dragRef.current.startY
    
    // Since we use 'right' positioning, we need to invert the X direction
    const newX = Math.max(0, Math.min(window.innerWidth - 100, dragRef.current.initialX - deltaX))
    const newY = Math.max(0, Math.min(window.innerHeight - 100, dragRef.current.initialY + deltaY))
    
    // Direct DOM update for instant response (no RAF delay)
    toolbarRef.current.style.right = `${newX}px`
    toolbarRef.current.style.top = `${newY}px`
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    if (toolbarRef.current && dragRef.current) {
      // Save final position to state
      const finalX = parseInt(toolbarRef.current.style.right) || dragRef.current.initialX
      const finalY = parseInt(toolbarRef.current.style.top) || dragRef.current.initialY
      setPosition({ x: finalX, y: finalY })
    }
    setIsDragging(false)
    dragRef.current = null
    // Restore text selection after drag
    document.body.style.userSelect = ''
    document.body.style.webkitUserSelect = ''
  }, [])

  // Add/remove event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  if (isMobile) {
    return (
      <div className=''>
        <div className='flex items-center justify-between px-2'>
          <div className='flex items-center'>
            <Link href="/apps" className='flex h-8 shrink-0 items-center justify-center px-0.5'>
              {systemFeatures.branding.enabled && systemFeatures.branding.workspace_logo
                ? <img
                  src={systemFeatures.branding.workspace_logo}
                  className='block h-[22px] w-auto object-contain'
                  alt='logo'
                />
                : <OctoFlowLogo />}
            </Link>
            <div className='mx-1.5 shrink-0 font-light text-divider-deep'>/</div>
            <WorkspaceProvider>
              <WorkplaceSelector />
            </WorkspaceProvider>
            {enableBilling ? <PlanBadge allowHover sandboxAsUpgrade plan={plan.type} onClick={handlePlanClick} /> : <LicenseNav />}
          </div>
          <div className='flex items-center'>
            <div className='mr-2'>
              <PluginsNav />
            </div>
            <AccountDropdown />
          </div>
        </div>
        <div className='my-1 flex items-center justify-center space-x-1'>
          {!isCurrentWorkspaceDatasetOperator && <ExploreNav className={navClassName} />}
          {!isCurrentWorkspaceDatasetOperator && <AppNav />}
          {(isCurrentWorkspaceEditor || isCurrentWorkspaceDatasetOperator) && <DatasetNav />}
          {!isCurrentWorkspaceDatasetOperator && <ToolsNav className={navClassName} />}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='flex h-[56px] items-center'>
        <div className='flex min-w-0 flex-[1]  items-center pl-3 pr-2 min-[1280px]:pr-3'>
          <Link href="/apps" className='flex h-8 shrink-0 items-center justify-center px-0.5'>
            {systemFeatures.branding.enabled && systemFeatures.branding.workspace_logo
              ? <img
                src={systemFeatures.branding.workspace_logo}
                className='block h-[22px] w-auto object-contain'
                alt='logo'
              />
              : <OctoFlowLogo />}
          </Link>
          <div className='mx-1.5 shrink-0 font-light text-divider-deep'>/</div>
          <WorkspaceProvider>
            <WorkplaceSelector />
          </WorkspaceProvider>
          {enableBilling ? <PlanBadge allowHover sandboxAsUpgrade plan={plan.type} onClick={handlePlanClick} /> : <LicenseNav />}
        </div>
        <div className='flex min-w-0 flex-[1] items-center justify-end pl-2 pr-3 min-[1280px]:pl-3'>
          <EnvNav />
          <div className='mr-2'>
            <PluginsNav />
          </div>
          <AccountDropdown />
        </div>
      </div>
      {/* Floating Navigation Toolbar */}
      {isMinimized ? (
        // Minimized state - show expand button on left edge
        <div 
          className='fixed left-0 z-50 flex items-center justify-center w-10 h-16 rounded-r-2xl bg-white/80 backdrop-blur-md shadow-lg border border-l-0 border-gray-200/50 cursor-pointer hover:bg-white/90 transition-all'
          style={{ 
            top: `${position.y}px`,
          }}
          onClick={() => setIsMinimized(false)}
        >
          <RiArrowRightSLine className='w-5 h-5 text-gray-600' />
        </div>
      ) : (
        // Expanded state - show full toolbar
        <div 
          ref={toolbarRef}
          className='fixed z-50 flex flex-col rounded-2xl bg-white/80 backdrop-blur-md shadow-lg border border-gray-200/50 select-none'
          style={{ 
            right: `${position.x}px`, 
            top: `${position.y}px`,
            cursor: isDragging ? 'grabbing' : 'default',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            transition: isDragging ? 'none' : 'all 0.2s'
          }}
        >
          {/* Drag Handle with Minimize Button */}
          <div className='flex items-center justify-between py-2 px-3 border-b border-gray-200/50'>
            <div 
              className='flex items-center space-x-1 cursor-grab active:cursor-grabbing flex-1'
              onMouseDown={handleMouseDown}
            >
              <div className='w-1 h-1 rounded-full bg-gray-400'></div>
              <div className='w-1 h-1 rounded-full bg-gray-400'></div>
              <div className='w-1 h-1 rounded-full bg-gray-400'></div>
            </div>
            <button
              className='ml-2 p-1 rounded-lg hover:bg-gray-200/50 transition-colors'
              onClick={() => setIsMinimized(true)}
              title='Minimize'
            >
              <RiArrowLeftSLine className='w-4 h-4 text-gray-600' />
            </button>
          </div>
          {/* Navigation Items */}
          <div className='flex flex-col space-y-2 p-3'>
            {!isCurrentWorkspaceDatasetOperator && <ExploreNav className={navClassName} />}
            {!isCurrentWorkspaceDatasetOperator && <AppNav />}
            {(isCurrentWorkspaceEditor || isCurrentWorkspaceDatasetOperator) && <DatasetNav />}
            {!isCurrentWorkspaceDatasetOperator && <ToolsNav className={navClassName} />}
          </div>
        </div>
      )}
    </>
  )
}
export default Header
