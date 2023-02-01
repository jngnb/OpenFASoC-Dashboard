import { useEffect, useState } from "react";
import csv from "csvtojson";

export default function useGithubCsv(url) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchDataFromGithub() {
      const response = await fetch(url);
      const responseData = await response.text();
      const responseJsonData = await csv().fromString(responseData);
      setData(responseJsonData);
    }
    fetchDataFromGithub();
  }, [url]);

  return {
    data
  };
}