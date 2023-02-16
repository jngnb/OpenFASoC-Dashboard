import useGithubCsv from "../hooks/useGithubCsv";
import DynamicTable from "./DynamicTable";

export default function GeneratorTable({ url }) {
  const { data } = useGithubCsv(url);
  return data === null ? null : <DynamicTable data={data} />;
}
