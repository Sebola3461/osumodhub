import { useEffect, useState } from "react";
import { GenerateComponentKey } from "../../helpers/GenerateComponentKey";
import "./../../styles/TagsInput.css";

export default ({ value, onInput }: { value?: string[]; onInput?: any }) => {
  const [tags, setTags] = useState<any[]>(value || []);

  function handleKeyDown(e: any) {
    if (e.key !== "Enter") return;
    const value = e.target.value;
    if (!value.trim()) return;
    setTags([...tags, value]);
    e.target.value = "";
    onInput([...tags, value]);
  }

  function removeTag(index: number) {
    setTags(tags.filter((el, i) => i !== index));
    onInput(tags.filter((el, i) => i !== index));
  }

  return (
    <div className="tags-input-container">
      {tags.map((tag, index) => (
        <div className="tag-item" key={GenerateComponentKey(10)}>
          <span className="text">{tag}</span>
          <span className="close" onClick={() => removeTag(index)}>
            &times;
          </span>
        </div>
      ))}
      <input
        onKeyDown={handleKeyDown}
        type="text"
        className="tags-input"
        placeholder="Type somthing"
      />
    </div>
  );
};
