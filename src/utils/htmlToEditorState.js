import { EditorState, convertFromRaw } from "draft-js";

const htmlToEditorState = (html) => {
  if (!html) return EditorState.createEmpty();

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const blocks = [];
  let keyCounter = 1;

  const processNode = (
    node,
    currentStyles = {},
    inheritedAlignment = "left",
  ) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) {
        blocks.push({
          key: `key${keyCounter++}`,
          text: text,
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: Object.keys(currentStyles)
            .filter((style) => currentStyles[style])
            .map((style) => ({
              offset: 0,
              length: text.length,
              style: style,
            })),
          entityRanges: [],
          data: { textAlign: inheritedAlignment },
        });
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();
      let textAlign = inheritedAlignment;
      const newStyles = { ...currentStyles };

      if (node.style) {
        if (node.style.fontWeight === "bold" || node.style.fontWeight === "700")
          newStyles.BOLD = true;
        if (node.style.fontStyle === "italic") newStyles.ITALIC = true;
        if (node.style.textDecoration === "underline")
          newStyles.UNDERLINE = true;
        if (node.style.textAlign) {
          textAlign = node.style.textAlign;
        }
      }

      switch (tagName) {
        case "h1":
          const h1Text = node.textContent.trim();
          if (h1Text) {
            blocks.push({
              key: `key${keyCounter++}`,
              text: h1Text,
              type: "header-one",
              depth: 0,
              inlineStyleRanges: Object.keys(newStyles)
                .filter((style) => newStyles[style])
                .map((style) => ({
                  offset: 0,
                  length: h1Text.length,
                  style: style,
                })),
              entityRanges: [],
              data: { textAlign: textAlign },
            });
          }
          break;

        case "h2":
          const h2Text = node.textContent.trim();
          if (h2Text) {
            blocks.push({
              key: `key${keyCounter++}`,
              text: h2Text,
              type: "header-two",
              depth: 0,
              inlineStyleRanges: Object.keys(newStyles)
                .filter((style) => newStyles[style])
                .map((style) => ({
                  offset: 0,
                  length: h2Text.length,
                  style: style,
                })),
              entityRanges: [],
              data: { textAlign: textAlign },
            });
          }
          break;

        case "h3":
          const h3Text = node.textContent.trim();
          if (h3Text) {
            blocks.push({
              key: `key${keyCounter++}`,
              text: h3Text,
              type: "header-three",
              depth: 0,
              inlineStyleRanges: Object.keys(newStyles)
                .filter((style) => newStyles[style])
                .map((style) => ({
                  offset: 0,
                  length: h3Text.length,
                  style: style,
                })),
              entityRanges: [],
              data: { textAlign: textAlign },
            });
          }
          break;

        case "div":
          Array.from(node.childNodes).forEach((child) => {
            if (child.nodeType === Node.ELEMENT_NODE) {
              const childTag = child.tagName.toLowerCase();
              if (childTag === "p") {
                const pText = child.textContent.trim();
                if (pText) {
                  let pStyles = { ...newStyles };
                  let pAlignment = textAlign;

                  if (child.style) {
                    if (
                      child.style.fontWeight === "bold" ||
                      child.style.fontWeight === "700"
                    )
                      pStyles.BOLD = true;
                    if (child.style.fontStyle === "italic")
                      pStyles.ITALIC = true;
                    if (child.style.textDecoration === "underline")
                      pStyles.UNDERLINE = true;
                    if (child.style.textAlign)
                      pAlignment = child.style.textAlign;
                  }

                  blocks.push({
                    key: `key${keyCounter++}`,
                    text: pText,
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: Object.keys(pStyles)
                      .filter((style) => pStyles[style])
                      .map((style) => ({
                        offset: 0,
                        length: pText.length,
                        style: style,
                      })),
                    entityRanges: [],
                    data: { textAlign: pAlignment },
                  });
                } else {
                  blocks.push({
                    key: `key${keyCounter++}`,
                    text: "",
                    type: "unstyled",
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                    data: { textAlign: textAlign },
                  });
                }
              } else if (childTag === "br") {
                blocks.push({
                  key: `key${keyCounter++}`,
                  text: "",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [],
                  data: { textAlign: textAlign },
                });
              } else {
                processNode(child, newStyles, textAlign);
              }
            } else if (
              child.nodeType === Node.TEXT_NODE &&
              child.textContent.trim()
            ) {
              const text = child.textContent.trim();
              blocks.push({
                key: `key${keyCounter++}`,
                text: text,
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: Object.keys(newStyles)
                  .filter((style) => newStyles[style])
                  .map((style) => ({
                    offset: 0,
                    length: text.length,
                    style: style,
                  })),
                entityRanges: [],
                data: { textAlign: textAlign },
              });
            }
          });
          break;

        case "ul":
          Array.from(node.querySelectorAll("li")).forEach((li) => {
            const liText = li.textContent.trim();
            if (liText) {
              blocks.push({
                key: `key${keyCounter++}`,
                text: liText,
                type: "unordered-list-item",
                depth: 0,
                inlineStyleRanges: Object.keys(newStyles)
                  .filter((style) => newStyles[style])
                  .map((style) => ({
                    offset: 0,
                    length: liText.length,
                    style: style,
                  })),
                entityRanges: [],
                data: { textAlign: textAlign },
              });
            }
          });
          break;

        case "ol":
          Array.from(node.querySelectorAll("li")).forEach((li) => {
            const liText = li.textContent.trim();
            if (liText) {
              blocks.push({
                key: `key${keyCounter++}`,
                text: liText,
                type: "ordered-list-item",
                depth: 0,
                inlineStyleRanges: Object.keys(newStyles)
                  .filter((style) => newStyles[style])
                  .map((style) => ({
                    offset: 0,
                    length: liText.length,
                    style: style,
                  })),
                entityRanges: [],
                data: { textAlign: textAlign },
              });
            }
          });
          break;

        case "li":
          const liText = node.textContent.trim();
          if (liText) {
            const parentTag = node.parentElement?.tagName.toLowerCase();
            const blockType =
              parentTag === "ol" ? "ordered-list-item" : "unordered-list-item";

            blocks.push({
              key: `key${keyCounter++}`,
              text: liText,
              type: blockType,
              depth: 0,
              inlineStyleRanges: Object.keys(newStyles)
                .filter((style) => newStyles[style])
                .map((style) => ({
                  offset: 0,
                  length: liText.length,
                  style: style,
                })),
              entityRanges: [],
              data: { textAlign: textAlign },
            });
          }
          break;

        case "p":
          const pText = node.textContent.trim();
          if (pText) {
            blocks.push({
              key: `key${keyCounter++}`,
              text: pText,
              type: "unstyled",
              depth: 0,
              inlineStyleRanges: Object.keys(newStyles)
                .filter((style) => newStyles[style])
                .map((style) => ({
                  offset: 0,
                  length: pText.length,
                  style: style,
                })),
              entityRanges: [],
              data: { textAlign: textAlign },
            });
          }
          break;

        case "strong":
        case "b":
          newStyles.BOLD = true;
          Array.from(node.childNodes).forEach((child) => {
            processNode(child, newStyles, textAlign);
          });
          break;

        case "em":
        case "i":
          newStyles.ITALIC = true;
          Array.from(node.childNodes).forEach((child) => {
            processNode(child, newStyles, textAlign);
          });
          break;

        case "u":
          newStyles.UNDERLINE = true;
          Array.from(node.childNodes).forEach((child) => {
            processNode(child, newStyles, textAlign);
          });
          break;

        default:
          Array.from(node.childNodes).forEach((child) => {
            processNode(child, newStyles, textAlign);
          });
          break;
      }
    }
  };

  Array.from(tempDiv.childNodes).forEach((child) => {
    processNode(child);
  });

  if (blocks.length === 0) {
    return EditorState.createEmpty();
  }

  const uniqueBlocks = blocks.filter((block) => {
    if (
      block.type === "unordered-list-item" ||
      block.type === "ordered-list-item"
    ) {
      return true;
    }
    return block.text || block.type !== "unstyled";
  });

  const contentState = convertFromRaw({
    blocks: uniqueBlocks,
    entityMap: {},
  });

  return EditorState.createWithContent(contentState);
};

export default htmlToEditorState;
