'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ConfirmDialogContextType {
  confirm: (message: string, title?: string) => Promise<boolean>
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined)

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    resolve: (value: boolean) => void
  } | null>(null)

  const confirm = (message: string, title = 'Confirm Action') => {
    return new Promise<boolean>((resolve) => {
      setDialog({
        isOpen: true,
        title,
        message,
        resolve,
      })
    })
  }

  const handleConfirm = () => {
    if (dialog) {
      dialog.resolve(true)
      setDialog(null)
    }
  }

  const handleCancel = () => {
    if (dialog) {
      dialog.resolve(false)
      setDialog(null)
    }
  }

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}
      {dialog?.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {dialog.title}
            </h3>
            <p className="text-gray-600 mb-6">
              {dialog.message}
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmDialogContext.Provider>
  )
}

export function useConfirm() {
  const context = useContext(ConfirmDialogContext)
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmDialogProvider')
  }
  return context
}