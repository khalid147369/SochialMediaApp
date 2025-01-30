import { useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { backendUrl } from '../config';

const cookies = new Cookies();

const useSubmitProfile = () => {
  const [loading, setLoading] = useState(false);

  const submitProfile = async (profileData) => {
    setLoading(true);
    console.log(profileData);
    setLoading(false);
  };

  return { submitProfile, loading };
};

export default useSubmitProfile;
