import  { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../redux/slices/userSlice';

const HomePage = () => {
  const dispatch = useDispatch();

  const { user, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(loadUser()); // Dispatch the action to load user data when component mounts
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Welcome, {user ? user.name : 'Guest'}</h1>
      {/* Your other components or JSX here */}
    </div>
  );
};

export default HomePage;
