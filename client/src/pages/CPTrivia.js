import React, { useState, useEffect } from "react";
import { FaClock, FaTrophy } from "react-icons/fa";
import { motion } from "framer-motion";

const CPTrivia = () => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(2);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [leaderboard, setLeaderboard] = useState([]);

  const [topic, setTopic] = useState("Data Structures");
  const [difficulty, setDifficulty] = useState("Medium");
  const [numQuestions, setNumQuestions] = useState(5);

  const topics = [
    "React Js", "Node Js",
    "OOPS", "Operating System", "Computer Networks","Linux","Git",
    "DBMS", "System Design", "Data Structures", "Algorithms"
  ];

  const difficulties = ["Easy", "Medium", "Hard"];

  // Fetch trivia questions
  const fetchTriviaData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/generateTrivia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, numQuestions }),
      });

      const data = await response.json();
      console.log("Received Data:", data);

      if (data.quizzes) {
        setQuizData(data.quizzes);
        setCurrentQuestion(0);
        setScore(0);
        setAttemptsLeft(2);
        setQuizFinished(false);
        setSelectedAnswer(null);
        setTimer(60);
      } else {
        setQuizData([]);
      }
    } catch (error) {
      console.error("Error fetching trivia:", error);
    }
    setLoading(false);
  };

  // Handle answer selection
  const handleAnswerClick = (option) => {
    if (selectedAnswer || attemptsLeft === 0) return;
  
    if (option === quizData[currentQuestion].answer) {
      // Correct Answer: Award points based on attempts
      setScore((prevScore) => prevScore + (attemptsLeft === 2 ? 10 : 5));
      setSelectedAnswer(option);
      setTimeout(() => nextQuestion(), 1000);
    } else {
      // Wrong Answer: Reduce attempts
      setAttemptsLeft((prev) => prev - 1);
      setSelectedAnswer(option);
  
      if (attemptsLeft === 2) {
        // First Wrong Attempt: Reset selection after a delay
        setTimeout(() => setSelectedAnswer(null), 1000);
      } else {
        // Second Wrong Attempt: Move to next question
        setTimeout(() => nextQuestion(), 1000);
      }
    }
  };
  

  // Move to next question or finish quiz
  const nextQuestion = () => {
    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion((prev) => prev + 1);
      setAttemptsLeft(2);
      setSelectedAnswer(null);
      setTimer(60);
    } else {
      setQuizFinished(true);
      updateLeaderboard();
    }
  };

  // Timer logic
  useEffect(() => {
    if (quizFinished) return;
    if (timer === 0) {
      nextQuestion();
      return;
    }

    const interval = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(interval);
  }, [timer, quizFinished]);

  // Update leaderboard
  const updateLeaderboard = () => {
    setLeaderboard((prev) => [
      ...prev,
      { topic, difficulty, score, timestamp: new Date().toISOString() }
    ]);
  };

  const saveLeaderboard = async () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username"); // Ensure username is stored
    
    if (!token || !username) {
      console.warn("User not authenticated or missing username.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/leaderboard/saveLeaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ username, topic, difficulty, score }),
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      console.log("Leaderboard entry saved successfully.");
      fetchLeaderboard(); // Refresh leaderboard after saving
    } catch (error) {
      console.error("Error saving leaderboard:", error);
    }
  };
  
  const fetchLeaderboard = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.warn("No authentication token found.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/leaderboard/getLeaderboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      console.log("Raw leaderboard data:", data); // Log the response
  
      // Ensure leaderboard is an array
      if (!Array.isArray(data.leaderboard)) {
        throw new Error("Invalid leaderboard data format");
      }
  
      setLeaderboard(data.leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setLeaderboard([]); // Ensure leaderboard remains an array
    }
  };
  
  useEffect(() => {
    fetchLeaderboard();
  }, []); // Run only once when component loads
  
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4 animate-fade-in">
      💡CP Trivia & Quizzes💡
      </h1>

      {/* Topic & Difficulty Selection */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select className="px-4 py-2 bg-gray-700 rounded-md" value={topic} onChange={(e) => setTopic(e.target.value)}>
          {topics.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <select className="px-4 py-2 bg-gray-700 rounded-md" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        <input type="number" min="1" max="10" value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)}
          className="px-4 py-2 bg-gray-700 rounded-md text-center w-20" />
      </div>

      {/* Generate Quiz Button */}
      <button onClick={fetchTriviaData} disabled={loading}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-semibold rounded-lg transition-transform transform hover:scale-105 active:scale-95 mb-6">
        {loading ? "Generating Quiz..." : "Generate Quiz"}
      </button>

      {/* Quiz Container */}
      {!quizFinished && quizData.length > 0 && (
        <div className="w-full max-w-lg p-6 bg-gray-800 rounded-lg shadow-md animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">
            Question {currentQuestion + 1}:
          </h2>
          <p className="text-lg">{quizData[currentQuestion].question}</p>

          <ul className="mt-4 space-y-3">
            {quizData[currentQuestion].options.map((option, idx) => (
              <motion.li
                key={idx}
                onClick={() => handleAnswerClick(option)}
                className={`p-3 rounded-lg cursor-pointer transition duration-300 ${
                  selectedAnswer === option 
                    ? option === quizData[currentQuestion].answer
                      ? "bg-green-500"
                      : "bg-red-500"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {option}
              </motion.li>
            ))}
          </ul>

          <div className="flex justify-between mt-4">
            <p className="text-sm text-gray-300">Attempts Left: {attemptsLeft}</p>
            <p className="text-sm text-red-400 flex items-center">
              <FaClock className="mr-1" /> Time Left: {timer}s
            </p>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="w-full max-w-lg mt-6">
        <h3 className="text-xl font-bold mb-2 flex items-center">
          <FaTrophy className="mr-2 text-yellow-400" /> Leaderboard
        </h3>
        <table className="w-full bg-gray-800 text-white rounded-lg">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-2">#</th>
              <th className="p-2">Topic</th>
              <th className="p-2">Difficulty</th>
              <th className="p-2">Score</th>
            </tr>
          </thead>
          <tbody>
  {Array.isArray(leaderboard) && leaderboard.length > 0 ? (
    leaderboard.sort((a, b) => b.score - a.score).map((entry, idx) => (
      <tr key={idx} className="text-center border-b border-gray-600">
        <td className="p-2">{idx + 1}</td>
        <td className="p-2">{entry.topic}</td>
        <td className="p-2">{entry.difficulty}</td>
        <td className="p-2">{entry.score}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4" className="p-4 text-center text-gray-400">
        No leaderboard data available.
      </td>
    </tr>
  )}
</tbody>
        </table>
      </div>
    </div>
  );
};

export default CPTrivia;
