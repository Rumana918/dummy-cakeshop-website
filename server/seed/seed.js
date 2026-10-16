import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import GalleryImage from '../models/GalleryImage.js';
import Settings from '../models/Settings.js';
import Review from '../models/Review.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sweet_whisk_bakery';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[Seed]: Connected to database');

    // Clean existing collections
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();
    await GalleryImage.deleteMany();
    await Settings.deleteMany();
    await Review.deleteMany();
    console.log('[Seed]: Cleared existing collections');

    // 1. Seed Users (Admin & Customer)
    const admin = await User.create({
      name: 'Head Baker Admin',
      email: 'admin@sweetwhisk.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&auto=format&fit=crop&q=80',
      addresses: [
        {
          label: 'Bakery Studio',
          recipientName: 'Head Baker Admin',
          phone: '+91 98765 43210',
          street: '123 Pastry Lane, Sugarloaf District',
          city: 'Bloom City',
          state: 'Maharashtra',
          zipCode: '400001',
          isDefault: true
        }
      ]
    });

    const customer = await User.create({
      name: 'Sophia Patel',
      email: 'demo@sweetwhisk.com',
      password: 'Customer@123',
      role: 'user',
      phone: '+91 98765 12345',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      addresses: [
        {
          label: 'Home',
          recipientName: 'Sophia Patel',
          phone: '+91 98765 12345',
          street: 'Flat 402, Rosewood Heights, Magnolia Park',
          city: 'Bloom City',
          state: 'Maharashtra',
          zipCode: '400050',
          isDefault: true
        },
        {
          label: 'Office',
          recipientName: 'Sophia Patel',
          phone: '+91 98765 12345',
          street: 'Level 5, Horizon Cyber Park, Downtown',
          city: 'Bloom City',
          state: 'Maharashtra',
          zipCode: '400051',
          isDefault: false
        }
      ]
    });

    console.log('[Seed]: Created Admin and Customer accounts');

    // 2. Seed Categories
    const categoriesData = [
      {
        name: 'Signature Cakes',
        slug: 'signature-cakes',
        description: 'Multi-layered artisanal celebration masterpieces baked fresh daily.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8AR8aLkwldhhWlVixRMawkGzVz8flLcHkM09nAgd4v7hRvFJnPZS2rQA9O1foFy3n7fn90MvN-nz0pu3S34as04EQnmwNqvCMaC0jpvsyqQjO3se_KpP6zZo8OQOf_LmbJP80ND-iEojlqQn84u8R9R4i2xerdct9ArWa3NMo0QAHKAJikjhnek1rZsY6zJXBfxEJYehICqzO1-6wcHfPlSr69WYjTwxEgvcpP5CMizVF8nuH73ru',
        order: 1
      },
      {
        name: 'French Macarons',
        slug: 'macarons',
        description: 'Delicate Parisian meringue shells filled with rich ganache and preserves.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAB5He5Bcg1-iozyoW9sWmr-p5osZYszvJ9VrMWEAYwBGEgVP_50oemaRE3kOVmVkkIgItcfeP6MQbuRx_i4WwmpquONBceNYSXxnunTfmpT-aFLZ4JbFQbF3EqhV2WJpsJWS8DD2XYki2WINCql6nhwLuRqSAEo_PnAOhMzoHwTRy4btDJspRfYXal_Kn_Q83L03HI4YVSPqmJ5161hR98v3_HoOX4DGvhLjKnb8f0qxqCLw9ApeqC',
        order: 2
      },
      {
        name: 'Cupcakes & Treats',
        slug: 'cupcakes',
        description: 'Fluffy individual cakes crowned with velvety floral swirls.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1INgnhacS7t64Pk-h5371Iac_0bGQPKmllV-xrPm6An8cjAJdvM0ytG8LXj6nD98tQJq_X3qBf1U_GEVIlKaHeeX7k3UKmSB7JKqvjsQY1Awkc5Sw15KnFTKD4-XyAmHiLvbAYKkxivCjOCGTk-5hqPnpDolwYcimxyov0YZe3hDS7Dvy9z3xcYJV5J6uXyKMg5SvGuoJ3zwBMWSrXLs7MC05Een8CKHMTrW7GF7OkmJejYjALMUH',
        order: 3
      },
      {
        name: 'Wedding & Bespoke',
        slug: 'wedding',
        description: 'Spectacular multi-tiered centerpieces customized for your milestone.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8d8EWw28dEDis225OepAjgzVUqJ3moABnr4FPUhsmwt5ujJqTVS-NQtJOP247W6AUwbzFQX6cyMBJnek6tT8piJRDKh8nOYqf5GdWOw7C6L0XJpKmUThOkNLKz_X_TGxFxXbUFcLVJqGDO8hF2g9ELFYD6DFpg0c0HSQEIy1LI8Ikh7-nTk-f9_-9zl1fo06FnL_3CrGKBLh9cYR6OJk_7cX9YmBIqG6DoR8hD6Wypf8xZufNtbMc',
        order: 4
      },
      {
        name: 'Birthday Specials',
        slug: 'birthday',
        description: 'Joyful, colorful, and dreamy cakes made to blow candles in style.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVpULMsjNNStgGGl9ON5NQfN_H6uurOrBYeVKbSaWwSjWiGYY5BV5a6R2l3u_fdoNRmnEUcMqI6LSDzO9dgHP_-i0d23eRl1QEBApjWki7DkGCNsKdCUUDGCBPLdd6s_iXFbfYZ9T4jysgnlEPVpyfR6JAtxUTe9gZSD7qljPxVVV4bOzC2fjUh4PQgk5Olx-21zGtrM-I51CZ0mIPpKf-J-IIT8D-PkSmnJ76GKBJB76DJM69jfpw',
        order: 5
      },
      {
        name: 'Artisanal Pastries',
        slug: 'pastries',
        description: 'Flaky French croissants, tarts, and buttery morning pastries.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3ceCVi4-0PsFwvtaybdY_R_S9E2tjZSHdNRLQpFexJsSctcKvq9Ol0lyMBkfDDyb5axEfzStxwpBQXqmeOpMulwoT8PGbSMmCy9hC613pIvMRS0rpkQFkXO0jTdosXw86J_Aj8UljYpeRP7zAhfPc0xCACgGmmlio7w12nS_765NYDdY1m1mpkcJutEdSqIBz4n_8OVxi3quBpiA5o4yD8mwPFpy5Mv7T71-3DqAA8qWMeww6ttB0',
        order: 6
      }
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`[Seed]: Created ${createdCategories.length} categories`);

    const getCat = (slug) => createdCategories.find(c => c.slug === slug)._id;

    // 3. Seed 14 Sample Cakes & Products
    const productsData = [
      {
        name: 'Pistachio Raspberry Bloom Cake',
        slug: 'pistachio-raspberry-bloom-cake',
        description: 'Delicate pistachio sponge layered with tart organic raspberry compote, velvety white chocolate buttercream, and crushed Iranian pistachios.',
        category: getCat('signature-cakes'),
        basePrice: 850,
        variants: [
          { weight: '500g', price: 850 },
          { weight: '1kg', price: 1550 },
          { weight: '2kg', price: 2950 }
        ],
        flavors: ['Classic Pistachio', 'Vanilla Bean Infusion', 'Dark Chocolate Twist'],
        isEggless: true,
        ingredients: 'Organic flour, cultured French butter, Iranian pistachios, fresh raspberries, Belgian white chocolate, organic sugar, Madagascar vanilla.',
        stock: 25,
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDVpULMsjNNStgGGl9ON5NQfN_H6uurOrBYeVKbSaWwSjWiGYY5BV5a6R2l3u_fdoNRmnEUcMqI6LSDzO9dgHP_-i0d23eRl1QEBApjWki7DkGCNsKdCUUDGCBPLdd6s_iXFbfYZ9T4jysgnlEPVpyfR6JAtxUTe9gZSD7qljPxVVV4bOzC2fjUh4PQgk5Olx-21zGtrM-I51CZ0mIPpKf-J-IIT8D-PkSmnJ76GKBJB76DJM69jfpw',
          'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&auto=format&fit=crop&q=80'
        ],
        isFeatured: true,
        isBestSeller: true,
        isAvailable: true,
        rating: 4.9,
        numReviews: 32
      },
      {
        name: 'Belgian Dark Chocolate Ganache Truffle',
        slug: 'belgian-dark-chocolate-ganache-truffle',
        description: 'Rich, moist chocolate sponge infused with espresso notes and frosted with a glossy 70% Callebaut dark chocolate mirror glaze and 24k edible gold flakes.',
        category: getCat('signature-cakes'),
        basePrice: 900,
        variants: [
          { weight: '500g', price: 900 },
          { weight: '1kg', price: 1650 },
          { weight: '2kg', price: 3100 }
        ],
        flavors: ['70% Dark Truffle', 'Mocha Hazelnut', 'Salted Caramel Crunch'],
        isEggless: false,
        ingredients: 'Callebaut Belgian dark chocolate, double cream, Dutch cocoa powder, free-range eggs, organic flour, espresso, edible gold foil.',
        stock: 18,
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuB8AR8aLkwldhhWlVixRMawkGzVz8flLcHkM09nAgd4v7hRvFJnPZS2rQA9O1foFy3n7fn90MvN-nz0pu3S34as04EQnmwNqvCMaC0jpvsyqQjO3se_KpP6zZo8OQOf_LmbJP80ND-iEojlqQn84u8R9R4i2xerdct9ArWa3NMo0QAHKAJikjhnek1rZsY6zJXBfxEJYehICqzO1-6wcHfPlSr69WYjTwxEgvcpP5CMizVF8nuH73ru',
          'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80'
        ],
        isFeatured: true,
        isBestSeller: true,
        isAvailable: true,
        rating: 5.0,
        numReviews: 48
      },
      {
        name: 'Fresh Strawberry Chantilly Cream Cake',
        slug: 'fresh-strawberry-chantilly-cream-cake',
        description: 'Light-as-air vanilla chiffon cake cushioned between pillowy fresh Chantilly cream and sweet, hand-selected seasonal strawberries.',
        category: getCat('birthday'),
        basePrice: 799,
        variants: [
          { weight: '500g', price: 799 },
          { weight: '1kg', price: 1450 },
          { weight: '2kg', price: 2750 }
        ],
        flavors: ['Strawberry Chantilly', 'Vanilla Sponge', 'White Berry Swirl'],
        isEggless: true,
        ingredients: 'Fresh strawberries, dairy whipped cream, organic vanilla bean, unbleached flour, cane sugar, pure butter.',
        stock: 15,
        images: [
          'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&auto=format&fit=crop&q=80'
        ],
        isFeatured: true,
        isBestSeller: true,
        isAvailable: true,
        rating: 4.8,
        numReviews: 29
      },
      {
        name: 'Classic Red Velvet Cream Cheese Cake',
        slug: 'classic-red-velvet-cream-cheese-cake',
        description: 'Velvety crimson buttermilk sponge with a hint of cocoa, crowned with luscious tangy cream cheese frosting and fine velvet crumbs.',
        category: getCat('birthday'),
        basePrice: 750,
        variants: [
          { weight: '500g', price: 750 },
          { weight: '1kg', price: 1399 },
          { weight: '2kg', price: 2650 }
        ],
        flavors: ['Classic Cream Cheese', 'White Chocolate Velvet'],
        isEggless: true,
        ingredients: 'Buttermilk, Philadelphia cream cheese, cocoa powder, butter, vanilla extract, flour, beet reduction.',
        stock: 20,
        images: [
          'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=800&auto=format&fit=crop&q=80'
        ],
        isFeatured: true,
        isBestSeller: false,
        isAvailable: true,
        rating: 4.9,
        numReviews: 19
      },
      {
        name: 'Pastel French Macaron Gift Box (12 pcs)',
        slug: 'pastel-french-macaron-gift-box-12',
        description: 'A curated luxury box of 12 hand-piped Parisian macarons: Pistachio, Raspberry Rose, Salted Caramel, Meyer Lemon, Dark Chocolate, and Tahitian Vanilla.',
        category: getCat('macarons'),
        basePrice: 699,
        variants: [
          { weight: 'Box of 6', price: 380 },
          { weight: 'Box of 12', price: 699 },
          { weight: 'Box of 24', price: 1350 }
        ],
        flavors: ['Assorted Chef Special', 'All Berry Flavors', 'Chocolate & Caramel Lovers'],
        isEggless: false,
        ingredients: 'Almond flour, powdered sugar, egg whites, fruit purées, Belgian chocolate ganache, butter.',
        stock: 30,
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAB5He5Bcg1-iozyoW9sWmr-p5osZYszvJ9VrMWEAYwBGEgVP_50oemaRE3kOVmVkkIgItcfeP6MQbuRx_i4WwmpquONBceNYSXxnunTfmpT-aFLZ4JbFQbF3EqhV2WJpsJWS8DD2XYki2WINCql6nhwLuRqSAEo_PnAOhMzoHwTRy4btDJspRfYXal_Kn_Q83L03HI4YVSPqmJ5161hR98v3_HoOX4DGvhLjKnb8f0qxqCLw9ApeqC',
          'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=800&auto=format&fit=crop&q=80'
        ],
        isFeatured: true,
        isBestSeller: true,
        isAvailable: true,
        rating: 4.9,
        numReviews: 54
      },
      {
        name: 'Vanilla Bean & Rose Cupcake Assortment (6pk)',
        slug: 'vanilla-bean-rose-cupcake-assortment-6pk',
        description: 'Madagascar Bourbon vanilla bean sponge topped with cloud-like whipped rose buttercream, fresh raspberries, and edible gold pearl dust.',
        category: getCat('cupcakes'),
        basePrice: 550,
        variants: [
          { weight: 'Box of 4', price: 380 },
          { weight: 'Box of 6', price: 550 },
          { weight: 'Box of 12', price: 1050 }
        ],
        flavors: ['Rose & Vanilla Swirl', 'Raspberry Buttercream', 'Lemon Zest'],
        isEggless: true,
        ingredients: 'Bourbon vanilla bean, unsalted butter, organic flour, cane sugar, raspberry reduction, rose water.',
        stock: 22,
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuA6MSeg_Epy4Z3YNc0cIrmG56hDMxH82oVk7v7RXPIPZa6udHgy6BfxdGye6Z4LoGWXZMDrULAF3t6MJeVb4cqH0j1zv4Zi5jQWh0YBLQGj1dCFBLcWiCq0m_JBaZtnRIT1RMWKN-3lJWVuJ0bQg-3O7cssL4ZEpCyZJqMwRq4k7bNVGKYp8TKWQNE6Fdw4P0V-yqQelVZeHCs1bbu82j5cRMZLBtUHcgVuvKCgjJrwYucuFjKOTr7e',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuD1INgnhacS7t64Pk-h5371Iac_0bGQPKmllV-xrPm6An8cjAJdvM0ytG8LXj6nD98tQJq_X3qBf1U_GEVIlKaHeeX7k3UKmSB7JKqvjsQY1Awkc5Sw15KnFTKD4-XyAmHiLvbAYKkxivCjOCGTk-5hqPnpDolwYcimxyov0YZe3hDS7Dvy9z3xcYJV5J6uXyKMg5SvGuoJ3zwBMWSrXLs7MC05Een8CKHMTrW7GF7OkmJejYjALMUH'
        ],
        isFeatured: false,
        isBestSeller: true,
        isAvailable: true,
        rating: 4.8,
        numReviews: 21
      },
      {
        name: 'Elegance Ivory & Botanical Wedding Cake',
        slug: 'elegance-ivory-botanical-wedding-cake',
        description: 'Three-tiered architectural celebration cake finished with textured ivory buttercream, handcrafted sugar peonies, and cascading silver-dollar eucalyptus.',
        category: getCat('wedding'),
        basePrice: 3200,
        variants: [
          { weight: '2kg (20-25 servings)', price: 3200 },
          { weight: '3.5kg (35-40 servings)', price: 5400 },
          { weight: '5kg (50-60 servings)', price: 7800 }
        ],
        flavors: ['Elderflower Lemon & White Berry', 'Belgian Chocolate Praline', 'Champagne Strawberry'],
        isEggless: true,
        ingredients: 'Organic unbleached flour, European butter, vanilla bean paste, hand-spun sugar florals, elderflower syrup.',
        stock: 5,
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuB8d8EWw28dEDis225OepAjgzVUqJ3moABnr4FPUhsmwt5ujJqTVS-NQtJOP247W6AUwbzFQX6cyMBJnek6tT8piJRDKh8nOYqf5GdWOw7C6L0XJpKmUThOkNLKz_X_TGxFxXbUFcLVJqGDO8hF2g9ELFYD6DFpg0c0HSQEIy1LI8Ikh7-nTk-f9_-9zl1fo06FnL_3CrGKBLh9cYR6OJk_7cX9YmBIqG6DoR8hD6Wypf8xZufNtbMc',
          'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&auto=format&fit=crop&q=80'
        ],
        isFeatured: true,
        isBestSeller: false,
        isAvailable: true,
        rating: 5.0,
        numReviews: 12
      },
      {
        name: 'Lavender Honey & Wild Blueberry Layer Cake',
        slug: 'lavender-honey-wild-blueberry-layer-cake',
        description: 'Floral-infused sponge subtly sweetened with organic mountain wildflower honey, filled with homemade wild blueberry compote and lavender buttercream.',
        category: getCat('signature-cakes'),
        basePrice: 820,
        variants: [
          { weight: '500g', price: 820 },
          { weight: '1kg', price: 1490 },
          { weight: '2kg', price: 2800 }
        ],
        flavors: ['Lavender Honey', 'Wild Blueberry Swirl', 'Earl Grey Tea Infusion'],
        isEggless: true,
        ingredients: 'Wild blueberries, culinary lavender, organic mountain honey, European butter, flour, vanilla.',
        stock: 12,
        images: [
          'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1562440499-64c9a111f713?w=800&auto=format&fit=crop&q=80'
        ],
        isFeatured: false,
        isBestSeller: false,
        isAvailable: true,
        rating: 4.7,
        numReviews: 15
      },
      {
        name: 'Matcha White Chocolate Mousse Cake',
        slug: 'matcha-white-chocolate-mousse-cake',
        description: 'Authentic ceremonial grade Uji matcha sponge paired with silky white chocolate mousse, dark matcha ganache, and edible flower blossoms.',
        category: getCat('signature-cakes'),
        basePrice: 950,
        variants: [
          { weight: '500g', price: 950 },
          { weight: '1kg', price: 1750 },
          { weight: '2kg', price: 3300 }
        ],
        flavors: ['Ceremonial Matcha', 'Matcha Mint', 'Matcha Strawberry'],
        isEggless: true,
        ingredients: 'Uji matcha green tea powder, Belgian white chocolate, fresh cream, sponge cake, edible pansies.',
        stock: 14,
        images: [
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80'
        ],
        isFeatured: false,
        isBestSeller: false,
        isAvailable: true,
        rating: 4.9,
        numReviews: 16
      },
      {
        name: 'Flaky French Butter Croissant (Pack of 4)',
        slug: 'flaky-french-butter-croissant-pack-of-4',
        description: 'Laminated with premium cultured French butter for hundreds of shatteringly crisp, airy layers with a tender, honeycomb center.',
        category: getCat('pastries'),
        basePrice: 420,
        variants: [
          { weight: 'Pack of 2', price: 220 },
          { weight: 'Pack of 4', price: 420 },
          { weight: 'Pack of 8', price: 800 }
        ],
        flavors: ['Classic French Butter', 'Almond Frangipane', 'Pain au Chocolat'],
        isEggless: false,
        ingredients: 'French T55 flour, 84% butterfat cultured butter, milk, sugar, sea salt, yeast.',
        stock: 35,
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuC3ceCVi4-0PsFwvtaybdY_R_S9E2tjZSHdNRLQpFexJsSctcKvq9Ol0lyMBkfDDyb5axEfzStxwpBQXqmeOpMulwoT8PGbSMmCy9hC613pIvMRS0rpkQFkXO0jTdosXw86J_Aj8UljYpeRP7zAhfPc0xCACgGmmlio7w12nS_765NYDdY1m1mpkcJutEdSqIBz4n_8OVxi3quBpiA5o4yD8mwPFpy5Mv7T71-3DqAA8qWMeww6ttB0'
        ],
        isFeatured: false,
        isBestSeller: true,
        isAvailable: true,
        rating: 4.9,
        numReviews: 42
      },
      {
        name: 'Lotus Biscoff Caramel Cheesecake',
        slug: 'lotus-biscoff-caramel-cheesecake',
        description: 'Creamy slow-baked New York style cheesecake on a crunchy Lotus speculoos biscuit crust, smothered in melted Biscoff spread and golden crumbs.',
        category: getCat('signature-cakes'),
        basePrice: 880,
        variants: [
          { weight: '500g', price: 880 },
          { weight: '1kg', price: 1600 },
          { weight: '2kg', price: 3000 }
        ],
        flavors: ['Biscoff Caramel', 'Dark Chocolate Biscoff'],
        isEggless: true,
        ingredients: 'Philadelphia cream cheese, Lotus Biscoff cookies & spread, sour cream, butter, brown sugar.',
        stock: 16,
        images: [
          'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=800&auto=format&fit=crop&q=80'
        ],
        isFeatured: true,
        isBestSeller: true,
        isAvailable: true,
        rating: 5.0,
        numReviews: 38
      },
      {
        name: 'Pastel Rainbow Funfetti Celebration Cake',
        slug: 'pastel-rainbow-funfetti-celebration-cake',
        description: 'Vibrant four-layer pastel vanilla sponge speckled with colorful sprinkles, layered with smooth Swiss meringue buttercream and a soft pink chocolate drip.',
        category: getCat('birthday'),
        basePrice: 790,
        variants: [
          { weight: '500g', price: 790 },
          { weight: '1kg', price: 1450 },
          { weight: '2kg', price: 2750 }
        ],
        flavors: ['Vanilla Funfetti', 'Strawberry Funfetti', 'Bubblegum Cream'],
        isEggless: true,
        ingredients: 'Flour, sugar, natural food coloring sprinkles, Swiss meringue buttercream, white chocolate drip.',
        stock: 20,
        images: [
          'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop&q=80'
        ],
        isFeatured: true,
        isBestSeller: false,
        isAvailable: true,
        rating: 4.8,
        numReviews: 18
      },
      {
        name: 'Meyer Lemon Curd & Elderflower Tart',
        slug: 'meyer-lemon-curd-elderflower-tart',
        description: 'Crisp buttery Pâte Sablée tart shell filled with zesty Meyer lemon curd, crowned with torched Italian meringue peaks and edible marigolds.',
        category: getCat('pastries'),
        basePrice: 580,
        variants: [
          { weight: 'Individual (Set of 2)', price: 320 },
          { weight: 'Large Tart (6-8 slices)', price: 580 }
        ],
        flavors: ['Meyer Lemon Elderflower', 'Lime & Basil Tart'],
        isEggless: false,
        ingredients: 'Meyer lemon juice, free-range egg yolks, butter, tart crust, sugar, Italian meringue.',
        stock: 14,
        images: [
          'https://images.unsplash.com/photo-1519869325930-281384150729?w=800&auto=format&fit=crop&q=80'
        ],
        isFeatured: false,
        isBestSeller: false,
        isAvailable: true,
        rating: 4.7,
        numReviews: 11
      },
      {
        name: 'Flourless Dark Chocolate Berry Torte',
        slug: 'flourless-dark-chocolate-berry-torte',
        description: 'Decadent gluten-friendly torte crafted with 72% single-origin dark chocolate, dusted with raw Dutch cocoa and topped with wild blackberries.',
        category: getCat('signature-cakes'),
        basePrice: 920,
        variants: [
          { weight: '500g', price: 920 },
          { weight: '1kg', price: 1680 }
        ],
        flavors: ['Dark Chocolate Blackberry', 'Chocolate Orange Infusion'],
        isEggless: false,
        ingredients: '72% dark chocolate, butter, eggs, sugar, raw cocoa, fresh blackberries.',
        stock: 10,
        images: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAoGwD4TH6YE4dxdn3HBdDy5I9tPDDT8cOAXzwlmYziVGEZzYeNJXde_M-0ZkUuOXEPqalw1SrSHp0oLlCeerf8LF1yEv3Bbc9cAq5__X2VHcBMZaWInOM1ZLneukYtInOtKHxBqlrcaccly9_Xs5tg4-qF4aWLj9OwN7MOnDkveLFvTWKtBBT-GmYQ4qowMeqF_AxuNFfpDWw3Is_eMoVmcu6nCuHV16wwnhqxomgXp88NR_mkOmt_'
        ],
        isFeatured: false,
        isBestSeller: false,
        isAvailable: true,
        rating: 4.9,
        numReviews: 24
      }
    ];

    const createdProducts = await Product.insertMany(productsData);
    console.log(`[Seed]: Created ${createdProducts.length} delicious cakes`);

    // 4. Seed Reviews for the first product
    await Review.create({
      product: createdProducts[0]._id,
      user: customer._id,
      userName: customer.name,
      rating: 5,
      title: 'Absolute perfection!',
      comment: 'Ordered this Pistachio Raspberry cake for my sister’s birthday and it was the highlight of the evening. Not overly sweet, beautifully balanced, and smelled wonderful!',
      isApproved: true
    });

    await Review.create({
      product: createdProducts[1]._id,
      user: customer._id,
      userName: 'Eleanor Vance',
      rating: 5,
      title: 'Decadent chocolate heaven',
      comment: 'The glaze on this cake was like a mirror! The richest, smoothest chocolate cake I have had in the city. Will definitely reorder.',
      isApproved: true
    });

    // 5. Seed Coupons
    const couponsData = [
      {
        code: 'SWEET10',
        discountType: 'percent',
        discountValue: 10,
        minOrderValue: 499,
        maxDiscount: 200,
        expiryDate: new Date('2028-12-31'),
        usageLimit: 500,
        usedCount: 14,
        isActive: true
      },
      {
        code: 'WELCOME50',
        discountType: 'flat',
        discountValue: 50,
        minOrderValue: 299,
        expiryDate: new Date('2028-12-31'),
        usageLimit: 1000,
        usedCount: 45,
        isActive: true
      },
      {
        code: 'CELEBRATE20',
        discountType: 'percent',
        discountValue: 20,
        minOrderValue: 1500,
        maxDiscount: 500,
        expiryDate: new Date('2028-12-31'),
        usageLimit: 200,
        usedCount: 8,
        isActive: true
      },
      {
        code: 'YUMMY100',
        discountType: 'flat',
        discountValue: 100,
        minOrderValue: 899,
        expiryDate: new Date('2028-12-31'),
        usageLimit: 300,
        usedCount: 22,
        isActive: true
      }
    ];

    await Coupon.insertMany(couponsData);
    console.log(`[Seed]: Created ${couponsData.length} promotional coupons`);

    // 6. Seed Gallery Images
    const galleryData = [
      {
        title: 'Peony Blush Wedding Tier',
        category: 'Weddings',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8d8EWw28dEDis225OepAjgzVUqJ3moABnr4FPUhsmwt5ujJqTVS-NQtJOP247W6AUwbzFQX6cyMBJnek6tT8piJRDKh8nOYqf5GdWOw7C6L0XJpKmUThOkNLKz_X_TGxFxXbUFcLVJqGDO8hF2g9ELFYD6DFpg0c0HSQEIy1LI8Ikh7-nTk-f9_-9zl1fo06FnL_3CrGKBLh9cYR6OJk_7cX9YmBIqG6DoR8hD6Wypf8xZufNtbMc',
        description: 'Hand-sculpted sugar flowers and delicate pearl dust.',
        isFeatured: true
      },
      {
        title: 'Parisian Pastel Macaron Tower',
        category: 'Pastries',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAB5He5Bcg1-iozyoW9sWmr-p5osZYszvJ9VrMWEAYwBGEgVP_50oemaRE3kOVmVkkIgItcfeP6MQbuRx_i4WwmpquONBceNYSXxnunTfmpT-aFLZ4JbFQbF3EqhV2WJpsJWS8DD2XYki2WINCql6nhwLuRqSAEo_PnAOhMzoHwTRy4btDJspRfYXal_Kn_Q83L03HI4YVSPqmJ5161hR98v3_HoOX4DGvhLjKnb8f0qxqCLw9ApeqC',
        description: 'Gradient assortment arranged for an upscale dessert table.',
        isFeatured: true
      },
      {
        title: 'Rose & Vanilla Buttercream Swirls',
        category: 'Cupcakes',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1INgnhacS7t64Pk-h5371Iac_0bGQPKmllV-xrPm6An8cjAJdvM0ytG8LXj6nD98tQJq_X3qBf1U_GEVIlKaHeeX7k3UKmSB7JKqvjsQY1Awkc5Sw15KnFTKD4-XyAmHiLvbAYKkxivCjOCGTk-5hqPnpDolwYcimxyov0YZe3hDS7Dvy9z3xcYJV5J6uXyKMg5SvGuoJ3zwBMWSrXLs7MC05Een8CKHMTrW7GF7OkmJejYjALMUH',
        description: 'Garnished with edible petals and gold flakes.',
        isFeatured: true
      },
      {
        title: 'Dark Chocolate Mirror Ganache',
        category: 'Birthdays',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8AR8aLkwldhhWlVixRMawkGzVz8flLcHkM09nAgd4v7hRvFJnPZS2rQA9O1foFy3n7fn90MvN-nz0pu3S34as04EQnmwNqvCMaC0jpvsyqQjO3se_KpP6zZo8OQOf_LmbJP80ND-iEojlqQn84u8R9R4i2xerdct9ArWa3NMo0QAHKAJikjhnek1rZsY6zJXBfxEJYehICqzO1-6wcHfPlSr69WYjTwxEgvcpP5CMizVF8nuH73ru',
        description: 'Deep cocoa luster with a velvety gold crown.',
        isFeatured: true
      },
      {
        title: 'Artisanal Morning Viennoiserie',
        category: 'Pastries',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3ceCVi4-0PsFwvtaybdY_R_S9E2tjZSHdNRLQpFexJsSctcKvq9Ol0lyMBkfDDyb5axEfzStxwpBQXqmeOpMulwoT8PGbSMmCy9hC613pIvMRS0rpkQFkXO0jTdosXw86J_Aj8UljYpeRP7zAhfPc0xCACgGmmlio7w12nS_765NYDdY1m1mpkcJutEdSqIBz4n_8OVxi3quBpiA5o4yD8mwPFpy5Mv7T71-3DqAA8qWMeww6ttB0',
        description: 'Freshly baked croissants and pains au chocolat.',
        isFeatured: true
      },
      {
        title: 'Signature Berry Tart & Pistachio Cake',
        category: 'Custom Cakes',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVpULMsjNNStgGGl9ON5NQfN_H6uurOrBYeVKbSaWwSjWiGYY5BV5a6R2l3u_fdoNRmnEUcMqI6LSDzO9dgHP_-i0d23eRl1QEBApjWki7DkGCNsKdCUUDGCBPLdd6s_iXFbfYZ9T4jysgnlEPVpyfR6JAtxUTe9gZSD7qljPxVVV4bOzC2fjUh4PQgk5Olx-21zGtrM-I51CZ0mIPpKf-J-IIT8D-PkSmnJ76GKBJB76DJM69jfpw',
        description: 'Delicate floral motifs with natural fruit compote.',
        isFeatured: true
      }
    ];

    await GalleryImage.insertMany(galleryData);
    console.log(`[Seed]: Created ${galleryData.length} gallery images`);

    // 7. Seed Default Settings
    await Settings.create({
      shopName: 'Sweet Whisk',
      tagline: 'Artisanal Bakery & Patisserie',
      logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2tF1YpvT9zih0-5StXLRF-P413DlxukJ7BfnahPwAWITkYtg8dKf75TYjUIgft_LfYuwG2kD1kLj0BwQde3ZxXFNStOI31TnwjwVRyeXbNHmRTBMBQiEqrKxFBY4L37E1N1osFy13Kqwap5Yz1w6M68mxKPUhx63kHbZJKvPOqDLl_j-Q9sDHEZzAYCqFTWHP3rq0e7s19oOdcnFvbMpMo5AjfxPcjBzP5JHgM7lfV35G-hu-L5gT',
      heroBanner: {
        badge: 'Artisanal Bakery & Patisserie',
        title: 'Handcrafted with Love & Sweetness',
        subtitle: 'Experience the pure bliss of organic ingredients, traditional French techniques, and a modern artisanal touch in every single bite. Baked fresh daily for your sweetest moments.',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVpULMsjNNStgGGl9ON5NQfN_H6uurOrBYeVKbSaWwSjWiGYY5BV5a6R2l3u_fdoNRmnEUcMqI6LSDzO9dgHP_-i0d23eRl1QEBApjWki7DkGCNsKdCUUDGCBPLdd6s_iXFbfYZ9T4jysgnlEPVpyfR6JAtxUTe9gZSD7qljPxVVV4bOzC2fjUh4PQgk5Olx-21zGtrM-I51CZ0mIPpKf-J-IIT8D-PkSmnJ76GKBJB76DJM69jfpw',
        specialTitle: 'Matcha White Chocolate Croissant & Rose Latte Combo',
        specialOriginalPrice: 999,
        specialDiscountedPrice: 749
      },
      contact: {
        address: '123 Pastry Lane, Sugarloaf District, Bloom City, 400001',
        email: 'hello@sweetwhisk.com',
        phone: '+91 98765 43210',
        whatsapp: '919876543210',
        openingHoursWeekdays: 'Mon - Fri: 7:00 AM - 7:00 PM',
        openingHoursWeekends: 'Sat - Sun: 8:00 AM - 6:00 PM',
        googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.56206308527!2d77.2090212!3d28.6139391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzUwLjIiTiA3N8KwMTInMzIuNSJF!5e0!3m2!1sen!2sin!4v1620000000000'
      },
      delivery: {
        standardFee: 50,
        freeDeliveryAbove: 999,
        slots: [
          'Morning (9:00 AM - 12:00 PM)',
          'Afternoon (1:00 PM - 4:00 PM)',
          'Evening (5:00 PM - 8:00 PM)',
          'Express Delivery (within 2 hours)'
        ]
      },
      socialLinks: {
        instagram: 'https://instagram.com/sweetwhisk',
        facebook: 'https://facebook.com/sweetwhisk',
        pinterest: 'https://pinterest.com/sweetwhisk'
      },
      announcement: '✨ Free delivery on all orders above ₹999! Fresh morning bakes dispatched from 8 AM.'
    });
    console.log('[Seed]: Created Default Settings');

    console.log('\n===============================================');
    console.log('🎉 SEED COMPLETED SUCCESSFULLY!');
    console.log('Admin Account: admin@sweetwhisk.com / Admin@123');
    console.log('Customer Account: demo@sweetwhisk.com / Customer@123');
    console.log('===============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
