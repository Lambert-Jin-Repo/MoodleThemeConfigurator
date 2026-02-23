'use client';

import { useState } from 'react';
import Toolbar from '@/components/Toolbar';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import MobileTabBar from '@/components/MobileTabBar';
import ControlsPanel from '@/components/controls/ControlsPanel';
import PreviewPanel from '@/components/preview/PreviewPanel';
import AuditPanel from '@/components/audit/AuditPanel';
import ExportModal from '@/components/export/ExportModal';
import SaveLoadModal from '@/components/SaveLoadModal';
import Toast from '@/components/Toast';
import { useKeyboardShortcuts } from '@/lib/use-keyboard-shortcuts';

export default function Home() {
  const [exportOpen, setExportOpen] = useState(false);
  const [exportInitialTab, setExportInitialTab] = useState<'export' | 'import'>('export');
  const [saveOpen, setSaveOpen] = useState(false);

  const openExport = () => { setExportInitialTab('export'); setExportOpen(true); };
  const openImport = () => { setExportInitialTab('import'); setExportOpen(true); };

  useKeyboardShortcuts({
    onSave: () => setSaveOpen(true),
    onExport: openExport,
  });

  return (
    <div className="h-screen flex flex-col">
      <Toolbar
        onSave={() => setSaveOpen(true)}
        onExport={openExport}
        onImport={openImport}
      />
      <div className="flex-1 overflow-hidden">
        <ResponsiveLayout
          controls={<ControlsPanel />}
          preview={<PreviewPanel />}
          audit={<AuditPanel />}
        />
      </div>
      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} initialTab={exportInitialTab} />
      <SaveLoadModal open={saveOpen} onClose={() => setSaveOpen(false)} />
      <Toast />
      <MobileTabBar />
    </div>
  );
}
