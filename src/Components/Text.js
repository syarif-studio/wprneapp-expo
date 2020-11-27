import React from "react"
import { Platform, Text as TextUi } from "react-native"
import HTML from "react-native-render-html"
import { usePostContent } from "../Hook"
import AutoHeightWebView from "react-native-autoheight-webview"

const generateHtml = (content) => `
    <style type="text/css">
      table {
        background-color: transparent;
        width: 100%;
        margin-bottom: 15px;
        font-size: .9em;
        border-spacing: 0;
        border-collapse: collapse;
      }
      table td, table th {
        padding: 15px;
        line-height: 1.5;
        vertical-align: top;
        border: 1px solid #ccc;
      }
    </style>
    ${content}
  `

export const Text = ({ title, postContent, ...props }) => {
  const content = usePostContent(postContent)
  title = postContent !== "disable" ? content : title
  title = props?.charLength
    ? title?.length > props.charLength
      ? title?.substring(0, props.charLength) + "..."
      : title?.substring(0, props.charLength)
    : title

  const { style } = props

  if (!title) return null

  return props.isHtml ? (
    Platform.OS === "web" ? (
      <div
        dangerouslySetInnerHTML={{
          __html: props.isWebView ? generateHtml(title) : title
        }}
      />
    ) : props.isWebView ? (
      <AutoHeightWebView
        style={{
          ...style,
          width: "100%"
        }}
        scalesPageToFit={false}
        originWhitelist={["*"]}
        source={{
          html: generateHtml(title)
        }}
        viewportContent={"width=device-width, user-scalable=no"}
      />
    ) : (
      <HTML
        html={title}
        tagsStyles={{
          span: style,
          p: style,
          del: { textDecorationLine: "line-through" }
        }}
      />
    )
  ) : (
    <TextUi style={style}>{title}</TextUi>
  )
}
