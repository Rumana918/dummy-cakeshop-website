# 🍰 Sweet Whisk — Artisanal Bakery & Patisserie
### Production-Ready MERN Stack E-Commerce Platform

A bespoke, production-ready full-stack MERN application crafted for an artisanal boutique bakery. Featuring a dreamy light pastel aesthetic, responsive layouts, end-to-end customer order flows, personalized cake customizations, payment integrations, and a full-featured administrative control suite.

---

## ✨ Design Reference & Theme Palette

Crafted strictly adhering to a light pastel aesthetic with soft rounded edges, delicate shadows, and zero harsh dark colors:

| Token | Hex Code | Visual Application |
|---|---|---|
| **Cream White** | `#FFF9F3` | Main site canvas, primary background |
| **Blush Pink** | `#FDE8EC` | Secondary cards, pill badges, accent containers |
| **Pastel Rose** | `#F4A7B9` | Primary action buttons, highlights, brand badges |
| **Deep Rose** | `#8A5A64` | Primary brand headings, elegant serif typography |
| **Warm Brown** | `#6B5B5B` | Readable body copy, secondary navigation |
| **Butter Yellow** | `#FFE9A8` | Category highlights, ratings, best-seller tags |
| **Mint Cream** | `#DFF3E8` | 100% Eggless badges, stock availability tags |

* **Typography**: *Playfair Display* & *Newsreader* for headings; *Poppins* & *Plus Jakarta Sans* for clean, modern body typography.
* **Component Styling**: Rounded corners (`rounded-2xl`, `rounded-3xl`), soft ambient drop-shadows, and micro-interactions.

---

## 🛠️ Tech Stack Architecture

### Frontend (`/client`)
- **Core**: React 18 with Vite
- **Routing**: React Router v6 (Public, Private, and Admin Route Guards)
- **Styling**: Tailwind CSS with custom pastel design system configuration
- **Icons**: Google Material Symbols Outlined & Lucide Icons
- **State Management**: React Context API (`AuthContext`, `CartContext`, `WishlistContext`)
  - Guest cart with `localStorage` persistence
  - Seamless automatic cart merge upon customer login
- **HTTP Client**: Axios with centralized request interceptors and token management
- **Feedback**: React Hot Toast & Canvas Confetti for celebratory checkout moments

### Backend (`/server`)
- **Runtime**: Node.js (ES Modules syntax)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM (Indexes, Schemas, Cascading hooks)
- **Authentication**: JWT (JSON Web Tokens) with Bearer token & HTTP-only cookie support, bcryptjs password hashing
- **File & Media Storage**: Multer + Cloudinary (with **zero-config local disk fallback**)
- **Payment Processing**: Razorpay (UPI, Credit/Debit Cards, NetBanking) + Cash on Delivery (COD) (with **built-in sandbox mock simulation**)
- **Email Notifications**: Nodemailer HTML transactional emails (with **clean terminal preview fallback**)
- **Security & Reliability**: Helmet, CORS, Express Rate Limiting, Express Validator, Morgan logger

---

## 📁 Repository Structure

```
stitch_shop_name_bakery_website/
├── client/                          # React Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/                  # Static design graphics & illustrations
│   │   ├── components/              # Shared layout & reusable components
│   │   │   ├── AdminLayout.jsx      # Admin panel layout with pastel sidebar
│   │   │   ├── EmptyState.jsx       # Pastel empty states with illustration
│   │   │   ├── Footer.jsx           # Site-wide branded pastel footer
│   │   │   ├── LoadingSkeleton.jsx  # Shimmer loading skeleton placeholders
│   │   │   ├── Navbar.jsx           # Main navbar with live cart & wishlist counters
│   │   │   └── ProductCard.jsx      # Reusable cake card with quick-add & wishlist
│   │   ├── context/                 # Context providers
│   │   │   ├── AuthContext.jsx      # User authentication & address state
│   │   │   ├── CartContext.jsx      # Cart items, quantities & discounts
│   │   │   └── WishlistContext.jsx  # Customer saved favorites
│   │   ├── pages/                   # Customer storefront pages
│   │   │   ├── admin/               # Admin Control Center (13 modules)
│   │   │   │   ├── AdminCategories.jsx
│   │   │   │   ├── AdminCoupons.jsx
│   │   │   │   ├── AdminCustomers.jsx
│   │   │   │   ├── AdminCustomRequests.jsx
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminGallery.jsx
│   │   │   │   ├── AdminMessages.jsx
│   │   │   │   ├── AdminOrderDetail.jsx
│   │   │   │   ├── AdminOrders.jsx
│   │   │   │   ├── AdminProductForm.jsx
│   │   │   │   ├── AdminProducts.jsx
│   │   │   │   ├── AdminReviews.jsx
│   │   │   │   └── AdminSettings.jsx
│   │   │   ├── About.jsx            # Bakery story, philosophy & baker team
│   │   │   ├── Cart.jsx             # Shopping cart, quantity, coupon promo
│   │   │   ├── Checkout.jsx         # Multi-step checkout, slot picker, payments
│   │   │   ├── Contact.jsx          # Inquiry form, Google map, store hours
│   │   │   ├── CustomCake.jsx       # Bespoke cake builder with photo upload
│   │   │   ├── ForgotPassword.jsx   # Password recovery request
│   │   │   ├── Gallery.jsx          # Filterable pastry gallery with lightbox
│   │   │   ├── Home.jsx             # Hero banner, categories, best-sellers, custom CTA
│   │   │   ├── Login.jsx            # Customer & admin authentication
│   │   │   ├── Menu.jsx             # Product catalog with search, filters & sort
│   │   │   ├── MyOrders.jsx         # Order history & live status tracker
│   │   │   ├── NotFound.jsx         # Custom 404 pastel illustration page
│   │   │   ├── OrderSuccess.jsx     # Order confirmation with confetti
│   │   │   ├── ProductDetails.jsx   # Product page with weight variant pricing
│   │   │   ├── Profile.jsx          # Profile details & address book management
│   │   │   ├── ResetPassword.jsx    # Reset password with token verification
│   │   │   ├── Signup.jsx           # Customer registration
│   │   │   └── Wishlist.jsx         # Saved items with direct add-to-cart
│   │   ├── routes/
│   │   │   ├── AdminRoute.jsx       # Admin access protection guard
│   │   │   └── PrivateRoute.jsx     # Logged-in customer route guard
│   │   ├── services/
│   │   │   └── api.js               # Centralized Axios API definitions
│   │   ├── App.jsx                  # Main route configuration
│   │   ├── index.css                # Global Tailwind CSS directives
│   │   └── main.jsx                 # Client entry point
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                          # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection with retry logic
│   ├── controllers/                 # Express route controllers
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── categoryController.js
│   │   ├── contactController.js
│   │   ├── couponController.js
│   │   ├── customCakeController.js
│   │   ├── galleryController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── productController.js
│   │   ├── reviewController.js
│   │   ├── settingsController.js
│   │   └── wishlistController.js
│   ├── middleware/
│   │   ├── authMiddleware.js        # protect, adminOnly, optionalAuth
│   │   ├── errorMiddleware.js       # Global 404 & centralized error handler
│   │   └── uploadMiddleware.js      # Multer memory storage configuration
│   ├── models/                      # Mongoose Database Models
│   │   ├── Cart.js
│   │   ├── Category.js
│   │   ├── ContactMessage.js
│   │   ├── Coupon.js
│   │   ├── CustomCakeRequest.js
│   │   ├── GalleryImage.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── Review.js
│   │   ├── Settings.js
│   │   └── User.js
│   ├── routes/                      # REST API routing definitions
│   ├── seed/
│   │   └── seed.js                  # Initial database seeder script
│   ├── uploads/                     # Local fallback storage for uploaded files
│   ├── utils/
│   │   ├── cloudinary.js            # Cloudinary uploader with local disk fallback
│   │   ├── email.js                 # Transactional emails with preview simulation
│   │   └── generateToken.js         # JWT generation utility
│   ├── .env.example
│   ├── package.json
│   └── server.js                    # Main server entry & middleware setup
│
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **MongoDB** (Local instance running at `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI)

---

### 2. Backend Setup (`/server`)

1. Open a terminal in the root directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(The default `.env` already has functional defaults for local development, local MongoDB, mock payments, and local uploads)*.

4. Seed the database:
   Populates 6 pastry categories, 14 signature cakes, 4 discount coupons, store settings, demo admin, and customer accounts:
   ```bash
   npm run seed
   ```

5. Start the backend server:
   ```bash
   # Development with auto-restart
   npm run dev

   # Or standard start
   npm start
   ```
   The backend will be available at: **`http://localhost:5000`** (API: `http://localhost:5000/api`).

---

### 3. Frontend Setup (`/client`)

1. Open a second terminal window:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Points by default to `VITE_API_URL=http://localhost:5000/api`)*.

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The application will launch at: **`http://localhost:5173`**.

---

## 🔑 Default Accounts (Pre-Seeded)

| Account Role | Email | Password | Permissions |
|---|---|---|---|
| **Head Baker / Admin** | `admin@sweetwhisk.com` | `Admin@123` | Full access to `/admin` dashboard, product CRUD, orders, custom cake quotes, coupons, reviews, settings |
| **Demo Customer** | `demo@sweetwhisk.com` | `Customer@123` | Storefront browsing, cart, wishlist, placing orders, custom cake requests, profile & addresses |

---

## 🍰 Key Application Features

### 1. Customer Storefront
- **Home Page (`/`)**: Hero banner with CTA, category navigation pills, best-selling cakes carousel, why choose us highlights, customer testimonials, photo strip, and custom cake banner.
- **Menu & Filtering (`/menu`)**: Live search, category tabs, price range slider, sort by price/rating/newest, 100% eggless toggle, pagination, and quick-add to cart.
- **Product Details (`/product/:id`)**: High-res gallery preview, dynamic weight selector (`500g`, `1kg`, `2kg`) with instant price recalculation, flavor selection, cake message personalization input, delivery date picker, reviews tab with customer rating submission, and related cakes.
- **Custom Cake Builder (`/custom-cake`)**: Multi-step inquiry form for bespoke cakes (occasion, size, flavor, eggless preference, design notes, reference photo upload, delivery slot).
- **Cart (`/cart`)**: LocalStorage persistence, quantity controls, coupon promo application, order calculation (items, delivery fee, discount), and instant login sync.
- **Checkout (`/checkout`)**: Saved address book selector, new address entry with automatic profile saving, delivery slot selection, payment method choices (Razorpay UPI/Cards or COD).
- **Order Success (`/order-success/:orderId`)**: Celebratory confetti animation, order breakdown, delivery address, and one-click tracking.
- **Customer Portal**:
  - `/my-orders`: Order history, status timeline (`Pending` -> `Confirmed` -> `Baking` -> `Out for Delivery` -> `Delivered`), order cancellation (while Pending), and re-order button.
  - `/profile`: Customer personal info and saved delivery address manager.
  - `/wishlist`: Saved favorite pastries with instant one-click add to cart.
- **Content Pages**:
  - `/about`: Patisserie history, baking philosophy, and chef team.
  - `/gallery`: Filterable photo gallery with full-screen lightbox modal.
  - `/contact`: Interactive contact form saved to database with email alert, store hours, WhatsApp direct button, and Google Maps embed.

---

### 2. Admin Control Center (`/admin`)
- **Dashboard (`/admin`)**: Today's orders count, total revenue, pending orders, custom requests counter, customer count, 7-day sales bar chart, low stock alerts, and recent orders table.
- **Products Management (`/admin/products`)**: Add and edit cakes with weight variants, flavors, eggless flag, stock levels, image upload, and availability toggle.
- **Categories Management (`/admin/categories`)**: Create, update, and manage pastry categories.
- **Order Processing (`/admin/orders` & `/admin/orders/:id`)**: Comprehensive order fulfillment table, status updater pipeline, customer shipping details, payment status, and printable invoice generator.
- **Custom Cake Quotes (`/admin/custom-requests`)**: Review customer design requests & reference photos, calculate quote prices, update status, and automatically email quotes to the customer.
- **Customer Management (`/admin/customers`)**: View registered customers, total orders, and block/unblock accounts.
- **Review Moderation (`/admin/reviews`)**: Approve or remove customer product reviews.
- **Discount Coupons (`/admin/coupons`)**: Create promo codes with percentage or flat discounts, minimum spend thresholds, and expiry dates.
- **Gallery Management (`/admin/gallery`)**: Upload and manage portfolio photos.
- **Customer Inquiries (`/admin/messages`)**: Read and mark customer contact inquiries as responded.
- **Store Settings (`/admin/settings`)**: Configure bakery contact info, delivery fees, time slots, and social media links.

---

## 🛡️ Zero-Config Resilient Fallbacks

This application runs out-of-the-box without requiring mandatory paid third-party accounts:
1. **Cloudinary Fallback**: If `CLOUDINARY_CLOUD_NAME` is omitted or left as placeholder, all image uploads (cakes, custom references, categories) are automatically stored on the local filesystem in `/server/uploads` and served via static route.
2. **Razorpay Sandbox Simulation**: If placeholder keys are detected, the checkout seamlessly simulates a successful online UPI/Card transaction, creates mock transaction IDs, confirms the order, and updates tracking history.
3. **Nodemailer Terminal Preview**: If SMTP credentials are blank, all transactional order confirmations, status updates, and custom cake quotes are logged directly to the server terminal with preview summaries without failing.

---

## 📡 REST API Reference

| Endpoint | Method | Access | Description |
|---|---|---|---|
| `/api/auth/register` | POST | Public | Customer account registration |
| `/api/auth/login` | POST | Public | User & admin login |
| `/api/auth/me` | GET | Private | Get authenticated profile |
| `/api/products` | GET | Public | Paginated product list with search/filter |
| `/api/products/:id` | GET | Public | Get product details by ID or slug |
| `/api/products` | POST | Admin | Create product with image upload |
| `/api/products/:id` | PUT | Admin | Update product details |
| `/api/products/:id` | DELETE | Admin | Delete product |
| `/api/categories` | GET | Public | Get all active categories |
| `/api/cart` | GET | Public/Private | Retrieve customer/guest cart |
| `/api/cart` | POST | Public/Private | Add item with variants to cart |
| `/api/cart/:itemId` | PUT | Public/Private | Update cart item quantity |
| `/api/cart/:itemId` | DELETE | Public/Private | Remove item from cart |
| `/api/orders` | POST | Private | Create new order (COD or Razorpay) |
| `/api/orders/my` | GET | Private | List current user's orders |
| `/api/orders/:id` | GET | Private | Get single order details |
| `/api/orders/:id/cancel` | PUT | Private | Cancel order (Pending status only) |
| `/api/payment/create-order`| POST | Private | Initialize Razorpay payment order |
| `/api/payment/verify` | POST | Private | Verify Razorpay payment signature |
| `/api/custom-requests` | POST | Public/Private | Submit custom cake inquiry |
| `/api/custom-requests/my` | GET | Private | List customer's custom inquiries |
| `/api/coupons/apply` | POST | Public | Validate & apply coupon promo code |
| `/api/wishlist` | GET | Private | Get customer wishlist |
| `/api/wishlist/:productId`| POST | Private | Toggle product in customer wishlist |
| `/api/admin/stats` | GET | Admin | Revenue, orders, chart & low stock stats |
| `/api/admin/orders` | GET | Admin | All orders with status filtering |
| `/api/admin/orders/:id/status`| PUT | Admin | Update order fulfillment status |

---

## 🧪 Testing the Complete Order Lifecycle

1. **Browse & Customize**:
   - Go to `http://localhost:5173/menu`.
   - Click **Classic Red Velvet Cream Cheese Cake**.
   - Select weight `1kg`, flavor `White Chocolate Velvet`, enter custom text `"Happy Birthday Sophia"`, pick a delivery date, and click **Add to Cart**.
2. **Apply Coupon**:
   - View your cart at `http://localhost:5173/cart`.
   - Apply coupon `SWEET10` (10% off) or `WELCOME50` (₹50 off).
3. **Checkout**:
   - Proceed to checkout. Sign in with `demo@sweetwhisk.com` / `Customer@123` (or register a new user).
   - Select your address and delivery slot.
   - Choose **Cash on Delivery** or **Pay Online (Razorpay / Sandbox)** and click **Place Order**.
4. **Order Tracking**:
   - Review your order success screen with celebratory confetti.
   - Navigate to `/my-orders` to inspect live fulfillment progress.
5. **Admin Fulfillment**:
   - Log out and log in as `admin@sweetwhisk.com` / `Admin@123`.
   - Go to `/admin/orders`, select the newly created order.
   - Advance the status to `Baking` or `Out for Delivery`, and click **Print Invoice**.
   - View the updated revenue and order counters on the `/admin` dashboard!

---

## 📄 License
This project is built and maintained as a production-grade full-stack reference template for **Sweet Whisk Bakery & Patisserie**. All rights reserved.
