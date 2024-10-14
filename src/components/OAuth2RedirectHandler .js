import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get('token');

    if (token) {
      login(token);
      navigate('/');
    } else {
      navigate('/login', { state: { error: 'OAuth2 login failed, no token received.' } });
    }
  }, [search, login, navigate]);

  return null;
};

export default OAuth2RedirectHandler;
