"use client";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function NavigationBar() {
    const { user, logout, login } = useAuth();
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
        <Link href="/" passHref>
          <motion.h1 
            className="text-3xl font-bold text-indigo-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            AImagine
          </motion.h1>
          </Link>
          <div className="space-x-4">
            {['Features', 'Pricing', 'About'].map((item) => (
              <Button key={item} variant="ghost" className="text-gray-600 hover:text-indigo-600">
                {item}
              </Button>
            ))}
            {user && (
              <Button 
                variant="default" 
                className="bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={() => {
                  logout();
                }}
              >
                Logout
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}