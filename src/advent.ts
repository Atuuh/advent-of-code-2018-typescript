export class Advent {
    protected PartA: string;
    protected PartB: string;
    protected DayNumber: string;
    protected Input: string;

    protected constructor() {

    }

    public Solve(): string {
        return `${this.DayNumber}: A = "${this.PartA}", B = "${this.PartB}"`
    }
}