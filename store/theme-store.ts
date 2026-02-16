// ── Zustand Theme Store with zundo (undo/redo) ──

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
import { nanoid } from 'nanoid';
import {
  ThemeTokens,
  DEFAULT_TOKENS,
  BRAND_LINKED_KEYS,
  PRESET_TEMPLATES,
  PreviewPage,
  Viewport,
  SavedConfig,
  darkenHex,
  autoTextColour,
} from '@/lib/tokens';

interface ThemeState {
  tokens: ThemeTokens;
  activePresetId: string | null;
  isCustomMode: boolean;
  activePage: PreviewPage;
  viewport: Viewport;
  zoom: number;
  savedConfigs: SavedConfig[];
  activeControlSection: string | null;

  setToken: (key: keyof ThemeTokens, value: string | number | boolean) => void;
  setBrandPrimary: (value: string) => void;
  applyPreset: (presetId: string) => void;
  switchToCustom: () => void;
  reset: () => void;
  setActivePage: (page: PreviewPage) => void;
  setZoom: (zoom: number) => void;
  setActiveControlSection: (section: string | null) => void;
  saveConfig: (name: string, score: number) => void;
  loadConfig: (id: string) => void;
  deleteConfig: (id: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  temporal(
    persist(
      (set, get) => ({
        tokens: { ...DEFAULT_TOKENS },
        activePresetId: null,
        isCustomMode: false,
        activePage: 'dashboard' as PreviewPage,
        viewport: 'desktop' as Viewport,
        zoom: 125,
        savedConfigs: [] as SavedConfig[],
        activeControlSection: null as string | null,

        setToken: (key, value) => {
          set((state) => {
            const newTokens = { ...state.tokens, [key]: value };
            if (key === 'navbarBg' && typeof value === 'string') {
              newTokens.navbarText = autoTextColour(value);
            }
            if (key === 'footerBg' && typeof value === 'string') {
              newTokens.footerText = autoTextColour(value);
            }
            return {
              tokens: newTokens,
              isCustomMode: true,
              activePresetId: null,
            };
          });
        },

        setBrandPrimary: (value: string) => {
          set((state) => {
            const oldBrand = state.tokens.brandPrimary;
            const newTokens = { ...state.tokens, brandPrimary: value };
            for (const key of BRAND_LINKED_KEYS) {
              const currentVal = state.tokens[key];
              if (typeof currentVal === 'string' && currentVal.toUpperCase() === oldBrand.toUpperCase()) {
                (newTokens as Record<string, string | number | boolean>)[key] = value;
              }
            }
            if (state.tokens.navbarBg.toUpperCase() === oldBrand.toUpperCase()) {
              newTokens.navbarBg = value;
              newTokens.navbarText = autoTextColour(value);
            }
            newTokens.btnPrimaryHover = darkenHex(newTokens.btnPrimaryBg, 15);
            newTokens.linkHover = darkenHex(newTokens.linkColour, 20);
            if (state.tokens.editModeOnColour.toUpperCase() === oldBrand.toUpperCase()) {
              newTokens.editModeOnColour = value;
            }
            return {
              tokens: newTokens,
              isCustomMode: true,
              activePresetId: null,
            };
          });
        },

        applyPreset: (presetId: string) => {
          const preset = PRESET_TEMPLATES.find(p => p.id === presetId);
          if (!preset) return;
          set({
            tokens: { ...DEFAULT_TOKENS, ...preset.overrides },
            activePresetId: presetId,
            isCustomMode: false,
          });
        },

        switchToCustom: () => {
          set({ isCustomMode: true, activePresetId: null });
        },

        reset: () => {
          set({
            tokens: { ...DEFAULT_TOKENS },
            activePresetId: null,
            isCustomMode: false,
          });
        },

        setActivePage: (page) => set({ activePage: page }),
        setZoom: (zoom) => set({ zoom }),
        setActiveControlSection: (section) => set({ activeControlSection: section }),

        saveConfig: (name, score) => {
          const config: SavedConfig = {
            id: nanoid(8),
            name,
            tokens: { ...get().tokens },
            score,
            timestamp: Date.now(),
          };
          set((state) => ({
            savedConfigs: [...state.savedConfigs, config],
          }));
        },

        loadConfig: (id) => {
          const config = get().savedConfigs.find(c => c.id === id);
          if (config) {
            set({
              tokens: { ...config.tokens },
              activePresetId: null,
              isCustomMode: true,
            });
          }
        },

        deleteConfig: (id) => {
          set((state) => ({
            savedConfigs: state.savedConfigs.filter(c => c.id !== id),
          }));
        },
      }),
      {
        name: 'cfa-theme-store',
        partialize: (state) => {
          // Strip large base64 image data from localStorage to avoid quota issues
          const { backgroundImage, loginBgImage, ...safeTokens } = state.tokens;
          return {
            tokens: { ...safeTokens, backgroundImage: backgroundImage ? '[session]' : '', loginBgImage: loginBgImage ? '[session]' : '' } as ThemeTokens,
            savedConfigs: state.savedConfigs,
            activePresetId: state.activePresetId,
            isCustomMode: state.isCustomMode,
          };
        },
        merge: (persistedState, currentState) => {
          const persisted = persistedState as Partial<ThemeState>;
          return {
            ...currentState,
            ...persisted,
            // Deep-merge tokens so newly-added keys keep their defaults
            tokens: { ...currentState.tokens, ...(persisted.tokens || {}) },
          };
        },
        onRehydrateStorage: () => (state) => {
          if (state) {
            // Clear session markers on load — images don't survive refresh
            if (state.tokens.backgroundImage === '[session]') state.tokens.backgroundImage = '';
            if (state.tokens.loginBgImage === '[session]') state.tokens.loginBgImage = '';
          }
        },
      }
    ),
    {
      limit: 50,
      partialize: (state) => {
        // Don't store large base64 in undo history
        const { backgroundImage, loginBgImage, ...rest } = state.tokens;
        return { tokens: { ...rest, backgroundImage: backgroundImage ? '1' : '', loginBgImage: loginBgImage ? '1' : '' } as ThemeTokens };
      },
    }
  )
);
