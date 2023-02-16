import { useCallback, useEffect, useState, useMemo } from "react";
import csv from "csvtojson";



export default function useGithubCsv(
  url,
  filterKeys = [],
  generateSummary = () => {}
) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({});

  useEffect(() => {
    async function fetchDataFromGithub() {
      setLoading(true);
      const response = await fetch(url);
      const responseData = await response.text();
      const responseJsonData = await csv().fromString(responseData);
      setData(responseJsonData);
      setLoading(false);
    }
    fetchDataFromGithub();
  }, [url]);

  const summaryData = useMemo(() => {
    if (data === null) return null;
    const internalData = generateSummary(data);
    return internalData;
  }, [data, generateSummary]);

  const detailData = useMemo(() => {
    if (data === null) return null;
    console.log(filter);
    return data.filter((entry) =>
      filterKeys.every((filterKey) => entry[filterKey] === filter[filterKey])
    );
  }, [data, filter, filterKeys]);

  const setDetailParams = useCallback((filter) => {
    setFilter(filter);
  }, []);

  return {
    summaryData,
    loading,
    setDetailParams,
    detailData
  };
}
