import React from "react"
import { Text as TextUi } from "react-native"
import HTML from "react-native-render-html"
import { usePostContent } from "../Hook"

export const Text = ({ title, postContent, ...props }) => {
  const content = usePostContent(postContent)
  title = postContent !== "disable" ? content : title
  title = props.charLength
    ? title.length > props.charLength
      ? title.substring(0, props.charLength) + "..."
      : title.substring(0, props.charLength)
    : title

  const { style, ...restProps } = props

  return props.isHtml ? (
    <HTML html={title} />
  ) : (
    <TextUi style={style} {...restProps}>
      {title}
    </TextUi>
  )
}
