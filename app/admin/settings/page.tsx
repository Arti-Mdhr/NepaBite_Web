"use client"

import { useState } from "react";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "email" | "security" | "appearance">("general");

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "NepaBite",
    siteDescription: "Discover and Share Authentic Nepali Recipes",
    siteUrl: "https://nepabite.com",
    adminEmail: "admin@nepabite.com",
    recipesPerPage: 12,
    allowRegistration: true,
    requireEmailVerification: true,
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "noreply@nepabite.com",
    smtpPassword: "••••••••",
    fromName: "NepaBite",
    fromEmail: "noreply@nepabite.com",
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: false,
    sessionTimeout: 60,
    passwordMinLength: 8,
    requireStrongPassword: true,
    enableRecaptcha: true,
    recaptchaSiteKey: "6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  });

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    primaryColor: "#16a34a",
    secondaryColor: "#059669",
    logoUrl: "",
    faviconUrl: "",
    theme: "light",
  });

  const handleSave = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      alert("Settings saved successfully!");
      setSaving(false);
    }, 1000);
  };

  const tabs = [
    { id: "general", name: "General", icon: "⚙️" },
    { id: "email", name: "Email", icon: "✉️" },
    { id: "security", name: "Security", icon: "🔒" },
    { id: "appearance", name: "Appearance", icon: "🎨" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage your application settings and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-6 py-4 text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-green-50 text-green-700 border-l-4 border-green-600 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 border-l-4 border-transparent"
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-8">
              {/* General Settings */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">General Settings</h2>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Site Description
                    </label>
                    <textarea
                      value={generalSettings.siteDescription}
                      onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Site URL
                    </label>
                    <input
                      type="url"
                      value={generalSettings.siteUrl}
                      onChange={(e) => setGeneralSettings({...generalSettings, siteUrl: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      value={generalSettings.adminEmail}
                      onChange={(e) => setGeneralSettings({...generalSettings, adminEmail: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Recipes Per Page
                    </label>
                    <input
                      type="number"
                      value={generalSettings.recipesPerPage}
                      onChange={(e) => setGeneralSettings({...generalSettings, recipesPerPage: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Allow User Registration</p>
                        <p className="text-xs text-slate-500">Let new users sign up for accounts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={generalSettings.allowRegistration}
                          onChange={(e) => setGeneralSettings({...generalSettings, allowRegistration: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Require Email Verification</p>
                        <p className="text-xs text-slate-500">Users must verify their email to access the site</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={generalSettings.requireEmailVerification}
                          onChange={(e) => setGeneralSettings({...generalSettings, requireEmailVerification: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {activeTab === "email" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Email Settings</h2>
                    <p className="text-sm text-slate-600">Configure SMTP settings for sending emails</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        value={emailSettings.smtpHost}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        SMTP Port
                      </label>
                      <input
                        type="number"
                        value={emailSettings.smtpPort}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpPort: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      SMTP Username
                    </label>
                    <input
                      type="text"
                      value={emailSettings.smtpUser}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpUser: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      SMTP Password
                    </label>
                    <input
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        From Name
                      </label>
                      <input
                        type="text"
                        value={emailSettings.fromName}
                        onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        From Email
                      </label>
                      <input
                        type="email"
                        value={emailSettings.fromEmail}
                        onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          Test email functionality after updating settings to ensure delivery works correctly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Security Settings</h2>
                    <p className="text-sm text-slate-600">Configure security and authentication options</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">Users will be logged out after this period of inactivity</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Minimum Password Length
                    </label>
                    <input
                      type="number"
                      value={securitySettings.passwordMinLength}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      reCAPTCHA Site Key
                    </label>
                    <input
                      type="text"
                      value={securitySettings.recaptchaSiteKey}
                      onChange={(e) => setSecuritySettings({...securitySettings, recaptchaSiteKey: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Enable Two-Factor Authentication</p>
                        <p className="text-xs text-slate-500">Require 2FA for admin accounts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.enableTwoFactor}
                          onChange={(e) => setSecuritySettings({...securitySettings, enableTwoFactor: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Require Strong Passwords</p>
                        <p className="text-xs text-slate-500">Passwords must include uppercase, lowercase, and numbers</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.requireStrongPassword}
                          onChange={(e) => setSecuritySettings({...securitySettings, requireStrongPassword: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Enable reCAPTCHA</p>
                        <p className="text-xs text-slate-500">Protect forms from spam and bots</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings.enableRecaptcha}
                          onChange={(e) => setSecuritySettings({...securitySettings, enableRecaptcha: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Appearance Settings</h2>
                    <p className="text-sm text-slate-600">Customize the look and feel of your site</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={appearanceSettings.primaryColor}
                          onChange={(e) => setAppearanceSettings({...appearanceSettings, primaryColor: e.target.value})}
                          className="h-12 w-20 rounded-lg border border-slate-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={appearanceSettings.primaryColor}
                          onChange={(e) => setAppearanceSettings({...appearanceSettings, primaryColor: e.target.value})}
                          className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={appearanceSettings.secondaryColor}
                          onChange={(e) => setAppearanceSettings({...appearanceSettings, secondaryColor: e.target.value})}
                          className="h-12 w-20 rounded-lg border border-slate-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={appearanceSettings.secondaryColor}
                          onChange={(e) => setAppearanceSettings({...appearanceSettings, secondaryColor: e.target.value})}
                          className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Theme
                    </label>
                    <select
                      value={appearanceSettings.theme}
                      onChange={(e) => setAppearanceSettings({...appearanceSettings, theme: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto (System)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      value={appearanceSettings.logoUrl}
                      onChange={(e) => setAppearanceSettings({...appearanceSettings, logoUrl: e.target.value})}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Favicon URL
                    </label>
                    <input
                      type="url"
                      value={appearanceSettings.faviconUrl}
                      onChange={(e) => setAppearanceSettings({...appearanceSettings, faviconUrl: e.target.value})}
                      placeholder="https://example.com/favicon.ico"
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">🎨</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-purple-700">
                          Changes to appearance settings may take a few minutes to reflect across the entire site.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200 mt-8">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}