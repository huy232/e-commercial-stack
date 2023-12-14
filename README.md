
```
e-commercial-app
├─ client
│  ├─ .env.local
│  ├─ .eslintrc.json
│  ├─ app
│  │  ├─ api
│  │  │  ├─ home
│  │  │  │  └─ route.ts
│  │  │  └─ index.ts
│  │  ├─ components
│  │  │  ├─ Banner
│  │  │  │  └─ index.tsx
│  │  │  ├─ CustomImage
│  │  │  │  └─ index.tsx
│  │  │  ├─ Header
│  │  │  │  └─ index.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ Navbar
│  │  │  │  └─ index.tsx
│  │  │  └─ Sidebar
│  │  │     └─ index.tsx
│  │  ├─ context
│  │  │  └─ reduxProvider.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  └─ pages
│  │     ├─ (member)
│  │     ├─ (private)
│  │     └─ (public)
│  │        └─ login
│  │           └─ page.tsx
│  ├─ assets
│  │  ├─ icons
│  │  │  └─ index.ts
│  │  └─ images
│  │     └─ banner.png
│  ├─ axios
│  │  └─ index.ts
│  ├─ lib
│  │  ├─ features
│  │  └─ store.ts
│  ├─ next-env.d.ts
│  ├─ next.config.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ next.svg
│  │  └─ vercel.svg
│  ├─ README.md
│  ├─ store
│  │  ├─ actions
│  │  │  └─ asyncAction.ts
│  │  ├─ index.ts
│  │  └─ slices
│  │     └─ appSlice.ts
│  ├─ tailwind.config.ts
│  ├─ tsconfig.json
│  ├─ types
│  │  └─ category.d.ts
│  └─ utils
│     ├─ navigation.ts
│     └─ path.ts
├─ README.md
└─ server
   ├─ .env
   ├─ config
   │  ├─ cloudinary.config.ts
   │  └─ dbconnect.ts
   ├─ controllers
   │  ├─ controller
   │  │  ├─ blog.controller.ts
   │  │  ├─ blogCategory.controller.ts
   │  │  ├─ brand.controller.ts
   │  │  ├─ coupon.controller.ts
   │  │  ├─ insertData.controller.ts
   │  │  ├─ order.controller.ts
   │  │  ├─ product.controller.ts
   │  │  ├─ productCategory.controller.ts
   │  │  └─ user.controller.ts
   │  └─ index.ts
   ├─ data
   │  ├─ cate_brand.ts
   │  ├─ data2.json
   │  └─ ecommerce.json
   ├─ dist
   │  ├─ config
   │  │  ├─ cloudinary.config.js
   │  │  └─ dbconnect.js
   │  ├─ controllers
   │  │  ├─ controller
   │  │  │  ├─ blog.controller.js
   │  │  │  ├─ blogCategory.controller.js
   │  │  │  ├─ brand.controller.js
   │  │  │  ├─ coupon.controller.js
   │  │  │  ├─ insertData.controller.js
   │  │  │  ├─ order.controller.js
   │  │  │  ├─ product.controller.js
   │  │  │  ├─ productCategory.controller.js
   │  │  │  └─ user.controller.js
   │  │  └─ index.js
   │  ├─ data
   │  │  ├─ cate_brand.js
   │  │  └─ data2.json
   │  ├─ middlewares
   │  │  ├─ errorHandler.js
   │  │  ├─ jwt.js
   │  │  └─ verifyToken.js
   │  ├─ models
   │  │  ├─ index.js
   │  │  └─ model
   │  │     ├─ bill.model.js
   │  │     ├─ blog.model.js
   │  │     ├─ blogCategory.model.js
   │  │     ├─ brand.model.js
   │  │     ├─ coupon.model.js
   │  │     ├─ order.model.js
   │  │     ├─ product.model.js
   │  │     ├─ productCategory.model.js
   │  │     └─ user.model.js
   │  ├─ routes
   │  │  ├─ index.js
   │  │  ├─ route
   │  │  │  ├─ blog.route.js
   │  │  │  ├─ blogCategory.route.js
   │  │  │  ├─ brand.route.js
   │  │  │  ├─ coupon.route.js
   │  │  │  ├─ insertData.route.js
   │  │  │  ├─ order.route.js
   │  │  │  ├─ product.route.js
   │  │  │  ├─ productCategory.route.js
   │  │  │  └─ user.route.js
   │  │  └─ route.js
   │  ├─ server.js
   │  ├─ tsconfig-paths-bootstrap.js
   │  └─ utils
   │     ├─ calculateExpiry.js
   │     ├─ logger.js
   │     ├─ parseInteger.js
   │     └─ sendMail.js
   ├─ middlewares
   │  ├─ errorHandler.ts
   │  ├─ jwt.ts
   │  └─ verifyToken.ts
   ├─ models
   │  ├─ index.ts
   │  └─ model
   │     ├─ bill.model.ts
   │     ├─ blog.model.ts
   │     ├─ blogCategory.model.ts
   │     ├─ brand.model.ts
   │     ├─ coupon.model.ts
   │     ├─ order.model.ts
   │     ├─ product.model.ts
   │     ├─ productCategory.model.ts
   │     └─ user.model.ts
   ├─ package-lock.json
   ├─ package.json
   ├─ routes
   │  ├─ index.ts
   │  ├─ route
   │  │  ├─ blog.route.ts
   │  │  ├─ blogCategory.route.ts
   │  │  ├─ brand.route.ts
   │  │  ├─ coupon.route.ts
   │  │  ├─ insertData.route.ts
   │  │  ├─ order.route.ts
   │  │  ├─ product.route.ts
   │  │  ├─ productCategory.route.ts
   │  │  └─ user.route.ts
   │  └─ route.ts
   ├─ server.ts
   ├─ tsconfig-paths-bootstrap.ts
   ├─ tsconfig.json
   ├─ types
   │  └─ user.d.ts
   └─ utils
      ├─ calculateExpiry.ts
      ├─ logger.ts
      ├─ parseInteger.ts
      └─ sendMail.ts

```