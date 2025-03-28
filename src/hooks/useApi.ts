  import axios  from "axios";
import React from "react";

const useApi = <T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  body: unknown,
  headers: object,
) => {
  const [data, setData] = React.useState<T | null>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | unknown>(null);

  React.useEffect(() => {
    setIsLoading(true);
    const fetch = async () => {
      try {
        const response = await axios({
          method,
          url,
          data: body,
          headers,
        });

        if (!response) return;

        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [body, method, url, headers]);

  return { data, isLoading, error };
};

export default useApi;
