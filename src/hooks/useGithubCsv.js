import { useCallback, useEffect, useState, useMemo } from "react";
import csv from "csvtojson";



export default function useGithubCsv(
  selectedUrls,
  idToken,
  filterKeys = [],
  generateSummary = () => {}
) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({});

  useEffect(() => {
    async function fetchDataFromGithub() {
      setLoading(true);
     
        const responses = await Promise.all(selectedUrls.map(url => fetch(url, {
          headers: {
            'Authorization': 'Bearer ' + idToken,
          },
        })));

        const responseData = await Promise.all(
          responses.map(async resp => {
            const data = await resp.json();
            return transformToJson(data);
          })
        );

        console.log(responseData);
      const responseJsonData = await Promise.all(responseData.map(respData => csv().fromString(respData)));
      setData(responseJsonData.flat());
      setLoading(false);
    }
    fetchDataFromGithub();
  }, [selectedUrls]);

  const summaryData = useMemo(() => {
    if (data === null) return null;
    const internalData = generateSummary(data, selectedUrls.length);
    return internalData;
  }, [data, generateSummary, selectedUrls]);

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

function transformToJson(data) {
  // Header for the output
  let output = "header,inverter,temp,freq,power,error,run_time";

  // Iterate through rows
  for (let item of data.rows) {
      let values = item.f.map(entry => entry.v); // Extract the values
      
      // Check if values contain 'failed', if not just join them
      let line = values.includes('failed') ? values.slice(0, 3).join(',') + ",failed,failed,failed," + values[6] : values.join(',');
      
      output += "\n" + line; // Append to output
  }
  
  return output;
}
