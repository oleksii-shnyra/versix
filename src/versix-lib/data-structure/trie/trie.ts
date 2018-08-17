import { InputMap, InputCharMap, TrieNode } from "./interface";

export class Trie<T = {}> {
    private nodes: InputCharMap<T> = {};

    constructor(map: InputMap<T>) {
        this.buildTrieFromMap(map);
    }

    private buildTrieFromMap(map: InputMap<T>) {
        Object.keys(map).forEach(key => {
            let consumed = 0;
            let curNode: TrieNode<T>;
            for (const c of key) {
                consumed++;
                if (!curNode) {
                    if (!this.nodes[c]) {
                        this.nodes[c] = {
                            children: {},
                        };
                    }
                    curNode = this.nodes[c];
                }
                if (consumed > 1) {
                    if (!curNode.children[c]) {
                        curNode.children[c] = {
                            children: {},
                        };
                    }
                    curNode = curNode.children[c];
                }
                if (consumed === key.length) {
                    curNode.value = map[key];
                }
            }
        });
    }

    public get(path: string): false | { value: T } {
        let curNode: TrieNode<T>;
        let consumed = 0;
        for (const c of path) {
            consumed++;
            if (consumed > 1) {
                if (!curNode || !curNode.children[c]) {
                    return false;
                } else {
                    curNode = curNode.children[c];
                }
            } else {
                if (!this.nodes[c]) {
                    return false;
                }
                curNode = this.nodes[c];
            }
        }
        return curNode ?  { value: curNode.value } : false;
    }

    public getFullTrie(): InputCharMap<T> {
        return this.nodes;
    }
}