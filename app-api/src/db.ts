// better-sqlite3 has no official types so provide a simple declaration
// "better-sqlite3" is a native addon that may fail to build on some Node
// versions (e.g. Node 23).  We only load it lazily when a DATABASE_URL is
// provided so that the app can run with an in-memory store during development
// or on machines where the native binary isn't compatible.
let Database: any;
import { randomUUID } from "node:crypto";
import { createRequire } from "module";
const requireC = createRequire(import.meta.url);
import type { RequestRecord, RequestStatus } from "./requests.js";
import { assertStatusTransition } from "./requests.js";

export type RequestStore = {
  createRequest: (input: {
    userEmail: string;
    wallet: string;
  }) => RequestRecord;
  getRequest: (id: string) => RequestRecord | undefined;
  listRequests: (status?: RequestStatus) => RequestRecord[];
  updateRequest: (
    id: string,
    patch: Partial<RequestRecord>,
  ) => RequestRecord | undefined;
};

const now = () => Math.floor(Date.now() / 1000);

const normalizeSqlitePath = (url: string): string => {
  if (url.startsWith("sqlite:")) {
    return url.replace(/^sqlite:\/?\/?/, "");
  }
  return url;
};

// build a sqlite-backed store given a Database constructor (from better-sqlite3)
const buildSqliteStore = (dbUrl: string, Sqlite: any): RequestStore => {
  const dbPath = normalizeSqlitePath(dbUrl);
  const db = new Sqlite(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS requests (
      id TEXT PRIMARY KEY,
      userEmail TEXT NOT NULL,
      wallet TEXT NOT NULL,
      status TEXT NOT NULL,
      score INTEGER,
      txHash TEXT,
      adminNote TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );
  `);

  const insertStmt = db.prepare(`
    INSERT INTO requests (id, userEmail, wallet, status, score, txHash, adminNote, createdAt, updatedAt)
    VALUES (@id, @userEmail, @wallet, @status, @score, @txHash, @adminNote, @createdAt, @updatedAt)
  `);

  const selectStmt = db.prepare("SELECT * FROM requests WHERE id = ?");
  const selectAllStmt = db.prepare("SELECT * FROM requests");
  const selectByStatusStmt = db.prepare(
    "SELECT * FROM requests WHERE status = ?",
  );
  const updateStmt = db.prepare(`
    UPDATE requests
    SET userEmail = @userEmail,
        wallet = @wallet,
        status = @status,
        score = @score,
        txHash = @txHash,
        adminNote = @adminNote,
        updatedAt = @updatedAt
    WHERE id = @id
  `);

  return {
    createRequest: ({ userEmail, wallet }) => {
      const timestamp = now();
      const request: RequestRecord = {
        id: randomUUID(),
        userEmail,
        wallet,
        status: "PENDING",
        score: null,
        txHash: null,
        adminNote: null,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      insertStmt.run(request);
      return request;
    },
    getRequest: (id) => {
      const row = selectStmt.get(id) as RequestRecord | undefined;
      return row;
    },
    listRequests: (status) => {
      const rows = status
        ? (selectByStatusStmt.all(status) as RequestRecord[])
        : (selectAllStmt.all() as RequestRecord[]);
      return rows;
    },
    updateRequest: (id, patch) => {
      const existing = selectStmt.get(id) as RequestRecord | undefined;
      if (!existing) return undefined;
      if (patch.status && patch.status !== existing.status) {
        assertStatusTransition(existing.status, patch.status);
      }
      const updated: RequestRecord = {
        ...existing,
        ...patch,
        updatedAt: now(),
      };
      updateStmt.run(updated);
      return updated;
    },
  };
};

const buildMemoryStore = (): RequestStore => {
  const store = new Map<string, RequestRecord>();

  return {
    createRequest: ({ userEmail, wallet }) => {
      const timestamp = now();
      const request: RequestRecord = {
        id: randomUUID(),
        userEmail,
        wallet,
        status: "PENDING",
        score: null,
        txHash: null,
        adminNote: null,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      store.set(request.id, request);
      return request;
    },
    getRequest: (id) => store.get(id),
    listRequests: (status) => {
      const items = Array.from(store.values());
      return status ? items.filter((item) => item.status === status) : items;
    },
    updateRequest: (id, patch) => {
      const existing = store.get(id);
      if (!existing) return undefined;
      if (patch.status && patch.status !== existing.status) {
        assertStatusTransition(existing.status, patch.status);
      }
      const updated: RequestRecord = {
        ...existing,
        ...patch,
        updatedAt: now(),
      };
      store.set(id, updated);
      return updated;
    },
  };
};

export const initDb = (dbUrl?: string): RequestStore => {
  if (!dbUrl) {
    return buildMemoryStore();
  }
  // attempt to load the native sqlite module safely
  let Sqlite: any;
  try {
    // use createRequire to avoid ReferenceError, but catch loading errors
    Sqlite = requireC("better-sqlite3");
  } catch (err) {
    console.warn("SQLite module not available, using memory store", err);
    return buildMemoryStore();
  }

  try {
    return buildSqliteStore(dbUrl, Sqlite);
  } catch (error) {
    console.warn(
      "SQLite initialization failed, falling back to memory store",
      error,
    );
    return buildMemoryStore();
  }
};
