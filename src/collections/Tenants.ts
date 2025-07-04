import { isSuperAdmin } from '@/lib/access';
import type { CollectionConfig } from 'payload'

const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    useAsTitle: 'slug',
  },
  fields: [
    {
      name: "name",
      required: true,
      type: "text",
      label: "Store Name",
      admin: {
        description: "This is the name of the store (e.g. Bao's Store)",
      },
    },
    {
        name: "slug",
        type: "text",
        index: true,
        required: true,
        unique: true,
        access: {
          update: ({ req }) => isSuperAdmin(req.user),
        },
        admin: {
            description:
                "This is the subdomain for the store(e.g. [slug].4rchiv3dGarm3nts.com",
        },
    },
    {
        name: "image",
        type: "upload",
        relationTo: "media",
    },
    {
        name: "stripeAccountId",
        type: "text",
        required: true,
        access: {
          update: ({ req }) => isSuperAdmin(req.user),
        },
        admin: {
            description: "Stripe account ID associated to your shop",
        },
    },
    {
        name: "stripeDetailsSubmitted",
        type: "checkbox",
        access: {
          update: ({ req }) => isSuperAdmin(req.user),
        },
        admin: {
            description: "You cannot create products until you submit your Stripe details",
        },
    },
  ],
};

export default Tenants
