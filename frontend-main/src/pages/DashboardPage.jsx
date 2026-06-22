import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const DashboardPage = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Upload',
      icon: '📤',
      path: '/upload',
      bgColor: 'bg-blue-500',
    },
    {
      title: 'Record',
      icon: '🎤',
      path: '/record',
      bgColor: 'bg-blue-500',
    },
    {
      title: 'Lessons',
      icon: '📚',
      path: '/lessons',
      bgColor: 'bg-blue-500',
    },
    {
      title: 'Profile',
      icon: '👤',
      path: '/profile',
      bgColor: 'bg-blue-500',
    },
    {
      title: 'Chats',
      icon: '💬',
      path: '/chats',
      bgColor: 'bg-blue-500',
    },
    {
      title: 'Settings',
      icon: '⚙️',
      path: '/settings',
      bgColor: 'bg-blue-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Hello!" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <div
              key={item.title}
              onClick={() => navigate(item.path)}
              className={`${item.bgColor} p-8 rounded-xl shadow-xl hover:shadow-2xl cursor-pointer transform hover:-translate-y-1 transition-all`}
            >
              <div className="text- text-center">
                <div className="text-4xl mb-2">{item.icon}</div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;