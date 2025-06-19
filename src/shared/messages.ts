import type { Server, Socket } from 'https://deno.land/x/socket_io@0.2.0/mod.ts';
import type { Socket as ClientSocket } from 'socket.io-client';


export type CustomServer = Server<ClientToServerEvents, ServerToClientEvents>;
export type CustomSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export type CustomClientSocket = ClientSocket<
	ServerToClientEvents,
	ClientToServerEvents
>;

interface ServerToClientEvents {

	// Full or delta updates for player state
	latencyTest: () => void;

}

interface ClientToServerEvents {

	latencyTest: () => void;

}
