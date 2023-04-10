import { useState } from "react";
import { Modal, Button } from 'react-bootstrap';
import { Typography, useTheme } from "@mui/material";
import useGithubCsv from "hooks/useGithubCsv";
import DynamicTable from "components/DynamicTable";
import Header from "components/Header";
import ModalGraph from "components/graphs/ModalGraph"
import 'bootstrap/dist/css/bootstrap.min.css';  
import Scatterplot from "components/graphs/Scatterplot"
import Scatterplot2 from "components/graphs/Scatterplot2"



export default function Generator({ name, urls, filterKeys = [], detailFilterKey, generateSummary = () => {}}) {
  const [selectedUrls, setSelectedUrls] = useState([urls[0].url]);
  const [selectedLabels, setSelectedLabels] = useState([urls[0].label]);
  const { summaryData, detailData, setDetailParams, loading } = useGithubCsv(
    selectedUrls,
    filterKeys,
    generateSummary
  );

  const columnNames = detailData?.length 
  ? Object.keys(detailData[0]).filter(
    (c) => c !== detailFilterKey && !filterKeys.includes(c)) 
  : [];

  console.log(columnNames)

  const theme = useTheme();
  const [headerValues, setHeaderValues] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState('freq');
  // const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    console.log('handle modal');
  }

  const handleLeftArrowClick = () => {
    const currentColumnIndex = columnNames.indexOf(selectedColumn);
    const nextColumnIndex = currentColumnIndex === 0 ? columnNames.length - 1 : currentColumnIndex - 1;
    setSelectedColumn(columnNames[nextColumnIndex]); 
  };
  
  const handleRightArrowClick = () => {
    const currentColumnIndex = columnNames.indexOf(selectedColumn);
    const nextColumnIndex = currentColumnIndex ===  columnNames.length - 1 ? 0 : currentColumnIndex + 1;
    setSelectedColumn(columnNames[nextColumnIndex]);
  };  
  
  if (loading) return null;

  return (
    <div>
      <Header title={name} subtitle="brief description of temperature sensor" />
      <div style={{ display: "flex", alignItems: "center", 
                    marginLeft: "1.5rem", marginTop: "1rem", marginBottom: "0rem"}}>
        {urls.map(({ label, url }) => (
          <label key={url} style={{ marginLeft: "1rem" }}>
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
                setSelectedLabels((prevState) => {
                  if (e.target.checked) {
                    return [...prevState, label];
                  } else {
                    return prevState.filter((selectedLabel) => selectedLabel !== label);
                  }
                });
              }}
            />
            { " " + label }
          </label>
        ))}
      </div>
      {/* <div style={{ display: "flex", alignItems: 'flex-start' }}> */}
        {/* <div style={{ flex: "1", margin: "1rem 2rem"}}> */}
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: selectedUrls.length > 1 ? '0.5 0 60%' : '0.5 0 60%', margin: "1rem 2rem"}}>
          <DynamicTable
             data={ 
              summaryData.map(summary => Object.keys(summary).sort((a, b) => {
                if (a.endsWith('_1') && b.endsWith('_2')) {
                  return -1;
                } else if (a.endsWith('_2') && b.endsWith('_1')) {
                  return 1;
                } else {
                  return 0;
                }
              }).reduce((obj, key) => {
                obj[key] = summary[key];
                return obj;
              }, {}))
            }
            //  summaryData.map((entry) => {
            //   const modifiedEntry = { ...entry };
            //   for (const key in modifiedEntry) {
            //     if (key.includes('_')){
            //       var pretty_key = key.replace("_", " ");
            //       const labels = [];
            //       console.log(pretty_key)
            //       if (key.endsWith('_1') && selectedUrls.length >= 1) {
            //         pretty_key = pretty_key.replace("_1", "");
            //         console.log(urls)
            //         const label = (urls.find(u => u.url === selectedUrls[0])).label;
            //         labels.push(label);
            //         console.log(label + "\n" + pretty_key);
            //         modifiedEntry[label + "\n" + pretty_key] = modifiedEntry[key];
            //         delete modifiedEntry[key];
            //       }
            //       else if (key.endsWith('_2') && selectedUrls.length > 1){
            //         pretty_key = pretty_key.replace("_2", "");
            //         const label = (urls.find(u => u.url === selectedUrls[1])).label;
            //         labels.push(label);
            //         console.log(label + "\n" + pretty_key);
            //         modifiedEntry[label + "\n" + pretty_key] = modifiedEntry[key];
            //         delete modifiedEntry[key];
            //       }
            //       else {
            //         modifiedEntry[pretty_key] = modifiedEntry[key];
            //       }
            //       delete modifiedEntry[key];
            //     }
            //   }
            //   return modifiedEntry; 
            // })}
            urlLabels={selectedLabels}
            numFilterKeys = {2}
            onEntryClick={(entry) => {
              const values = filterKeys.reduce(
                (acc, filterKey) => ({ ...acc, [filterKey]: entry[filterKey] }),
                {}
              );
              console.log(values)
              setHeaderValues(values);
              setDetailParams(values);
              handleModal();
            }}
          />
        </div>
        <div style={{ display: "flex", flex: '1 0 70%', flexDirection: 'column', justifyContent: "center" }}>
          <div style={{ flexBasis: "50%" }}>
            {summaryData && 
            (<Scatterplot width={500} height={350} data={summaryData} 
                          xAxis="Frequency (Hz)" yAxis="Power (μW)" groupBy="inverter" />)}
          </div>
          <div style={{ flexBasis: "50%" }}>
            <Scatterplot2
              width={500}
              height={300}
              data={summaryData}
              xAxis="Inverter"
              yAxis="Header"
              groupBy="inverter"
            />
          </div>
        </div>
      </div>
        <div style={{ flex: "1"}}>
          <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)} 
          dialogClassName="custom-size-modal"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          style={{ zIndex: 9999 }}
          >
          <Modal.Header>
              <Typography variant="h5" fontWeight="bold" color={theme.palette.neutral.main}>
                {Object.entries(headerValues).map(header => `${header[0].toUpperCase()}: ${header[1]} `)}
              </Typography>
            </Modal.Header>
            <Modal.Body>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{flex: (selectedUrls.length > 1 ? '0 0 60%' : '0 0 50%'), marginRight: '2%', height: '100%' }}>
                  {detailData &&
                    <>
                      {(() => {
                        const combinedData = [];
                        console.log(detailData)
                        detailData.forEach(entry => {
                          
                          var matchingObj = combinedData.find(obj => 
                            obj[detailFilterKey] === entry[detailFilterKey]);

                          if (matchingObj) {
                            const entryCopy = {...entry}
                            delete entryCopy[detailFilterKey]
                            filterKeys.map((fk) => delete entryCopy[fk]);
                            const firstObjIndex = combinedData.indexOf(matchingObj);
                            for (var key in entryCopy){
                              entryCopy[key+'2'] = entryCopy[key];
                              //delete entry[key];
                            }
                            combinedData[firstObjIndex] = {...matchingObj, ...entryCopy};
                          }
                          else {
                            combinedData.push(entry);
                          }
                        });
                        console.log(combinedData);
                        return (
                          <DynamicTable
                            data={combinedData.map((entry) => {
                              const filteredEntry = { ...entry };
                              filterKeys.map((fk) => delete filteredEntry[fk]);
                              return filteredEntry;
                            })}
                            urlLabels={selectedLabels}
                            numFilterKeys={1}
                          />
                        );
                      })()}
                    </>
                  }       
                </div>
                {detailData && 
                <div style={{flex: selectedUrls.length > 1 ? '1 1 38%' : '1 1 48%', display: 'flex', flexDirection: 'column'}}>
                  <div style={{ order: 1 , paddingBottom: '4%'}}>
                    <button onClick={handleLeftArrowClick}>&lt;</button>
                    <button onClick={handleRightArrowClick}>&gt;</button>
                  </div>
                  {/* instead just give graph name */}
                  <div style={{ order: 2 }}>
                    <Typography variant="h5" fontWeight="bold" color={theme.palette.neutral.main}>
                    {selectedColumn}
                    </Typography>
                  </div>
                  <div style={{ order: 3, height: '100%' }}>
                    <ModalGraph
                      data={detailData} 
                      column={selectedColumn} 
                      detailFilterKey={detailFilterKey} 
                    />
                  </div>
                </div>
                }
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setShowModal(false)}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
  );
}