import { Advent } from '../advent'
import { input } from './input'

export class DaySeven extends Advent {
    constructor() {
        super();
        this.DayNumber = "Day Seven";
        this.Input = input;

        const graph = this.parseInput(this.Input.split('\n'));

        let output = '';
        while (true) {
            const root = graph.GetRoot();
            output += root.value;
            if (graph.GetAllNodes().length === 1) {
                break;
            }
            graph.DeleteNode(root.value);
        }

        this.PartA = output;
    }

    parseInput(inputs: string[]): UniqueGraph<string> {
        const regex = /(?:Step (.)).*(?:step (.).*)/;
        let matches = inputs.map(value => value.split(regex)).map(value => value.filter(t => !!t));

        const firstNode = new UniqueGraphNode<string>(matches[0][0]);
        const child = new UniqueGraphNode<string>(matches[0][1], firstNode);
        matches.splice(0, 1);
        const graph = new UniqueGraph(firstNode);
        firstNode.children.push(child);
        while (matches.length > 0) {
            for (const [index, value] of matches.entries()) {
                if (graph.AddNode(value[0], value[1])) {
                    matches.splice(index, 1);
                }
            }
        }
        return graph;
    }


}

class UniqueGraph<T>
{
    initial: UniqueGraphNode<T>;
    constructor(root: UniqueGraphNode<T>) {
        this.initial = root;
    }

    GetAllNodes(): Array<UniqueGraphNode<T>> {
        const nodeList = [this.initial];
        for (const node of nodeList) {
            if (node.parents.length > 0) {
                for (const parent of node.parents) {
                    if (!nodeList.includes(parent)) {
                        nodeList.push(parent);
                    }
                }
            }
            if (node.children.length > 0) {
                for (const child of node.children) {
                    if (!nodeList.includes(child)) {
                        nodeList.push(child);
                    }
                }
            }
        }
        return nodeList
    }

    AddNode(parent: T, child: T): boolean {
        let parentNode = this.FindNode(parent);
        let childNode = this.FindNode(child);
        if (!parentNode && !childNode) {
            return false;
        }
        if (!parentNode) {
            parentNode = new UniqueGraphNode<T>(parent);
        }
        else if (!childNode) {
            childNode = new UniqueGraphNode<T>(child);
        }
        this.CreateEdge(parentNode, childNode);
        return true;
    }

    DeleteNode(nodeValue: T) {
        const node = this.FindNode(nodeValue);
        node.children.forEach(child => {
            child.parents = child.parents.filter(x => x.value !== nodeValue)
        });
        node.parents.forEach(parent => {
            parent.children = parent.children.filter(x => x.value !== nodeValue)
        });
        if (this.initial.value === nodeValue && this.initial.children.length > 0) {
            const values = this.GetAllNodes()
                .filter(x => x.parents.length === 0 && x.value !== nodeValue)
                .map(x => x.value)
                .sort();
            this.initial = this.FindNode(values[0]);
        }
    }

    FindNode(value: T): UniqueGraphNode<T> | null {
        const nodes = this.GetAllNodes();
        for (const node of nodes) {
            if (node.value === value) {
                return node
            }
        }
        return null;
    }

    CreateEdge(parent: UniqueGraphNode<T>, child: UniqueGraphNode<T>) {
        parent.children.push(child);
        child.parents.push(parent);
    }

    GetRoot(): UniqueGraphNode<T> {
        //     let parents = this.initial.parents.length > 0 ? this.initial.parents : [this.initial];
        //     while (true) {
        //         let newParents = parents.reduce((total, next) => {
        //             return total.concat(next.parents);
        //         }, new Array<UniqueGraphNode<T>>());
        //         if (newParents.length === 0) {
        //             break;
        //         }
        //         parents = newParents;
        //     }
        //     const values = parents.map(x => x.value)
        //         .sort();
        //     return this.FindNode(values[0]);
        // }
        const values = this.GetAllNodes()
            .filter(x => x.parents.length === 0)
            .map(x => x.value)
            .sort();

        return this.FindNode(values[0])
    }

}

class UniqueGraphNode<T> {
    value: T;
    parents: Array<UniqueGraphNode<T>> = new Array<UniqueGraphNode<T>>();
    children: Array<UniqueGraphNode<T>> = new Array<UniqueGraphNode<T>>();
    constructor(value: T, parent?: UniqueGraphNode<T>, child?: UniqueGraphNode<T>) {
        this.value = value;
        if (parent) { this.parents.push(parent); }
        if (child) { this.children.push(child); }
    }
}

