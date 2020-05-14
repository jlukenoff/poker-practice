import * as path from "path";
import { readFile } from "fs";

// define type for Roomba traversal output
type RoombaResult = {
  resultString: string;
  traversalSteps: number[][];
  dirtLocations: string[];
  finalPositionRaw: [number, number];
  initialPositionRaw: [number, number];
  dirtCount: number;
  finalMatrix: string;
  originalMatrix: string;
  directions: string;
};

/**
 * Class Roomba
 * - ingests input via string or flat file
 * - creates a 2D array populated with input
 * - traverses array and returns information on traversal
 *
 * Note: One performance optimization would be to minimize
 * space complexity by not actually creating a 2D array. Instead,
 * this could be achieved by running calculations from the current
 * position, incrementing and decrementing as we do here. However,
 * I have chosen to build the matrix here to make it easier to
 * communicate this data to the GraphQL server and then the front end.
 */
export default class Roomba {
  inputString: string = "";
  matrix: number[][] = [[0]];
  directions: string = "";
  currentPosition: [number, number] = [0, 0];
  dirtLocations: string[] = [];

  /**
   * @param pathToInputFile [string] - path to input file
   * @returns Promise resolving to an input string
   */
  readFromFile(pathToInputFile: string): Promise<string | Error> {
    const targetFile = path.resolve(pathToInputFile);

    // asynchronously read from file and resolve resulting data as string
    return new Promise((resolve, reject) =>
      readFile(targetFile, (e, d) => {
        if (e) reject(`Error importing file: ${e.message}`);

        resolve(d.toString());
      })
    );
  }

  // ingest input string and update instance state with results
  ingestInput(this: Roomba, inputString: string): void {
    // split input string on newlines
    const [
      dimensions,
      initialCoordinates,
      ...remainingRows
    ] = inputString.split("\n");

    // extract width and height from first row
    const [width, height] = dimensions.split(" ");

    // extract initial coordinates from second row
    const [col, row] = initialCoordinates.split(" ");

    // update instance initial coordinates
    this.currentPosition = [+col, +height - 1 - +row];

    // set instance directions string: (e.g. NESWNESW)
    this.directions = <string>remainingRows.pop();

    // set dirt locations list, inverting y
    this.dirtLocations = remainingRows;

    // set rendered 2D array
    this.matrix = Roomba.prototype.renderMatrix(
      +width,
      +height,
      this.dirtLocations
    );
  }

  // render a 2D matrix of given width, height and dirtLocations
  private renderMatrix(
    width: number,
    height: number,
    dirtLocations: string[]
  ): number[][] {
    // convert dirtLocations to Set for constant time lookups
    const locSet = new Set(dirtLocations);

    // render 2D array
    return Array(height)
      .fill(null)
      .map((r, y) =>
        // populate row
        Array(width)
          .fill(null)
          .map((v, x) => {
            // check dirtLocations for current coordinates and fill with 1 or 0
            return locSet.has(`${x} ${height - 1 - y}`) ? 1 : 0;
          })
      );
  }

  // traverses current matrix and returns information on matrix
  traverse(this: Roomba): RoombaResult {
    // get instance properties
    const { directions, matrix, currentPosition, dirtLocations } = this;

    // set initial variables
    let [x, y] = currentPosition;
    const traversalSteps = [];
    let dirtCount = 0;
    const originalMatrix = [...matrix.map((r) => [...r])];

    // traverse directions string, we go over the end of the string here so we can count the cell we land on last
    for (let i = 0; i <= directions.length; i++) {
      traversalSteps.push([x, matrix.length - 1 - y]);

      // check if we are on a 1 or 0 (dirt cell or not)
      if (matrix[y][x] === 1) {
        matrix[y][x] = 0;
        // increment counter
        dirtCount++;
      }

      // get current character from directions string
      const nextDirection = directions.charAt(i);

      // move coordinates based on current direction step
      // in each condition we also check that we are not
      // exceeding the edge of the matrix
      if (nextDirection === "N" && y >= 1) {
        y--;
      } else if (nextDirection === "S" && y < matrix.length - 1) {
        y++;
      } else if (nextDirection === "E" && x < matrix[0].length - 1) {
        x++;
      } else if (nextDirection === "W" && x >= 1) {
        x--;
      }
    }

    // return last location
    return {
      // invert y
      resultString: `${x} ${matrix.length - 1 - y}\n${dirtCount}`,
      finalPositionRaw: [x, y],
      initialPositionRaw: currentPosition,
      traversalSteps,
      dirtLocations,
      dirtCount,
      finalMatrix: JSON.stringify(matrix),
      originalMatrix: JSON.stringify(originalMatrix),
      directions,
    };
  }
}
