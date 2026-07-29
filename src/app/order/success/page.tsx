import { notFound } from 'next/navigation'

import StoreTheme from '@/components/store/StoreTheme'

import { getTemplatePack } from '@/components/store/templates'

import { getStoreSlugFromHeaders } from '@/lib/server-api'

import { getStoreBySlug, StoreNotFoundError } from '@/lib/store'



type OrderSuccessPageProps = {

  searchParams: Promise<{ orderId?: string }>

}



export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {

  const storeSlug = await getStoreSlugFromHeaders()

  const { orderId } = await searchParams



  if (!storeSlug) {

    notFound()

  }



  try {

    const store = await getStoreBySlug(storeSlug)

    const OrderSuccess = getTemplatePack(store.themeConfig?.template).OrderSuccess



    return (

      <StoreTheme themeConfig={store.themeConfig}>

        <OrderSuccess store={store} orderId={orderId} />

      </StoreTheme>

    )

  } catch (error) {

    if (error instanceof StoreNotFoundError) {

      notFound()

    }

    throw error

  }

}

