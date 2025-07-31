import { useNFTs, useNFT } from './hooks/useNFTs';

function App() {
  // Test for real data
  const { nfts, isLoading: nftsLoading, isError: nftsError, error } = useNFTs();
  const { nft: firstNFT, isLoading: nftLoading } = useNFT(nfts[0]?.id);

  console.log('useNFT[s]', { nfts, isLoading: nftsLoading, isError: nftsError, error });
  console.log('useNFT:', { firstNFT, isLoading: nftLoading });

  if (nfts.length > 0) {
    console.log('NFTs loaded:', nfts.length);
    console.log('First NFT:', nfts[0]);
  }

  if (firstNFT) {
    console.log('First NFT details:', firstNFT);
  }

  return (
    <div data-testid="app-container" className="min-h-screen bg-gray-50 flex items-center justify-center">
      <h1 data-testid="app-title" className="text-4xl font-bold text-gray-900">Mintlayer NFT dApp</h1>
    </div>
  );
}

export default App;
