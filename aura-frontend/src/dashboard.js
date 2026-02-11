import React from 'react';


const MatchPage = ({ personaSummary, friendName, friendTrait, onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-indigo-100">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✨</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Aura's Analysis Complete</h1>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          "After conversing with you, Aura has realized that you are someone who is 
          <span className="font-bold text-indigo-600"> {personaSummary}</span>."
        </p>

        <div className="bg-indigo-50 rounded-2xl p-6 mb-8 border border-indigo-100">
          <p className="text-sm text-indigo-400 uppercase font-bold tracking-widest mb-2">We found a connection</p>
          <h2 className="text-xl font-bold text-gray-800 mb-1">{friendName}</h2>
          <p className="text-gray-500 text-sm">is also a <span className="font-medium text-gray-700">{friendTrait}</span></p>
          <p className="mt-4 text-sm text-gray-600 italic">"They are comfortable and excited to speak with you!"</p>
        </div>

        <button 
          className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg"
          onClick={() => alert("Connecting to chat...")}
        >
          Say Hello to {friendName}
        </button>
        
        <button 
          className="mt-4 text-gray-400 text-sm underline"
          onClick={onBack}
        >
          Keep Practicing with Aura
        </button>
      </div>
    </div>
  );
};

export default MatchPage;
