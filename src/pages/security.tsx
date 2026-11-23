import { Lock, LogOut, MailCheck, Shield } from "lucide-react";
import SettingsLayout, { SettingsLink } from "../components/SettingsLayout";

export default function Security() {
  return <SettingsLayout title="Keep your account secure." description="Manage your password, verification, and account access." icon={Shield}>
    <section className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
      <SettingsLink to="/settings/security/change-password" title="Change password" description="Choose a new password for your account." icon={Lock} />
      <SettingsLink to="/verify-email" title="Email verification" description="Confirm your email to start recording transactions." icon={MailCheck} />
      <SettingsLink to="/settings/security/logout-all" title="Sign out on all devices" description="Remove trusted-device access across your account." icon={LogOut} />
    </section>
  </SettingsLayout>;
}
