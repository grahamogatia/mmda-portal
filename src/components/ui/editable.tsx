import sanitizeHtml from "sanitize-html";
import ContentEditable from 'react-contenteditable';
import { useCallback } from "react";

function Editable( {content, setContent}: {content: string, setContent: (content: string) => void}) {
  //const [content, setContent] = useState(""); // The HTML content

  const onContentChange = useCallback((evt: { currentTarget: { innerHTML: string; }; }) => {
    // Sanitize content to allow font-size and other tags
    const sanitizeConf = {
      allowedTags: ["b", "i", "p", "span", "font", "br"], // Allow <span> for inline styles
      allowedAttributes: {
        "*": ["style"],  // Allow inline styles for all tags
        "font": ["size"], // Allow size in font tags
      },
    };
    setContent(sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf));
  }, []);

  return (
    <div>
        <p className="w-full text-start font-semibold">Enter Advisory Here:</p> 
      <ContentEditable
        className="min-h-[200px]"
        id="editable-content"
        onChange={onContentChange}
        onBlur={onContentChange}
        html={content}
        tagName="div"
        style={{ fontSize: "18.6667px", border: "1px solid #ccc", padding: "10px" }}
      />
    </div>
  );
}

export default Editable;
