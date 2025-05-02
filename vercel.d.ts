declare module '@vercel/node' {
  import { IncomingMessage, ServerResponse } from 'http';
  
  export interface VercelRequest extends IncomingMessage {
    query: {
      [key: string]: string | string[];
    };
    cookies: {
      [key: string]: string;
    };
    body: any;
  }
  
  export interface VercelResponse extends ServerResponse {
    status(code: number): VercelResponse;
    send(body: any): void;
    json(body: any): void;
  }
}
