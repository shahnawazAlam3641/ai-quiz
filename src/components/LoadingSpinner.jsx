const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-emerald-500 rounded-full animate-spin animate-reverse"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;