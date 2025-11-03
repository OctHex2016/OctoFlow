'use client'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useContext } from 'use-context-selector'
import useSWR from 'swr'
import { RiDeleteBinLine, RiEditLine } from '@remixicon/react'
import Button from '@/app/components/base/button'
import Modal from '@/app/components/base/modal'
import Input from '@/app/components/base/input'
import { ToastContext } from '@/app/components/base/toast'
import { deleteWorkspace, updateWorkspaceInfo, fetchWorkspaces } from '@/service/common'
import { useAppContext } from '@/context/app-context'
import { basePath } from '@/utils/var'
import type { IWorkspace } from '@/models/common'

export default function WorkspacePage() {
  const { t } = useTranslation()
  const { notify } = useContext(ToastContext)
  const { data, mutate } = useSWR({ url: '/workspaces' }, fetchWorkspaces)
  const workspaces = data?.workspaces || []
  const { isCurrentWorkspaceManager } = useAppContext()
  const [editingWorkspace, setEditingWorkspace] = useState<IWorkspace | null>(null)
  const [deletingWorkspace, setDeletingWorkspace] = useState<IWorkspace | null>(null)
  const [workspaceName, setWorkspaceName] = useState('')
  const [deleteConfirmName, setDeleteConfirmName] = useState('')

  const handleEditClick = (workspace: IWorkspace) => {
    setEditingWorkspace(workspace)
    setWorkspaceName(workspace.name)
  }

  const handleRename = async () => {
    if (!workspaceName.trim() || !editingWorkspace) {
      notify({ type: 'error', message: t('common.account.workspaceNamePlaceholder') })
      return
    }

    try {
      await updateWorkspaceInfo({ url: '/workspaces/info', body: { name: workspaceName } })
      notify({ type: 'success', message: t('common.actionMsg.modifiedSuccessfully') })
      setEditingWorkspace(null)
      setWorkspaceName('')
      await mutate()
    }
    catch {
      notify({ type: 'error', message: t('common.provider.saveFailed') })
    }
  }

  const handleDeleteClick = (workspace: IWorkspace) => {
    if (workspaces.length <= 1) {
      notify({ type: 'error', message: t('common.workspace.cannotDeleteLastWorkspace') })
      return
    }
    setDeletingWorkspace(workspace)
    setDeleteConfirmName('')
  }

  const handleDelete = async () => {
    if (!deletingWorkspace)
      return

    try {
      await deleteWorkspace({ url: `/workspaces/${deletingWorkspace.id}` })
      notify({ type: 'success', message: t('common.actionMsg.deletedSuccessfully') })
      setDeletingWorkspace(null)
      
      // If deleted current workspace, reload to switch to another
      if (deletingWorkspace.current) {
        location.assign(`${location.origin}${basePath}`)
      }
      else {
        await mutate()
      }
    }
    catch (error: any) {
      notify({ 
        type: 'error', 
        message: error?.message || t('common.actionMsg.deleteFailed') 
      })
    }
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-1 overflow-y-auto'>
        <div className='p-8'>
          <div className='mb-6'>
            <h3 className='text-xl font-semibold text-text-primary'>{t('common.workspace.manage')}</h3>
            <p className='mt-1 text-sm text-text-tertiary'>{t('common.workspace.manageDescription')}</p>
          </div>

          <div className='space-y-3'>
            {workspaces.length === 0 && (
              <div className='text-center py-8 text-text-tertiary'>
                No workspaces found. Loading...
              </div>
            )}
            {workspaces.map(workspace => (
              <div 
                key={workspace.id}
                className='flex items-center justify-between p-4 rounded-lg border border-divider-subtle bg-background-default hover:bg-background-default-hover'
              >
                <div className='flex items-center gap-3 flex-1 min-w-0'>
                  <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-components-icon-bg-blue-solid'>
                    <span className='text-lg font-semibold uppercase text-white'>
                      {workspace.name[0]}
                    </span>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2'>
                      <h4 className='text-sm font-medium text-text-primary truncate'>
                        {workspace.name}
                      </h4>
                      {workspace.current && (
                        <span className='px-2 py-0.5 text-xs font-medium rounded bg-state-accent-active text-text-accent'>
                          {t('common.workspace.current')}
                        </span>
                      )}
                    </div>
                    <p className='text-xs text-text-tertiary'>
                      {t('common.workspace.plan')}: {workspace.plan || 'Free'}
                    </p>
                  </div>
                </div>

                {workspace.current && isCurrentWorkspaceManager && (
                  <div className='flex items-center gap-2'>
                    <Button
                      size='small'
                      onClick={() => handleEditClick(workspace)}
                    >
                      <RiEditLine className='h-4 w-4 mr-1' />
                      {t('common.operation.rename')}
                    </Button>
                    <Button
                      size='small'
                      variant='secondary-destructive'
                      onClick={() => handleDeleteClick(workspace)}
                      disabled={workspaces.length <= 1}
                    >
                      <RiDeleteBinLine className='h-4 w-4 mr-1' />
                      {t('common.operation.delete')}
                    </Button>
                  </div>
                )}
                {!workspace.current && (
                  <div className='text-xs text-text-tertiary'>
                    {t('common.workspace.switchToManage')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rename Modal */}
      {editingWorkspace && (
        <Modal isShow onClose={() => setEditingWorkspace(null)} className='w-[480px]'>
          <div className='p-6'>
            <div className='mb-4 text-xl font-semibold text-text-primary'>
              {t('common.workspace.renameWorkspace')}
            </div>
            <div className='mb-4'>
              <div className='mb-2 text-sm font-medium text-text-primary'>
                {t('common.account.workspaceName')}
              </div>
              <Input
                value={workspaceName}
                placeholder={t('common.account.workspaceNamePlaceholder')}
                onChange={(e) => setWorkspaceName(e.target.value)}
                onClear={() => setWorkspaceName('')}
              />
            </div>
            <div className='flex justify-end gap-2'>
              <Button size='large' onClick={() => setEditingWorkspace(null)}>
                {t('common.operation.cancel')}
              </Button>
              <Button size='large' variant='primary' onClick={handleRename}>
                {t('common.operation.save')}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deletingWorkspace && (
        <Modal isShow onClose={() => setDeletingWorkspace(null)} className='w-[480px]'>
          <div className='p-6'>
            <div className='mb-4 text-xl font-semibold text-text-primary'>
              {t('common.workspace.deleteWorkspace')}
            </div>
            <div className='mb-4'>
              <div className='mb-2 text-sm text-text-secondary'>
                {t('common.workspace.deleteWarning')}
              </div>
              <div className='mb-3 rounded-lg bg-state-destructive-hover p-3 text-sm text-text-destructive'>
                <strong>{t('common.operation.warning')}:</strong> {t('common.workspace.deleteIsPermanent')}
              </div>
              <div className='mb-2 text-sm font-medium text-text-primary'>
                {t('common.workspace.typeWorkspaceNameToConfirm')}
              </div>
              <div className='mb-2 rounded bg-background-section-burn px-3 py-2 font-mono text-sm text-text-primary'>
                {deletingWorkspace.name}
              </div>
              <Input
                value={deleteConfirmName}
                placeholder={t('common.workspace.enterWorkspaceName')}
                onChange={(e) => setDeleteConfirmName(e.target.value)}
                onClear={() => setDeleteConfirmName('')}
              />
            </div>
            <div className='flex justify-end gap-2'>
              <Button size='large' onClick={() => setDeletingWorkspace(null)}>
                {t('common.operation.cancel')}
              </Button>
              <Button 
                size='large' 
                variant='primary-destructive' 
                onClick={handleDelete}
                disabled={deleteConfirmName !== deletingWorkspace.name}
              >
                {t('common.operation.delete')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
