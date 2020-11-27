/* eslint-disable react/display-name */
import React from "react"
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute
} from "@react-navigation/native"
import {
  createStackNavigator,
  TransitionPresets
} from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Icon } from "react-native-elements"
import useSWR from "swr"
import Page from "../Page"

function getOptions(route, pages) {
  const routeName = getFocusedRouteNameFromRoute(route)
  const index = pages.findIndex(
    (page) => page.slug === routeName?.replace("tab-", "")
  )

  if (index === -1) return false

  let title = pages[index]?.name || ""

  if (pages[index]?.dynamicTitle) {
    const params = route.params
    title = params?.item?.title?.rendered ?? params?.item?.name
  }

  const headerShown = pages?.[index]?.showHeaderBar
  return { title, headerShown }
}

const Tab = createBottomTabNavigator()

function BottomBar({ navigation, route, pages }) {
  React.useLayoutEffect(() => {
    const options = getOptions(route, pages)
    navigation.setOptions({ ...options })
  }, [navigation, route, pages])

  const bottomNavPages = pages
    .filter((page) => page?.addToBottomNav)
    .sort((a, b) => a.navPriority - b.navPriority)

  return (
    <Tab.Navigator
      lazy={false}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const index = pages.findIndex(
            (page) => page.slug === route.name.replace("tab-", "")
          )
          const icon = pages?.[index]?.icon
          const { name, provider, size, activeColor, inactiveColor } = icon
          // You can return any component that you like here!
          return (
            <Icon
              name={name}
              type={provider}
              size={size}
              color={focused ? activeColor : inactiveColor}
            />
          )
        },
        tabBarLabel: ""
      })}
    >
      {Array.isArray(bottomNavPages) &&
        bottomNavPages.map((page) => {
          return (
            <Tab.Screen
              key={page.slug}
              name={`tab-${page.slug}`}
              options={{
                title: page.name,
                headerShown: page.showHeaderBar
              }}
            >
              {(props) => <Page {...props} page={page} />}
            </Tab.Screen>
          )
        })}
    </Tab.Navigator>
  )
}

const Stack = createStackNavigator()

export default function Route() {
  const { data } = useSWR("page/get_pages")
  const pages = data?.pages
  const firstBottomNav = pages?.find((page) => page?.addToBottomNav)

  if (!data) return null

  const sortedPages = pages.sort((a, b) => a.navPriority - b.navPriority)

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          ...TransitionPresets.SlideFromRightIOS
        }}
      >
        {firstBottomNav && (
          <Stack.Screen
            name="BottomTab"
            options={{
              title: firstBottomNav.name,
              headerShown: firstBottomNav.showHeaderBar
            }}
          >
            {(props) => <BottomBar {...props} pages={pages} />}
          </Stack.Screen>
        )}
        {Array.isArray(sortedPages) &&
          sortedPages.map((page) => (
            <Stack.Screen
              key={page.slug}
              name={page.slug}
              options={{
                title: page.name,
                headerShown: page.showHeaderBar
              }}
            >
              {(props) => <Page {...props} page={page} />}
            </Stack.Screen>
          ))}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
