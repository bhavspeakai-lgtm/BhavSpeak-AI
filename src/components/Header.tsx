import React from 'react';
import { useLearning } from '@/context/LearningContext';
import { useAuth } from '@/context/AuthContext';
import { ACCENTS } from '@/types/learning';
import { Zap, Flame, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onSettingsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  const { userProgress } = useLearning();
  const { user, logout } = useAuth();
  const currentAccent = ACCENTS.find((a) => a.id === userProgress.accent);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-3xl">🗣️</span>
            <span className="text-xl font-bold text-foreground">BhavSpeak AI</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4">
            {/* Accent flag */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary">
              <span className="text-lg">{currentAccent?.flag}</span>
              <span className="text-sm font-semibold text-secondary-foreground hidden sm:inline">
                {currentAccent?.name.split(' ')[0]}
              </span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10">
              <Flame className="w-5 h-5 text-accent" />
              <span className="text-sm font-bold text-accent">{userProgress.streak}</span>
            </div>

            {/* XP */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-primary">{userProgress.xp}</span>
            </div>

            {/* User Level */}
            {user?.pretestLevel && (
              <div className="px-3 py-1.5 rounded-full bg-primary/10">
                <span className="text-sm font-semibold text-primary">
                  Level {user.pretestLevel}
                </span>
              </div>
            )}

            {/* Logout */}
            {onSettingsClick && (
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="rounded-full"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
