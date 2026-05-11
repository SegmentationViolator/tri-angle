export interface LenisScrollPayload {
  readonly scroll: number;
  readonly velocity: number;
  readonly direction: 1 | -1 | 0;
  readonly progress: number;
}

type Listener<T> = (payload: T) => void;

class Emitter<T> {
  private listeners = new Set<Listener<T>>();

  on(fn: Listener<T>): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  emit(payload: T): void {
    this.listeners.forEach((fn) => fn(payload));
  }

  clear(): void {
    this.listeners.clear();
  }
}

export const scrollEmitter = new Emitter<LenisScrollPayload>();
export const tickEmitter = new Emitter<number>();
