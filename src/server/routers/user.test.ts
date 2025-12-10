import { describe, it, expect } from "vitest";
import { call } from "@orpc/server";
import { findUser } from "./user";

describe("user router", () => {
  const mockHeaders = new Headers();
  const context = { headers: mockHeaders };

  describe("findUser", () => {
    it("should find user by id", async () => {
      const result = await call(
        findUser,
        { id: "An1KG8fc4zKMXzNQopfszeAhRicvP85i" },
        { context }
      );

      expect(result.id).toBe("An1KG8fc4zKMXzNQopfszeAhRicvP85i");
      expect(result.name).toBe("zhaker");
    });

    it("should throw error when user not found", async () => {
      await expect(
        call(findUser, { id: "non-existent-id" }, { context })
      ).rejects.toThrow("User not found");
    });
  });
});
