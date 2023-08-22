import { BaseSyntheticEvent, useState } from "react";

const LowComponent = (onDataChange: any) => {
  const [text, setText] = useState<string>("");

  const textChangeHandler = (e: BaseSyntheticEvent) => {
    setText(e.currentTarget.value);
  };

  const submitText = () => {
    onDataChange(text);
  };

  return (
    <>
      <input value={text} onChange={textChangeHandler} />
      <button onClick={submitText}>submit</button>
    </>
  );
};

export default LowComponent;
