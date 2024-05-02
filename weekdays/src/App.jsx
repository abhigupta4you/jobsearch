import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyComponent = () => {
  const [jdList, setJdList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState(""); // State to store the sort parameter

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("https://api.weekday.technology/adhoc/getSampleJdJSON", {
          params: {
            limit: 10,
            offset: 0
          },
          headers: {
            "Content-Type": "application/json"
          }
        });
        setJdList(response.data.jdList);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to handle sorting based on the selected parameter
  const handleSort = (param) => {
    setSortBy(param);
    // Sorting logic here
    // Assuming jdList is an array of objects
    const sortedList = [...jdList].sort((a, b) => {
      if (a[param] < b[param]) return -1;
      if (a[param] > b[param]) return 1;
      return 0;
    });
    setJdList(sortedList);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-center mt-4 mb-8 space-x-4">
        {/* Input boxes for sorting */}
        <input type="button" value="Sort by UID" onClick={() => handleSort("jdList.jdUid")} />
        <input type="button" value="Sort by Link" onClick={() => handleSort("jdLink")} />
        <input type="button" value="Sort by Salary" onClick={() => handleSort("maxJdSalary")} />
        <input type="button" value="Sort by Location" onClick={() => handleSort("Location")} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <div>Loading...</div>
        ) : (
          jdList.map((item, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-bold mb-2">{item.jobRole}</h2>
              <p><strong>Salary : </strong>{item.minJdSalary}-{item.maxJdSalary} in {item.salaryCurrencyCode}</p>
              <p><strong>Experience : </strong>{item.minExp}-{item.maxExp} </p>
              <p><strong>Link: </strong>{item.jdLink}</p>
            
              <p><strong>Location: </strong>{item.location}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyComponent;
