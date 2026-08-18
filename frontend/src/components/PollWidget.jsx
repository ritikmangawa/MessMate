import { useState, useEffect } from 'react';
import axios from 'axios';

const PollWidget = () => {
  const [pollData, setPollData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/polls', { withCredentials: true });
        setPollData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, []);

  const handleVote = async (optionId) => {
    try {
      const res = await axios.post('http://localhost:5000/api/polls/vote', {
        pollId: pollData.poll._id,
        optionId
      }, { withCredentials: true });
      
      setPollData({ poll: res.data.poll, hasVoted: true });
    } catch (err) {
      alert(err.response?.data?.message || 'Error voting');
    }
  };

  if (loading) return null;
  if (!pollData || !pollData.poll) return null;

  const { poll, hasVoted } = pollData;
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-sm p-6 text-white h-full flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-purple-200 mb-2">Active Poll</h3>
        <p className="text-xl font-bold mb-6">{poll.question}</p>
      </div>

      <div className="space-y-3">
        {poll.options.map(opt => {
          const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          return (
            <div key={opt._id} className="relative">
              {hasVoted ? (
                <div className="bg-purple-800/50 rounded-xl overflow-hidden relative border border-purple-500/30">
                  <div className="bg-purple-500 h-full absolute top-0 left-0 transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                  <div className="relative p-3 flex justify-between items-center text-sm font-bold z-10">
                    <span>{opt.text}</span>
                    <span>{percentage}%</span>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => handleVote(opt._id)}
                  className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-medium transition text-sm"
                >
                  {opt.text}
                </button>
              )}
            </div>
          );
        })}
      </div>
      {hasVoted && <p className="text-xs text-purple-200 text-center mt-4">{totalVotes} students voted</p>}
    </div>
  );
};

export default PollWidget;
