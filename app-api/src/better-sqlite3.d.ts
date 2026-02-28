// ambient declaration so TypeScript doesn't complain about missing types

declare module "better-sqlite3" {
  interface DatabaseOptions {
    readonly verbose?: boolean;
  }
  // export a class so it can be `new Database(...)`
  class Database {
    constructor(path: string, options?: DatabaseOptions);
    prepare(sql: string): any;
    exec(sql: string): void;
    // minimal members used in this project
  }
  export = Database;
}
