# UI Components Setup Guide - Complete Code Reference

Tài liệu này chứa toàn bộ code của tất cả UI components, có thể copy trực tiếp sang project khác.

## Mục Lục

1. [Setup & Dependencies](#setup--dependencies)
2. [Core Utility](#core-utility)
3. [Core Components](#core-components)
4. [Form Components](#form-components)
5. [Overlay Components](#overlay-components)
6. [Data Display Components](#data-display-components)
7. [Custom Components](#custom-components)
8. [Usage Examples](#usage-examples)
9. [Dark Mode (next-themes)](#dark-mode-next-themes)
10. [Widget Components](#widget-components)
11. [Video Player (HLS)](#video-player-hls)

---

## Tổng Quan

Project sử dụng **53 UI components** được build trên:

- **Radix UI** - Unstyled, accessible primitives
- **ShadCN UI** - Pre-built component library
- **Tailwind CSS v4** - Utility-first styling (NO `tailwind.config.ts`)
- **Class Variance Authority (CVA)** - Component variants
- **React Hook Form** - Form management
- **TanStack Table** - Data tables

> ⚠️ **Tailwind CSS v4**: Project này dùng Tailwind v4. KHÔNG có `tailwind.config.ts`. Theme được define trong `globals.css` với `@theme {}`. PostCSS chỉ cần `@tailwindcss/postcss`.

### Component Structure

```
components/
└── ui/                    # 53 base UI components
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    ├── table.tsx
    ├── dialog.tsx
    ├── form.tsx
    ├── SafeImage.tsx      # Custom image component
    ├── truncated-text.tsx # Custom text truncation
    ├── state.tsx          # Error/Empty/Loading states
    ├── navigation-link.tsx # Enhanced navigation
    └── navigation-progress.tsx # Route progress bar
```

---

## Setup & Dependencies

### Tailwind v4 Setup

> Project này dùng **Tailwind CSS v4** — khác hoàn toàn với v3.

**`postcss.config.mjs`** (chỉ cần 1 plugin):

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

**`app/globals.css`** (không `@tailwind base/components/utilities`):

```css
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.6 0.2 250);
  --color-background: oklch(1 0 0);
  --font-sans: "Open Sans", sans-serif;
  /* ...thêm custom tokens ở đây */
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

Install:

```bash
npm install tailwindcss @tailwindcss/postcss
# Không cần autoprefixer khi dùng Tailwind v4
```

---

### Required Packages

```json
{
  "dependencies": {
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.1.8",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "sonner": "^2.0.1",
    "react-hook-form": "^7.54.2",
    "@hookform/resolvers": "^4.1.3",
    "zod": "^3.24.2",
    "@tanstack/react-table": "^8.21.2",
    "recharts": "^2.15.1",
    "next-themes": "^0.4.6"
  }
}
```

## Core Utility

**File:** `lib/utils.ts` - Copy toàn bộ file này:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Usage:**

```typescript
import { cn } from '@/lib/utils';

<div className={cn('base-class', condition && 'conditional-class', className)} />
```

### Path Aliases (tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## Core Components

### 1. Button

**File:** `components/ui/button.tsx` - Copy toàn bộ code:

```typescript
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-xl px-3',
        lg: 'h-11 rounded-xl px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

**Import:**

```typescript
import { Button } from "@/components/ui/button";
```

**Variants:**

- `default` - Primary button
- `destructive` - Error/danger action
- `outline` - Outlined button
- `secondary` - Secondary action
- `ghost` - Minimal button
- `link` - Link style

**Sizes:**

- `default` - h-10 px-4 py-2
- `sm` - h-9 px-3
- `lg` - h-11 px-8
- `icon` - h-10 w-10

**Usage:**

```typescript
<Button variant="default" size="default">
  Click me
</Button>

<Button variant="outline" size="sm">
  Outline
</Button>

<Button variant="ghost" size="icon">
  <Icon />
</Button>

<Button asChild>
  <Link href="/">Link Button</Link>
</Button>
```

**Features:**

- `asChild` prop để render as child component
- Rounded corners (rounded-xl)
- Focus ring
- Disabled state
- Icon support

---

### 2. Card

**File:** `components/ui/card.tsx` - Copy toàn bộ code:

```typescript
import * as React from 'react';

import { cn } from '@/lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border bg-card text-card-foreground', className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

**Import:**

```typescript
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
```

**Usage:**

```typescript
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Structure:**

- `Card` - Container với border và background
- `CardHeader` - Header với padding p-6
- `CardTitle` - Title (text-2xl font-semibold)
- `CardDescription` - Description (text-sm text-muted-foreground)
- `CardContent` - Content area (p-6 pt-0)
- `CardFooter` - Footer (p-6 pt-0)

---

### 3. Input

**File:** `components/ui/input.tsx` - Copy toàn bộ code:

```typescript
import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
```

**Import:**

```typescript
import { Input } from "@/components/ui/input";
```

**Usage:**

```typescript
<Input
  type="text"
  placeholder="Enter text"
  className="w-full"
/>
```

**Features:**

- Rounded corners (rounded-xl)
- Border styling
- Placeholder styling
- Disabled state
- File input support
- Responsive text size (text-base md:text-sm)

---

### 4. Textarea

**File:** `components/ui/textarea.tsx` - Copy toàn bộ code:

```typescript
import * as React from 'react';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
```

**Import:**

```typescript
import { Textarea } from "@/components/ui/textarea";
```

---

### 5. Select

**File:** `components/ui/select.tsx` - Copy toàn bộ code:

```typescript
'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
```

**Import:**

```typescript
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select";
```

**Usage:**

```typescript
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Group 1</SelectLabel>
      <SelectItem value="option1">Option 1</SelectItem>
      <SelectItem value="option2">Option 2</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

**Features:**

- Scroll buttons for long lists
- Grouping support
- Separator support
- Keyboard navigation
- Portal rendering

---

### 6. Checkbox

**File:** `components/ui/checkbox.tsx` - Copy toàn bộ code:

```typescript
'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
```

---

### 7. Radio Group

**File:** `components/ui/radio-group.tsx` - Copy toàn bộ code:

```typescript
'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';

import { cn } from '@/lib/utils';

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-3.5 w-3.5 fill-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
```

---

### 8. Switch

**File:** `components/ui/switch.tsx` - Copy toàn bộ code:

```typescript
'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0'
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
```

---

### 9. Label

**File:** `components/ui/label.tsx` - Copy toàn bộ code:

```typescript
'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
```

---

### 10. Badge

**File:** `components/ui/badge.tsx` - Copy toàn bộ code:

```typescript
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
```

---

### 11. Avatar

**File:** `components/ui/avatar.tsx` - Copy toàn bộ code:

```typescript
'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { cn } from '@/lib/utils';

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
```

---

### 12. Skeleton

**File:** `components/ui/skeleton.tsx` - Copy toàn bộ code:

```typescript
import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />;
}

export { Skeleton };
```

---

### 13. Progress

**File:** `components/ui/progress.tsx` - Copy toàn bộ code:

```typescript
'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn('bg-primary/20 relative h-2 w-full overflow-hidden rounded-full', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
```

---

### 14. Table

**File:** `components/ui/table.tsx` - Copy toàn bộ code:

```typescript
import * as React from 'react';

import { cn } from '@/lib/utils';

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  )
);
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
));
TableCaption.displayName = 'TableCaption';

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
```

**Import:**

```typescript
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
```

**Usage:**

```typescript
<Table>
  <TableCaption>A list of items</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Item 1</TableCell>
      <TableCell>Active</TableCell>
      <TableCell className="text-right">$100</TableCell>
    </TableRow>
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={2}>Total</TableCell>
      <TableCell className="text-right">$100</TableCell>
    </TableRow>
  </TableFooter>
</Table>
```

---

## Form Components

### Form (react-hook-form integration)

**File:** `components/ui/form.tsx` - Copy toàn bộ code:

```typescript
'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn('space-y-2', className)} {...props} />
      </FormItemContext.Provider>
    );
  }
);
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && 'text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-[0.8rem] text-muted-foreground', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? '') : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-[0.8rem] font-medium text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
```

**Import:**

```typescript
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
```

**Setup:**

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

**Components:**

- `Form` - FormProvider wrapper
- `FormField` - Field controller với Controller
- `FormItem` - Field container với spacing
- `FormLabel` - Label với error styling
- `FormControl` - Input wrapper với ARIA
- `FormDescription` - Helper text
- `FormMessage` - Error message display

---

## Overlay Components

### Dialog

**File:** `components/ui/dialog.tsx` - Copy toàn bộ code:

```typescript
'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
```

**Import:**

```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
```

**Usage:**

```typescript
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      {/* Content */}
    </div>
    <DialogFooter>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Features:**

- Overlay với backdrop
- Close button
- Keyboard escape
- Focus trap
- Portal rendering
- Animation transitions

---

### Toast (Sonner)

**File:** `components/ui/sonner.tsx` - Copy toàn bộ code:

```typescript
'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
```

**Setup trong Root Layout:**

```typescript
import { Toaster } from '@/components/ui/sonner';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster
          closeButton={true}
          expand={true}
          position="bottom-center"
        />
      </body>
    </html>
  );
}
```

**Usage:**

```typescript
import { toast } from "sonner";

// Basic
toast("Event created");

// Success
toast.success("Profile updated");

// Error
toast.error("Something went wrong");

// With description
toast("Event created", {
  description: "Sunday, December 03, 2023 at 9:00 AM",
});

// With action
toast("Event created", {
  action: {
    label: "Undo",
    onClick: () => console.log("Undo"),
  },
});

// Promise
toast.promise(promise, {
  loading: "Loading...",
  success: "Success!",
  error: "Error!",
});
```

**Features:**

- Theme-aware (light/dark)
- Auto-dismiss
- Action buttons
- Promise support
- Custom styling

---

## Data Display Components

### Data Table (TanStack Table)

**File:** `components/ui/data-table.tsx`

**Import:**

```typescript
import { DataTable } from "@/components/ui/data-table";
```

**Usage:**

```typescript
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
];

function DataTableDemo() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchColumn="email"
      searchPlaceholder="Search emails..."
    />
  );
}
```

**Features:**

- Built-in search
- Sorting
- Filtering
- Pagination
- Responsive

---

## Custom Components

### 1. SafeImage

**File:** `components/ui/SafeImage.tsx` - Copy toàn bộ code:

```typescript
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
  onError?: () => void;
}

export default function SafeImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority,
  fallbackSrc = '/banner_website.jpg',
  onError,
}: SafeImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [useRegularImg, setUseRegularImg] = useState(false);

  // Reset state when src prop changes
  useEffect(() => {
    setImageSrc(src);
    setUseRegularImg(false);
  }, [src]);

  const handleImageError = () => {
    onError?.();

    if (imageSrc !== fallbackSrc) {
      // Try fallback first
      setImageSrc(fallbackSrc);
    } else {
      // If fallback also fails, use regular img tag
      setUseRegularImg(true);
    }
  };

  const isExternalUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname !== window.location.hostname;
    } catch {
      return false;
    }
  };

  // For external URLs that might not be in next.config.js, use regular img tag
  if (useRegularImg || isExternalUrl(imageSrc)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(fill ? 'absolute inset-0 w-full h-full object-cover' : '', className)}
        onError={handleImageError}
        loading={priority ? 'eager' : 'lazy'}
      />
    );
  }

  // For internal or configured external URLs, use Next.js Image
  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      priority={priority}
      onError={handleImageError}
    />
  );
}
```

**Import:**

```typescript
import SafeImage from "@/components/ui/SafeImage";
```

**Usage:**

```typescript
<SafeImage
  src="/image.jpg"
  alt="Description"
  width={500}
  height={300}
  fallbackSrc="/fallback.jpg"
  className="rounded-lg"
/>

<SafeImage
  src="/image.jpg"
  alt="Description"
  fill
  className="object-cover"
/>
```

**Features:**

- Automatic fallback on error
- External URL support
- Next.js Image optimization
- Regular img fallback for external URLs
- Error handling

**Props:**

- `src: string` - Image source
- `alt: string` - Alt text
- `width?: number` - Image width
- `height?: number` - Image height
- `fill?: boolean` - Fill container
- `className?: string` - Additional classes
- `priority?: boolean` - Priority loading
- `fallbackSrc?: string` - Fallback image (default: '/banner_website.jpg')
- `onError?: () => void` - Error callback

---

### 2. TruncatedText

**File:** `components/ui/truncated-text.tsx` - Copy toàn bộ code:

```typescript
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TruncatedTextProps {
  text: string;
  maxWords?: number;
  className?: string;
  showButton?: boolean;
  buttonText?: {
    show: string;
    hide: string;
  };
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
}

export function TruncatedText({
  text,
  maxWords = 50,
  className,
  showButton = true,
  buttonText = {
    show: 'Xem thêm',
    hide: 'Thu gọn',
  },
  as = 'span',
}: TruncatedTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  // Split text into words
  const words = text.trim().split(/\s+/);
  const shouldTruncate = words.length > maxWords;
  const displayWords = isExpanded ? words : words.slice(0, maxWords);
  const displayText = displayWords.join(' ');

  useEffect(() => {
    if (textRef.current) {
      const element = textRef.current;
      setIsTruncated(element.scrollHeight > element.clientHeight || shouldTruncate);
    }
  }, [text, shouldTruncate]);

  const Element = as;

  if (!shouldTruncate) {
    return <Element className={className}>{text}</Element>;
  }

  return (
    <Element ref={textRef} className={cn('transition-all duration-300', className)}>
      <div className="flex items-start gap-1">
        <span
          className={cn(
            'transition-all duration-300',
            !isExpanded && 'line-clamp-1 overflow-hidden',
            isExpanded && 'whitespace-normal'
          )}
        >
          {displayText}
        </span>
        {showButton && isTruncated && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center h-auto p-0 text-xs text-muted-foreground hover:text-foreground font-normal flex-shrink-0 leading-none"
          >
            {isExpanded ? (
              <>
                {buttonText.hide}
                <ChevronUp className="ml-1 h-3 w-3" />
              </>
            ) : (
              <>
                {buttonText.show}
                <ChevronDown className="ml-1 h-3 w-3" />
              </>
            )}
          </Button>
        )}
      </div>
    </Element>
  );
}
```

**Import:**

```typescript
import { TruncatedText } from "@/components/ui/truncated-text";
```

**Usage:**

```typescript
<TruncatedText
  text="Very long text that needs to be truncated..."
  maxWords={50}
  showButton={true}
  buttonText={{
    show: 'Xem thêm',
    hide: 'Thu gọn',
  }}
  as="p"
/>
```

**Features:**

- Word-based truncation
- Expand/collapse functionality
- Custom button text
- Multiple element types (span, p, h1-h6)
- Smooth transitions

**Props:**

- `text: string` - Text to truncate
- `maxWords?: number` - Max words before truncation (default: 50)
- `className?: string` - Additional classes
- `showButton?: boolean` - Show expand button (default: true)
- `buttonText?: { show: string; hide: string }` - Button labels
- `as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'` - Element type

---

### 3. State Components

**File:** `components/ui/state.tsx` - Copy toàn bộ code:

```typescript
'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  detail?: string;
  onRetry?: () => void;
}

function ErrorState({ className, message, detail, onRetry, ...props }: ErrorStateProps) {
  return (
    <div
      className={cn('min-h-screen bg-gray-50 flex items-center justify-center', className)}
      {...props}
    >
      <Card className="max-w-md mx-auto text-center shadow-md">
        <CardContent className="p-8">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">{message || 'Có lỗi xảy ra'}</h2>
          {detail && <p className="text-gray-600 mb-2">{detail}</p>}
          <p className="text-gray-600 mb-6">Không thể tải dữ liệu. Vui lòng thử lại.</p>
          <div className="flex gap-3 justify-center">
            {onRetry && <Button onClick={onRetry}>Thử lại</Button>}
            <Button variant="outline" asChild>
              <Link href="/">Về trang chủ</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('min-h-screen bg-gray-50 flex items-center justify-center', className)}
      {...props}
    >
      <Card className="max-w-sm w-full mx-auto text-center shadow-md">
        <CardContent className="p-8">
          <div className="text-gray-400 text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            Chưa có bất động sản nào để so sánh
          </h2>
          <p className="text-gray-600 mb-6">
            Hãy quay về My Revo và chọn bất động sản để bắt đầu so sánh nhé.
          </p>
          <Button asChild className="w-full">
            <Link href="/myrevo">Về My Revo</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingSkeleton({
  className,
  propertyCount = 3,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { propertyCount?: number }) {
  return (
    <div className={cn('min-h-screen bg-gray-50', className)} {...props}>
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(propertyCount)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-4">
                <Skeleton className="h-40 w-full rounded" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export { ErrorState, EmptyState, LoadingSkeleton };
```

**Import:**

```typescript
import { ErrorState, EmptyState, LoadingSkeleton } from "@/components/ui/state";
```

**Usage:**

```typescript
// Error State
<ErrorState
  message="Có lỗi xảy ra"
  detail="Chi tiết lỗi"
  onRetry={() => refetch()}
/>

// Empty State
<EmptyState />

// Loading Skeleton
<LoadingSkeleton propertyCount={3} />
```

**Features:**

- Pre-styled error states
- Empty state with CTA
- Loading skeletons
- Retry functionality
- Responsive design

**Props:**

**ErrorState:**

- `message?: string` - Error message
- `detail?: string` - Error details
- `onRetry?: () => void` - Retry callback

**LoadingSkeleton:**

- `propertyCount?: number` - Number of skeleton items (default: 3)

---

### 4. NavigationLink

**File:** `components/ui/navigation-link.tsx`

**Import:**

```typescript
import { NavigationLink, EnhancedNavigationLink } from "@/components/ui/navigation-link";
```

**Usage:**

```typescript
// Basic usage
<NavigationLink href="/page" showProgress={true}>
  Go to Page
</NavigationLink>

// Enhanced with options
<EnhancedNavigationLink
  href="/page"
  showProgress={true}
  progressDelay={100}
  progressType="immediate"
  onNavigationStart={() => console.log('Starting')}
>
  Enhanced Link
</EnhancedNavigationLink>
```

**Features:**

- Integration with NavigationProgressProvider
- Progress bar on navigation
- Delay support
- Hover-triggered progress
- Callback support

**Props:**

**NavigationLink:**

- `showProgress?: boolean` - Show progress bar (default: true)
- `progressDelay?: number` - Delay before showing progress (default: 0)

**EnhancedNavigationLink:**

- All NavigationLink props plus:
- `onNavigationStart?: () => void` - Start callback
- `onNavigationComplete?: () => void` - Complete callback
- `progressType?: 'immediate' | 'delayed' | 'on-hover'` - Progress trigger type

---

### 5. NavigationProgress

**File:** `components/ui/navigation-progress.tsx`

**Import:**

```typescript
import {
  NavigationProgress,
  NavigationProgressAdvanced,
} from "@/components/ui/navigation-progress";
```

**Usage:**

```typescript
import { useNavigationProgressContext } from '@/components/providers/navigationProgressProvider';

function MyComponent() {
  const { isNavigating, progress } = useNavigationProgressContext();

  return (
    <>
      <NavigationProgress isNavigating={isNavigating} progress={progress} />
      {/* Or advanced version */}
      <NavigationProgressAdvanced isNavigating={isNavigating} />
    </>
  );
}
```

**Features:**

- Top progress bar
- Gradient styling
- Smooth animations
- Shimmer effect
- Auto-hide on completion

**Props:**

- `isNavigating: boolean` - Navigation state
- `progress: number` - Progress percentage (0-100)
- `className?: string` - Additional classes

---

---

### 15. Alert

**File:** `components/ui/alert.tsx` - Copy toàn bộ code:

```typescript
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('mb-1 font-medium leading-none tracking-tight', className)}
      {...props}
    />
  )
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
```

---

### 16. Alert Dialog

**File:** `components/ui/alert-dialog.tsx` - Copy toàn bộ code:

```typescript
'use client';

import * as React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = (props: AlertDialogPrimitive.AlertDialogPortalProps) => (
  <AlertDialogPrimitive.Portal {...props} />
);
AlertDialogPortal.displayName = AlertDialogPrimitive.Portal.displayName;

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);
AlertDialogHeader.displayName = 'AlertDialogHeader';

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold', className)}
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', className)}
    {...props}
  />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
```

---

## Usage Examples

### 1. Component Import Pattern

**Always use path aliases:**

```typescript
// ✅ Good
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// ❌ Bad
import { Button } from "../../../components/ui/button";
```

### 2. Styling with cn()

**Always use cn() for class merging:**

```typescript
import { cn } from '@/lib/utils';

<div className={cn('base-class', condition && 'conditional-class', className)} />
```

### 3. Form Handling

**Always use Form components with react-hook-form:**

```typescript
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';

const form = useForm();

<Form {...form}>
  <FormField
    control={form.control}
    name="fieldName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Label</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
      </FormItem>
    )}
  />
</Form>
```

### 4. Toast Notifications

**Prefer Sonner over Toast component:**

```typescript
// ✅ Recommended
import { toast } from "sonner";
toast.success("Success!");

// ⚠️ Alternative (more setup)
import { useToast } from "@/components/ui/use-toast";
```

### 5. Image Handling

**Use SafeImage for all images:**

```typescript
// ✅ Good - with fallback
import SafeImage from '@/components/ui/SafeImage';
<SafeImage src="/image.jpg" alt="Description" width={500} height={300} />

// ⚠️ Only if you're sure image exists
import Image from 'next/image';
<Image src="/image.jpg" alt="Description" width={500} height={300} />
```

### 6. Loading States

**Use State components:**

```typescript
import { LoadingSkeleton, ErrorState, EmptyState } from '@/components/ui/state';

{isLoading && <LoadingSkeleton />}
{error && <ErrorState onRetry={refetch} />}
{!data?.length && <EmptyState />}
```

### 7. Text Truncation

**Use TruncatedText for long text:**

```typescript
import { TruncatedText } from '@/components/ui/truncated-text';

<TruncatedText text={longText} maxWords={50} />
```

### 8. Navigation

**Use NavigationLink for internal links:**

```typescript
import { NavigationLink } from '@/components/ui/navigation-link';

<NavigationLink href="/page">Go to Page</NavigationLink>
```

### 9. Component Composition

**Compose components properly:**

```typescript
// ✅ Good
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// ❌ Bad - Don't replace with divs
<div className="card">
  <div className="card-header">Title</div>
</div>
```

### 10. TypeScript

**Always type your components:**

```typescript
interface MyComponentProps {
  title: string;
  description?: string;
}

export function MyComponent({ title, description }: MyComponentProps) {
  // ...
}
```

---

## Component Checklist

Khi setup project mới, đảm bảo có:

- [ ] `lib/utils.ts` với `cn()` function
- [ ] Path aliases trong `tsconfig.json`
- [ ] All required dependencies installed
- [ ] `components/ui/` folder với base components
- [ ] Toaster setup trong root layout (nếu dùng Sonner)
- [ ] NavigationProgressProvider setup (nếu dùng navigation progress)

---

## Quick Reference

### Most Used Components

1. **Button** - `@/components/ui/button`
2. **Card** - `@/components/ui/card`
3. **Input** - `@/components/ui/input`
4. **Dialog** - `@/components/ui/dialog`
5. **Toast (Sonner)** - `@/components/ui/sonner`
6. **Table** - `@/components/ui/table`
7. **Form** - `@/components/ui/form`
8. **Select** - `@/components/ui/select`
9. **SafeImage** - `@/components/ui/SafeImage`
10. **TruncatedText** - `@/components/ui/truncated-text`

---

## Complete Component List

Tất cả components cần copy (theo thứ tự ưu tiên):

### Core Components (Copy ngay)

1. `lib/utils.ts` - Utility function
2. `components/ui/button.tsx`
3. `components/ui/card.tsx`
4. `components/ui/input.tsx`
5. `components/ui/textarea.tsx`
6. `components/ui/select.tsx`
7. `components/ui/checkbox.tsx`
8. `components/ui/radio-group.tsx`
9. `components/ui/switch.tsx`
10. `components/ui/label.tsx`
11. `components/ui/badge.tsx`
12. `components/ui/avatar.tsx`
13. `components/ui/skeleton.tsx`
14. `components/ui/progress.tsx`
15. `components/ui/table.tsx`
16. `components/ui/alert.tsx`
17. `components/ui/alert-dialog.tsx`

### Overlay Components

18. `components/ui/dialog.tsx`
19. `components/ui/sheet.tsx`
20. `components/ui/popover.tsx`
21. `components/ui/tooltip.tsx`

### Navigation Components

22. `components/ui/tabs.tsx`
23. `components/ui/accordion.tsx`
24. `components/ui/pagination.tsx`

### Form Components

25. `components/ui/form.tsx`
26. `components/ui/calendar.tsx`
27. `components/ui/date-picker.tsx`

### Feedback Components

28. `components/ui/sonner.tsx`
29. `components/ui/toast.tsx`

### Data Display

30. `components/ui/data-table.tsx`

### Custom Components

31. `components/ui/SafeImage.tsx`
32. `components/ui/truncated-text.tsx`
33. `components/ui/state.tsx`
34. `components/ui/navigation-link.tsx`
35. `components/ui/navigation-progress.tsx`

### Import Pattern

```typescript
// Single component
import { ComponentName } from "@/components/ui/component-name";

// Multiple components
import { Component1, Component2, Component3 } from "@/components/ui/component-name";
```

---

_Document được tạo từ phân tích codebase thực tế - Áp dụng cho tất cả project_

---

## Dark Mode (next-themes)

### Install

```bash
npm install next-themes
```

### `components/ui/sonner.tsx`

```typescript
'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
```

### Setup trong `lib/providers/index.tsx`

```typescript
import { ThemeProvider } from 'next-themes'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </QueryProvider>
    </ReduxProvider>
  )
}
```

### Theme Toggle Component

```typescript
'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

---

## Widget Components

Các widget components phức tạp sử dụng trong Beyond8:

### `components/widget/confirm-dialog.tsx`

```typescript
'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  trigger: React.ReactNode
  title: string
  description: string
  onConfirm: () => void | Promise<void>
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'destructive'
  isLoading?: boolean
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  onConfirm,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  variant = 'default',
  isLoading,
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={variant === 'destructive' ? 'bg-destructive hover:bg-destructive/90' : ''}
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

**Usage:**

```typescript
<ConfirmDialog
  trigger={<Button variant="destructive">Xóa khóa học</Button>}
  title="Xác nhận xóa"
  description="Hành động này không thể hoàn tác."
  onConfirm={() => deleteMutation.mutate(id)}
  variant="destructive"
  isLoading={deleteMutation.isPending}
/>
```

### Cart Popover Pattern

```typescript
'use client'

import { ShoppingCart } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function CartPopover() {
  const { items } = useCartContext() // your cart context

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {items.length > 0 && (
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {items.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        {/* Cart items list */}
        <div className="p-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Giỏ hàng trống</p>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex items-center gap-3 py-2">
                {/* item content */}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
```

### Notification Popover Pattern

```typescript
'use client'

import { Bell } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

export function NotificationPopover() {
  const { notifications, unreadCount, markAsRead } = useNotifications()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Thông báo</h4>
          <Button variant="ghost" size="sm" onClick={() => markAsRead()}>Đánh dấu đã đọc</Button>
        </div>
        <ScrollArea className="h-80">
          {notifications.map(n => (
            <div
              key={n.id}
              className={cn(
                'flex gap-3 p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors',
                !n.isRead && 'bg-blue-50 dark:bg-blue-950/20'
              )}
              onClick={() => markAsRead(n.id)}
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.message}</p>
              </div>
              {!n.isRead && <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />}
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
```

---

## Video Player (HLS)

### Install

```bash
npm install hls.js @vidstack/react
```

### Pattern với hls.js (bare-metal)

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

interface VideoPlayerProps {
  src: string
  poster?: string
  className?: string
  onEnded?: () => void
  onTimeUpdate?: (currentTime: number, duration: number) => void
}

export function HlsVideoPlayer({ src, poster, className, onEnded, onTimeUpdate }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    // Cleanup previous instance
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
      })
      hlsRef.current = hls

      hls.loadSource(src)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => { /* autoplay blocked */ })
      })

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) setError('Không thể tải video. Vui lòng thử lại.')
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS
      video.src = src
    } else {
      setError('Trình duyệt không hỗ trợ HLS.')
    }

    return () => {
      hlsRef.current?.destroy()
      hlsRef.current = null
    }
  }, [src])

  if (error) {
    return (
      <div className="flex items-center justify-center bg-black text-white p-8">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <video
      ref={videoRef}
      className={cn('w-full h-full', className)}
      poster={poster}
      controls
      playsInline
      onEnded={onEnded}
      onTimeUpdate={() => {
        const video = videoRef.current
        if (video && onTimeUpdate) onTimeUpdate(video.currentTime, video.duration)
      }}
    />
  )
}
```

### Pattern với @vidstack/react (recommended)

```typescript
'use client'

import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/video.css'
import { MediaPlayer, MediaProvider, Track } from '@vidstack/react'
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default'

interface VidstackPlayerProps {
  src: string
  title?: string
  poster?: string
  subtitles?: { src: string; label: string; language: string }[]
  onEnded?: () => void
}

export function VidstackPlayer({ src, title, poster, subtitles, onEnded }: VidstackPlayerProps) {
  return (
    <MediaPlayer
      title={title}
      src={src}
      poster={poster}
      onEnded={onEnded}
      className="w-full aspect-video"
    >
      <MediaProvider>
        {subtitles?.map(sub => (
          <Track
            key={sub.src}
            src={sub.src}
            kind="subtitles"
            label={sub.label}
            lang={sub.language}
          />
        ))}
      </MediaProvider>
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  )
}
```

**Usage:**

```typescript
// HLS stream
<VidstackPlayer
  src="https://cdn.example.com/course/lesson1/index.m3u8"
  title="Bài 1: Giới thiệu"
  poster="https://cdn.example.com/thumbnail.jpg"
  onEnded={() => handleLessonComplete()}
/>

// MP4 file
<VidstackPlayer
  src="https://cdn.example.com/video.mp4"
  title="Video bài giảng"
/>
```

**Notes:**

- `@vidstack/react` handles HLS, DASH, MP4 automatically
- Import CSS files là bắt buộc cho default layout
- Custom layout: dùng `VideoLayout` từ vidstack
- Supports subtitles/captions qua `<Track />`
