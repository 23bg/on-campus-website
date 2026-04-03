import "@testing-library/jest-dom/vitest";

const _nodeEnv = process.env.NODE_ENV ?? "test";
void _nodeEnv;
process.env.DATABASE_URL = process.env.DATABASE_URL ?? "mongodb://127.0.0.1:27017/oncampus_test";
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-jwt-secret-that-is-at-least-32-chars";
