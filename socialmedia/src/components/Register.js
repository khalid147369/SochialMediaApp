import cookie from 'universal-cookie';

const cookies = new cookie();

const handleRegister = async () => {
  // ...existing code...
  cookies.set('token', response.data.token, { path: '/' });
  // ...existing code...
};

const token = cookies.get('token');

// ...existing code...
