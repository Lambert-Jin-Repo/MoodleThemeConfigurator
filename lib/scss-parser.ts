// ── SCSS Parser — Reverse of scss-generator.ts ──
// Parses SCSS text (variables + CSS rule overrides) back into Partial<ThemeTokens>.
// Handles both raw SCSS blocks and the combined .txt download format.

import type { ThemeTokens } from './tokens';

// ── Helpers ──

/** Strip !important and extra whitespace from a CSS value */
function clean(val: string): string {
  return val.replace(/!important/gi, '').trim();
}

/** Extract a hex colour (#xxx or #xxxxxx) from a string, or return the cleaned string */
function extractHex(val: string): string {
  const cleaned = clean(val);
  const match = cleaned.match(/#[0-9a-fA-F]{3,8}/);
  return match ? match[0] : cleaned;
}

/** Parse a numeric value from a string, stripping unit suffixes like rem, px, em */
function parseNumericValue(val: string, unit: string): number | null {
  const cleaned = clean(val);
  const re = new RegExp(`([\\d.]+)\\s*${unit}?`);
  const match = cleaned.match(re);
  if (match) {
    const num = parseFloat(match[1]);
    return isNaN(num) ? null : num;
  }
  return null;
}

/** Extract a colour value from a CSS property declaration within a block */
function extractPropertyValue(block: string, property: string): string | null {
  // Match "property: value" — value ends at ; or } or newline
  const escaped = property.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const re = new RegExp(`${escaped}\\s*:\\s*([^;}]+)`, 'i');
  const match = block.match(re);
  return match ? clean(match[1]) : null;
}

// ── SCSS Variable Parsing (Block 1) ──

/** Map of SCSS variable names to ThemeTokens keys and their parse type */
const VARIABLE_MAP: Array<{
  scssVar: string;
  tokenKey: keyof ThemeTokens;
  type: 'hex' | 'rem' | 'px' | 'number' | 'string';
}> = [
  { scssVar: 'primary', tokenKey: 'brandPrimary', type: 'hex' },
  { scssVar: 'link-color', tokenKey: 'linkColour', type: 'hex' },
  { scssVar: 'body-bg', tokenKey: 'pageBg', type: 'hex' },
  { scssVar: 'card-bg', tokenKey: 'cardBg', type: 'hex' },
  { scssVar: 'font-size-base', tokenKey: 'bodyFontSize', type: 'rem' },
  { scssVar: 'line-height-base', tokenKey: 'lineHeight', type: 'number' },
  { scssVar: 'success', tokenKey: 'success', type: 'hex' },
  { scssVar: 'warning', tokenKey: 'warning', type: 'hex' },
  { scssVar: 'danger', tokenKey: 'error', type: 'hex' },
  { scssVar: 'info', tokenKey: 'info', type: 'hex' },
  { scssVar: 'btn-border-radius', tokenKey: 'btnRadius', type: 'px' },
  { scssVar: 'input-border-radius', tokenKey: 'loginInputRadius', type: 'px' },
  { scssVar: 'font-family-sans-serif', tokenKey: 'fontFamily', type: 'string' },
];

function parseScssVariables(scss: string, tokens: Partial<ThemeTokens>): void {
  for (const { scssVar, tokenKey, type } of VARIABLE_MAP) {
    // Match $variable-name: value; (value may contain commas, quotes, etc.)
    const escaped = scssVar.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const re = new RegExp(`\\$${escaped}\\s*:\\s*(.+?)\\s*;`, 'i');
    const match = scss.match(re);
    if (!match) continue;

    const rawValue = match[1].trim();

    switch (type) {
      case 'hex':
        (tokens as Record<string, unknown>)[tokenKey] = extractHex(rawValue);
        break;
      case 'rem': {
        const num = parseNumericValue(rawValue, 'rem');
        if (num !== null) (tokens as Record<string, unknown>)[tokenKey] = num;
        break;
      }
      case 'px': {
        const num = parseNumericValue(rawValue, 'px');
        if (num !== null) (tokens as Record<string, unknown>)[tokenKey] = num;
        break;
      }
      case 'number': {
        const num = parseFloat(rawValue);
        if (!isNaN(num)) (tokens as Record<string, unknown>)[tokenKey] = num;
        break;
      }
      case 'string':
        // Strip trailing semicolons (already stripped by regex) and outer whitespace
        (tokens as Record<string, unknown>)[tokenKey] = rawValue;
        break;
    }
  }
}

// ── CSS Rule Parsing (Block 2) ──

/**
 * Find a CSS rule block by selector. Handles nested braces.
 * Returns the content between the outermost { } for the matched selector.
 */
function findRuleBlock(scss: string, selectorPattern: string): string | null {
  const re = new RegExp(selectorPattern + '\\s*\\{', 'i');
  const match = re.exec(scss);
  if (!match) return null;

  // Find matching closing brace, accounting for nesting
  let depth = 0;
  const start = match.index + match[0].length;
  for (let i = start; i < scss.length; i++) {
    if (scss[i] === '{') depth++;
    if (scss[i] === '}') {
      if (depth === 0) {
        return scss.substring(start, i);
      }
      depth--;
    }
  }
  return null;
}

/**
 * Find ALL occurrences of a CSS rule block by selector.
 * Returns an array of content strings between { }.
 */
function findAllRuleBlocks(scss: string, selectorPattern: string): string[] {
  const results: string[] = [];
  const re = new RegExp(selectorPattern + '\\s*\\{', 'gi');
  let match: RegExpExecArray | null;

  while ((match = re.exec(scss)) !== null) {
    let depth = 0;
    const start = match.index + match[0].length;
    for (let i = start; i < scss.length; i++) {
      if (scss[i] === '{') depth++;
      if (scss[i] === '}') {
        if (depth === 0) {
          results.push(scss.substring(start, i));
          break;
        }
        depth--;
      }
    }
  }
  return results;
}

function parseCssRules(scss: string, tokens: Partial<ThemeTokens>): void {
  // Pre-process: strip !important globally for simpler matching
  const cleaned = scss.replace(/!important/gi, '');

  // --- Navbar background ---
  const navbarFixedBlock = findRuleBlock(cleaned, '\\.navbar\\.fixed-top');
  if (navbarFixedBlock) {
    const bg = extractPropertyValue(navbarFixedBlock, 'background-color');
    if (bg) tokens.navbarBg = extractHex(bg);

    // Border-bottom colour → navbarBorder
    const borderBottom = extractPropertyValue(navbarFixedBlock, 'border-bottom');
    if (borderBottom) {
      const borderHex = extractHex(borderBottom);
      if (borderHex !== borderBottom || borderHex.startsWith('#')) {
        tokens.navbarBorder = borderHex;
      }
    }
  }

  // --- Navbar text colour (first .navbar { color: X } rule) ---
  // Use the raw (non-cleaned) scss here but still strip !important from value
  const navbarBlocks = findAllRuleBlocks(cleaned, '\\.navbar(?![.\\w#-])');
  for (const block of navbarBlocks) {
    const color = extractPropertyValue(block, 'color');
    if (color) {
      tokens.navbarText = extractHex(color);
      break; // Take the first match
    }
  }

  // --- Nav active underline ---
  const navActiveBlock = findRuleBlock(
    cleaned,
    '\\.navbar\\s+\\.primary-navigation\\s+\\.nav-link\\.active'
  );
  if (navActiveBlock) {
    const borderBottom = extractPropertyValue(navActiveBlock, 'border-bottom');
    if (borderBottom) {
      tokens.navActiveUnderline = extractHex(borderBottom);
    }
    const borderBottomColor = extractPropertyValue(navActiveBlock, 'border-bottom-color');
    if (borderBottomColor) {
      tokens.navActiveUnderline = extractHex(borderBottomColor);
    }
  }

  // --- Nav hover ---
  const navHoverBlock = findRuleBlock(
    cleaned,
    '\\.navbar\\s+\\.primary-navigation\\s+\\.nav-link:hover'
  );
  if (navHoverBlock) {
    const bg = extractPropertyValue(navHoverBlock, 'background-color');
    if (bg) tokens.navHoverBg = bg.trim();
    const color = extractPropertyValue(navHoverBlock, 'color');
    if (color) tokens.navHoverText = extractHex(color);
  }

  // --- Buttons ---
  const btnPrimaryBlock = findRuleBlock(cleaned, '\\.btn-primary(?!:)');
  if (btnPrimaryBlock) {
    const bg = extractPropertyValue(btnPrimaryBlock, 'background-color');
    if (bg) tokens.btnPrimaryBg = extractHex(bg);
    const color = extractPropertyValue(btnPrimaryBlock, 'color');
    if (color) tokens.btnPrimaryText = extractHex(color);
  }

  const btnPrimaryHoverBlock = findRuleBlock(cleaned, '\\.btn-primary:hover');
  if (btnPrimaryHoverBlock) {
    const bg = extractPropertyValue(btnPrimaryHoverBlock, 'background-color');
    if (bg) tokens.btnPrimaryHover = extractHex(bg);
  }

  // --- Footer ---
  const footerBlock = findRuleBlock(cleaned, '#page-footer(?!\\s+a)');
  if (footerBlock) {
    const bg = extractPropertyValue(footerBlock, 'background-color');
    if (bg) tokens.footerBg = extractHex(bg);
    const color = extractPropertyValue(footerBlock, 'color');
    if (color) tokens.footerText = extractHex(color);
    const borderTop = extractPropertyValue(footerBlock, 'border-top');
    if (borderTop) {
      tokens.footerAccent = extractHex(borderTop);
    }
  }

  const footerLinkBlock = findRuleBlock(cleaned, '#page-footer\\s+a');
  if (footerLinkBlock) {
    const color = extractPropertyValue(footerLinkBlock, 'color');
    if (color) tokens.footerLink = extractHex(color);
  }

  // --- Login page ---
  const loginBodyBlock = findRuleBlock(cleaned, 'body#page-login-index(?!\\s+\\.)');
  if (loginBodyBlock) {
    // Check for gradient first
    const bgGradient = extractPropertyValue(loginBodyBlock, 'background');
    if (bgGradient && bgGradient.includes('linear-gradient')) {
      tokens.loginGradientEnabled = true;
      // Extract both colours from linear-gradient(135deg, #color1, #color2)
      const gradientMatch = bgGradient.match(
        /linear-gradient\s*\([^,]*,\s*(#[0-9a-fA-F]{3,8})\s*,\s*(#[0-9a-fA-F]{3,8})\s*\)/i
      );
      if (gradientMatch) {
        tokens.loginBg = gradientMatch[1];
        tokens.loginGradientEnd = gradientMatch[2];
      }
    } else {
      const bg = extractPropertyValue(loginBodyBlock, 'background-color');
      if (bg) tokens.loginBg = extractHex(bg);
    }
  }

  // Login card background
  const loginCardBlock =
    findRuleBlock(cleaned, 'body#page-login-index\\s+\\.card') ||
    findRuleBlock(cleaned, '\\.login-container');
  if (loginCardBlock) {
    const bg = extractPropertyValue(loginCardBlock, 'background-color');
    if (bg) tokens.loginCardBg = extractHex(bg);
  }

  // Login button
  const loginBtnBlock = findRuleBlock(cleaned, '#loginbtn');
  if (loginBtnBlock) {
    const bg = extractPropertyValue(loginBtnBlock, 'background-color');
    if (bg) tokens.loginBtnBg = extractHex(bg);
    const color = extractPropertyValue(loginBtnBlock, 'color');
    if (color) tokens.loginBtnText = extractHex(color);
  }

  // --- Secondary navigation ---
  const secondaryNavBlock = findRuleBlock(
    cleaned,
    '\\.secondary-navigation\\s+\\.nav-tabs\\s+\\.nav-link\\.active'
  );
  if (secondaryNavBlock) {
    const borderColor = extractPropertyValue(secondaryNavBlock, 'border-bottom-color');
    const color = extractPropertyValue(secondaryNavBlock, 'color');
    // Prefer border-bottom-color, fall back to color
    if (borderColor) {
      tokens.secondaryNavActive = extractHex(borderColor);
    } else if (color) {
      tokens.secondaryNavActive = extractHex(color);
    }
  }

  // --- Typography: headings ---
  const headingBlock = findRuleBlock(cleaned, 'h1\\s*,\\s*h2\\s*,\\s*h3\\s*,\\s*h4\\s*,\\s*h5\\s*,\\s*h6');
  if (headingBlock) {
    const color = extractPropertyValue(headingBlock, 'color');
    if (color) tokens.headingText = extractHex(color);
  }

  // --- Typography: body text ---
  // Match "body { color:" but not "body#page-login-index"
  const bodyBlocks = findAllRuleBlocks(cleaned, 'body(?![#.\\w-])');
  for (const block of bodyBlocks) {
    const color = extractPropertyValue(block, 'color');
    if (color) {
      tokens.bodyText = extractHex(color);
      break;
    }
  }

  // --- Focus ring ---
  const focusBlock = findRuleBlock(cleaned, '\\*:focus');
  if (focusBlock) {
    const outline = extractPropertyValue(focusBlock, 'outline');
    if (outline) {
      // Parse "2px solid #colour" or "3px solid #colour"
      const outlineMatch = outline.match(/([\d.]+)\s*px\s+solid\s+(#[0-9a-fA-F]{3,8})/i);
      if (outlineMatch) {
        tokens.focusRingWidth = parseFloat(outlineMatch[1]);
        tokens.focusRing = outlineMatch[2];
      } else {
        // Try to at least get the colour
        const hex = extractHex(outline);
        if (hex.startsWith('#')) tokens.focusRing = hex;
      }
    }
  }

  // --- Progress bar ---
  const progressBlock = findRuleBlock(cleaned, '\\.progress-bar');
  if (progressBlock) {
    const bg = extractPropertyValue(progressBlock, 'background-color');
    if (bg) tokens.progressFill = extractHex(bg);
  }

  // --- Drawers ---
  const drawerBlock =
    findRuleBlock(cleaned, '\\[data-region="right-hand-drawer"\\]') ||
    findRuleBlock(cleaned, '\\.drawer');
  if (drawerBlock) {
    const bg = extractPropertyValue(drawerBlock, 'background-color');
    if (bg) tokens.drawerBg = extractHex(bg);
    const color = extractPropertyValue(drawerBlock, 'color');
    if (color) tokens.drawerText = extractHex(color);
    const borderColor = extractPropertyValue(drawerBlock, 'border-color');
    if (borderColor) tokens.drawerBorder = extractHex(borderColor);
  }

  // --- Edit mode toggle ---
  const editModeBlock = findRuleBlock(
    cleaned,
    '\\.editmode-switch-form\\s+\\.form-check-input:checked'
  );
  // Also try the navbar-prefixed version from the generator
  const editModeBlockAlt = findRuleBlock(
    cleaned,
    '\\.navbar\\s+\\.editmode-switch-form\\s+\\.form-check-input:checked'
  );
  const editBlock = editModeBlock || editModeBlockAlt;
  if (editBlock) {
    const bg = extractPropertyValue(editBlock, 'background-color');
    if (bg) tokens.editModeOnColour = extractHex(bg);
  }

  // --- Breadcrumb ---
  const breadcrumbBlock = findRuleBlock(cleaned, '\\.breadcrumb(?![\\w-])');
  if (breadcrumbBlock) {
    const bg = extractPropertyValue(breadcrumbBlock, 'background-color');
    if (bg) tokens.breadcrumbBg = extractHex(bg);
  }

  // --- Section accent ---
  const sectionBlock = findRuleBlock(cleaned, '\\.course-section\\s+h3');
  if (sectionBlock) {
    const borderBottom = extractPropertyValue(sectionBlock, 'border-bottom');
    if (borderBottom) {
      tokens.sectionAccent = extractHex(borderBottom);
    }
  }

  // --- Cards ---
  // Match .card but NOT .card, (part of login card selector) or .card-*
  const cardBlocks = findAllRuleBlocks(cleaned, '\\.card(?![\\w-])');
  for (const block of cardBlocks) {
    const bg = extractPropertyValue(block, 'background-color');
    if (bg && !tokens.cardBg) tokens.cardBg = extractHex(bg);
    const borderColor = extractPropertyValue(block, 'border-color');
    if (borderColor) tokens.cardBorder = extractHex(borderColor);
  }

  // --- Link hover ---
  const linkHoverBlock = findRuleBlock(cleaned, 'a:hover');
  if (linkHoverBlock) {
    const color = extractPropertyValue(linkHoverBlock, 'color');
    if (color) tokens.linkHover = extractHex(color);
  }

  // --- Content max width ---
  const contentBlock = findRuleBlock(cleaned, '#page\\.drawers\\s+\\.main-inner');
  if (contentBlock) {
    const maxWidth = extractPropertyValue(contentBlock, 'max-width');
    if (maxWidth) {
      const num = parseNumericValue(maxWidth, 'px');
      if (num !== null) tokens.contentMaxWidth = num;
    }
  }
}

// ── Download Format Parsing ──

/**
 * Parse the combined .txt download format:
 *   === CFA Moodle Theme Configuration ===
 *   --- Brand Colour ---
 *   #336E7B
 *   --- Raw Initial SCSS ---
 *   ...
 *   --- Raw SCSS ---
 *   ...
 *
 * Returns the individual sections or null if this is not the download format.
 */
function parseDownloadFormat(text: string): {
  brandColour: string | null;
  block1: string;
  block2: string;
} | null {
  // Check if this looks like the download format
  if (!text.includes('=== CFA Moodle Theme Configuration ===')) {
    return null;
  }

  let brandColour: string | null = null;
  let block1 = '';
  let block2 = '';

  // Extract Brand Colour section
  const brandMatch = text.match(
    /---\s*Brand Colour\s*---\s*\n\s*(#[0-9a-fA-F]{3,8})/i
  );
  if (brandMatch) {
    brandColour = brandMatch[1];
  }

  // Extract Raw Initial SCSS section (between "--- Raw Initial SCSS ---" and "--- Raw SCSS ---")
  const block1Match = text.match(
    /---\s*Raw Initial SCSS\s*---\s*\n([\s\S]*?)(?=---\s*Raw SCSS\s*---|$)/i
  );
  if (block1Match) {
    block1 = block1Match[1].trim();
  }

  // Extract Raw SCSS section (everything after "--- Raw SCSS ---")
  const block2Match = text.match(
    /---\s*Raw SCSS\s*---\s*\n([\s\S]*)$/i
  );
  if (block2Match) {
    block2 = block2Match[1].trim();
  }

  return { brandColour, block1, block2 };
}

// ── Main Parser ──

/**
 * Parse SCSS text (variables and/or CSS rule overrides) back into Partial<ThemeTokens>.
 *
 * Accepts:
 * - Raw SCSS variable declarations (Block 1)
 * - Raw CSS rule overrides (Block 2)
 * - Both blocks concatenated
 * - The combined .txt download format with section headers
 *
 * Only includes tokens that were actually found in the input.
 */
export function parseScssToTokens(scss: string): Partial<ThemeTokens> {
  const tokens: Partial<ThemeTokens> = {};

  if (!scss || !scss.trim()) return tokens;

  // Check for the combined download format
  const downloadFormat = parseDownloadFormat(scss);

  if (downloadFormat) {
    // Parse brand colour from the dedicated section
    if (downloadFormat.brandColour) {
      tokens.brandPrimary = downloadFormat.brandColour;
    }

    // Parse Block 1 (SCSS variables)
    if (downloadFormat.block1) {
      parseScssVariables(downloadFormat.block1, tokens);
    }

    // Parse Block 2 (CSS rules)
    if (downloadFormat.block2) {
      parseCssRules(downloadFormat.block2, tokens);
    }
  } else {
    // Not the download format — parse the entire input as both variables and rules.
    // This handles cases where users paste just one block, or raw SCSS.
    parseScssVariables(scss, tokens);
    parseCssRules(scss, tokens);
  }

  return tokens;
}
