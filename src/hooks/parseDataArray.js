import useGithubCsv from "./useGithubCsv";

export default function parseDataArray(urls) {
    const csvDataArray = 
        urls.map(( url ) => {
            return useGithubCsv(url);
        }
    )
}