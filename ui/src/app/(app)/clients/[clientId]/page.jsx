"use client"
import "./style.css"
import Map from "@/components/map/map";
import { getCoordinates } from "@/lib/geocode";
import axios from "axios";
import { useState,useEffect } from "react";
import { DataTable } from "@/components/table/base-data-table";


function ClientPage({params}) {
  const [clientData, setClientData] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  useEffect(
    ()=>{
      async function fetchClientData(){
        try {
          const API_URL = process.env.NEXT_PUBLIC_URLAPI;
          if (!API_URL) throw new Error("API URL is not defined in env variables");
            const response = await axios.get(`${API_URL}/clients/${params.clientId}`);
            const client = response.data;
            setClientData(client);

            if (client.address) {
              const coords = await getCoordinates(client.address);
              setCoordinates(coords);
            }
        } catch (err) {
          console.error('Error fetching client data:', error);
        }
      }
      fetchClientData()
    },[]
  )


  // setCoordinates("33°15'13.5\"N 8°30'30.8\"W")

  return (
    <>
      <h1>client {params.clientId}</h1>
      <div className="container">
        <div className="mapContainer">
            <div className="logoContainer"></div>
            <div className="TheAddress"></div>
            <div className="TheAddressInMap">
                <Map coordinates={coordinates}/>
            </div>
        </div>
        <div className="statiqueContainer">
          <div className="activeProducts statiquesDisplay">
            <h1 className="statiquesHeader">Active Products</h1>
            <h2 className="nbrStatiques">120</h2>
            <p className="calc">11%</p>
          </div>
          <div className="expiringSoon statiquesDisplay">
            <h1 className="statiquesHeader">Expiring Soon</h1>
            <h2 className="nbrStatiques">120</h2>
            <p className="calc">11%</p>
          </div>
          <div className="expired statiquesDisplay">
            <h1 className="statiquesHeader">Expired</h1>
            <h2 className="nbrStatiques">120</h2>
            <p className="calc">11%</p>
          </div>
          <div className="clients statiquesDisplay">
            <h1 className="statiquesHeader">Clients</h1>
            <h2 className="nbrStatiques">120</h2>
            <p className="calc">11%</p>
          </div>
        </div>
      </div>
      <div className="data">
          {/* <DataTable data={clientData} columns={}/> */}
      </div>
    </>
  );
}
export default ClientPage;
