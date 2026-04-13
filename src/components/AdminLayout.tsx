import { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const DRAWER_WIDTH = 260;

// TODO: Customize admin nav items for your domain
const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: <DashboardIcon /> },
  { label: 'Products', href: '/admin/products', icon: <InventoryIcon /> },
  { label: 'Categories', href: '/admin/categories', icon: <CategoryIcon /> },
  { label: 'Orders', href: '/admin/orders', icon: <ShoppingCartIcon /> },
  { label: 'Users', href: '/admin/users', icon: <PeopleIcon /> },
  { label: 'Settings', href: '/admin/settings', icon: <SettingsIcon /> },
];

/**
 * AdminLayout — sidebar navigation with role-based route protection.
 * Pattern from uwu-sri-lanka/website.
 *
 * Redirects non-admin users to the homepage.
 * Includes a responsive drawer (permanent on desktop, temporary on mobile).
 *
 * Usage:
 * ```tsx
 * export default function AdminPage() {
 *   return (
 *     <AdminLayout title="Products">
 *       <ProductTable />
 *     </AdminLayout>
 *   );
 * }
 * ```
 */
export default function AdminLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const router = useRouter();
  const { isAdmin, isLoading, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace('/');
    }
  }, [isLoading, isAdmin, router]);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    router.push('/');
  }, [logout, router]);

  if (isLoading || !isAdmin) {
    return null;
  }

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar>
        <Typography variant='h6' noWrap>
          Admin
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flex: 1 }}>
        {NAV_ITEMS.map(item => (
          <ListItemButton
            key={item.href}
            selected={router.pathname === item.href}
            onClick={() => {
              router.push(item.href);
              if (isMobile) setMobileOpen(false);
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary='Logout' />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App bar — mobile only */}
      {isMobile && (
        <AppBar position='fixed' sx={{ zIndex: t => t.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color='inherit'
              edge='start'
              onClick={handleDrawerToggle}
              aria-label='open navigation'
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' noWrap>
              {title ?? 'Admin'}
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar */}
      <Box
        component='nav'
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant='temporary'
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant='permanent'
            sx={{
              '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                boxSizing: 'border-box',
              },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>

      {/* Main content */}
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: isMobile ? '64px' : 0,
        }}
      >
        {!isMobile && title && (
          <Typography variant='h4' component='h1' sx={{ mb: 3 }}>
            {title}
          </Typography>
        )}
        {children}
      </Box>
    </Box>
  );
}
