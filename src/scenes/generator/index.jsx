import GeneratorTable from "components/GeneratorTable";
import OverviewTable from "components/OverviewTable";
import Header from "components/Header";

export default function Generator({ name, urls }) {
  return (
    <div>
      <Header title={ name } subtitle="brief description of temperature sensor"/>
      {/* <OverviewTable urls={urls} numConfigurationHeaders=2/> */}
      {urls.map((url) => (
        <GeneratorTable url={url} />
      ))}
    </div>
  );
}