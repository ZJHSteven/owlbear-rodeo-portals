import {Image, isImage, Item, TextContent} from "@owlbear-rodeo/sdk";

export default function getText(item: Item): string {
  if (isImage(item)) {
    return getImageText(item);
  }

  return item.name;
}

function getImageText(image: Image): string {
  const text = getTextContentText(image.text);
  return text.length === 0 ? image.name : text;
}

function getTextContentText(textContent: TextContent): string {
  if (textContent.type === "PLAIN") {
    return textContent.plainText;
  }

  console.warn("only plain text supported");
  return "";
}
