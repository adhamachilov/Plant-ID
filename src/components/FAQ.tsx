import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <div className="space-y-3 sm:space-y-4">
      <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">Frequently Asked Questions</h2>
      {items.map((item, index) => (
        <div 
          key={index} 
          className="bg-emerald-900/30 rounded-md sm:rounded-lg overflow-hidden"
        >
          <button
            className="w-full px-4 sm:px-5 py-3 sm:py-4 flex justify-between items-center text-left"
            onClick={() => toggleItem(index)}
          >
            <span className="font-medium text-white text-sm sm:text-base">{item.question}</span>
            {openIndex === index ? (
              <ChevronUp className="h-5 w-5 text-emerald-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-emerald-400" />
            )}
          </button>
          
          <div 
            className={`px-4 sm:px-5 overflow-hidden transition-all duration-300 ${
              openIndex === index 
                ? 'max-h-96 py-4 opacity-100' 
                : 'max-h-0 py-0 opacity-0'
            }`}
          >
            <p className="text-emerald-200 text-xs sm:text-sm">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
