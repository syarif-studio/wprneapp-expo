import React from "react"
import useSWR from "swr"
import { PostTypeProvider } from "../PostTypeContext"
import { wooapi } from "../../Api"
import { useAsyncStorage } from "@react-native-community/async-storage"

async function fetchData(json) {
  const param = JSON.parse(json)
  let { postType, ...query } = param
  const response = await wooapi.get(postType + "s", query)
  return response?.data
}

function useGetOrderData() {
  const { getItem } = useAsyncStorage("userOrders")
  const [orderIds, setOrderIds] = React.useState([])
  const { data: orders, isValidating } = useSWR(
    orderIds?.length
      ? JSON.stringify({
          postType: "order",
          include: orderIds.join()
        })
      : null,
    fetchData,
    { revalidateOnFocus: true }
  )

  const { data: products } = useSWR(() => {
    let ids = []
    if (Array.isArray(orders)) {
      orders.forEach((order) => {
        order.line_items.forEach((item) => {
          ids.push(item?.product_id)
        })
      })
    }

    return (
      ids?.length &&
      JSON.stringify({
        postType: "product",
        include: ids.join()
      })
    )
  }, fetchData)

  const readItemFromStorage = React.useCallback(async () => {
    const item = await getItem()
    const items = JSON.parse(item)
    setOrderIds(items || [])
  }, [])

  React.useEffect(() => {
    readItemFromStorage()
  }, [readItemFromStorage])

  const items = orders?.map((order) => {
    const line_items = order?.line_items?.map((line_item) => {
      const product_id = line_item?.product_id
      const product = products?.find((product) => product?.id === product_id)
      return { ...line_item, image: product?.images?.[0]?.src }
    })

    const line_item = line_items?.reduce(
      (acc, item) => `${acc}${item?.name} x ${item?.quantity} \n`,
      ""
    )

    return { ...order, line_items, line_item, image: line_items?.[0]?.image }
  })

  return {
    data: items,
    isLoading: isValidating,
    mutateData: readItemFromStorage
  }
}

function OrderRoot({ children }) {
  return <PostTypeProvider value="order">{children}</PostTypeProvider>
}

export { OrderRoot, useGetOrderData }
