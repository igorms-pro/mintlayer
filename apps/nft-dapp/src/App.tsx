import { Header } from '@/components/layout';
import { NFTGallery } from '@/components/nft';

function App() {


  return (
    <div data-testid="app-container" className="min-h-screen bg-gray-50">
      <Header />
      <NFTGallery />
    </div>
  );
}

export default App;
