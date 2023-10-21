declare global {
  // eslint-reason var를 안쓰고 let, const를 쓰면 globalThis의 필드로써 추론되지 않습니다.
  // eslint-disable-next-line no-var
  var __ENV__: Window['__ENV__'];

  interface Window {
    __ENV__: Record<string, string>;
  }
}

export {};
