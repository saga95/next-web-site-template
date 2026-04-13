import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Container, Tabs, Tab, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuth } from '@/contexts/AuthContext';

// TODO: Customize account tabs for your domain
const TABS = [
  { label: 'Profile', href: '/account', icon: <PersonIcon /> },
  { label: 'Orders', href: '/account/orders', icon: <ShoppingBagIcon /> },
  { label: 'Settings', href: '/account/settings', icon: <SettingsIcon /> },
];

/**
 * AccountLayout — tabbed navigation for authenticated user pages.
 * Pattern from uwu-sri-lanka/website.
 *
 * Redirects unauthenticated users to the login page.
 *
 * Usage:
 * ```tsx
 * export default function ProfilePage() {
 *   return (
 *     <AccountLayout title="My Profile">
 *       <ProfileForm />
 *     </AccountLayout>
 *   );
 * }
 * ```
 */
export default function AccountLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const activeTab = TABS.findIndex(tab => tab.href === router.pathname);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      {title && (
        <Typography variant='h4' component='h1' sx={{ mb: 3 }}>
          {title}
        </Typography>
      )}
      <Tabs
        value={activeTab === -1 ? 0 : activeTab}
        onChange={(_, newValue: number) => {
          const tab = TABS[newValue];
          if (tab) router.push(tab.href);
        }}
        variant='scrollable'
        scrollButtons='auto'
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        {TABS.map(tab => (
          <Tab
            key={tab.href}
            label={tab.label}
            icon={tab.icon}
            iconPosition='start'
          />
        ))}
      </Tabs>
      <Box>{children}</Box>
    </Container>
  );
}
