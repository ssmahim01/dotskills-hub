'use client';

import React from 'react';
import { Bell, Moon, Sun, LogOut, User } from 'lucide-react';
import { Input } from '@/components/ui/input';

import { useTheme } from '@/lib/providers/ThemeProvider';
import { useAuth } from '@/lib/hooks/useAuth';

export interface NavbarProps {
  onLogout?: () => void;
}

export function Navbar({ onLogout }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  // const userMenuItems: DropdownItem[] = [
  //   {
  //     label: 'Profile',
  //     icon: <User className="w-4 h-4" />,
  //     onClick: () => console.log('Profile clicked'),
  //   },
  //   {
  //     label: 'Logout',
  //     icon: <LogOut className="w-4 h-4" />,
  //     onClick: onLogout || (() => {}),
  //     variant: 'danger',
  //   },
  // ];

  return (
    <nav className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Left: Search */}
      <div className="flex-1 max-w-md">
        <Input
          placeholder="Search..."
          className="bg-muted/50"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-border" />

        {/* User Menu */}
        {/* <Dropdown
          trigger={
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-accent transition-all cursor-pointer">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                {user?.name.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="hidden sm:block text-sm">
                <p className="font-medium text-foreground">{user?.name || 'Admin'}</p>
                <p className="text-xs text-muted-foreground">{user?.role === 'super-admin' ? 'Super Admin' : 'Store Owner'}</p>
              </div>
            </div>
          }
          items={userMenuItems}
          align="right"
        /> */}
      </div>
    </nav>
  );
}
