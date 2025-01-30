import React , {useEffect,useState} from 'react';
import ProfileForm from '../components/ProfileForm';

import './Profile.css'
import axios from 'axios';
import { backendUrl } from '../config';
function Profile() {



  return (
    <div className="flex justify-center items-center h-screen">
      <ProfileForm className="width md block mx-auto "  />
    </div>
  );
}

export default Profile;