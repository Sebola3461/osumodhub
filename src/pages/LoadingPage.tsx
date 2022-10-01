import { useContext } from "react";
import AppBar from "../components/global/AppBar";
import LoadingComponent from "../components/global/LoadingComponent";
import { GenerateComponentKey } from "../helpers/GenerateComponentKey";
import { hexToRGB } from "../helpers/hexToRGB";
import { AuthContext } from "../providers/AuthContext";

export default ({ text }: { text?: string }) => {
  function getDarkColor(color: number[]) {
    const c: number[] = [];

    color.forEach((cl) => {
      c.push(cl - 20);
    });

    return c;
  }

  function getLightWhite(color: number[]) {
    const c: number[] = [];

    color.forEach((cl) => {
      c.push(cl + 200);
    });

    return c;
  }

  const { login } = useContext(AuthContext);

  return (
    <>
      <AppBar />
      <style key={GenerateComponentKey(20)}>
        {`:root {
        --base: ${hexToRGB(login.color).join(",")};
        --rgb: ${hexToRGB(login.color).join(",")};
        --base-dark: ${getDarkColor(hexToRGB(login.color)).join(",")};
        --rgb-dark: ${getDarkColor(hexToRGB(login.color)).join(",")};
        --base-light: ${getLightWhite(hexToRGB(login.color)).join(",")};
        --rgb-darklight: ${getLightWhite(hexToRGB(login.color)).join(",")};
      }`}
      </style>
      <div className="loading-page-content">
        <LoadingComponent text={text} />
      </div>
    </>
  );
};
