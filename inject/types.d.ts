export {};

declare global {
  interface Window {
    kasware?: KaswareProvider;
    kastle?: KastleProvider;
    KaspaWallets?: KaspaWalletsApi;
  }
}

export interface KaswareProvider {
  requestAccounts(): Promise<string[]>;
  getAccounts(): Promise<string[]>;
  getNetwork(): Promise<string>;
  switchNetwork?(network: string): Promise<void>;
  disconnect?(origin?: string): Promise<void>;
  getPublicKey?(): Promise<string>;
  getBalance(): Promise<number | { total?: number; confirmed?: number; balance?: number }>;
  getKRC20Balance?(): Promise<unknown[]>;
  sendKaspa(to: string, sompi: number, options?: { priorityFee?: number; payload?: string }): Promise<string>;
  signMessage?(message: string, type?: string): Promise<string>;
  on?(event: string, handler: (...args: unknown[]) => void): void;
  removeListener?(event: string, handler: (...args: unknown[]) => void): void;
}

export interface KastleProvider {
  connect(networkId?: string): Promise<boolean>;
  getAccount(): Promise<string | { address: string }>;
  disconnect?(): Promise<void>;
  getNetwork?(): Promise<string>;
  getBalance?(): Promise<number | { total?: number; confirmed?: number; balance?: number }>;
  sendKaspa(to: string, sompi: number, options?: { priorityFee?: number }): Promise<string>;
  signMessage?(message: string, type?: string): Promise<string>;
}

export interface KaspaWalletsApi {
  connect(id: "kasware" | "kastle"): Promise<{ id: string; address: string }>;
  logout(): Promise<void>;
  current(): { id: string; address: string };
  detected(): string[];
  sendKaspa(to: string, sompi: number, opts?: { priorityFee?: number; payload?: string }): Promise<string>;
}
