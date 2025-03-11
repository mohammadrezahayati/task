'use client';
import DynamicForm from './DynamicForm';
import ApplicationList from './ApplicationList';
import { useTheme } from './context/createTheme';

const MainPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={
        theme === 'dark'
          ? 'dark bg-gray-900 text-white w-full'
          : 'bg-gray-100 text-gray-900 w-full'
      }>
      <div className='container mx-auto px-6'>
        <button
          onClick={toggleTheme}
          className='mb-4 p-2 border rounded bg-gray-300 dark:bg-gray-700 dark:text-white'>
          {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </button>
        <h1 className='text-3xl font-bold mb-6'>
          Smart Insurance Application Portal
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <DynamicForm />
          <ApplicationList />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
