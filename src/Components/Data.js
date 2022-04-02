import React, { useEffect, useState } from "react";
import axios from "axios";
import { act } from "react-dom/test-utils";

function Data() {
  const [activities, setActivities] = useState([]);
  var user_sessions = {
    user_sessions: {},
  };

  //FIRST STEP
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://api.slangapp.com/challenges/v1/activities",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Basic NTY6cTFDeExBWW1Bdm1rWWMwSE8vWk5aR2xXMGJlMWJuUjVNOEhCdnRtNXNFTT0=",
          },
        }
      );

      //Converting data
      const responseData = Object.values(response.data);
      const DataFetch = responseData[0].map((data) => ({
        id: data.id,
        user_id: data.user_id,
        answered_at: data.answered_at,
        first_seen_at: data.first_seen_at,
      }));
      setActivities(DataFetch);

    } catch (err) {
      console.error("Ohhhhhu nooor!! My list .... is broken!", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //SECOND STEP

  //Get unique user ids
  const uniqueUserIds = [];
  for (var i = 0; i < activities.length; i++) {
    if (!uniqueUserIds.includes(activities[i].user_id)) {
      uniqueUserIds.push(activities[i].user_id);
    }
  }

  //Group activities by user ids
  const groupActivities = {};
  var contador = 0;
  while (contador < uniqueUserIds.length) {
    const arr = [];
    for (var i = 0; i < activities.length; i++) {
      if (activities[i].user_id == uniqueUserIds[contador]) {
        arr.push(activities[i]);
      }
    }
    groupActivities[uniqueUserIds[contador]] = arr;
    user_sessions["user_sessions"][uniqueUserIds[contador]] = [];
    contador++;
  }

  console.log(uniqueUserIds);
  console.log(groupActivities);

  //Main Algorithm
  var a = 0;
  while (a < uniqueUserIds.length) {
    //Initializing variables
    var b = 0;
    var c = 1;

    //variables to track the position of first and last activity for each user session
    var started = 0;
    var ended = 0;

    //Initializing array of User sessions for each user id
    var arrUserSessions = [];

    //Initializing array of activities for each user sessions
    var arrActivities = [];

    while (b < groupActivities[uniqueUserIds[a]].length) {

      //Getting time in minutes of answered_at and fist_seen_at
      const answered_at =
        new Date(groupActivities[uniqueUserIds[a]][b].answered_at).getTime() /
        1000 / 60;
      const first_seen_at =
        new Date(groupActivities[uniqueUserIds[a]][c].first_seen_at).getTime() /
        1000 / 60;

      //Avoding comparisons between the same activity
      if (
        groupActivities[uniqueUserIds[a]][b].id !=
        groupActivities[uniqueUserIds[a]][c].id
      ) {
        //Initializing the timestamp of user session start.
        var startedAt =
          groupActivities[uniqueUserIds[a]][started].first_seen_at;

        //Initializing the time in seconds of user session start.
        var starting =
          new Date(
            groupActivities[uniqueUserIds[a]][started].first_seen_at
          ).getTime() / 1000;
        arrActivities.push(groupActivities[uniqueUserIds[a]][b].id);

        //Validating if there are more than 5 minutes between first_seen_at and answered_at
        if (first_seen_at - answered_at > 5) {

          //Updating variable of the end for each user session
          ended = b;
      
          //Initializing the timestamp of user session end.
          var endedAt = groupActivities[uniqueUserIds[a]][ended].answered_at;

          //Initializing the time in seconds of user session end.
          var ending =
            new Date(
              groupActivities[uniqueUserIds[a]][ended].answered_at
            ).getTime() / 1000;

          //Getting user session duration.
          var duration = ending - starting;

          //Adding user session to the array
          arrUserSessions.push({
            ended_at: endedAt,
            started_at: startedAt,
            activity_ids: arrActivities,
            duration_seconds: duration,
          });

          //Updating variable of the start for each user session
          started = c;

          //Reinitializing array of activities for a new user session
          arrActivities = [];

        //Same process to add the user session when the array for each user id ends.
        } else if (c == groupActivities[uniqueUserIds[a]].length - 1) {

          //Adding the last activity to the array.
          arrActivities.push(groupActivities[uniqueUserIds[a]][c].id);

          //Updating variable to the end or last item of the array
          ended = c;

          //Initializing the timestamp of user session end.
          var endedAt = groupActivities[uniqueUserIds[a]][ended].answered_at;

          //Initializing the time in seconds of user session end.
          var ending =
            new Date(
              groupActivities[uniqueUserIds[a]][ended].answered_at
            ).getTime() / 1000;

          //Getting user session duration.
          var duration = ending - starting;

          //Adding user session to the array
          arrUserSessions.push({
            ended_at: endedAt,
            started_at: startedAt,
            activity_ids: arrActivities,
            duration_seconds: duration,
          });
        }
      }
      b++;
      if (c < groupActivities[uniqueUserIds[a]].length - 1) {
        c++;
      } else {
        break;
      }
    }
    user_sessions["user_sessions"][uniqueUserIds[a]] = arrUserSessions;
    a++;
  }

  console.log(user_sessions);

  //THIRD STEP
  const postData = async () => {
    try {
      const response = await axios.post(
        "https://api.slangapp.com/challenges/v1/activities/sessions",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Basic NTY6cTFDeExBWW1Bdm1rWWMwSE8vWk5aR2xXMGJlMWJuUjVNOEhCdnRtNXNFTT0=",
          },
        },
        user_sessions
      );
    } catch (err) {
      console.error("Ohhhhhu nooor!!", err);
    }
  };

  useEffect(() => {
    postData();
  });

  return <div>{console.log("activities", activities)}</div>;
}

export default Data;
