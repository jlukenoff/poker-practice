<template>
  <div class="container">
    <div class="matrix-container">
      <img
        src="https://storage.googleapis.com/john-lukenoff-portoflio/static/roomba.png"
        alt="Roomba"
        class="roomba-img"
        ref="roombaImg"
      />
      <ul v-for="(row, rowIndex) in matrix" :key="rowIndex" class="matrix-row">
        <li
          v-for="(cell, cellIndex) in row"
          :key="cellIndex"
          class="matrix-cell"
          :class="{ filled: cell === 1 }"
        >
          <!-- x: {{ cellIndex }} y: {{ matrix.length - 1 - rowIndex }} -->
        </li>
      </ul>
      <div class="title">
        <span v-show="currentStep">Next Step: {{ currentStep }}</span
        ><br />
        <ul class="results-list">
          <li>
            Final Coordinates (x, y):
            {{
              resultString
                .split("\n")[0]
                .split(" ")
                .join(", ")
            }}
          </li>
          <li>Dirt Collected: {{ resultString.split("\n")[1] }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from "gsap";

export default {
  name: "Room",
  props: {
    dirtCount: {
      type: [String, Number],
    },
    resultString: {
      type: String,
    },
    dirtLocations: {
      type: Array,
    },
    finalPositionRaw: {
      type: Array,
    },
    initialPositionRaw: {
      type: Array,
    },
    finalMatrix: {
      type: String,
    },
    originalMatrix: {
      type: String,
      default: "[]",
    },
    traversalSteps: {
      type: Array,
      default() {
        return [];
      },
    },
    directions: {
      type: String,
    },
  },
  computed: {
    // create matrix prop when original matrix changes
    matrix() {
      return JSON.parse(this.originalMatrix);
    },
  },
  watch: {
    // watch for changes to travsersalSteps
    traversalSteps(newSteps) {
      const $vm = this;
      // start roomba animation
      animateRoomba($vm, newSteps);
    },
  },
  data() {
    const $vm = this;
    return {
      currentStep: "",
      animationTimeline: gsap.timeline({
        // Uncomment to set repeat
        // repeat: 2,
        // repeatDelay: 2,
        defaults: {},
        smoothChildTiming: true,
        onRepeat: () => resetMatrix($vm),
        onComplete: () => resetMatrix($vm),
      }),
    };
  },
};

function animateRoomba($vm, traversalSteps) {
  const {
    $refs: { roombaImg },
    initialPositionRaw,
    matrix,
    directions,
    animationTimeline,
  } = $vm;

  animationTimeline.clear();

  for (let i = 0; i < traversalSteps.length; i++) {
    const [x, y] = traversalSteps[i];

    // initialize options for animation step
    const animateOptions = {
      duration: 1,
      ease: "none",
      // invert y
      y: (matrix.length - 1 - y) * 60,
      x: x * 60 + 2,
    };

    let rotation = 0;
    let currentStep;

    // calculate rotation based on directions string
    switch (directions[i]) {
      case "N":
        rotation = 0;
        currentStep = "North";
        break;
      case "E":
        rotation = 90;
        currentStep = "East";
        break;
      case "S":
        rotation = 180;
        currentStep = "South";
        break;
      case "W":
        rotation = -90;
        currentStep = "West";
        break;

      default:
        break;
    }

    animateOptions.rotate = rotation;

    // add animation to timeline
    animationTimeline
      .add()
      .to(roombaImg, animateOptions)
      .call(() => updateState($vm, x, matrix.length - 1 - y, currentStep));
  }
}

// update state with each animation
function updateState($vm, x, y, step) {
  if ($vm.matrix[y][x] === 1) {
    const newRow = $vm.matrix[y];
    newRow[x] = 0;

    $vm.matrix.splice(y, 1, newRow);
  }

  $vm.currentStep = step;
}

// reset matrix when done
function resetMatrix($vm) {
  $vm.matrix.splice(0, $vm.matrix.length, ...JSON.parse($vm.originalMatrix));
  $vm.currentStep = "";
}
</script>

<style lang="scss" scoped>
$border: 1px solid #333;
$cell-size: 50px;
$filledBg: #ccc;

.title {
  text-align: center;
  margin: auto;
}

.results-list {
  list-style: none;
}

.matrix-container {
  display: flex;
  flex-flow: column;
  width: min-content;
  align-items: flex-start;
  margin: 0 auto;

  .matrix-row {
    list-style: none;
    display: inline-flex;
    flex-wrap: nowrap;
    margin: 0 20px;
    padding: 0;
    border-bottom: $border;

    &:first-of-type {
      border-top: $border;
    }

    .matrix-cell {
      padding: 5px;
      border-right: $border;
      min-width: $cell-size;
      min-height: $cell-size;

      &:first-of-type {
        border-left: $border;
      }

      &.filled {
        background-color: $filledBg;
      }
    }
  }
  .roomba-img {
    max-width: $cell-size;
    width: 50px;
    height: auto;
    position: relative;
    left: 25px;
    top: 60px;
  }
}
</style>
