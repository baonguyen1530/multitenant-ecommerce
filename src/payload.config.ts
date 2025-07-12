// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig, Config } from 'payload'
import { fileURLToPath } from 'url'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'

import Users from './collections/Users'
import Media from './collections/Media'
import Categories from './collections/Categories'
import Products from './collections/Products'
import Tags from './collections/Tags'
import Tenants from './collections/Tenants'
import { Orders } from './collections/Orders'
import Reviews from './collections/Reviews'
import { isSuperAdmin } from './lib/access'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Handle sharp import gracefully
let sharp: any
try {
  sharp = require('sharp')
} catch (error) {
  console.warn('Sharp not available, image processing will be limited')
  sharp = null
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeNavLinks: ["@/components/stripe-verify#StripeVerify"]
    }
  },
  collections: [Users, Media, Categories, Products, Tags, Tenants, Orders, Reviews],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  ...(sharp && { sharp }),
  plugins: [
    payloadCloudPlugin(),
    multiTenantPlugin<Config>({
      collections: {
        products: {},
      },
      tenantsArrayField: {
        includeDefaultField: false,
      },
      userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    }),
    // storage-adapter-placeholder
  ],
})