import { useContext } from "react";
import { getLocalization } from "../../localization/localizationManager";
import { AuthContext } from "../../providers/AuthContext";
import "./../../styles/BigSearch.css";

export default ({
  onInput,
  _default,
}: {
  onInput: Function;
  _default: any;
}) => {
  const { login } = useContext(AuthContext);

  return (
    <div className="bigsearch background5 round1">
      <input
        type="text"
        placeholder={getLocalization(login.language, [
          "home",
          "search",
          "placeholder",
        ])}
        defaultValue={_default}
        onInput={(e) => {
          onInput(e);
        }}
      />
    </div>
  );
};
