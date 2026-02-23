'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { Upload } from 'lucide-react';
import { useThemeStore } from '@/store/theme-store';
import { FONT_OPTIONS, LOGO_ACCENT_COLOURS } from '@/lib/tokens';
import { bestLogoAccentColour, isDarkBackground, contrastRatio } from '@/lib/accessibility';
import type { ThemeTokens } from '@/lib/tokens';
import PresetDropdown from './PresetDropdown';
import AccordionSection from './AccordionSection';
import type { AccordionSectionHandle } from './AccordionSection';
import ColourPicker from './ColourPicker';
import SliderControl from './SliderControl';
import SelectControl from './SelectControl';
import GradientToggle from './GradientToggle';
import ImageUploadControl from './ImageUploadControl';
import QuickPalette from './QuickPalette';
import BatchImportModal from './BatchImportModal';

function AdditiveHint() {
  return (
    <span className="inline-block text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 ml-1" title="This generates additive CSS beyond standard Moodle Boost. The SCSS will work but it's not a native Moodle setting.">
      Additive CSS
    </span>
  );
}

export default function ControlsPanel() {
  const tokens = useThemeStore((s) => s.tokens);
  const setToken = useThemeStore((s) => s.setToken);
  const setBrandPrimary = useThemeStore((s) => s.setBrandPrimary);
  const scrollToSectionRequest = useThemeStore((s) => s.scrollToSectionRequest);
  const clearScrollRequest = useThemeStore((s) => s.clearScrollRequest);

  const [batchImportOpen, setBatchImportOpen] = useState(false);

  const accordionRefs = useRef<Record<string, AccordionSectionHandle | null>>({});

  const setAccordionRef = useCallback(
    (sectionId: string) => (handle: AccordionSectionHandle | null) => {
      accordionRefs.current[sectionId] = handle;
    },
    []
  );

  // Respond to scroll-to-section requests from store
  useEffect(() => {
    if (!scrollToSectionRequest) return;
    const ref = accordionRefs.current[scrollToSectionRequest];
    if (ref) {
      ref.open();
      ref.scrollIntoView();
      // Highlight after scroll settles so user sees where to look
      setTimeout(() => ref.highlight(), 400);
    }
    clearScrollRequest();
  }, [scrollToSectionRequest, clearScrollRequest]);

  const set = (key: keyof ThemeTokens) => (value: string | number | boolean) => {
    setToken(key, value);
  };

  return (
    <div className="h-full overflow-y-auto bg-white border-r border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-800">Theme Controls</h2>
        <button
          onClick={() => setBatchImportOpen(true)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Import colors"
        >
          <Upload className="w-3.5 h-3.5" />
          Import
        </button>
      </div>

      <BatchImportModal open={batchImportOpen} onClose={() => setBatchImportOpen(false)} />

      {/* Preset Dropdown */}
      <PresetDropdown />

      {/* Quick Palette */}
      <QuickPalette />

      {/* 1. Brand Colour */}
      <AccordionSection title="Brand Colour" sectionId="brand-colour" defaultOpen ref={setAccordionRef('brand-colour')}>
        <ColourPicker
          label="Primary Brand Colour"
          value={tokens.brandPrimary}
          onChange={setBrandPrimary}
          showContrastOn={tokens.pageBg}
        />
      </AccordionSection>

      {/* 2. Logo */}
      <AccordionSection title="Logo" sectionId="logo" ref={setAccordionRef('logo')}>
        {/* Mini preview on current navbar background */}
        <div
          className="rounded-lg p-3 flex items-center justify-center"
          style={{ backgroundColor: tokens.navbarBg }}
        >
          <div className="flex items-center gap-1.5" style={{ lineHeight: 1.15 }}>
            <svg width={18} height={26} viewBox="0 0 20 29" fill="none" aria-hidden="true">
              <rect x="11" y="0" width="9" height="9" fill="#BAF73C" />
              <rect x="0" y="10" width="9" height="9" fill="#F27927" />
              <rect x="11" y="20" width="9" height="9" fill="#00BFFF" />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{
                color: tokens.navbarBg && bestLogoAccentColour(tokens.navbarBg) ? (isDarkBackground(tokens.navbarBg) ? '#F0EEEE' : '#404041') : '#404041',
                fontSize: '9px', fontWeight: 600, letterSpacing: '0.04em'
              }}>Centre for</span>
              <span style={{
                color: tokens.navbarBg && bestLogoAccentColour(tokens.navbarBg) ? (isDarkBackground(tokens.navbarBg) ? '#F0EEEE' : '#404041') : '#404041',
                fontSize: '11px', fontWeight: 800, letterSpacing: '0.02em'
              }}>Accessibility</span>
              <span style={{
                color: tokens.logoAustraliaColour === 'auto'
                  ? bestLogoAccentColour(tokens.navbarBg)
                  : tokens.logoAustraliaColour,
                fontSize: '6.5px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const
              }}>Australia</span>
            </div>
          </div>
        </div>

        {/* Colour options */}
        <div className="space-y-2 mt-3">
          <label className="block text-xs font-semibold text-gray-700">
            &quot;Australia&quot; Text Colour
          </label>
          <p className="text-xs text-gray-500 leading-relaxed">
            Choose an accent colour from the CFA Brand Style Guide. &quot;Centre for Accessibility&quot; automatically adapts to light/dark backgrounds.
          </p>

          {/* Auto button */}
          <button
            className={`w-full px-3 py-2 text-xs rounded-lg border transition-colors flex items-center justify-between ${
              tokens.logoAustraliaColour === 'auto'
                ? 'bg-blue-50 border-blue-400 text-blue-700 font-semibold'
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
            onClick={() => set('logoAustraliaColour')('auto')}
            title="Auto-detect best WCAG contrast colour for current navbar"
          >
            <span>Auto (WCAG best match)</span>
            {tokens.logoAustraliaColour === 'auto' && (
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block w-4 h-4 rounded border border-blue-300"
                  style={{ backgroundColor: bestLogoAccentColour(tokens.navbarBg) }}
                />
                <span className="font-mono">{bestLogoAccentColour(tokens.navbarBg)}</span>
              </span>
            )}
          </button>

          {/* Colour grid */}
          <div className="grid grid-cols-3 gap-2">
            {LOGO_ACCENT_COLOURS.map((c) => {
              const isSelected = tokens.logoAustraliaColour === c.hex;
              const ratio = contrastRatio(c.hex, tokens.navbarBg);
              const passesAA = ratio >= 3.0;
              return (
                <button
                  key={c.hex}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-gray-800 ring-2 ring-offset-1 ring-gray-400 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-400 bg-white'
                  }`}
                  onClick={() => set('logoAustraliaColour')(c.hex)}
                  title={`${c.name} ${c.hex} — ${ratio.toFixed(1)}:1 contrast`}
                  aria-label={`Set Australia colour to ${c.name}`}
                >
                  <span
                    className="w-5 h-5 rounded flex-shrink-0 border border-gray-300"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="flex flex-col">
                    <span className="text-xs font-medium text-gray-700 leading-tight">{c.name}</span>
                    <span className={`text-[10px] leading-tight ${passesAA ? 'text-green-600' : 'text-red-500'}`}>
                      {ratio.toFixed(1)}:1 {passesAA ? '✓' : '✗'}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </AccordionSection>

      {/* 3. Navbar */}
      <AccordionSection title="Navbar" sectionId="navbar" ref={setAccordionRef('navbar')}>
        <ColourPicker
          label="Navbar Background"
          value={tokens.navbarBg}
          onChange={(v) => set('navbarBg')(v)}
          tokenKey="navbarBg"
          linkedToBrand
        />
        <ColourPicker
          label="Navbar Text"
          value={tokens.navbarText}
          onChange={(v) => set('navbarText')(v)}
          showContrastOn={tokens.navbarBg}
        />
        <div>
          <div className="flex items-center mb-1">
            <span className="text-xs font-semibold text-gray-700">Nav Hover Background</span>
            <AdditiveHint />
          </div>
          <ColourPicker
            label=""
            value={tokens.navHoverBg}
            onChange={(v) => set('navHoverBg')(v)}
          />
        </div>
        <div>
          <div className="flex items-center mb-1">
            <span className="text-xs font-semibold text-gray-700">Nav Hover Text</span>
            <AdditiveHint />
          </div>
          <ColourPicker
            label=""
            value={tokens.navHoverText}
            onChange={(v) => set('navHoverText')(v)}
          />
        </div>
        <div>
          <div className="flex items-center mb-1">
            <span className="text-xs font-semibold text-gray-700">Nav Active Underline</span>
            <AdditiveHint />
          </div>
          <ColourPicker
            label=""
            value={tokens.navActiveUnderline}
            onChange={(v) => set('navActiveUnderline')(v)}
            tokenKey="navActiveUnderline"
            linkedToBrand
          />
        </div>
        <div>
          <div className="flex items-center mb-1">
            <span className="text-xs font-semibold text-gray-700">Navbar Border</span>
            <AdditiveHint />
          </div>
          <ColourPicker
            label=""
            value={tokens.navbarBorder === 'none' ? tokens.navbarBg : tokens.navbarBorder}
            onChange={(v) => set('navbarBorder')(v)}
          />
        </div>
      </AccordionSection>

      {/* 4. Edit Mode Toggle */}
      <AccordionSection title="Edit Mode Toggle" sectionId="edit-mode-toggle" ref={setAccordionRef('edit-mode-toggle')}>
        <ColourPicker
          label="Edit Mode ON Colour"
          value={tokens.editModeOnColour}
          onChange={(v) => set('editModeOnColour')(v)}
          showContrastOn={tokens.navbarBg}
          tokenKey="editModeOnColour"
          linkedToBrand
        />
        <div>
          <div className="flex items-center mb-1">
            <span className="text-xs font-semibold text-gray-700">Edit Mode Thumb Colour</span>
            <AdditiveHint />
          </div>
          <ColourPicker
            label=""
            value={tokens.editModeThumbColour}
            onChange={(v) => set('editModeThumbColour')(v)}
          />
        </div>
      </AccordionSection>

      {/* 5. Links & Focus */}
      <AccordionSection title="Links & Focus" sectionId="links-&-focus" ref={setAccordionRef('links-&-focus')}>
        <ColourPicker
          label="Link Colour"
          value={tokens.linkColour}
          onChange={(v) => set('linkColour')(v)}
          showContrastOn={tokens.pageBg}
          tokenKey="linkColour"
          linkedToBrand
        />
        <ColourPicker
          label="Link Hover Colour"
          value={tokens.linkHover}
          onChange={(v) => set('linkHover')(v)}
          showContrastOn={tokens.pageBg}
        />
        <ColourPicker
          label="Focus Ring Colour"
          value={tokens.focusRing}
          onChange={(v) => set('focusRing')(v)}
          showContrastOn={tokens.pageBg}
          tokenKey="focusRing"
          linkedToBrand
        />
        <SliderControl
          label="Focus Ring Width"
          value={tokens.focusRingWidth}
          onChange={(v) => set('focusRingWidth')(v)}
          min={1}
          max={4}
          step={1}
          unit="px"
        />
      </AccordionSection>

      {/* 6. Buttons */}
      <AccordionSection title="Buttons" sectionId="buttons" ref={setAccordionRef('buttons')}>
        <ColourPicker
          label="Button Primary BG"
          value={tokens.btnPrimaryBg}
          onChange={(v) => set('btnPrimaryBg')(v)}
          showContrastOn={tokens.btnPrimaryText}
          tokenKey="btnPrimaryBg"
          linkedToBrand
        />
        <ColourPicker
          label="Button Primary Text"
          value={tokens.btnPrimaryText}
          onChange={(v) => set('btnPrimaryText')(v)}
        />
        <ColourPicker
          label="Button Hover"
          value={tokens.btnPrimaryHover}
          onChange={(v) => set('btnPrimaryHover')(v)}
        />
        <SliderControl
          label="Button Radius"
          value={tokens.btnRadius}
          onChange={(v) => set('btnRadius')(v)}
          min={0}
          max={24}
          step={1}
          unit="px"
        />
      </AccordionSection>

      {/* 7. Content Area */}
      <AccordionSection title="Content Area" sectionId="content-area" ref={setAccordionRef('content-area')}>
        <ColourPicker
          label="Page Background"
          value={tokens.pageBg}
          onChange={(v) => set('pageBg')(v)}
        />
        <ColourPicker
          label="Card Background"
          value={tokens.cardBg}
          onChange={(v) => set('cardBg')(v)}
          showContrastOn={tokens.pageBg}
        />
        <ColourPicker
          label="Card Border"
          value={tokens.cardBorder}
          onChange={(v) => set('cardBorder')(v)}
        />
        <div>
          <div className="flex items-center mb-1">
            <span className="text-xs font-semibold text-gray-700">Breadcrumb Background</span>
            <AdditiveHint />
          </div>
          <ColourPicker
            label=""
            value={tokens.breadcrumbBg === 'transparent' ? '#FFFFFF' : tokens.breadcrumbBg}
            onChange={(v) => set('breadcrumbBg')(v)}
          />
        </div>
        <div>
          <div className="flex items-center mb-1">
            <span className="text-xs font-semibold text-gray-700">Section Accent</span>
            <AdditiveHint />
          </div>
          <ColourPicker
            label=""
            value={tokens.sectionAccent === 'none' ? '#FFFFFF' : tokens.sectionAccent}
            onChange={(v) => set('sectionAccent')(v)}
          />
        </div>
        <div className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded p-2 mt-1">
          <strong>Additive CSS</strong> controls generate valid SCSS that works on MoodleCloud, but target elements beyond standard Boost theme variables.
        </div>
        <SliderControl
          label="Content Max Width"
          value={tokens.contentMaxWidth}
          onChange={(v) => set('contentMaxWidth')(v)}
          min={600}
          max={1200}
          step={10}
          unit="px"
        />
      </AccordionSection>

      {/* 7.5 Background Images */}
      <AccordionSection title="Background Images" sectionId="background-images" ref={setAccordionRef('background-images')}>
        <ImageUploadControl
          label="Site Background"
          value={tokens.backgroundImage}
          onChange={(v) => set('backgroundImage')(v)}
          onClear={() => set('backgroundImage')('')}
          hint="Displays behind all pages except login (desktop only, matching Moodle's 768px+ breakpoint)"
        />
        <ImageUploadControl
          label="Login Page Background"
          value={tokens.loginBgImage}
          onChange={(v) => set('loginBgImage')(v)}
          onClear={() => set('loginBgImage')('')}
          hint="Displays behind the login card"
        />
      </AccordionSection>

      {/* 8. Login Page */}
      <AccordionSection title="Login Page" sectionId="login-page" ref={setAccordionRef('login-page')}>
        <ColourPicker
          label="Login Background"
          value={tokens.loginBg}
          onChange={(v) => set('loginBg')(v)}
        />
        <GradientToggle
          enabled={tokens.loginGradientEnabled}
          endColour={tokens.loginGradientEnd}
          onToggle={(v) => set('loginGradientEnabled')(v)}
          onEndColourChange={(v) => set('loginGradientEnd')(v)}
        />
        <ColourPicker
          label="Login Card Background"
          value={tokens.loginCardBg}
          onChange={(v) => set('loginCardBg')(v)}
        />
        <ColourPicker
          label="Login Heading"
          value={tokens.loginHeading}
          onChange={(v) => set('loginHeading')(v)}
          showContrastOn={tokens.loginCardBg}
        />
        <ColourPicker
          label="Login Button BG"
          value={tokens.loginBtnBg}
          onChange={(v) => set('loginBtnBg')(v)}
          showContrastOn={tokens.loginBtnText}
          tokenKey="loginBtnBg"
          linkedToBrand
        />
        <ColourPicker
          label="Login Button Text"
          value={tokens.loginBtnText}
          onChange={(v) => set('loginBtnText')(v)}
        />
        <ColourPicker
          label="Signup Button BG"
          value={tokens.signupBtnBg}
          onChange={(v) => set('signupBtnBg')(v)}
          showContrastOn={tokens.loginBg}
        />
        <SliderControl
          label="Input Radius"
          value={tokens.loginInputRadius}
          onChange={(v) => set('loginInputRadius')(v)}
          min={0}
          max={24}
          step={1}
          unit="px"
        />
      </AccordionSection>

      {/* 9. Footer */}
      <AccordionSection title="Footer" sectionId="footer" ref={setAccordionRef('footer')}>
        <ColourPicker
          label="Footer Background"
          value={tokens.footerBg}
          onChange={(v) => set('footerBg')(v)}
        />
        <ColourPicker
          label="Footer Text"
          value={tokens.footerText}
          onChange={(v) => set('footerText')(v)}
          showContrastOn={tokens.footerBg}
        />
        <ColourPicker
          label="Footer Link"
          value={tokens.footerLink}
          onChange={(v) => set('footerLink')(v)}
          showContrastOn={tokens.footerBg}
          tokenKey="footerLink"
          linkedToBrand
        />
        <div>
          <div className="flex items-center mb-1">
            <span className="text-xs font-semibold text-gray-700">Footer Accent (top border)</span>
            <AdditiveHint />
          </div>
          <ColourPicker
            label=""
            value={tokens.footerAccent === 'none' ? '#FFFFFF' : tokens.footerAccent}
            onChange={(v) => set('footerAccent')(v)}
          />
        </div>
      </AccordionSection>

      {/* 10. Typography */}
      <AccordionSection title="Typography" sectionId="typography" ref={setAccordionRef('typography')}>
        <SelectControl
          label="Font Family"
          value={`${tokens.fontFamily}||${tokens.fontWeight}`}
          onChange={(v) => {
            const [family, weight] = v.split('||');
            set('fontFamily')(family);
            set('fontWeight')(weight);
          }}
          options={FONT_OPTIONS.map((opt) => ({
            label: opt.label,
            value: `${opt.value}||${opt.weight}`,
          }))}
        />
        <SliderControl
          label="Base Font Size"
          value={tokens.bodyFontSize}
          onChange={(v) => set('bodyFontSize')(v)}
          min={0.75}
          max={1.25}
          step={0.0625}
          unit="rem"
        />
        <SliderControl
          label="Heading Scale"
          value={tokens.headingScale}
          onChange={(v) => set('headingScale')(v)}
          min={1.0}
          max={1.5}
          step={0.05}
        />
        <SliderControl
          label="Line Height"
          value={tokens.lineHeight}
          onChange={(v) => set('lineHeight')(v)}
          min={1.2}
          max={2.0}
          step={0.1}
        />
        <ColourPicker
          label="Heading Text"
          value={tokens.headingText}
          onChange={(v) => set('headingText')(v)}
          showContrastOn={tokens.pageBg}
        />
        <ColourPicker
          label="Body Text"
          value={tokens.bodyText}
          onChange={(v) => set('bodyText')(v)}
          showContrastOn={tokens.pageBg}
          tokenKey="bodyText"
        />
        <ColourPicker
          label="Muted Text"
          value={tokens.mutedText}
          onChange={(v) => set('mutedText')(v)}
          showContrastOn={tokens.pageBg}
        />
      </AccordionSection>

      {/* 11. Drawers */}
      <AccordionSection title="Drawers" sectionId="drawers" ref={setAccordionRef('drawers')}>
        <ColourPicker
          label="Drawer Background"
          value={tokens.drawerBg}
          onChange={(v) => set('drawerBg')(v)}
        />
        <ColourPicker
          label="Drawer Text"
          value={tokens.drawerText}
          onChange={(v) => set('drawerText')(v)}
        />
        <ColourPicker
          label="Drawer Border"
          value={tokens.drawerBorder}
          onChange={(v) => set('drawerBorder')(v)}
        />
      </AccordionSection>

      {/* 12. Secondary Navigation */}
      <AccordionSection title="Secondary Navigation" sectionId="secondary-nav" ref={setAccordionRef('secondary-nav')}>
        <ColourPicker
          label="Active Tab Colour"
          value={tokens.secondaryNavActive}
          onChange={(v) => set('secondaryNavActive')(v)}
          tokenKey="secondaryNavActive"
          linkedToBrand
        />
        <ColourPicker
          label="Tab Text Colour"
          value={tokens.secondaryNavText}
          onChange={(v) => set('secondaryNavText')(v)}
          showContrastOn={tokens.pageBg}
        />
      </AccordionSection>

      {/* 13. Alerts & Progress */}
      <AccordionSection title="Alerts & Progress" sectionId="alerts-&-progress" ref={setAccordionRef('alerts-&-progress')}>
        <ColourPicker
          label="Success"
          value={tokens.success}
          onChange={(v) => set('success')(v)}
        />
        <ColourPicker
          label="Warning"
          value={tokens.warning}
          onChange={(v) => set('warning')(v)}
        />
        <ColourPicker
          label="Error"
          value={tokens.error}
          onChange={(v) => set('error')(v)}
        />
        <ColourPicker
          label="Info"
          value={tokens.info}
          onChange={(v) => set('info')(v)}
          tokenKey="info"
          linkedToBrand
        />
        <ColourPicker
          label="Progress Fill"
          value={tokens.progressFill}
          onChange={(v) => set('progressFill')(v)}
          tokenKey="progressFill"
          linkedToBrand
        />
      </AccordionSection>
    </div>
  );
}
