
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Friends = () => {
  const [friends, setFriends] = useState([]); // Define the friends state

  useEffect(() => {
    // Fetch friends data and set it to the friends state
    axios.get('https://travelmateapp.azurewebsites.net/api/Friends')
      .then(response => {
        setFriends(response.data);
      })
      .catch(error => {
        console.error('Error fetching friends:', error);
      });
  }, []);

  return (
    <div>
      {friends.map(friend => (
        <div key={friend.id}>
          {/* Render friend details */}
        </div>
      ))}
    </div>
  );
};

export default Friends;