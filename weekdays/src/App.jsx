import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const MyComponent = () => {
  const [jdList, setJdList] = useState([]);   //to load data from api
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);  //for scroll

  const [searchFilters, setSearchFilters] = useState({   // search functionality :- this time not working properly due to some bug issue
    companyName: "",
    location: "",
    minExp: ""
  });

  const page = useRef(1);   //setdefault

  useEffect(() => {
    fetchData();   //sideeffect
  }, []);

  useEffect(() => {
    page.current = 1;
    setJdList([]);
    fetchData();
  }, [searchFilters]);

  const fetchData = async () => {
    try {
      const response = await axios.post("https://api.weekday.technology/adhoc/getSampleJdJSON", {
        limit: 10,
        offset: (page.current - 1) * 10,
        ...searchFilters
      });

      if (response.data && response.data.jdList.length > 0) {
        setJdList(prevList => [...prevList, ...response.data.jdList]);
        setLoading(false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setJdList([]);
    setHasMore(true);
    fetchData();
  };

  const handleChange = (e) => {
    
    const { name, value } = e.target;
    setSearchFilters({
      ...searchFilters,
      [name]: value
    });
  };

  
  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading || !hasMore) return;
    page.current += 1;
    fetchData();
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);  // scroll- inbuild method
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="container mx-auto">
      <div className="flex justify-center mt-4 mb-8 space-x-4">

        <header className=' m-6 block text-center text-2xl font-semibold'>Welcome to WEEKDAY!</header> <br />

      </div>

      <div className="flex flex-col md:flex-row justify-center mt-4 mb-8  space-y-5 md:space-x-8">
        {/* Input fields for searching */}
        <input type="text" name="companyName" placeholder="Company Name" value={searchFilters.companyName} onChange={handleChange} />
        <input type="text" name="location" placeholder="Location" value={searchFilters.location} onChange={handleChange} />
        <input type="text" name="minExperience" placeholder="Min. Experience" value={searchFilters.minExp} onChange={handleChange} />
        <button className='py-2 px-3 rounded-3xl  bg-cyan-500 text-whites font-serif' onClick={handleSearch}>Search</button>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14">
        {loading ? (
          <div>Loading...</div>
        ) : (
          jdList.map((item, index) => (
            <div key={index} className="bg-white hover:shadow-lime-600   shadow-black shadow-lg rounded-lg p-4">
              <h2 className="text-lg font-bold mb-2">{item.jobRole.toUpperCase()}</h2>
              <p> <img src={item.logoUrl} alt="" /></p>
              <p><strong>Company : {item.companyName}</strong></p>
              <p><strong>Salary : </strong>{item.minJdSalary}-{item.maxJdSalary} in {item.salaryCurrencyCode}</p>
              <p><strong>Experience : </strong>{item.minExp}-{item.maxExp} </p>


              <p><strong>Location: </strong>{item.location}</p>
              <p><strong>Job Description : </strong>{item.jobDetailsFromCompany.slice(0,150)} </p>
              <button className='py-2 px-3 rounded-3xl  bg-lime-500 text-whites font-serif'><a target="_blank" href={item.jdLink}>Apply!</a></button>
            </div>
          ))
        )}
      </div>

      {loading && <div>Loading...</div>}
      {!loading && !hasMore && <div>No more data available</div>}
    </div>

  );
};

export default MyComponent;
