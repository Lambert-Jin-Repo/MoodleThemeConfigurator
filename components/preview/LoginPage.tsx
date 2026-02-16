'use client';

import { useThemeStore } from '@/store/theme-store';
import CfaLogo from './CfaLogo';

export default function LoginPage() {
  const tokens = useThemeStore((s) => s.tokens);

  const bgStyle: React.CSSProperties = tokens.loginBgImage
    ? {
      backgroundImage: `url('${tokens.loginBgImage}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: tokens.loginBg, // fallback behind image
    }
    : tokens.loginGradientEnabled
      ? {
        background: `linear-gradient(135deg, var(--cfa-login-bg), var(--cfa-login-gradient-end))`,
      }
      : {
        backgroundColor: 'var(--cfa-login-bg)',
      };

  return (
    <div
      className="min-h-[500px] flex items-center justify-center p-8"
      style={bgStyle}
    >
      <div
        className="w-full max-w-sm rounded-lg shadow-lg p-8 login-area"
        style={{
          backgroundColor: 'var(--cfa-login-card-bg)',
          border: `1px solid var(--cfa-card-border)`,
        }}
      >
        {/* Full CFA Logo */}
        <div className="flex justify-center mb-6">
          <CfaLogo bgHex={tokens.loginCardBg} variant="login" />
        </div>

        <h2
          className="text-center text-lg font-semibold mb-6"
          style={{ color: 'var(--cfa-login-heading)' }}
        >
          Log in
        </h2>

        {/* Username */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--cfa-body-text)' }}
          >
            Username
          </label>
          <input
            type="text"
            className="moodle-input w-full text-sm"
            placeholder="Enter your username"
            readOnly
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--cfa-body-text)' }}
          >
            Password
          </label>
          <input
            type="password"
            className="moodle-input w-full text-sm"
            placeholder="Enter your password"
            readOnly
          />
        </div>

        {/* Login button */}
        <button
          className="w-full py-2 rounded font-medium text-sm transition-colors"
          style={{
            backgroundColor: 'var(--cfa-login-btn-bg)',
            color: 'var(--cfa-login-btn-text)',
            borderRadius: `${tokens.loginInputRadius}px`,
          }}
        >
          Log in
        </button>

        {/* Links */}
        <div className="mt-4 text-center">
          <span className="moodle-link text-sm">Create new account</span>
        </div>
      </div>
    </div>
  );
}

