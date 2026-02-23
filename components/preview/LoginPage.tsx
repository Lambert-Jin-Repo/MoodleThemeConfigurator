'use client';

import { useThemeStore } from '@/store/theme-store';
import { ChevronDown } from 'lucide-react';
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
        className="w-full max-w-md rounded-xl shadow-lg p-10 login-area"
        style={{
          backgroundColor: 'var(--cfa-login-card-bg)',
          border: '1px solid var(--cfa-card-border)',
        }}
      >
        {/* CFA Logo — centred */}
        <div className="flex justify-center mb-6">
          <CfaLogo bgHex={tokens.loginCardBg} variant="login" />
        </div>

        {/* Username input — no label */}
        <input
          type="text"
          className="moodle-input w-full"
          defaultValue="admin"
          readOnly
          aria-label="Username"
          style={{
            borderRadius: `${tokens.loginInputRadius}px`,
            padding: '10px 16px',
            fontSize: '0.875rem',
          }}
        />

        {/* Password input */}
        <input
          type="password"
          className="moodle-input w-full mt-3"
          placeholder="Password"
          readOnly
          aria-label="Password"
          style={{
            borderRadius: `${tokens.loginInputRadius}px`,
            padding: '10px 16px',
            fontSize: '0.875rem',
          }}
        />

        {/* Log in button — left-aligned, auto width */}
        <div className="mt-4">
          <button
            className="font-medium text-sm"
            style={{
              backgroundColor: 'var(--cfa-login-btn-bg)',
              color: 'var(--cfa-login-btn-text)',
              borderRadius: '4px',
              padding: '8px 24px',
              border: 'none',
              cursor: 'pointer',
            }}
            aria-label="Log in"
          >
            Log in
          </button>
        </div>

        {/* Lost password link */}
        <div className="mt-3">
          <span
            className="moodle-link"
            style={{ fontSize: '13px' }}
          >
            Lost password?
          </span>
        </div>

        {/* Divider */}
        <hr
          className="my-5"
          style={{ borderTop: '1px solid #dee2e6', borderBottom: 'none' }}
        />

        {/* First time section */}
        <h3
          className="font-bold"
          style={{
            fontSize: '18px',
            color: 'var(--cfa-heading-text)',
            margin: 0,
          }}
        >
          Is this your first time here?
        </h3>

        <p
          className="mt-2"
          style={{
            fontSize: '14px',
            color: 'var(--cfa-body-text)',
            margin: '8px 0 0 0',
            lineHeight: 1.5,
          }}
        >
          For full access to this site, you first need to create an account.
        </p>

        {/* Create new account button — left-aligned, auto width */}
        <div className="mt-4">
          <button
            className="text-sm font-medium"
            style={{
              backgroundColor: 'var(--cfa-signup-btn-bg)',
              color: '#FFFFFF',
              borderRadius: '4px',
              padding: '8px 20px',
              border: 'none',
              cursor: 'pointer',
            }}
            aria-label="Create new account"
          >
            Create new account
          </button>
        </div>

        {/* Second divider */}
        <hr
          className="my-5"
          style={{ borderTop: '1px solid #dee2e6', borderBottom: 'none' }}
        />

        {/* Footer section */}
        <div
          style={{
            fontSize: '12px',
            color: 'var(--cfa-muted-text)',
          }}
        >
          {/* Language selector row */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="flex items-center gap-1" style={{ cursor: 'pointer' }}>
              English (United States) (en_us)
              <ChevronDown size={12} />
            </span>

            <span style={{ color: 'var(--cfa-muted-text)' }}>|</span>

            <span
              style={{
                backgroundColor: '#e9ecef',
                color: 'var(--cfa-body-text)',
                padding: '2px 10px',
                borderRadius: '10px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Cookies notice
            </span>
          </div>

          {/* Cookie settings link */}
          <div className="mt-2">
            <span
              className="moodle-link"
              style={{ fontSize: '12px' }}
            >
              Cookie Settings
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
