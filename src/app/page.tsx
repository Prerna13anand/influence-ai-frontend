// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";

// Define types for our data
type Post = {
  id: number;
  post_text: string;
  created_at: string;
};

type LinkedInProfile = {
  name: string;
  picture: string;
};

export default function HomePage() {
  // Form and post states
  const [role, setRole] = useState("");
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  // Auth and user states
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<LinkedInProfile | null>(null);
  
  // NEW: State to handle sharing status
  const [isSharing, setIsSharing] = useState<number | null>(null); // Store the ID of the post being shared
  const [shareStatus, setShareStatus] = useState("");


  // This useEffect hook runs once when the page loads to check for a token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      setAccessToken(token);
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  // This useEffect runs when the accessToken is set, to fetch the user's profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (accessToken) {
        try {
          const response = await fetch("http://127.0.0.1:8000/users/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (!response.ok) throw new Error("Failed to fetch user profile");
          const data = await response.json();
          setUserProfile(data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchUserProfile();
    fetchPosts();
  }, [accessToken]);

  const fetchPosts = async () => {
    // ... (this function is unchanged)
    try {
        const response = await fetch("http://127.0.0.1:8000/posts");
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data.sort((a: Post, b: Post) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      } catch (error) {
        console.error(error);
      }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    // ... (this function is unchanged)
    event.preventDefault();
    setIsLoading(true);
    setResult("");
    try {
        const response = await fetch("http://127.0.0.1:8000/generate-post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role, topic, tone: "professional" }),
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setResult(data.post_text);
        fetchPosts();
      } catch (error) {
        console.error("Failed to fetch post:", error);
        setResult("Failed to generate post. Please check the backend server.");
      } finally {
        setIsLoading(false);
      }
  };

  // NEW: Function to handle sharing a post
  const handleShare = async (postText: string, postId: number) => {
    if (!accessToken) {
      alert("Please log in with LinkedIn first.");
      return;
    }
    setIsSharing(postId);
    setShareStatus("Sharing...");

    try {
      const response = await fetch("http://127.0.0.1:8000/posts/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ post_text: postText }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.details || "Failed to share post");
      }
      setShareStatus("Posted successfully!");
    } catch (error) {
      console.error(error);
      setShareStatus("Failed to share post.");
    } finally {
      setTimeout(() => {
        setIsSharing(null);
        setShareStatus("");
      }, 3000); // Reset status after 3 seconds
    }
  };


  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 text-white p-8 font-sans">
      <div className="w-full max-w-2xl">
        {userProfile ? (
          <div className="text-center mb-6 p-4 bg-gray-800 rounded-lg flex items-center justify-center space-x-4">
            <img src={userProfile.picture} alt="Profile" className="w-16 h-16 rounded-full" />
            <p className="text-xl">Welcome, {userProfile.name}!</p>
          </div>
        ) : (
          <div className="text-center mb-6">
            <a
              href="http://127.0.0.1:8000/auth/linkedin"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-300"
            >
              Login with LinkedIn to Get Started
            </a>
          </div>
        )}

        <h1 className="text-4xl font-bold text-center mb-8">
          Influence AI Content Generator
        </h1>

        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
          {/* Form inputs are unchanged */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">Your Professional Role</label>
            <input type="text" id="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g., Software Engineer" className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
          </div>
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-2">Topic to Write About</label>
            <input type="text" id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., The future of AI" className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-gray-500" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Post"}
          </button>
        </form>

        {result && (
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg mt-8">
            <h2 className="text-2xl font-bold mb-4">Generated Post:</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{result}</p>
          </div>
        )}

        <div className="mt-12 w-full">
          <h2 className="text-3xl font-bold text-center mb-6">Post History</h2>
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <p className="text-gray-300 whitespace-pre-wrap">{post.post_text}</p>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-xs text-gray-500">
                        Created at: {new Date(post.created_at).toLocaleString()}
                    </p>
                    {/* NEW: Share button and status message */}
                    {accessToken && (
                        <div className="flex items-center space-x-4">
                            {shareStatus && isSharing === post.id && <p className="text-sm text-green-400">{shareStatus}</p>}
                            <button 
                                onClick={() => handleShare(post.post_text, post.id)}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-500"
                                disabled={isSharing !== null}
                            >
                                {isSharing === post.id ? "Sharing..." : "Share on LinkedIn"}
                            </button>
                        </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}