import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header, Footer } from '@/components/layout';
import { NFTGallery } from '@/components/nft';
import { NFTDetails } from '@/components/nft/NFTDetails';

function App() {
  return (
    <Router>
      <div data-testid="app-container" className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<NFTGallery />} />
            <Route path="/nft/:tokenId" element={<NFTDetails />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
