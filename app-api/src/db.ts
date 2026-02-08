import Database from "better-sqlite3";
import { randomUUID } from "node:crypto";
import type { RequestRecord, RequestStatus } from "./requests.js";
import { assertStatusTransition } from "./requests.js";

export type RequestStore = {
  createRequest: (input: { userEmail: string; wallet: string }) => RequestRecord;
  getRequest: (id: string) => RequestRecord | undefined;
  listRequests: (status?: RequestStatus) => RequestRecord[];
  updateRequest: (id: string, patch: Partial<RequestRecord>) => RequestRecord | undefined;
};

const now = () => Math.floor(Date.now() / 1000);

const normalizeSqlitePath = (url: string): string => {
  if (url.startsWith("sqlite:")) {
    return url.replace(/^sqlite:\/?\/?/, "");
  }
  return url;
};

const buildSqliteStore = (dbUrl: string): RequestStore => {
  const dbPath = normalizeSqlitePath(dbUrl);
  const db = new Database(dbPath);

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
  const selectByStatusStmt = db.prepare("SELECT * FROM requests WHERE status = ?");
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
  try {
    return buildSqliteStore(dbUrl);
  } catch (error) {
    // Fallback to memory if SQLite fails to initialize
    console.warn("SQLite unavailable, falling back to in-memory store", error);
    return buildMemoryStore();
  }
};
