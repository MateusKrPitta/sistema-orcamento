const editorStateToHtml = (editorState) => {
  if (!editorState) return "";

  const contentState = editorState.getCurrentContent();
  const blockMap = contentState.getBlockMap();

  let html = "";
  let currentListType = null;
  let listItems = [];
  let listAlignment = "left";

  const closeCurrentList = () => {
    if (currentListType && listItems.length > 0) {
      const listTag = currentListType === "unordered-list-item" ? "ul" : "ol";
      html += `<${listTag} style="text-align: ${listAlignment};">\n`;
      html += listItems.join("\n");
      html += `\n</${listTag}>\n`;
    }
    listItems = [];
    currentListType = null;
    listAlignment = "left";
  };

  blockMap.forEach((block) => {
    const textAlign = block.getData().get("textAlign") || "left";
    const blockType = block.getType();
    const text = block.getText();

    if (!text.trim() && blockType === "unstyled") {
      if (currentListType) {
        closeCurrentList();
      }
      html += "<div><br></div>\n";
      return;
    }

    const characterList = block.getCharacterList();
    let styledText = "";

    if (characterList && text.length > 0) {
      let currentStyles = {
        BOLD: false,
        ITALIC: false,
        UNDERLINE: false,
      };

      for (let i = 0; i < text.length; i++) {
        const char = characterList.get(i);
        if (!char) {
          styledText += text[i];
          continue;
        }

        const charStyles = char.getStyle();
        const newStyles = {
          BOLD: charStyles.has("BOLD"),
          ITALIC: charStyles.has("ITALIC"),
          UNDERLINE: charStyles.has("UNDERLINE"),
        };

        if (currentStyles.UNDERLINE && !newStyles.UNDERLINE) {
          styledText += "</u>";
        }
        if (currentStyles.ITALIC && !newStyles.ITALIC) {
          styledText += "</em>";
        }
        if (currentStyles.BOLD && !newStyles.BOLD) {
          styledText += "</strong>";
        }

        if (!currentStyles.BOLD && newStyles.BOLD) {
          styledText += "<strong>";
        }
        if (!currentStyles.ITALIC && newStyles.ITALIC) {
          styledText += "<em>";
        }
        if (!currentStyles.UNDERLINE && newStyles.UNDERLINE) {
          styledText += "<u>";
        }

        styledText += text[i];
        currentStyles = newStyles;
      }

      if (currentStyles.UNDERLINE) styledText += "</u>";
      if (currentStyles.ITALIC) styledText += "</em>";
      if (currentStyles.BOLD) styledText += "</strong>";
    } else {
      styledText = text;
    }

    if (
      blockType === "unordered-list-item" ||
      blockType === "ordered-list-item"
    ) {
      if (!currentListType) {
        currentListType = blockType;
        listAlignment = textAlign;
      }

      if (currentListType !== blockType) {
        closeCurrentList();
        currentListType = blockType;
        listAlignment = textAlign;
      }

      listItems.push(`<li>${styledText}</li>`);
    } else {
      if (currentListType) {
        closeCurrentList();
      }

      switch (blockType) {
        case "header-one":
          html += `<h1 style="text-align: ${textAlign};">${styledText}</h1>\n`;
          break;
        case "header-two":
          html += `<h2 style="text-align: ${textAlign};">${styledText}</h2>\n`;
          break;
        case "header-three":
          html += `<h3 style="text-align: ${textAlign};">${styledText}</h3>\n`;
          break;
        default:
          if (styledText.trim() === "") {
            html += `<div><br></div>\n`;
          } else {
            html += `<div style="text-align: ${textAlign};">${styledText}</div>\n`;
          }
          break;
      }
    }
  });

  if (currentListType) {
    closeCurrentList();
  }

  return html;
};

export default editorStateToHtml;
