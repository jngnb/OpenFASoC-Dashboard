# Code Explanation
### App.js: the main part of this app. 
It returns the page we see in the app. 
It also defines a variable “generators” that will be used as data to render the page.

It currently imports two main elements:
```
import Layout from "scenes/layout";
import Generator from 'scenes/generator';
```
### Generator: the page we see for each generator
It import multiple elements, several of them are used to make the plots.
```
import useGithubCsv from "hooks/useGithubCsv";
import DynamicTable from "components/DynamicTable";
import Header from "components/Header";
import ModalGraph from "components/graphs/ModalGraph"
import 'bootstrap/dist/css/bootstrap.min.css';  
import Scatterplot from "components/graphs/Scatterplot"
import Scatterplot2 from "components/graphs/Scatterplot2"
```
useGithubCsv is the important file here, it fetch the csv file from the internet and store them in memory locally.

### Possible modifications
Change the usegithubcsv to get data from the http server(when do we want to deploy it) instead of github. 
