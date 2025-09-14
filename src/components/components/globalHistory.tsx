import React from 'react';
import { CheckCircle, User2 } from 'lucide-react';

const mockData = [
  { wallet: '@1...7xpJ', accounts: 2, refunded: '0.00498 SOL', tx: '5qhNr...638w', date: '7/4/2025, 2:46:27 PM' },
  { wallet: '9t...3840', accounts: 4, refunded: '0.04079 SOL', tx: 'S1aVX...UgfZ', date: '7/4/2025, 2:46:20 PM' },
  { wallet: '9t...3840', accounts: 20, refunded: '0.04079 SOL', tx: 'Y3fVvc...vKj7', date: '7/4/2025, 2:46:19 PM' },
  { wallet: '9t...3840', accounts: 20, refunded: '0.04079 SOL', tx: 'sZP1zd...uA6m', date: '7/4/2025, 2:46:18 PM' },
  { wallet: '9t...3840', accounts: 20, refunded: '0.04079 SOL', tx: '329q4v...5xzC', date: '7/4/2025, 2:46:17 PM' },
  { wallet: '9t...3840', accounts: 20, refunded: '0.04079 SOL', tx: '2oRj6...x6tS', date: '7/4/2025, 2:46:16 PM' },
  { wallet: '9t...3840', accounts: 20, refunded: '0.04079 SOL', tx: '3pCjk...5oF9', date: '7/4/2025, 2:46:15 PM' },
  { wallet: '9t...3840', accounts: 20, refunded: '0.04079 SOL', tx: '5RlmEW...phR4', date: '7/4/2025, 2:46:14 PM' },
  { wallet: '9t...3840', accounts: 20, refunded: '0.04079 SOL', tx: 'swap22...s34R', date: '7/4/2025, 2:45:55 PM' },
  { wallet: '9t...3840', accounts: 20, refunded: '0.04079 SOL', tx: '3QbJwn...mYd4', date: '7/4/2025, 2:45:54 PM' },
  { wallet: '9t...3840', accounts: 20, refunded: '0.04079 SOL', tx: '5oUP7L...3ThT', date: '7/4/2025, 2:45:53 PM' },
  { wallet: '9t...3840', accounts: 20, refunded: '0.04079 SOL', tx: 'Xz4DyO...gjCW', date: '7/4/2025, 2:45:52 PM' },
  { wallet: '9t...3840', accounts: 20, refunded: '0.04079 SOL', tx: '5E9JZ...YhuU', date: '7/4/2025, 2:45:51 PM' },
  { wallet: '4P...4Py', accounts: 1, refunded: '0.00204 SOL', tx: '2u7R3V...D3ik', date: '7/4/2025, 2:44:21 PM' },
  { wallet: 'Et...hbcF', accounts: 1, refunded: '0.00102 SOL', tx: '3fVzEJ...4BWG', date: '7/4/2025, 2:44:20 PM' },
  { wallet: 'Gu...R4qP', accounts: 1, refunded: '0.00498 SOL', tx: '4GoHhm...DRqS', date: '7/4/2025, 2:44:19 PM' },
  { wallet: '7b...vgkD', accounts: 1, refunded: '0.019835 SOL', tx: '4uJ8je...8rvY', date: '7/4/2025, 2:39:14 PM' },
];

const GlobalHistory = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12 bg-[#181c2b] rounded-2xl shadow-lg border border-[#23263a] p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Global Transaction History</h2>
        <div className="text-white/70 text-sm">Recent SOL refunds from users around the world</div>
      </div>
      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full text-left text-white/90">
          <thead>
            <tr className="bg-[#23263a] text-white/80 text-sm">
              <th className="py-3 px-4 font-semibold">WALLET</th>
              <th className="py-3 px-4 font-semibold">ACCOUNTS</th>
              <th className="py-3 px-4 font-semibold">REFUNDED SOL</th>
              <th className="py-3 px-4 font-semibold">TX SIGNATURE</th>
              <th className="py-3 px-4 font-semibold">DATE</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((row, i) => (
              <tr key={i} className="border-b border-[#23263a] hover:bg-[#23263a]/60 transition">
                <td className="py-3 px-4 flex items-center gap-2">
                  <User2 className="w-5 h-5 text-[#8096D2]" />
                  <span className="font-mono">{row.wallet}</span>
                </td>
                <td className="py-3 px-4 text-center">{row.accounts}</td>
                <td className="py-3 px-4 text-[#4fd1c5] font-semibold">{row.refunded}</td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <span className="font-mono">{row.tx}</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </td>
                <td className="py-3 px-4 text-white/70">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-6">
        <button className="bg-gradient-to-r from-[#6366f1] to-[#06b6d4] hover:from-[#8096D2] hover:to-[#4fd1c5] text-white font-semibold text-lg py-2 px-8 rounded-xl shadow-lg transition-all">
          Load More
        </button>
      </div>
      <div className="text-xs text-white/40 text-center mt-4">
        To ensure our tool stays active a small donation is included for the expenses of servers, RPC & development.
      </div>
    </div>
  );
};

export default GlobalHistory;