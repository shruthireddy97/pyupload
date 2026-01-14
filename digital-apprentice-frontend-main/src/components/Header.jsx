import { useNavigate } from 'react-router-dom';

const Header = ({ title }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <header className="bg-orange-600 text-white p-4 flex justify-between items-center">
      <button
        onClick={() => navigate('/dashboard')}
        className="px-4 py-2 hover:bg-blue-700 rounded"
      >
        Home
      </button>
      <h1 className="text-xl font-bold">{title}</h1>
      <button
        onClick={handleLogout}
        className="px-4 py-2 hover:bg-blue-700 rounded"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;