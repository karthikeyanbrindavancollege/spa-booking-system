'use client'

import { useToast } from './Toast'

export function ToastDemo() {
  const { addToast } = useToast()

  return (
    <div className="fixed bottom-4 left-4 space-y-2 z-40">
      <button
        onClick={() => addToast('Success! Operation completed successfully.', 'success')}
        className="block px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
      >
        Test Success Toast
      </button>
      <button
        onClick={() => addToast('Error! Something went wrong.', 'error')}
        className="block px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
      >
        Test Error Toast
      </button>
      <button
        onClick={() => addToast('Warning! Please check your input.', 'warning')}
        className="block px-3 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
      >
        Test Warning Toast
      </button>
      <button
        onClick={() => addToast('Info: Here is some information.', 'info')}
        className="block px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
      >
        Test Info Toast
      </button>
    </div>
  )
}