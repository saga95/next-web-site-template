import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from '../components/ui/ComponentName';

// ─── META ──────────────────────────────────────────────────────────────────

const meta = {
  title: 'UI/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**ComponentName** — [description of what this component does].

### Design Tokens Used
- Colors: \`tokens.colors.brand[500]\`
- Spacing: \`tokens.spacing[4]\`
- Radius: \`tokens.radius.md\`

### Accessibility
- Role: \`[role]\`
- Keyboard: [keyboard interaction description]
- Screen reader: [what gets announced]
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      description: 'Visual style variant',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Size scale',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading state',
    },
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── STORIES ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    children: 'ComponentName',
    variant: 'primary',
    size: 'md',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <ComponentName variant='primary'>Primary</ComponentName>
      <ComponentName variant='secondary'>Secondary</ComponentName>
      <ComponentName variant='ghost'>Ghost</ComponentName>
      <ComponentName variant='danger'>Danger</ComponentName>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <ComponentName size='sm'>Small</ComponentName>
      <ComponentName size='md'>Medium</ComponentName>
      <ComponentName size='lg'>Large</ComponentName>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading...',
    isLoading: true,
  },
};

// Dark mode story
export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    children: 'Dark Mode',
    variant: 'primary',
  },
};

// Mobile viewport
export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  args: {
    children: 'Mobile View',
  },
};
