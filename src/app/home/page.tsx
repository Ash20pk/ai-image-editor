"use client";
import React, { useState, useEffect } from 'react';
import { Wand2, MessageSquare, Sparkles, Share2, ChevronRight, Upload, Edit3, Cpu, Sliders, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Link from "next/link";

const FeatureCard = ({ icon: Icon, title, description, isActive, onClick }) => (
  <motion.div 
    className={`cursor-pointer p-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1 ${isActive ? 'bg-indigo-600 text-white' : 'bg-white shadow-md'}`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    <Icon className={`mx-auto mb-4 ${isActive ? 'text-white' : 'text-indigo-600'}`} size={48} />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className={isActive ? 'text-indigo-100' : 'text-gray-600'}>{description}</p>
  </motion.div>
);

const ImageTransformDemo = () => {
  const [currentImage, setCurrentImage] = useState('original');
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const images = {
    original: "https://images.unsplash.com/photo-1500622944204-b135684e99fd",
    transformed: "https://images.unsplash.com/photo-1682685796014-2f342188a635"
  };
  const placeholders = [
    "Make the sky more dramatic with sunset colors",
    "Remove the background and replace it with a beach scene",
    "Add a soft, dreamy glow to the entire image",
    "Change the subject's hair color to vibrant blue"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTransform = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setCurrentImage('transformed');
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">Try It Out</h3>
      <div className="relative w-full h-96 mb-6 overflow-hidden rounded-lg shadow-md">
        <img 
          src={images[currentImage]} 
          alt="Landscape" 
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        {isProcessing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </div>
      <div className="flex space-x-4 mb-4">
        <input 
          type="text" 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)} 
          placeholder={placeholders[placeholderIndex]}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 placeholder-gray-400"
        />
        <Button 
          onClick={handleTransform}
          disabled={isProcessing || !prompt}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
        >
          Transform
        </Button>
      </div>
      <Button 
        onClick={() => {
          setCurrentImage('original');
          setPrompt('');
        }}
        className="w-full bg-gray-100 text-indigo-600 hover:bg-gray-200"
      >
        Reset
      </Button>
    </div>
  );
};

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { icon: Upload, title: "Upload Image", description: "Select and upload your image to edit" },
    { icon: Edit3, title: "Describe Edits", description: "Use natural language to describe your desired changes" },
    { icon: Cpu, title: "AI Processing", description: "Our AI analyzes your request and applies the edits" },
    { icon: Sliders, title: "Fine-tune Results", description: "Adjust and perfect the AI-generated edits" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">How It Works</h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div 
            key={index}
            className={`flex items-center p-4 rounded-lg ${index === activeStep ? 'bg-indigo-100' : 'bg-gray-50'} transition-colors duration-300`}
            animate={{ scale: index === activeStep ? 1.05 : 1 }}
          >
            <step.icon className={`mr-4 ${index === activeStep ? 'text-indigo-600' : 'text-gray-400'}`} size={32} />
            <div>
              <h4 className="font-semibold text-gray-800">{step.title}</h4>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const PricingCard = ({ title, price, features, isPopular }) => (
  <div className={`bg-white p-8 rounded-lg shadow-lg flex flex-col ${isPopular ? 'border-2 border-indigo-400' : ''}`}>
    <h3 className="text-2xl font-semibold mb-2 text-gray-800">{title}</h3>
    <div className="text-4xl font-bold mb-6 text-indigo-600">${price}<span className="text-xl font-normal text-gray-600">/mo</span></div>
    <ul className="flex-grow space-y-4 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-gray-700">
          <Check className="mr-2 text-green-500" size={20} />
          {feature}
        </li>
      ))}
    </ul>
    <Button className={`w-full ${isPopular ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-100 text-indigo-600 hover:bg-gray-200'}`}>
      Choose Plan
    </Button>
  </div>
);

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    { icon: Wand2, title: 'AI-Powered Edits', description: 'Effortlessly transform images with text prompts' },
    { icon: MessageSquare, title: 'Natural Language', description: 'Edit using everyday language, not complex tools' },
    { icon: Sparkles, title: 'Magical Results', description: 'Achieve professional-quality edits in seconds' },
    { icon: Share2, title: 'Easy Sharing', description: 'Export and share your creations instantly' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="container mx-auto px-4 py-16">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-5xl font-bold mb-4 text-gray-800">Transform Images with AI Magic</h2>
          <p className="text-xl text-gray-600 mb-8">Unleash your creativity with simple text prompts and cutting-edge AI technology.</p>
          <Link href="/authpage" passHref>
            <Button 
              size="lg" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Your AI Journey <ChevronRight className="ml-2" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <ImageTransformDemo />
          <HowItWorks />
        </div>

        <h3 className="text-3xl font-semibold mb-8 text-center text-gray-800">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              {...feature} 
              isActive={index === activeFeature}
              onClick={() => setActiveFeature(index)}
            />
          ))}
        </div>

        <h3 className="text-3xl font-semibold mb-8 text-center text-gray-800">Pricing Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <PricingCard 
            title="Basic" 
            price={9.99} 
            features={["100 AI edits/month", "Basic filters", "24/7 support"]} 
            isPopular={false}
          />
          <PricingCard 
            title="Pro" 
            price={19.99} 
            features={["Unlimited AI edits", "Advanced filters", "Priority support", "Custom export formats"]} 
            isPopular={true}
          />
          <PricingCard 
            title="Enterprise" 
            price={49.99} 
            features={["Unlimited AI edits", "Custom AI model training", "Dedicated account manager", "API access"]} 
            isPopular={false}
          />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p className="text-gray-600">&copy; 2024 AImagine. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">Terms of Service</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;