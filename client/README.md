This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

```
client
├─ .eslintrc.json
├─ .gitignore
├─ app
│  ├─ api
│  │  ├─ category
│  │  │  └─ route.ts
│  │  ├─ index.ts
│  │  ├─ product
│  │  │  └─ route.ts
│  │  └─ user
│  │     └─ route.ts
│  ├─ components
│  │  ├─ Banner
│  │  │  └─ index.tsx
│  │  ├─ Blog
│  │  │  └─ index.tsx
│  │  ├─ CustomImage
│  │  │  └─ index.tsx
│  │  ├─ CustomSlider
│  │  │  └─ index.tsx
│  │  ├─ DailySale
│  │  │  └─ index.tsx
│  │  ├─ FeatureProducts
│  │  │  └─ index.tsx
│  │  ├─ Footer
│  │  │  └─ index.tsx
│  │  ├─ FooterContent
│  │  │  └─ index.tsx
│  │  ├─ Header
│  │  │  └─ index.tsx
│  │  ├─ HotCollections
│  │  │  └─ index.tsx
│  │  ├─ index.ts
│  │  ├─ LoginForm
│  │  │  └─ index.tsx
│  │  ├─ MailNotify
│  │  │  └─ index.tsx
│  │  ├─ Navbar
│  │  │  └─ index.tsx
│  │  ├─ NewArrivals
│  │  │  └─ index.tsx
│  │  ├─ Product
│  │  │  └─ index.tsx
│  │  ├─ ProductCard
│  │  │  └─ index.tsx
│  │  ├─ ProductOptions
│  │  │  └─ index.tsx
│  │  ├─ SaleCountdown
│  │  │  └─ index.tsx
│  │  ├─ Seller
│  │  │  └─ index.tsx
│  │  ├─ Sidebar
│  │  │  └─ index.tsx
│  │  ├─ SignUpForm
│  │  │  └─ index.tsx
│  │  └─ TopHeader
│  │     └─ index.tsx
│  ├─ context
│  │  └─ reduxProvider.tsx
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ hooks
│  │  ├─ index.ts
│  │  └─ useCountdown.tsx
│  └─ pages
│     ├─ blogs
│     │  ├─ page.tsx
│     │  └─ [blogSlug]
│     │     └─ page.tsx
│     ├─ faqs
│     │  └─ page.tsx
│     ├─ forgot-password
│     │  └─ page.tsx
│     ├─ layout.tsx
│     ├─ login
│     │  └─ page.tsx
│     ├─ our-services
│     │  └─ page.tsx
│     ├─ page.tsx
│     ├─ products
│     │  ├─ page.tsx
│     │  └─ [productSlug]
│     │     └─ page.tsx
│     ├─ register
│     │  └─ page.tsx
│     └─ services
│        └─ page.tsx
├─ assets
│  ├─ icons
│  │  └─ index.ts
│  └─ images
│     ├─ banner-1.png
│     ├─ banner-2.png
│     ├─ banner.png
│     ├─ bottom-banner
│     │  ├─ bottom-banner-1.png
│     │  ├─ bottom-banner-2.png
│     │  ├─ bottom-banner-3.png
│     │  └─ bottom-banner-4.png
│     ├─ index.ts
│     └─ no-product-image.png
├─ axios
│  └─ index.ts
├─ constant
│  ├─ baseurl.ts
│  └─ index.ts
├─ hooks
├─ lib
│  ├─ features
│  ├─ hooks.ts
│  └─ store.ts
├─ next.config.js
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  ├─ next.svg
│  └─ vercel.svg
├─ README.md
├─ store
│  ├─ actions
│  │  └─ asyncAction.ts
│  ├─ index.ts
│  └─ slices
│     └─ appSlice.ts
├─ tailwind.config.ts
├─ tsconfig.json
├─ types
│  ├─ apiResponse.d.ts
│  ├─ category.d.ts
│  ├─ index.d.ts
│  ├─ product.d.ts
│  └─ redux.d.ts
└─ utils
   ├─ formatPrice.ts
   ├─ formatTime.ts
   ├─ index.ts
   ├─ navigation.ts
   ├─ passwordHashingClient.ts
   ├─ path.ts
   └─ renderStarFromNumber.tsx

```
```
client
├─ .eslintrc.json
├─ .gitignore
├─ app
│  ├─ api
│  │  ├─ category
│  │  │  └─ route.ts
│  │  ├─ index.ts
│  │  ├─ product
│  │  │  └─ route.ts
│  │  └─ user
│  │     └─ route.ts
│  ├─ components
│  │  ├─ Banner
│  │  │  └─ index.tsx
│  │  ├─ Blog
│  │  │  └─ index.tsx
│  │  ├─ CustomImage
│  │  │  └─ index.tsx
│  │  ├─ CustomSlider
│  │  │  └─ index.tsx
│  │  ├─ DailySale
│  │  │  └─ index.tsx
│  │  ├─ FeatureProducts
│  │  │  └─ index.tsx
│  │  ├─ Footer
│  │  │  └─ index.tsx
│  │  ├─ FooterContent
│  │  │  └─ index.tsx
│  │  ├─ Header
│  │  │  └─ index.tsx
│  │  ├─ HotCollections
│  │  │  └─ index.tsx
│  │  ├─ index.ts
│  │  ├─ LoginForm
│  │  │  └─ index.tsx
│  │  ├─ MailNotify
│  │  │  └─ index.tsx
│  │  ├─ Navbar
│  │  │  └─ index.tsx
│  │  ├─ NewArrivals
│  │  │  └─ index.tsx
│  │  ├─ Product
│  │  │  └─ index.tsx
│  │  ├─ ProductCard
│  │  │  └─ index.tsx
│  │  ├─ ProductOptions
│  │  │  └─ index.tsx
│  │  ├─ SaleCountdown
│  │  │  └─ index.tsx
│  │  ├─ Seller
│  │  │  └─ index.tsx
│  │  ├─ Sidebar
│  │  │  └─ index.tsx
│  │  ├─ SignUpForm
│  │  │  └─ index.tsx
│  │  └─ TopHeader
│  │     └─ index.tsx
│  ├─ context
│  │  └─ reduxProvider.tsx
│  ├─ favicon.ico
│  ├─ globals.css
│  └─ hooks
│     ├─ index.ts
│     └─ useCountdown.tsx
├─ assets
│  ├─ icons
│  │  └─ index.ts
│  └─ images
│     ├─ banner-1.png
│     ├─ banner-2.png
│     ├─ banner.png
│     ├─ bottom-banner
│     │  ├─ bottom-banner-1.png
│     │  ├─ bottom-banner-2.png
│     │  ├─ bottom-banner-3.png
│     │  └─ bottom-banner-4.png
│     ├─ index.ts
│     └─ no-product-image.png
├─ axios
│  └─ index.ts
├─ constant
│  ├─ baseurl.ts
│  └─ index.ts
├─ hooks
├─ lib
│  ├─ features
│  ├─ hooks.ts
│  └─ store.ts
├─ next.config.js
├─ package-lock.json
├─ package.json
├─ pages
│  ├─ blogs
│  │  ├─ page.tsx
│  │  └─ [blogSlug]
│  │     └─ page.tsx
│  ├─ faqs
│  │  └─ page.tsx
│  ├─ forgot-password
│  │  └─ page.tsx
│  ├─ index.tsx
│  ├─ layout.tsx
│  ├─ login
│  │  └─ page.tsx
│  ├─ our-services
│  │  └─ page.tsx
│  ├─ products
│  │  ├─ page.tsx
│  │  └─ [productSlug]
│  │     └─ page.tsx
│  ├─ register
│  │  └─ page.tsx
│  └─ services
│     └─ page.tsx
├─ postcss.config.js
├─ public
│  ├─ next.svg
│  └─ vercel.svg
├─ README.md
├─ store
│  ├─ actions
│  │  └─ asyncAction.ts
│  ├─ index.ts
│  └─ slices
│     └─ appSlice.ts
├─ tailwind.config.ts
├─ tsconfig.json
├─ types
│  ├─ apiResponse.d.ts
│  ├─ category.d.ts
│  ├─ index.d.ts
│  ├─ product.d.ts
│  └─ redux.d.ts
└─ utils
   ├─ formatPrice.ts
   ├─ formatTime.ts
   ├─ index.ts
   ├─ navigation.ts
   ├─ passwordHashingClient.ts
   ├─ path.ts
   └─ renderStarFromNumber.tsx

```