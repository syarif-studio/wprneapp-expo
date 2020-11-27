import React from "react"
import * as components from "../Components"

const buildChild = (parent, page) => {
  let child = page[parent]?.nodes?.length
    ? page[parent].nodes.map((node) => {
        return buildComponent(node, page)
      })
    : typeof page[parent].linkedNodes === "object" &&
      Object.values(page[parent].linkedNodes)?.length
    ? Object.values(page[parent].linkedNodes).map((node) => {
        return buildComponent(node, page)
      })
    : null

  return child
}

const buildComponent = (parent, page) => {
  let child = buildChild(parent, page)
  let props =
    parent === "ROOT"
      ? { isRoot: true, key: parent, ...page[parent].props }
      : { key: parent, ...page[parent].props }

  return (
    components[page[parent]?.type?.resolvedName] &&
    React.createElement(
      components[page[parent].type.resolvedName],
      props,
      child
    )
  )
}

const Page = ({ navigation, route, page }) => {
  const json = page?.json
  const dataJson = json && JSON.parse(json)

  React.useLayoutEffect(() => {
    const params = route.params
    const title = params?.item?.title?.rendered ?? params?.item?.name
    if (title && page?.dynamicTitle) {
      navigation.setOptions({ title })
    }
  })

  return dataJson ? buildComponent("ROOT", dataJson) : null
}

export default Page
