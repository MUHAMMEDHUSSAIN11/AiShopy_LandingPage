import { notFound } from 'next/navigation'

import StoreTheme from '@/components/store/StoreTheme'

import { getTemplatePack } from '@/components/store/templates'

import { getStoreSlugFromHeaders } from '@/lib/server-api'

import { getStoreBySlug, StoreNotFoundError } from '@/lib/store'



export default async function CartPage() {

  const storeSlug = await getStoreSlugFromHeaders()



  if (!storeSlug) {

    notFound()

  }



  try {

    const store = await getStoreBySlug(storeSlug)

    const Cart = getTemplatePack(store.themeConfig?.template).Cart



    return (

      <StoreTheme themeConfig={store.themeConfig}>

        <Cart store={store} />

      </StoreTheme>

    )

  } catch (error) {

    if (error instanceof StoreNotFoundError) {

      notFound()

    }

    throw error

  }

}

