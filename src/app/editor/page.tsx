"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import ImageEditor from "@/components/ImageEditor";
import { useAuth } from '@/hooks/useAuth';

export default function EditorPage() {
  const [editHistory, setEditHistory] = useState<string[]>([]);
  const { user, loading } = useAuth();
  const router = useRouter();

  console.log(user, loading)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/authpage');
    }
  }, [user, loading, router]);

  const createEdit = (prompt: string) => {
    setEditHistory((prevHistory) => [...prevHistory, prompt]);
  };

  if (loading) {
    return <div>Loading...</div>; // or a loading spinner
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ImageEditor createEdit={createEdit} />
      {editHistory.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Edit History</h2>
          <ul className="list-disc pl-6">
            {editHistory.map((prompt, index) => (
              <li key={index} className="mb-2">
                {prompt}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}