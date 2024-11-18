import React, { useContext, useEffect, useState } from 'react';
import '../styles/LandingPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../context/GeneralContext';

const LandingPage = () => {
  const [error, setError] = useState('');
  const [checkBox, setCheckBox] = useState(false);
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [Flights, setFlights] = useState([]);
  
  const navigate = useNavigate();
  const { setTicketBookingDate } = useContext(GeneralContext);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (localStorage.getItem('userType') === 'admin') {
      navigate('/admin');
    } else if (localStorage.getItem('userType') === 'flight-operator') {
      navigate('/flight-admin');
    }
  }, [navigate]);

  const fetchFlights = async () => {
    if (departure && destination && departureDate) {
      const date = new Date();
      const date1 = new Date(departureDate);
      const date2 = checkBox ? new Date(returnDate) : null;

      if (date1 >= date && (!checkBox || (date2 && date2 > date1))) {
        setError('');
        try {
          const response = await axios.get('http://localhost:6001/fetch-flights');
          setFlights(response.data);
        } catch (err) {
          setError('Error fetching flights');
        }
      } else {
        setError('Please check the dates');
      }
    } else {
      setError('Please fill all the inputs');
    }
  };

  const handleTicketBooking = (id, origin, destination) => {
    if (userId) {
      setTicketBookingDate(origin === departure ? departureDate : returnDate);
      navigate(`/book-flight/${id}`);
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="landingPage">
      <div className="landingHero">
        <div className="landingHero-title">
          <h1 className="banner-h1">Embark on an Extraordinary Flight Booking Adventure!</h1>
          <p className="banner-p">
            Unleash your travel desires and book extraordinary Flight journeys that will transport you to unforgettable destinations, igniting a sense of adventure like never before.
          </p>
        </div>

        <div className="Flight-search-container input-container mb-4">
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" onChange={(e) => setCheckBox(e.target.checked)} />
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Return journey</label>
          </div>
          <div className="Flight-search-container-body">
            <div className="form-floating">
              <select className="form-select form-select-sm mb-3" aria-label=".form-select-sm example" value={departure} onChange={(e) => setDeparture(e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="Chennai">Chennai</option>
                <option value="Banglore">Banglore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Indore">Indore</option>
                <option value="Delhi">Delhi</option>
                <option value="Pune">Pune</option>
                <option value="Trivendrum">Trivendrum</option>
                <option value="Bhopal">Bhopal</option>
                <option value="Kolkata">Kolkata</option>
                <option value="varanasi">varanasi</option>
                <option value="Jaipur">Jaipur</option>
              </select>
              <label htmlFor="floatingSelect">Departure City</label>
            </div>
            <div className="form-floating">
              <select className="form-select form-select-sm mb-3" aria-label=".form-select-sm example" value={destination} onChange={(e) => setDestination(e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="Chennai">Chennai</option>
                <option value="Banglore">Banglore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Indore">Indore</option>
                <option value="Delhi">Delhi</option>
                <option value="Pune">Pune</option>
                <option value="Trivendrum">Trivendrum</option>
                <option value="Bhopal">Bhopal</option>
                <option value="Kolkata">Kolkata</option>
                <option value="varanasi">varanasi</option>
                <option value="Jaipur">Jaipur</option>
              </select>
              <label htmlFor="floatingSelect">Destination City</label>
            </div>
            <div className="form-floating mb-3">
              <input type="date" className="form-control" id="floatingInputstartDate" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
              <label htmlFor="floatingInputstartDate">Journey date</label>
            </div>
            {checkBox &&
              <div className="form-floating mb-3">
                <input type="date" className="form-control" id="floatingInputreturnDate" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
                <label htmlFor="floatingInputreturnDate">Return date</label>
              </div>
            }
            <div>
              <button className="btn btn-primary" onClick={fetchFlights}>Search</button>
            </div>
          </div>
          {error && <p className="error-message">{error}</p>}
        </div>

        {Flights.length > 0 && 
          <div className="availableFlightsContainer">
            <h1>Available Flights</h1>
            <div className="Flights">
              {Flights.filter(Flight => Flight.origin === departure && Flight.destination === destination).map((Flight) => (
                <div className="Flight" key={Flight._id}>
                  <div>
                    <p><b>{Flight.flightName}</b></p>
                    <p><b>Flight Number:</b> {Flight.flightId}</p>
                  </div>
                  <div>
                    <p><b>Start :</b> {Flight.origin}</p>
                    <p><b>Departure Time:</b> {Flight.departureTime}</p>
                  </div>
                  <div>
                    <p><b>Destination :</b> {Flight.destination}</p>
                    <p><b>Arrival Time:</b> {Flight.arrivalTime}</p>
                  </div>
                  <div>
                    <p><b>Starting Price:</b> {Flight.basePrice}</p>
                    <p><b>Available Seats:</b> {Flight.totalSeats}</p>
                  </div>
                  <button className="button btn btn-primary" onClick={() => handleTicketBooking(Flight._id, Flight.origin, Flight.destination)}>Book Now</button>
                </div>
              ))}
            </div>
          </div>
        }

        {Flights.length === 0 && <p>No Flights found for the selected route and dates.</p>}

        <section id="about" className="section-about p-4">
          <div className="container">
            <h2 className="section-title">About Us</h2>
            <p className="section-description">
              Welcome to our Flight ticket booking app, where we are dedicated to providing you with an exceptional travel experience from start to finish. Whether you're embarking on a daily commute, planning an exciting cross-country adventure, or seeking a leisurely scenic route, our app offers an extensive selection of Flight options to cater to your unique travel preferences.
            </p>
            <span><h5>2024 Fly Around - &copy; All rights reserved</h5></span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
