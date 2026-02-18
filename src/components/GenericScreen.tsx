const GenericScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center">
      <h1 className="text-4xl font-bold text-gray-600 uppercase mb-2">404 Error Page</h1>
      <p className="text-2xl text-gray-400 mb-8">Regrese al whatsapp</p>
      
      <div className="flex items-center mb-4">
        <span className="text-[12rem] font-bold text-blue-200">4</span>
        <svg
          width="160"
          height="240"
          viewBox="0 0 120 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-4"
        >
          <rect x="40" y="20" width="40" height="40" rx="10" fill="#3B82F6" />
          <circle cx="50" cy="35" r="5" fill="white" />
          <circle cx="70" cy="35" r="5" fill="white" />
          <line x1="45" y1="30" x2="55" y2="40" stroke="black" strokeWidth="2" />
          <line x1="55" y1="30" x2="45" y2="40" stroke="black" strokeWidth="2" />
          <line x1="65" y1="30" x2="75" y2="40" stroke="black" strokeWidth="2" />
          <line x1="75" y1="30" x2="65" y2="40" stroke="black" strokeWidth="2" />
          <line x1="60" y1="20" x2="60" y2="10" stroke="#3B82F6" strokeWidth="4" />
          <circle cx="60" cy="8" r="3" fill="orange" />
          <rect x="35" y="60" width="50" height="50" rx="5" fill="#3B82F6" />
          <rect x="45" y="70" width="30" height="30" fill="white" />
          <circle cx="60" cy="85" r="8" fill="gray" />
          <circle cx="55" cy="90" r="4" fill="darkgray" />
          <circle cx="65" cy="80" r="3" fill="lightgray" />
          <rect x="25" y="70" width="10" height="30" fill="#3B82F6" transform="rotate(-30 25 70)" />
          <rect x="85" y="70" width="10" height="30" fill="#3B82F6" transform="rotate(30 85 70)" />
          <rect x="90" y="95" width="5" height="15" fill="gray" transform="rotate(30 90 95)" /> 
          <rect x="88" y="105" width="10" height="5" fill="gray" transform="rotate(30 88 105)" />
          <rect x="45" y="110" width="10" height="30" fill="#3B82F6" /> 
          <rect x="65" y="110" width="10" height="20" fill="#3B82F6" /> 
          <rect x="70" y="135" width="10" height="10" fill="#3B82F6" transform="rotate(45 70 135)" /> 
          <circle cx="80" cy="55" r="2" fill="yellow" />
          <line x1="30" y1="120" x2="20" y2="130" stroke="gray" strokeWidth="2" />
          <circle cx="18" cy="132" r="3" fill="gray" />
        </svg>
        <span className="text-[12rem] font-bold text-blue-200">4</span>
      </div>
      
      <p className="text-2xl text-gray-500 mb-8">uh-oh! Pagina no encontrada...</p>
      
  
    </div>
  );
};

export default GenericScreen;