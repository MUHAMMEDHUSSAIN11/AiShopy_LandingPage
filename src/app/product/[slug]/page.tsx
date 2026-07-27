import { notFound } from 'next/navigation'

import ErrorMessage from '@/components/store/ErrorMessage'

import StoreTheme from '@/components/store/StoreTheme'

import { getTemplatePack } from '@/components/store/templates'

import { getStoreSlugFromHeaders } from '@/lib/server-api'

import { getProduct, ProductNotFoundError } from '@/lib/product'

import { getStoreBySlug, StoreNotFoundError } from '@/lib/store'



type ProductPageProps = {

  params: Promise<{ slug: string }>

}



export default async function ProductPage({ params }: ProductPageProps) {

  const storeSlug = await getStoreSlugFromHeaders()

  const { slug } = await params



  if (!storeSlug) {

    notFound()

  }



  try {

    const [store, product] = await Promise.all([

      getStoreBySlug(storeSlug),

      getProduct(storeSlug, slug),

    ])



    const ProductView = getTemplatePack(store.themeConfig?.template).ProductDetail



    return (

      <StoreTheme themeConfig={store.themeConfig}>

        <ProductView store={store} product={product} />

      </StoreTheme>

    )

  } catch (error) {

    if (error instanceof StoreNotFoundError || error instanceof ProductNotFoundError) {

      notFound()

    }



    return (

      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">

        <ErrorMessage

          title="Something went wrong"

          message="We couldn't load this product. Please refresh and try again."

        />

      </div>

    )

  }

}

