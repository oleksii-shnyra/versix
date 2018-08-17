export interface InputMap<T> {
    [key: string]: T
}

export interface InputCharMap<T> {
    [char: string]: TrieNode<T>
}

export interface TrieNode<T> {
    value?: T
    children: InputCharMap<T>
}
