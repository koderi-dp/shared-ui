import { expect, it } from "vitest";
import { createTreeIndex, resolveRootId, TREE_ROOT } from "./tree-controller";

type Node = { id: string; parentId: string | null; name: string };

const getId = (node: Node) => node.id;
const getParentId = (node: Node) => node.parentId;

const tree: Node[] = [
  { id: TREE_ROOT, parentId: null, name: "All" },
  { id: "a", parentId: TREE_ROOT, name: "A" },
  { id: "a1", parentId: "a", name: "A1" },
  { id: "a2", parentId: "a", name: "A2" },
  { id: "b", parentId: TREE_ROOT, name: "B" },
];

it("takes the one top-level item as the root when it is not named", () => {
  expect(resolveRootId(tree, { getId, getParentId })).toBe(TREE_ROOT);
});

it("takes a named root, and refuses one that is not an item", () => {
  expect(resolveRootId(tree, { getId, getParentId }, "a")).toBe("a");
  expect(() => resolveRootId(tree, { getId, getParentId }, "nope")).toThrow(/not one of the items/);
});

it("refuses to guess a root when the top level is empty or crowded", () => {
  expect(() => resolveRootId([], { getId, getParentId })).toThrow(/No tree item is at the top/);
  const two: Node[] = [
    { id: "x", parentId: null, name: "X" },
    { id: "y", parentId: null, name: "Y" },
  ];
  expect(() => resolveRootId(two, { getId, getParentId })).toThrow(
    /Several tree items are at the top/,
  );
});

it("groups the items under their parent, in the order they were given", () => {
  const { dataLoader, hasChildren, rootId } = createTreeIndex(tree, { getId, getParentId });
  expect(rootId).toBe(TREE_ROOT);
  expect(dataLoader.getChildren(TREE_ROOT)).toEqual(["a", "b"]);
  expect(dataLoader.getChildren("a")).toEqual(["a1", "a2"]);
  expect(dataLoader.getChildren("a1")).toEqual([]);
  expect(hasChildren("a")).toBe(true);
  expect(hasChildren("a1")).toBe(false);
  expect(hasChildren(TREE_ROOT)).toBe(true);
});

it("returns the item for an id, and throws for one it does not have", () => {
  const { dataLoader } = createTreeIndex(tree, { getId, getParentId });
  expect(dataLoader.getItem("a1")).toBe(tree[2]);
  expect(() => dataLoader.getItem("gone")).toThrow(/No tree item with id "gone"/);
});

it("shows an item whose parent is missing at the root, and never the root as its own child", () => {
  const orphan: Node[] = [
    { id: TREE_ROOT, parentId: null, name: "All" },
    { id: "kept", parentId: "deleted", name: "Kept" },
  ];
  const { dataLoader } = createTreeIndex(orphan, { getId, getParentId });
  expect(dataLoader.getChildren(TREE_ROOT)).toEqual(["kept"]);
  expect(dataLoader.getChildren(TREE_ROOT)).not.toContain(TREE_ROOT);
});
