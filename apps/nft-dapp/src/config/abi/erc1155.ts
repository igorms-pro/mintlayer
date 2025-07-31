/**
 * ERC1155 Contract ABI
 * Real ABI from verified contract on Base Sepolia
 */

export const ERC1155_ABI = [
  // Claim functions
  {
    "inputs": [
      {"name": "_tokenId", "type": "uint256"},
      {"name": "_quantity", "type": "uint256"},
      {"name": "_currency", "type": "address"},
      {"name": "_pricePerToken", "type": "uint256"},
      {"name": "_proof", "type": "bytes32[]"},
      {"name": "_proofMaxQuantityPerTransaction", "type": "uint256"}
    ],
    "name": "claim",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {"name": "proof", "type": "bytes32[]"},
          {"name": "maxQuantityInAllowlist", "type": "uint256"}
        ],
        "name": "Proof",
        "type": "tuple"
      }
    ],
    "name": "verifyClaim",
    "outputs": [{"name": "isOverride", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "_tokenId", "type": "uint256"},
      {"name": "_conditionId", "type": "uint256"}
    ],
    "name": "getClaimConditionById",
    "outputs": [
      {
        "components": [
          {"name": "startTimestamp", "type": "uint256"},
          {"name": "maxClaimableSupply", "type": "uint256"},
          {"name": "supplyClaimed", "type": "uint256"},
          {"name": "quantityLimitPerWallet", "type": "uint256"},
          {"name": "currency", "type": "address"},
          {"name": "pricePerToken", "type": "uint256"},
          {"name": "allowlistMerkleRoot", "type": "bytes32"}
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_tokenId", "type": "uint256"}],
    "name": "getActiveClaimConditionId",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  // Balance and ownership
  {
    "inputs": [
      {"name": "account", "type": "address"},
      {"name": "id", "type": "uint256"}
    ],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  // URI for metadata
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "uri",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const; 