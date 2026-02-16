'use client';

import { useThemeStore } from '@/store/theme-store';
import { FONT_OPTIONS, LOGO_ACCENT_COLOURS } from '@/lib/tokens';
import { bestLogoAccentColour, isDarkBackground, contrastRatio } from '@/lib/accessibility';
import type { ThemeTokens } from '@/lib/tokens';
import PresetSelector from './PresetSelector';
import AccordionSection from './AccordionSection';
import ColourPicker from './ColourPicker';
import SliderControl from './SliderControl';
import SelectControl from './SelectControl';
import GradientToggle from './GradientToggle';
import ImageUploadControl from './ImageUploadControl';

export default function ControlsPanel() {
  const tokens = useThemeStore((s) => s.tokens);
  const isCustomMode = useThemeStore((s) => s.isCustomMode);
  const setToken = useThemeStore((s) => s.setToken);
  const setBrandPrimary = useThemeStore((s) => s.setBrandPrimary);
  const switchToCustom = useThemeStore((s) => s.switchToCustom);

  const locked = !isCustomMode;

  const set = (key: keyof ThemeTokens) => (value: string | number | boolean) => {
    setToken(key, value);
  };

  return (
    <div className="h-full overflow-y-auto bg-white border-r border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-bold text-gray-800">Theme Controls</h2>
        {locked && (
          <button
            className="mt-1 text-xs text-blue-600 hover:underline"
            onClick={switchToCustom}
          >
            Customise current preset
          </button>
        )}
      </div>

      {/* 1. Presets */}
      <AccordionSection title="Presets" defaultOpen>
        <PresetSelector />
      </AccordionSection>

      {/* 2. Brand Colour */}
      <AccordionSection title="Brand Colour" defaultOpen>
        <ColourPicker
          label="Primary Brand Colour"
          value={tokens.brandPrimary}
          onChange={setBrandPrimary}
          disabled={locked}
          showContrastOn="#FFFFFF"
        />
      </AccordionSection>

      {/* 2.5 Logo */}
      <AccordionSection title="Logo">
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
            disabled={locked}
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
                  disabled={locked}
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
      <AccordionSection title="Navbar">
        <ColourPicker
          label="Navbar Background"
          value={tokens.navbarBg}
          onChange={(v) => set('navbarBg')(v)}
          disabled={locked}
        />
        <ColourPicker
          label="Navbar Text"
          value={tokens.navbarText}
          onChange={(v) => set('navbarText')(v)}
          disabled={locked}
          showContrastOn={tokens.navbarBg}
        />
        <ColourPicker
          label="Nav Hover Background"
          value={tokens.navHoverBg}
          onChange={(v) => set('navHoverBg')(v)}
          disabled={locked}
        />
      </AccordionSection>

      {/* 4. Edit Mode Toggle */}
      <AccordionSection title="Edit Mode Toggle">
        <ColourPicker
          label="Edit Mode ON Colour"
          value={tokens.editModeOnColour}
          onChange={(v) => set('editModeOnColour')(v)}
          disabled={locked}
          showContrastOn={tokens.navbarBg}
        />
        <ColourPicker
          label="Edit Mode Thumb Colour"
          value={tokens.editModeThumbColour}
          onChange={(v) => set('editModeThumbColour')(v)}
          disabled={locked}
        />
      </AccordionSection>

      {/* 5. Links & Focus */}
      <AccordionSection title="Links & Focus">
        <ColourPicker
          label="Link Colour"
          value={tokens.linkColour}
          onChange={(v) => set('linkColour')(v)}
          disabled={locked}
          showContrastOn="#FFFFFF"
          tokenKey="linkColour"
        />
        <ColourPicker
          label="Focus Ring Colour"
          value={tokens.focusRing}
          onChange={(v) => set('focusRing')(v)}
          disabled={locked}
        />
        <SliderControl
          label="Focus Ring Width"
          value={tokens.focusRingWidth}
          onChange={(v) => set('focusRingWidth')(v)}
          min={1}
          max={4}
          step={1}
          unit="px"
          disabled={locked}
        />
      </AccordionSection>

      {/* 6. Buttons */}
      <AccordionSection title="Buttons">
        <ColourPicker
          label="Button Primary BG"
          value={tokens.btnPrimaryBg}
          onChange={(v) => set('btnPrimaryBg')(v)}
          disabled={locked}
          showContrastOn={tokens.btnPrimaryText}
        />
        <ColourPicker
          label="Button Primary Text"
          value={tokens.btnPrimaryText}
          onChange={(v) => set('btnPrimaryText')(v)}
          disabled={locked}
        />
        <ColourPicker
          label="Button Hover"
          value={tokens.btnPrimaryHover}
          onChange={(v) => set('btnPrimaryHover')(v)}
          disabled={locked}
        />
        <SliderControl
          label="Button Radius"
          value={tokens.btnRadius}
          onChange={(v) => set('btnRadius')(v)}
          min={0}
          max={24}
          step={1}
          unit="px"
          disabled={locked}
        />
      </AccordionSection>

      {/* 7. Content Area */}
      <AccordionSection title="Content Area">
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          Page background is locked to #FFFFFF. Moodle Boost has dozens of elements that default to white — tinted backgrounds create inconsistent artefacts.
        </div>
        <ColourPicker
          label="Card Background"
          value={tokens.cardBg}
          onChange={(v) => set('cardBg')(v)}
          disabled={locked}
        />
        <ColourPicker
          label="Card Border"
          value={tokens.cardBorder}
          onChange={(v) => set('cardBorder')(v)}
          disabled={locked}
        />
        <ColourPicker
          label="Breadcrumb Background"
          value={tokens.breadcrumbBg === 'transparent' ? '#FFFFFF' : tokens.breadcrumbBg}
          onChange={(v) => set('breadcrumbBg')(v)}
          disabled={locked}
        />
        <ColourPicker
          label="Section Accent"
          value={tokens.sectionAccent === 'none' ? '#FFFFFF' : tokens.sectionAccent}
          onChange={(v) => set('sectionAccent')(v)}
          disabled={locked}
        />
        <SliderControl
          label="Content Max Width"
          value={tokens.contentMaxWidth}
          onChange={(v) => set('contentMaxWidth')(v)}
          min={600}
          max={1200}
          step={10}
          unit="px"
          disabled={locked}
        />
      </AccordionSection>

      {/* 7.5 Background Images */}
      <AccordionSection title="Background Images">
        <ImageUploadControl
          label="Site Background"
          value={tokens.backgroundImage}
          onChange={(v) => set('backgroundImage')(v)}
          onClear={() => set('backgroundImage')('')}
          disabled={locked}
          hint="Displays behind all pages except login (desktop only, matching Moodle's 768px+ breakpoint)"
        />
        <ImageUploadControl
          label="Login Page Background"
          value={tokens.loginBgImage}
          onChange={(v) => set('loginBgImage')(v)}
          onClear={() => set('loginBgImage')('')}
          disabled={locked}
          hint="Displays behind the login card"
        />
      </AccordionSection>

      {/* 8. Login Page */}
      <AccordionSection title="Login Page">
        <ColourPicker
          label="Login Background"
          value={tokens.loginBg}
          onChange={(v) => set('loginBg')(v)}
          disabled={locked}
        />
        <GradientToggle
          enabled={tokens.loginGradientEnabled}
          endColour={tokens.loginGradientEnd}
          onToggle={(v) => set('loginGradientEnabled')(v)}
          onEndColourChange={(v) => set('loginGradientEnd')(v)}
          disabled={locked}
        />
        <ColourPicker
          label="Login Card Background"
          value={tokens.loginCardBg}
          onChange={(v) => set('loginCardBg')(v)}
          disabled={locked}
        />
        <ColourPicker
          label="Login Heading"
          value={tokens.loginHeading}
          onChange={(v) => set('loginHeading')(v)}
          disabled={locked}
          showContrastOn={tokens.loginCardBg}
        />
        <ColourPicker
          label="Login Button BG"
          value={tokens.loginBtnBg}
          onChange={(v) => set('loginBtnBg')(v)}
          disabled={locked}
          showContrastOn={tokens.loginBtnText}
        />
        <ColourPicker
          label="Login Button Text"
          value={tokens.loginBtnText}
          onChange={(v) => set('loginBtnText')(v)}
          disabled={locked}
        />
        <SliderControl
          label="Input Radius"
          value={tokens.loginInputRadius}
          onChange={(v) => set('loginInputRadius')(v)}
          min={0}
          max={24}
          step={1}
          unit="px"
          disabled={locked}
        />
      </AccordionSection>

      {/* 9. Footer */}
      <AccordionSection title="Footer">
        <ColourPicker
          label="Footer Background"
          value={tokens.footerBg}
          onChange={(v) => set('footerBg')(v)}
          disabled={locked}
        />
        <ColourPicker
          label="Footer Text"
          value={tokens.footerText}
          onChange={(v) => set('footerText')(v)}
          disabled={locked}
          showContrastOn={tokens.footerBg}
        />
        <ColourPicker
          label="Footer Link"
          value={tokens.footerLink}
          onChange={(v) => set('footerLink')(v)}
          disabled={locked}
          showContrastOn={tokens.footerBg}
        />
        <ColourPicker
          label="Footer Accent (top border)"
          value={tokens.footerAccent === 'none' ? '#FFFFFF' : tokens.footerAccent}
          onChange={(v) => set('footerAccent')(v)}
          disabled={locked}
        />
      </AccordionSection>

      {/* 10. Typography */}
      <AccordionSection title="Typography">
        <SelectControl
          label="Font Family"
          value={tokens.fontFamily}
          onChange={(v) => set('fontFamily')(v)}
          options={FONT_OPTIONS}
          disabled={locked}
        />
        <SliderControl
          label="Base Font Size"
          value={tokens.bodyFontSize}
          onChange={(v) => set('bodyFontSize')(v)}
          min={0.75}
          max={1.25}
          step={0.0625}
          unit="rem"
          disabled={locked}
        />
        <SliderControl
          label="Heading Scale"
          value={tokens.headingScale}
          onChange={(v) => set('headingScale')(v)}
          min={1.0}
          max={1.5}
          step={0.05}
          disabled={locked}
        />
        <SliderControl
          label="Line Height"
          value={tokens.lineHeight}
          onChange={(v) => set('lineHeight')(v)}
          min={1.2}
          max={2.0}
          step={0.1}
          disabled={locked}
        />
        <ColourPicker
          label="Heading Text"
          value={tokens.headingText}
          onChange={(v) => set('headingText')(v)}
          disabled={locked}
          showContrastOn="#FFFFFF"
        />
        <ColourPicker
          label="Body Text"
          value={tokens.bodyText}
          onChange={(v) => set('bodyText')(v)}
          disabled={locked}
          showContrastOn="#FFFFFF"
          tokenKey="bodyText"
        />
        <ColourPicker
          label="Muted Text"
          value={tokens.mutedText}
          onChange={(v) => set('mutedText')(v)}
          disabled={locked}
          showContrastOn="#FFFFFF"
        />
      </AccordionSection>

      {/* 11. Drawers */}
      <AccordionSection title="Drawers">
        <ColourPicker
          label="Drawer Background"
          value={tokens.drawerBg}
          onChange={(v) => set('drawerBg')(v)}
          disabled={locked}
        />
        <ColourPicker
          label="Drawer Text"
          value={tokens.drawerText}
          onChange={(v) => set('drawerText')(v)}
          disabled={locked}
        />
        <ColourPicker
          label="Drawer Border"
          value={tokens.drawerBorder}
          onChange={(v) => set('drawerBorder')(v)}
          disabled={locked}
        />
      </AccordionSection>

      {/* 12. Alerts & Progress */}
      <AccordionSection title="Alerts & Progress">
        <ColourPicker
          label="Success"
          value={tokens.success}
          onChange={(v) => set('success')(v)}
          disabled={locked}
        />
        <ColourPicker
          label="Warning"
          value={tokens.warning}
          onChange={(v) => set('warning')(v)}
          disabled={locked}
        />
        <ColourPicker
          label="Error"
          value={tokens.error}
          onChange={(v) => set('error')(v)}
          disabled={locked}
        />
        <ColourPicker
          label="Info"
          value={tokens.info}
          onChange={(v) => set('info')(v)}
          disabled={locked}
        />
        <ColourPicker
          label="Progress Fill"
          value={tokens.progressFill}
          onChange={(v) => set('progressFill')(v)}
          disabled={locked}
        />
      </AccordionSection>
    </div>
  );
}
