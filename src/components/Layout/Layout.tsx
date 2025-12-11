import type { ReactNode } from 'react';
import Navbar from './Navbar';
import { useTheme } from '../../hooks/useTheme';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Apply theme to document root
  useTheme();
  
  return (
    <div className="min-h-screen theme-transition" style={{ 
      backgroundColor: 'var(--bg-secondary)' 
    }}>
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
