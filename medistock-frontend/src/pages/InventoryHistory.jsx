import {useEffect,useState} from "react";
import {getHistory} from "../services/inventoryHistoryService";
import Navbar from "../components/Navbar";

function InventoryHistory(){

const [history,setHistory]=useState([]);

useEffect(()=>{

loadHistory();

},[]);

const loadHistory=async()=>{

const res=await getHistory();

setHistory(res.data);

};

return(

<>

<Navbar/>

<div className="container mt-4">

<h2>Inventory History</h2>

<table className="table table-bordered">

<thead>

<tr>

<th>ID</th>

<th>Medicine</th>

<th>Action</th>

<th>Quantity</th>

<th>Date</th>

</tr>

</thead>

<tbody>

{

history.map((h)=>(

<tr key={h.id}>

<td>{h.id}</td>

<td>{h.medicineName}</td>

<td>{h.action}</td>

<td>{h.quantity}</td>

<td>{h.actionTime}</td>

</tr>

))

}

</tbody>

</table>

</div>

</>

);

}

export default InventoryHistory;