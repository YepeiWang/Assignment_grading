import React from 'react';
import logo from './logo.svg';
import './App.css';
import { rubricItem, rubricItems, clusterItem} from './data';
import { Viz } from './ClusterViz';
import {Input,Button,FormControl,MenuItem,Select,TextField,Stack} from '@mui/material';

interface SimilarAppProps{};
interface SimilarAppState{
    similarItems: {[id: number]: clusterItem};
    errorItems: {[id: number]: clusterItem};
    selectedClusterID: number | undefined;
};

class CheckApp extends React.Component<SimilarAppProps, SimilarAppState> {
    constructor(props: any){
        super(props);
        this.state = {
            errorItems: {},
            similarItems: {},
            selectedClusterID: undefined
        }
        
        this.selectCluster = this.selectCluster.bind(this);
    };

    componentDidMount(){
        console.log('todo: read distant results');
        fetch("http://localhost:5001/distantResult")
        .then((response) => {
			if (!response.ok){
				throw new Error('Something went wrong');
			}
			return response.json();
        })
        .then((data) => {
            var errorItems: {[id:number]: clusterItem} = {};
            var similarItems: {[id:number]: clusterItem} = {};
            data.similarContent.forEach((value: any) => {
                errorItems[value.cluster] = {id: value.cluster, items: []};
                similarItems[value.cluster] = {id: value.cluster, items: []};
                errorItems[value.cluster].items.push(value.answer[0]);
                for (let i = 1; i < 6; i++){
                    similarItems[value.cluster].items.push(value.answer[i]);
                }
            })
            this.setState({
                similarItems: similarItems,
                errorItems: errorItems,
            });
        })
    }

    selectCluster(event: React.MouseEvent){
        var button = event.target as HTMLElement;
        var clusterID = parseInt(event.currentTarget.getAttribute('data-id') as string);
        this.setState({selectedClusterID: clusterID});
    }
    
    
    submitRubric(event: React.SyntheticEvent<HTMLFormElement>){
        event.preventDefault();
        const form = event.currentTarget;
        rubricItems.forEach((value: rubricItem, index: number) => {
            if ((form.elements[index] as HTMLInputElement).value != value.defaultValue){
                value.defaultValue = (form.elements[index] as HTMLInputElement).value;
            } else {
                value.defaultValue = value.defaultValue
            }
        })
    }

    render(): React.ReactNode {
        return <div className='view'>
            <div className='logo'>
                <p></p>
            </div>
            <div className='title'>
            <h1>{"Step 2:  Check Potential Error, Regrade, and Re-design the Rubric"}</h1>
            </div>
            <div id = "cluster"> 
                <h2>Cluster Result</h2>
                <div id="cluster-viz">
                        <Viz data={{table: []}}/>
                </div>
                <div id="rubric-redesign">
                    <div id="rubric-display">
                        <h2>Edit Rubric</h2>
                        <p>Total Points: 8 pts</p>
                        <form onSubmit={this.submitRubric}>
                            {rubricItems.map((value: rubricItem, index: number) => {
                                return <label style={{display: "block"}} key={index}>
                                    {value.point} pts:&nbsp;
                                    <Input
                                        style={{width: "80%", height: "40px"}}
                                        type="text"
                                        defaultValue={value.defaultValue}
                                    ></Input>
                                </label>
                            })}
                            <p></p>
                            <Button variant="outlined" size="small" type="submit">Submit</Button>
                        </form>
                    </div>
                </div>
            </div>
            <div id="cluster-analysis">
                <div>
                    <h2>Potential Error Submission from cluster {this.state.selectedClusterID}</h2>
                    <div>
                        {Object.values(this.state.errorItems).map((value: clusterItem, index: number) => {
                            return  <Button  variant="outlined" size="medium" key={index} onClick={this.selectCluster}
                                data-id={value.id}
                            >cluster {value.id}</Button>
                        })}
                    </div>
                    <div>
                        <Input
                            style={{width: "90%", height: "60px",background: "#C15BB1A6"}}
                            value={this.state.selectedClusterID===undefined? "Click the cluster button to see the potential error submission": this.state.errorItems[this.state.selectedClusterID].items[0]}
                        />
                    </div>
                    <form>
                    <p></p>
                    <Stack direction="row" spacing={2}>
                       
                            <Button color="secondary">Regrade</Button>
                                <FormControl style={{width: 100}}> 
                                    <Select size="small">
                                    <MenuItem disabled value="">
                                        <em>Score</em>
                                    </MenuItem>
                                        {rubricItems.map((value: rubricItem, index: number) => {
                                            return <MenuItem  value={value.point} key={index}>{value.point} pts</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                                <Button variant="outlined" size="small">Submit</Button>
                                
                        </Stack>
                    </form>
                    <div id="SimilarSubmission">
                    <h2>Similar submissions that could potentially be influenced</h2>
                        <Input
                            style={{width: "90%", height: "40px",background: "#C15BB117"}}
                            value={this.state.selectedClusterID===undefined? "Click the cluster button to see the Similar submission": this.state.similarItems[this.state.selectedClusterID].items[0]}
                        />
                        <Input
                            style={{width: "90%", height: "40px",background: "#C15BB117"}}
                            value={this.state.selectedClusterID===undefined? "Click the cluster button to see the Similar submission": this.state.similarItems[this.state.selectedClusterID].items[1]}
                        />
                        <Input
                            style={{width: "90%", height: "40px",background: "#C15BB117"}}
                            value={this.state.selectedClusterID===undefined? "Click the cluster button to see the Similar submission": this.state.similarItems[this.state.selectedClusterID].items[2]}
                        />
                        <Input
                            style={{width: "90%", height: "40px",background: "#C15BB117"}}
                            value={this.state.selectedClusterID===undefined? "Click the cluster button to see the Similar submission": this.state.similarItems[this.state.selectedClusterID].items[3]}
                        />
                        <Input
                            style={{width: "90%", height: "40px",background: "#C15BB117"}}
                            value={this.state.selectedClusterID===undefined? "Click the cluster button to see the Similar submission": this.state.similarItems[this.state.selectedClusterID].items[4]}
                        />
                         <p></p>
                        <Stack direction="row" spacing={2}>
                            <Button color="secondary">Regrade</Button>
                                <FormControl style={{width: 100}}> 
                                    <Select size="small">
                                    <MenuItem disabled value="">
                                        <em>Score</em>
                                    </MenuItem>
                                        {rubricItems.map((value: rubricItem, index: number) => {
                                            return <MenuItem  value={value.point} key={index}>{value.point} pts</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                                <Button variant="outlined" size="small">Submit</Button>
                        </Stack>
                </div>
                </div>
            </div>
        </div>
    }
}

export  {CheckApp};
