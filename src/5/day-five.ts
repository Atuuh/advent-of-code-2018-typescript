import { Advent } from '../advent'
import { input } from './input'

export class DayFive extends Advent {
    constructor() {
        super();
        this.DayNumber = "Day Five";
        this.Input = input;

        let polymer = this.Input;
        let newPolymer = polymer;
        do {
            polymer = newPolymer;
            newPolymer = this.triggerPolymer(polymer);

        } while (polymer !== newPolymer)

        this.PartA = polymer.length.toString();
    }

    private triggerPolymer(input: string): string {
        for (let i = 0; i < input.length - 1; i++) {
            if (input[i] === this.toggleCase(input[i + 1])) {
                return input.slice(0, i) + input.slice(i + 2);
            }
        }
        return input;
    }


    private toggleCase(input: string): string {
        if (input.length !== 1) { throw new Error('toggleCase input is not a single char'); }
        return input === input.toLowerCase() ? input.toUpperCase() : input.toLowerCase();
    }
}
