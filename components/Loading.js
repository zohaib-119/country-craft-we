import { FaSpinner } from "react-icons/fa";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        <FaSpinner className="animate-spin text-orange-500 text-5xl" />
        {/* <p className="text-orange-500 text-lg mt-4">Loading, please wait...</p> */}
      </div>
    </div>
  );
};

export default Loading;
