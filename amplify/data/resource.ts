import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * Data schema using AWS AppSync (GraphQL) + DynamoDB.
 * Pattern from politica, friday.lk, tmsaaokenki-dev/website, and uwu-sri-lanka/website.
 *
 * Reference models for an ecommerce domain.
 * Replace / extend these for your specific use-case.
 *
 * Authorization rules:
 * - Public reads via API key (storefront)
 * - Authenticated reads for all logged-in users
 * - Owner-based writes for user resources (orders, reviews)
 * - Group-based writes for admin resources (products, categories)
 *
 * @see https://docs.amplify.aws/gen2/build-a-backend/data/
 */
const schema = a.schema({
  // ─── Category ───────────────────────────────────────────────────────────
  Category: a
    .model({
      name: a.string().required(),
      slug: a.string().required(),
      description: a.string(),
      image: a.string(),
      parentId: a.string(),
      sortOrder: a.integer().default(0),
    })
    .authorization(allow => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['read']),
      allow.group('Admin').to(['create', 'update', 'delete']),
    ]),

  // ─── Product ────────────────────────────────────────────────────────────
  Product: a
    .model({
      name: a.string().required(),
      slug: a.string().required(),
      description: a.string(),
      price: a.float().required(),
      compareAtPrice: a.float(),
      currency: a.string().default('USD'),
      images: a.string().array(),
      categoryId: a.string(),
      status: a.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']),
      inventory: a.integer().default(0),
      sku: a.string(),
    })
    .authorization(allow => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['read']),
      allow.group('Admin').to(['create', 'update', 'delete']),
    ]),

  // ─── Order ──────────────────────────────────────────────────────────────
  Order: a
    .model({
      userId: a.string().required(),
      items: a.json().required(),
      subtotal: a.float().required(),
      tax: a.float().default(0),
      shipping: a.float().default(0),
      total: a.float().required(),
      status: a.enum([
        'PENDING',
        'CONFIRMED',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
      ]),
      shippingAddress: a.json(),
    })
    .authorization(allow => [
      allow.owner().to(['create', 'read']),
      allow.group('Admin').to(['read', 'update', 'delete']),
    ]),

  // ─── Contact Submission ─────────────────────────────────────────────────
  ContactSubmission: a
    .model({
      name: a.string().required(),
      email: a.string().required(),
      subject: a.string(),
      message: a.string().required(),
    })
    .authorization(allow => [
      allow.publicApiKey().to(['create']),
      allow.group('Admin').to(['read', 'delete']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
