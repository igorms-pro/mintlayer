import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout';
import { NFTGallery } from '@/components/nft';
import { NFTDetails } from '@/components/nft/NFTDetails';

function App() {
  return (
    <Router>
      <div data-testid="app-container" className="min-h-screen bg-white">
        <Header />
        <Routes>
          <Route path="/" element={<NFTGallery />} />
          <Route path="/nft/:tokenId" element={<NFTDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
