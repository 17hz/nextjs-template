"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { orpc } from "@/lib/orpc/query";

export default function OrpcDemoPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const planetsQuery = useQuery(
    orpc.planet.listPlanet.queryOptions({
      input: { limit: 10 },
    })
  );

  const createMutation = useMutation({
    ...orpc.planet.createPlanet.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.planet.listPlanet.queryKey({ input: { limit: 10 } }),
      });
      setName("");
      setDescription("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate({ name, description: description || undefined });
  };

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tighter">
          oRPC Demo
        </h1>

        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <div>
            <label className="mb-2 block font-mono text-sm text-gray-400">
              Planet Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-600 bg-transparent px-4 py-2 font-mono text-white focus:border-white focus:outline-none"
              placeholder="Enter planet name"
            />
          </div>
          <div>
            <label className="mb-2 block font-mono text-sm text-gray-400">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-600 bg-transparent px-4 py-2 font-mono text-white focus:border-white focus:outline-none"
              placeholder="Enter description (optional)"
            />
          </div>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="border border-white px-6 py-2 font-mono text-sm transition-colors hover:bg-white hover:text-black disabled:opacity-50"
          >
            {createMutation.isPending ? "Creating..." : "Create Planet"}
          </button>
        </form>

        <div className="border-t border-gray-800 pt-8">
          <h2 className="mb-4 font-mono text-xl text-gray-400">Planets</h2>

          {planetsQuery.isLoading && (
            <p className="font-mono text-gray-500">Loading...</p>
          )}

          {planetsQuery.error && (
            <p className="font-mono text-red-500">
              Error: {planetsQuery.error.message}
            </p>
          )}

          {planetsQuery.data && (
            <ul className="space-y-3">
              {planetsQuery.data.map((planet) => (
                <li
                  key={planet.id}
                  className="border border-gray-800 p-4"
                >
                  <div className="font-bold">{planet.name}</div>
                  {planet.description && (
                    <div className="mt-1 text-sm text-gray-400">
                      {planet.description}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
