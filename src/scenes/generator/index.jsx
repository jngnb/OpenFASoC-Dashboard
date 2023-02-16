import { useState } from "react";
import useGithubCsv from "hooks/useGithubCsv";
import DynamicTable from "components/DynamicTable";
import Header from "components/Header";

export default function Generator({ name, url, filterKeys = [], generateSummary = () => {}}) {
  const { summaryData, detailData, setDetailParams, loading } = useGithubCsv(
    url,
    filterKeys,
    generateSummary
  );

  const [headerValues, setHeaderValues] = useState({});

  if (loading) return null;

  return (
    <div>
    <Header title={name} subtitle="brief description of temperature sensor" />
    <div style={{ display: "flex", alignItems: 'flex-start' }}>
    <div style={{ flex: "1" }}>
      <DynamicTable
        data={summaryData}
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
          data={detailData.map((entry) => {
            const filteredEntry = { ...entry };
            filterKeys.map((fk) => delete filteredEntry[fk]);
            return filteredEntry;
          })}
        />
      )}
    </div>
  </div>
  </div>

    // <div>
    //   <Header title={ name } subtitle="brief description of temperature sensor"/>
    //   <DynamicTable
    //     data={summaryData}
    //     //flip
    //     onEntryClick={ (entry) => {
    //       const headerValues = filterKeys.reduce(
    //         (acc, filterKey) => ({ ...acc, [filterKey]: entry[filterKey] }),
    //         {}
    //       );
    //       setDetailParams(headerValues); 
    //       x = headerValues[0];
    //       y = headerValues[1];
    //     }}
    //   />
    //   <Header subtitle = { `Inverter: ${x} Header: ${y}` }/>
    //   { detailData &&
    //     <DynamicTable data={ detailData.map(entry => {
    //       const filteredEntry = { ...entry };
    //       filterKeys.map(fk => delete filteredEntry[fk])
    //       return filteredEntry; })
    //     }
    //     />
    //   }
    // </div>
  );
}