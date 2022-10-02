import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ClusterApp } from './ClusterApp';
import { CheckApp } from './CheckApp';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import rubricgo from './logo.png'
import {Button} from '@mui/material';

interface Item{
  name: string;
  route: string;
}

const sidebarItems: Item[] = [
  {
    name: "Cluster and Design",
    route: "/cluster"
  },
  // {
  //   name: "Check and Regrade",
  //   route: "/check"
  // },
];


function ContentRoutes(){
  return (
    <Routes>
    <Route path="" element={<App/>}></Route>
    <Route path="/cluster" element={<ClusterApp/>}></Route>
    {/* <Route path="/check" element={<CheckApp />}></Route> */}
  </Routes>

)
}

// function SidebarItem(props: Item){
//   return (
//     <Link to={props.route}>
//       <p></p>
//       <Button size="large" color="secondary">{props.name}</Button>
//       <p></p>
//     </Link>
//   )
// }

// function Sidebar(){
//   return (<div id="sidebar">
//     <img  style={{height:60}} src={rubricgo}/>
//     {sidebarItems.map((value: Item, index: number) => {
//       return <SidebarItem  name={value.name} route={value.route} key={index}/>;
//     })}
//   </div>)
// }

function Layout(){
  return (<div id="layout">
    <Router>
      {/* <Sidebar/> */}
      <ContentRoutes/>
    </Router>
  </div>)
}

ReactDOM.render(
  <React.StrictMode>
    <Layout />
  </React.StrictMode>,

  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
