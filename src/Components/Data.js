import React,{useEffect,useState} from 'react';
import axios from 'axios';

function Data() {
    const [activities, setActivities] = useState([]);
    const fetchData = async () => {
        try {
          const response = await axios.get("https://api.slangapp.com/challenges/v1/activities",{
              headers:{
                  'Content-Type': 'application/json',
                  'Authorization': 'Basic NTY6cTFDeExBWW1Bdm1rWWMwSE8vWk5aR2xXMGJlMWJuUjVNOEhCdnRtNXNFTT0='
              }
          });
          console.log(response.data);
          const responseData = Object.values(response.data);
          console.log(responseData);
          const DataFetch =responseData[0].map((data) => ({
            id: data.id,
            user_id: data.user_id,
            answered_at: data.answered_at,
            first_seen_at:data.first_seen_at,
          }));

          console.log(DataFetch);
          setActivities(DataFetch);

        } catch (err) {
          console.error("Ohhhhhu nooor!! My list .... is broken!", err);
        }
      };

      useEffect(() => {
        fetchData();
      },[]);

  return (
    <div>Data
        {console.log('activities',activities)}
    </div>
  )
}

export default Data;