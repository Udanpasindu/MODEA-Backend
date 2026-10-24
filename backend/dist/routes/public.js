import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { Product } from '../models/Product.js';
import { Category, Collection } from '../models/Taxonomy.js';
import { Settings } from '../models/Settings.js';
import { checkout, checkoutSchema } from '../services/checkout.js';
export const publicRouter = Router();
publicRouter.get('/health', (_q, r) => r.json({ data: { status: 'ok' } }));
publicRouter.get('/products', async (req, res) => { const q = z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(48).default(12), search: z.string().optional(), category: z.string().optional(), collection: z.string().optional(), size: z.string().optional(), color: z.string().optional(), minPrice: z.coerce.number().optional(), maxPrice: z.coerce.number().optional(), availability: z.enum(['in-stock', 'all']).optional(), newArrival: z.enum(['true', 'false']).optional(), featured: z.enum(['true', 'false']).optional(), bestSeller: z.enum(['true', 'false']).optional(), sort: z.enum(['newest', 'price-asc', 'price-desc']).default('newest') }).parse(req.query); const filter = { status: 'published' }; if (q.search)
    filter.$text = { $search: q.search }; if (q.category)
    filter.category = q.category; if (q.collection)
    filter.collections = q.collection; if (q.size)
    filter['variants.size'] = q.size; if (q.color)
    filter['variants.color'] = q.color; if (q.availability === 'in-stock')
    filter['variants.stock'] = { $gt: 0 }; if (q.minPrice != null || q.maxPrice != null)
    filter.price = { ...(q.minPrice != null ? { $gte: q.minPrice } : {}), ...(q.maxPrice != null ? { $lte: q.maxPrice } : {}) }; if (q.newArrival)
    filter.newArrival = q.newArrival === 'true'; if (q.featured)
    filter.featured = q.featured === 'true'; if (q.bestSeller)
    filter.bestSeller = q.bestSeller === 'true'; const sort = q.sort === 'price-asc' ? { price: 1 } : q.sort === 'price-desc' ? { price: -1 } : { createdAt: -1 }; const [items, total] = await Promise.all([Product.find(filter).populate('category collections').sort(sort).skip((q.page - 1) * q.limit).limit(q.limit), Product.countDocuments(filter)]); res.json({ data: { items, pagination: { page: q.page, limit: q.limit, total, pages: Math.ceil(total / q.limit) } } }); });
publicRouter.get('/products/:slug', async (req, res) => { const item = await Product.findOne({ slug: req.params.slug, status: 'published' }).populate('category collections'); if (!item)
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found' } }); res.json({ data: item }); });
publicRouter.get('/categories', async (_q, r) => r.json({ data: await Category.find({ published: true }).sort({ order: 1 }) }));
publicRouter.get('/collections', async (_q, r) => r.json({ data: await Collection.find({ published: true }).sort({ order: 1 }) }));
publicRouter.get('/collections/:slug', async (req, res) => { const item = await Collection.findOne({ slug: req.params.slug, published: true }); if (!item)
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Collection not found' } }); res.json({ data: item }); });
publicRouter.get('/settings/public', async (_q, r) => { const s = await Settings.findOne({ key: 'store' }).lean(); r.json({ data: s ?? { storeName: 'MODEA CLOTHING', currency: 'LKR' } }); });
publicRouter.post('/orders/checkout', rateLimit({ windowMs: 60000, limit: 8 }), async (req, res) => res.status(201).json({ data: await checkout(checkoutSchema.parse(req.body)) }));
publicRouter.post('/contact', rateLimit({ windowMs: 60000, limit: 5 }), async (req, res) => { z.object({ name: z.string().min(2), email: z.string().email(), message: z.string().min(10).max(2000) }).parse(req.body); res.status(202).json({ data: { accepted: true } }); });
