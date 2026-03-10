import { ReactNode } from "react";
import { MainNav } from "./MainNav";
import { MainFooter } from "./MainFooter";
import { BottomNav } from "./BottomNav";
import { MobileHeader } from "./MobileHeader";

interface PublicLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  pageTitle?: string;
  showBackButton?: boolean;
}

export function PublicLayout({ 
  children, 
  showFooter = true, 
  pageTitle,
  showBackButton = false 
}: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <MainNav />
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileHeader title={pageTitle} showBack={showBackButton} />
      </div>
      
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      
      {showFooter && <div className="hidden md:block"><MainFooter /></div>}
      
      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
