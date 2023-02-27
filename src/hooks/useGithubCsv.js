import { useCallback, useEffect, useState, useMemo } from "react";
import csv from "csvtojson";



export default function useGithubCsv(
  urls,
  filterKeys = [],
  generateSummary = () => {}
) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({});

  useEffect(() => {
    async function fetchDataFromGithub() {
      setLoading(true);
      const responses = await Promise.all(urls.map(url => fetch(url)));
      const responseData = await Promise.all(responses.map(resp => resp.text()));
      const responseJsonData = await Promise.all(responseData.map(respData => csv().fromString(respData)));
      setData(responseJsonData.flat());
      setLoading(false);
    }
    fetchDataFromGithub();
  }, [urls]);

  const summaryData = useMemo(() => {
    if (data === null) return null;
    const internalData = generateSummary(data);
    return internalData;
  }, [data, generateSummary]);

  const detailData = useMemo(() => {
    if (data === null) return null;
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
