import React from "react";

export const useLocalStorage = (key: string, initialValue: unknown) => {
  const [value, setValue] = React.useState(() => {
    const item = localStorage.getItem(key);
    return item || initialValue;
  });

  React.useEffect(() => {
    localStorage.setItem(key, value as string);
  }, [value, key]);

  return [value, setValue] as const;
};
