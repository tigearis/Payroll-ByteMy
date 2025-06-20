// lib/auth/auth-mutex.ts
// Authentication mutex to prevent concurrent auth operations

export interface AuthOperation {
  id: string;
  type: 'user_extraction' | 'token_refresh' | 'session_validation' | 'permission_check';
  timestamp: number;
  promise?: Promise<any>;
}

export interface MutexState {
  isLocked: boolean;
  currentOperation: AuthOperation | null;
  queuedOperations: AuthOperation[];
  lastOperationTime: number;
}

class AuthMutex {
  private static instance: AuthMutex;
  private state: MutexState = {
    isLocked: false,
    currentOperation: null,
    queuedOperations: [],
    lastOperationTime: 0,
  };
  private lockTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private stateListeners: Set<(state: MutexState) => void> = new Set();

  private constructor() {}

  public static getInstance(): AuthMutex {
    if (!AuthMutex.instance) {
      AuthMutex.instance = new AuthMutex();
    }
    return AuthMutex.instance;
  }

  // Subscribe to mutex state changes
  public subscribe(listener: (state: MutexState) => void): () => void {
    this.stateListeners.add(listener);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  // Get current mutex state (readonly)
  public getState(): Readonly<MutexState> {
    return {
      ...this.state,
      currentOperation: this.state.currentOperation ? { ...this.state.currentOperation } : null,
      queuedOperations: [...this.state.queuedOperations],
    };
  }

  // Acquire mutex lock for an operation
  public async acquire<T>(
    operationId: string,
    operationType: AuthOperation['type'],
    operation: () => Promise<T>,
    timeout: number = 30000
  ): Promise<T> {
    console.log(`🔒 Auth mutex acquire requested: ${operationId} (${operationType})`);

    return new Promise<T>((resolve, reject) => {
      const authOp: AuthOperation = {
        id: operationId,
        type: operationType,
        timestamp: Date.now(),
      };

      // If not locked, acquire immediately
      if (!this.state.isLocked) {
        this.executeOperation(authOp, operation, resolve, reject, timeout);
        return;
      }

      // If locked, queue the operation
      console.log(`⏳ Auth mutex busy, queueing operation: ${operationId}`);
      authOp.promise = new Promise<T>((opResolve, opReject) => {
        // Set up timeout for queued operation
        const timeoutId = setTimeout(() => {
          this.removeFromQueue(operationId);
          opReject(new Error(`Auth operation ${operationId} timed out after ${timeout}ms`));
        }, timeout);

        this.lockTimeouts.set(operationId, timeoutId);

        // Store resolve/reject in operation for later use
        (authOp as any).resolve = opResolve;
        (authOp as any).reject = opReject;
        (authOp as any).operation = operation;
      });

      this.state.queuedOperations.push(authOp);
      this.notifyStateChange();

      // Return the promise that will be resolved when operation runs
      authOp.promise.then(resolve).catch(reject);
    });
  }

  // Execute an operation with the mutex lock
  private async executeOperation<T>(
    authOp: AuthOperation,
    operation: () => Promise<T>,
    resolve: (value: T) => void,
    reject: (error: Error) => void,
    timeout: number
  ): Promise<void> {
    // Acquire lock
    this.state.isLocked = true;
    this.state.currentOperation = authOp;
    this.state.lastOperationTime = Date.now();
    this.notifyStateChange();

    console.log(`🔓 Auth mutex acquired: ${authOp.id} (${authOp.type})`);

    // Set up timeout
    const timeoutId = setTimeout(() => {
      console.error(`⏰ Auth operation timeout: ${authOp.id}`);
      this.release(authOp.id);
      reject(new Error(`Auth operation ${authOp.id} timed out after ${timeout}ms`));
    }, timeout);

    this.lockTimeouts.set(authOp.id, timeoutId);

    try {
      const result = await operation();
      
      // Clear timeout
      const timeoutRef = this.lockTimeouts.get(authOp.id);
      if (timeoutRef) {
        clearTimeout(timeoutRef);
        this.lockTimeouts.delete(authOp.id);
      }

      console.log(`✅ Auth operation completed: ${authOp.id}`);
      resolve(result);
    } catch (error) {
      console.error(`❌ Auth operation failed: ${authOp.id}`, error);
      
      // Clear timeout
      const timeoutRef = this.lockTimeouts.get(authOp.id);
      if (timeoutRef) {
        clearTimeout(timeoutRef);
        this.lockTimeouts.delete(authOp.id);
      }

      reject(error instanceof Error ? error : new Error(String(error)));
    } finally {
      this.release(authOp.id);
    }
  }

  // Release mutex lock
  public release(operationId: string): void {
    if (this.state.currentOperation?.id !== operationId) {
      console.warn(`⚠️ Auth mutex release ignored - not current operation: ${operationId}`);
      return;
    }

    console.log(`🔓 Auth mutex released: ${operationId}`);

    // Clear current operation
    this.state.isLocked = false;
    this.state.currentOperation = null;

    // Clean up timeout
    const timeoutRef = this.lockTimeouts.get(operationId);
    if (timeoutRef) {
      clearTimeout(timeoutRef);
      this.lockTimeouts.delete(operationId);
    }

    // Process next operation in queue
    this.processQueue();
    this.notifyStateChange();
  }

  // Process the next operation in the queue
  private processQueue(): void {
    if (this.state.queuedOperations.length === 0) {
      return;
    }

    const nextOp = this.state.queuedOperations.shift()!;
    console.log(`🔄 Processing queued auth operation: ${nextOp.id}`);

    // Get stored operation details
    const resolve = (nextOp as any).resolve;
    const reject = (nextOp as any).reject;
    const operation = (nextOp as any).operation;

    if (resolve && reject && operation) {
      this.executeOperation(nextOp, operation, resolve, reject, 30000);
    } else {
      console.error(`❌ Invalid queued operation: ${nextOp.id}`);
      this.processQueue(); // Try next operation
    }
  }

  // Remove operation from queue
  private removeFromQueue(operationId: string): void {
    const index = this.state.queuedOperations.findIndex(op => op.id === operationId);
    if (index !== -1) {
      this.state.queuedOperations.splice(index, 1);
      console.log(`🗑️ Removed queued auth operation: ${operationId}`);
      this.notifyStateChange();
    }
  }

  // Check if operation type is already running or queued
  public hasOperationType(operationType: AuthOperation['type']): boolean {
    if (this.state.currentOperation?.type === operationType) {
      return true;
    }
    return this.state.queuedOperations.some(op => op.type === operationType);
  }

  // Force release all locks (emergency cleanup)
  public forceReleaseAll(): void {
    console.warn('🚨 Force releasing all auth mutex locks');

    // Clear all timeouts
    this.lockTimeouts.forEach((timeout, id) => {
      clearTimeout(timeout);
      console.log(`🧹 Cleared timeout for operation: ${id}`);
    });
    this.lockTimeouts.clear();

    // Reject all queued operations
    this.state.queuedOperations.forEach(op => {
      const reject = (op as any).reject;
      if (reject) {
        reject(new Error(`Auth operation ${op.id} cancelled due to force release`));
      }
    });

    // Reset state
    this.state = {
      isLocked: false,
      currentOperation: null,
      queuedOperations: [],
      lastOperationTime: Date.now(),
    };

    this.notifyStateChange();
  }

  // Notify all state listeners
  private notifyStateChange(): void {
    const state = this.getState();
    this.stateListeners.forEach(listener => {
      try {
        listener(state);
      } catch (error) {
        console.error('❌ Auth mutex state listener error:', error);
      }
    });
  }

  // Get mutex statistics for debugging
  public getStats(): {
    isLocked: boolean;
    currentOperationType: string | null;
    queueLength: number;
    activeTimeouts: number;
    lastOperationTime: number;
    timeSinceLastOperation: number;
  } {
    const now = Date.now();
    return {
      isLocked: this.state.isLocked,
      currentOperationType: this.state.currentOperation?.type || null,
      queueLength: this.state.queuedOperations.length,
      activeTimeouts: this.lockTimeouts.size,
      lastOperationTime: this.state.lastOperationTime,
      timeSinceLastOperation: now - this.state.lastOperationTime,
    };
  }
}

// Export singleton instance
export const authMutex = AuthMutex.getInstance();

// Export hook for React components
export function useAuthMutex() {
  const [mutexState, setMutexState] = useState<MutexState>(authMutex.getState());

  useEffect(() => {
    const unsubscribe = authMutex.subscribe(setMutexState);
    return unsubscribe;
  }, []);

  return {
    mutexState,
    acquire: authMutex.acquire.bind(authMutex),
    hasOperationType: authMutex.hasOperationType.bind(authMutex),
    getStats: authMutex.getStats.bind(authMutex),
  };
}

// Export types
export type { MutexState, AuthOperation };