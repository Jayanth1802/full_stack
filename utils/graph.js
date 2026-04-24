function isValidEdge(str) {
    if (!str) return false;

    const trimmed = str.trim();

    const regex = /^[A-Z]->[A-Z]$/;

    if (!regex.test(trimmed)) return false;

    const [parent, child] = trimmed.split("->");

    if (parent === child) return false;

    return true;
}

function processData(data) {
    const invalid_entries = [];
    const duplicate_edges = [];

    const seen = new Set();
    const edges = [];

    // STEP 1: VALIDATION + DUPLICATES
    for (let item of data) {
        const trimmed = item.trim();

        if (!isValidEdge(trimmed)) {
            invalid_entries.push(item);
            continue;
        }

        if (seen.has(trimmed)) {
            if (!duplicate_edges.includes(trimmed)) {
                duplicate_edges.push(trimmed);
            }
            continue;
        }

        seen.add(trimmed);
        edges.push(trimmed);
    }

    // STEP 2: BUILD GRAPH
    const graph = {};
    const childSet = new Set();

    for (let edge of edges) {
        const [parent, child] = edge.split("->");

        if (!graph[parent]) graph[parent] = [];
        graph[parent].push(child);

        childSet.add(child);
    }

    // STEP 3: FIND ROOTS
    const nodes = new Set();

    edges.forEach(e => {
        const [p, c] = e.split("->");
        nodes.add(p);
        nodes.add(c);
    });

    let roots = [...nodes].filter(n => !childSet.has(n));

    if (roots.length === 0) {
        roots = [ [...nodes].sort()[0] ];
    }

    // STEP 4: DFS FOR TREE + CYCLE
    const visitedGlobal = new Set();
    let total_cycles = 0;

    function dfs(node, visited) {
        if (visited.has(node)) return "cycle";

        visited.add(node);

        const children = graph[node] || [];
        const obj = {};

        let maxDepth = 1;

        for (let child of children) {
            const res = dfs(child, new Set(visited));

            if (res === "cycle") return "cycle";

            obj[child] = res.tree;
            maxDepth = Math.max(maxDepth, 1 + res.depth);
        }

        return { tree: obj, depth: maxDepth };
    }

    const hierarchies = [];
    let total_trees = 0;
    let largest_tree_root = "";
    let maxDepthGlobal = 0;

    for (let root of roots) {
        const result = dfs(root, new Set());

        if (result === "cycle") {
            total_cycles++;

            hierarchies.push({
                root,
                tree: {},
                has_cycle: true
            });

        } else {
            total_trees++;

            if (
                result.depth > maxDepthGlobal ||
                (result.depth === maxDepthGlobal && root < largest_tree_root)
            ) {
                maxDepthGlobal = result.depth;
                largest_tree_root = root;
            }

            hierarchies.push({
                root,
                tree: { [root]: result.tree },
                depth: result.depth
            });
        }
    }

    return {
        hierarchies,
        invalid_entries,
        duplicate_edges,
        summary: {
            total_trees,
            total_cycles,
            largest_tree_root
        }
    };
}

module.exports = { processData };