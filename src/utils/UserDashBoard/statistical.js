import axios from 'axios';

export const fetchTours = async (token) => {
  try {
    const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/Tour/toursStatus/1`, {
      headers: { 'Authorization': `${token}` }
    });
    return response.data.$values;
  } catch (error) {
    console.error('Error fetching tours:', error);
    throw error;
  }
};
export const fetchTourData = async (tours, token) => {
  const tourAmounts = await Promise.all(tours.map(async (tour) => {
    const participantsResponse = await axios.get(`https://travelmateapp.azurewebsites.net/api/Tour/tourParticipants/${tour.tourId}`, {
      headers: { Authorization: `${token}` }
    });
    const totalPaid = participantsResponse.data.$values.reduce((acc, participant) => {
      return acc + (participant.totalAmount || 0);
    }, 0);
    return {
      tourName: tour.tourName,
      amount: tour.price * tour.maxGuests,
      totalPaid,
    };
  }));

  return tourAmounts;
};
export const fetchTransactions = async (userId) => {
  try {
    const response = await fetch(`https://travelmateapp.azurewebsites.net/api/Transaction/traveler/${userId}`);
    const data = await response.json();
    return data.$values.map(transaction => ({
      name: transaction.travelerName,
      tourName: transaction.tourName,
      localName: transaction.localName,
      date: new Date(transaction.transactionTime).toLocaleDateString('vi-VN'),
      amount: transaction.price,
      transactionTime: transaction.transactionTime
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};
