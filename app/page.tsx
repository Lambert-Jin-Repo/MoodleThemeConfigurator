'use client';

import { useState } from 'react';
import Toolbar from '@/components/Toolbar';
import PanelLayout from '@/components/PanelLayout';
import ControlsPanel from '@/components/controls/ControlsPanel';
import PreviewPanel from '@/components/preview/PreviewPanel';
import AuditPanel from '@/components/audit/AuditPanel';
import ExportModal from '@/components/export/ExportModal';
import SaveLoadModal from '@/components/SaveLoadModal';
import Toast from '@/components/Toast';
import { useKeyboardShortcuts } from '@/lib/use-keyboard-shortcuts';

export default function Home() {
  const [exportOpen, setExportOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);

  useKeyboardShortcuts({
    onSave: () => setSaveOpen(true),
    onExport: () => setExportOpen(true),
  });

  return (
    <div className="h-screen flex flex-col">
      <Toolbar
        onSave={() => setSaveOpen(true)}
        onExport={() => setExportOpen(true)}
      />
      <div className="flex-1 overflow-hidden">
        <PanelLayout
          left={<ControlsPanel />}
          center={<PreviewPanel />}
          right={<AuditPanel />}
        />
      </div>
      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />
      <SaveLoadModal open={saveOpen} onClose={() => setSaveOpen(false)} />
      <Toast />
    </div>
  );
}
