import { useState } from "react";
import useGithubCsv from "hooks/useGithubCsv";
import DynamicTable from "components/DynamicTable";
import Header from "components/Header";

export default function Generator({ name, urls, filterKeys = [], generateSummary = () => {}}) {
  const [selectedUrls, setSelectedUrls] = useState([urls[0].url]);
  const { summaryData, detailData, setDetailParams, loading } = useGithubCsv(
    selectedUrls,
    filterKeys,
    generateSummary
  );

  const [headerValues, setHeaderValues] = useState({});

  if (loading) return null;

  return (
    <div>
      <Header title={name} subtitle="brief description of temperature sensor" />
      <div style={{ flex: "1", display: "flex", alignItems: "center", marginLeft: "1.5rem", marginTop: "1rem", marginBottom: "0rem"}}>
        {urls.map(({ label, url }) => (
          <label key={url} style={{ marginRight: "1rem" }}>
            <input
              type="checkbox"
              value={url}
              checked={selectedUrls.includes(url)}
              onChange={(e) => {
                setSelectedUrls((prevState) => {
                  if (e.target.checked) {
                    return [...prevState, url];
                  } else {
                    return prevState.filter((selectedUrl) => selectedUrl !== url);
                  }
                });
              }}
            />
            { label }
          </label>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: 'flex-start' }}>
      <div style={{ flex: "1" }}>
        <DynamicTable
          data={ summaryData }
          numFilterKeys = {2}
          onEntryClick={(entry) => {
            const values = filterKeys.reduce(
              (acc, filterKey) => ({ ...acc, [filterKey]: entry[filterKey] }),
              {}
            );
            setHeaderValues(values);
            setDetailParams(values);
          }}
        />
      </div>
      <div style={{ flex: "1", marginLeft: "1.5rem" }}>
        <Header subtitle={Object.entries(headerValues).map(header => `${header[0].toUpperCase()}: ${header[1]} `) } />
        {detailData && (
          <DynamicTable
            data={ detailData.map((entry) => {
              const filteredEntry = { ...entry };
              filterKeys.map((fk) => delete filteredEntry[fk]);
              return filteredEntry;
            })}
            numFilterKeys = {1}
          />
        )}
      </div>
    </div>
  </div>
  );
}