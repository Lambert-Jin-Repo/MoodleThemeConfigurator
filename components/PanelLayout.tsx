'use client';

interface PanelLayoutProps {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
}

export default function PanelLayout({ left, center, right }: PanelLayoutProps) {
  return (
    <div className="flex h-full">
      {/* Left panel: Controls */}
      <div className="w-[320px] flex-shrink-0 overflow-hidden">
        {left}
      </div>

      {/* Centre panel: Preview */}
      <div className="flex-1 overflow-hidden" id="main-content">
        {center}
      </div>

      {/* Right panel: Audit */}
      <div className="w-[300px] flex-shrink-0 overflow-hidden">
        {right}
      </div>
    </div>
  );
}
