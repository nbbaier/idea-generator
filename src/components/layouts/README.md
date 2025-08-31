# Layout Components

This directory contains reusable layout components and utilities for consistent styling and structure across the application.

## Components

### PageLayout

The main page wrapper that provides consistent padding, min-height, and gradient background.

```tsx
<PageLayout>
   <Container>{/* Your content */}</Container>
</PageLayout>
```

### Container

Provides consistent max-width and centering for content sections.

```tsx
<Container size="lg">
   {" "}
   {/* sm, md, lg, xl, full */}
   {/* Your content */}
</Container>
```

### Header

Standardized header component with title and optional description.

```tsx
<Header title="Page Title" description="Optional description text">
   {/* Optional additional content */}
</Header>
```

### Footer

Simple footer component for consistent footer styling.

```tsx
<Footer>
   <p>Footer content</p>
</Footer>
```

### ContentArea

Provides consistent spacing for main content sections.

```tsx
<ContentArea spacing="lg">
   {" "}
   {/* sm, md, lg */}
   {/* Your content sections */}
</ContentArea>
```

## Utilities

### layoutUtils

Predefined CSS classes for common layout patterns.

```tsx
import { layoutUtils } from "@/components/layouts";

<div className={layoutUtils.flexCenter}>
  {/* Centered content */}
</div>

<div className={layoutUtils.responsive.grid}>
  {/* Responsive grid */}
</div>
```

### combineClasses

Utility function to combine CSS classes safely.

```tsx
import { combineClasses } from "@/components/layouts";

<div className={combineClasses(
  layoutUtils.flexCenter,
  "additional-class",
  condition && "conditional-class"
)}>
```

## Usage Examples

### Basic Page Structure

```tsx
<PageLayout>
   <Container>
      <Header title="My Page" />
      <ContentArea>{/* Main content */}</ContentArea>
      <Footer>
         <p>© 2024</p>
      </Footer>
   </Container>
</PageLayout>
```

### Custom Layout

```tsx
<Container className="py-20">
   <div className={layoutUtils.responsive.flexWrap}>{/* Custom layout */}</div>
</Container>
```
