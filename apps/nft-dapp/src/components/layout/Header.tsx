import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/Button';

export const Header  = () => {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="px-4 sm:px-8 py-4">
        <div className="flex h-8 items-center justify-between">
          <div className="flex items-center">
            <img
              src="/kiln-logo.svg"
              alt="Kiln"
              className="h-6 w-[69px] sm:h-8 sm:w-[92.3px]"
              width={92.3}
              height={32}
            />
          </div>

          <div className="flex items-center">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === 'authenticated');

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <Button
                            onClick={openConnectModal}
                            variant="primary"
                            size="md"
                            className="min-w-[140px]"
                          >
                            Connect Wallet
                          </Button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <Button
                            onClick={openChainModal}
                            variant="outline"
                            size="md"
                            className="min-w-[140px]"
                          >
                            Wrong network
                          </Button>
                        );
                      }

                      return (
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Button
                            onClick={openChainModal}
                            variant="secondary"
                            size="sm"
                            className="hidden sm:flex! items-center gap-2"
                          >
                            {chain.hasIcon && (
                              <div
                                className="h-4 w-4 rounded-full overflow-hidden"
                                style={{
                                  background: chain.iconBackground,
                                }}
                              >
                                {chain.iconUrl && (
                                  <img
                                    alt={chain.name ?? 'Chain icon'}
                                    src={chain.iconUrl}
                                    className="h-4 w-4"
                                  />
                                )}
                              </div>
                            )}
                            <span className="hidden md:inline">
                              {chain.name}
                            </span>
                          </Button>

                          {/* Account Button */}
                          <Button
                            onClick={openAccountModal}
                            variant="primary"
                            size="md"
                            className="min-w-[120px] sm:min-w-[140px]"
                          >
                            <span className="truncate text-sm sm:text-base">
                              {account.displayName}
                              {account.displayBalance
                                ? ` (${account.displayBalance})`
                                : ''}
                            </span>
                          </Button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
    </header>
  );
}; 