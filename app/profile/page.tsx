"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface QuizHistoryEntry {
  id: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  score: number;
  total_questions: number;
  time_taken: number | null;
  created_at: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<{
    full_name?: string;
    avatar_url?: string;
    email: string;
  } | null>(null);
  const [history, setHistory] = useState<QuizHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          window.location.href = "/auth";
          return;
        }

        const { data: prof } = await supabase
          .from("profiles")
          .select("full_name, avatar_url, email")
          .eq("id", user.id)
          .single();
        setProfile(prof as any);

        const { data: quizzes } = await supabase
          .from("quizzes")
          .select(
            "id, topic, difficulty, score, total_questions, time_taken, created_at"
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        setHistory(quizzes as QuizHistoryEntry[]);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="card mb-8 flex items-center space-x-6">
          {profile?.avatar_url && (
            <Image
              src={profile?.avatar_url || ""}
              alt="Avatar"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {profile?.full_name || profile?.email}
            </h1>
            <p className="text-gray-600">{profile?.email}</p>
          </div>
        </div>

        {/* Quiz History */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quiz History
        </h2>
        {history.length === 0 ? (
          <p className="text-gray-600">You haven’t taken any quizzes yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Topic
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Difficulty
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Score
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((q) => (
                  <tr key={q.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {new Date(q.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {q.topic}
                    </td>
                    <td className="px-4 py-2 text-sm capitalize">
                      {q.difficulty}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {q.score}/{q.total_questions}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {q.time_taken !== null
                        ? `${Math.floor(q.time_taken / 60)}:${String(
                            q.time_taken % 60
                          ).padStart(2, "0")}m`
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
