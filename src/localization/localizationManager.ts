import enUS from "./languages/enUS";
import ptBR from "./languages/ptBR";
import id from "./languages/id";
import pl from "./languages/pl";

export const Languages = {
  enUS,
  ptBR,
  pl,
  id,
};

export function getLocalization(language: string, query: string[]) {
  let selectedLanguage = Languages[language];

  if (!selectedLanguage) selectedLanguage = Languages.enUS;

  let result = "";

  let queryObject = selectedLanguage;
  query.forEach((target) => {
    try {
      queryObject = queryObject[target];
    } catch (e) {
      console.error(e);
    }
  });

  result = queryObject;

  return result || "";
}
