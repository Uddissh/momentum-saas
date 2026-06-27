import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Toaster } from 'react-hot-toast';

export function Layout() {
  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-x-hidden">
        <Outlet />
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#141428',
            color: '#f5f5fa',
            border: '1px solid #232348',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#21e695', secondary: '#050510' } },
          error: { iconTheme: { primary: '#ff4757', secondary: '#050510' } },
        }}
      />
    </div>
  );
}
