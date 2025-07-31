import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock fetch globally
global.fetch = vi.fn()

// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useAccount: () => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true,
  }),
  useBalance: () => ({
    data: { value: BigInt(1000000000000000000) }, // 1 ETH
  }),
  useConnect: () => ({
    connect: vi.fn(),
    connectors: [{ ready: true }],
  }),
  useDisconnect: () => ({
    disconnect: vi.fn(),
  }),
  createConfig: vi.fn(),
  http: vi.fn(),
  injected: vi.fn(),
  walletConnect: vi.fn(),
}))

// Mock viem
vi.mock('viem', () => ({
  parseEther: vi.fn((value: string) => BigInt(value)),
  formatEther: vi.fn((value: bigint) => value.toString()),
}))

// Mock TanStack Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({
    data: undefined,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
    isRefetching: false,
  })),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
    setQueryData: vi.fn(),
    getQueryData: vi.fn(),
    refetchQueries: vi.fn(),
  })),
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
})) 