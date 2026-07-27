import { notFound } from 'next/navigation'

import StoreTheme from '@/components/store/StoreTheme'

import { getTemplatePack } from '@/components/store/templates'

import { getStoreSlugFromHeaders } from '@/lib/server-api'

import { getStoreBySlug, StoreNotFoundError } from '@/lib/store'



export default async function CheckoutPage() {

  const storeSlug = await getStoreSlugFromHeaders()



  if (!storeSlug) {

    notFound()

  }



  try {

    const store = await getStoreBySlug(storeSlug)

    const Checkout = getTemplatePack(store.themeConfig?.template).Checkout



    return (

      <StoreTheme themeConfig={store.themeConfig}>

        <Checkout store={store} />

      </StoreTheme>

    )

  } catch (error) {

    if (error instanceof StoreNotFoundError) {

      notFound()

    }

    throw error

  }

}

