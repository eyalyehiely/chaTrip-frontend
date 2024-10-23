"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
  isOpen: boolean;
  toggleOpen: (index: number) => void;
}

const FAQItem = ({ question, answer, index, isOpen, toggleOpen }: FAQItemProps) => {
  return (
    <div className="mb-4">
      <button
        onClick={() => toggleOpen(index)}
        className="w-full text-left bg-gray-200 dark:bg-gray-700 text-lg font-medium py-3 px-4 rounded-lg flex justify-between items-center hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        <span>{question}</span>
        <ChevronDown
          className={`ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>
      {isOpen && (
        <div className="mt-2 text-gray-700 dark:text-gray-300 px-4">
          {answer}
        </div>
      )}
    </div>
  );
};

export default function Faqs() {
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I start chatting?",
      answer: "Click on the 'Start Chatting' button and follow the instructions to begin a conversation."
    },
    {
      question: "How can I explore nearby attractions?",
      answer: "You can explore nearby attractions by clicking the 'Explore Nearby' button and allowing location access."
    },
    {
      question: "Is this guide free to use?",
      answer: "Yes, this guide is free for all users."
    },
    {
      question: "Do I need an account to use the services?",
      answer: "You can explore the features without an account, but some personalized services will require you to log in."
    }
  ];

  const toggleOpenFAQ = (index: number) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold mb-6">FAQs:</h2>
      {faqs.map((faq, index) => (
        <FAQItem
          key={index}
          index={index}
          question={faq.question}
          answer={faq.answer}
          isOpen={openFAQIndex === index}
          toggleOpen={toggleOpenFAQ}
        />
      ))}
    </div>
  );
}