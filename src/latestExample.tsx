import * as React from "react";
import { useEffect, useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  AnimatePresence,
  useTransform
} from "framer-motion";
import { findIndex, Position } from "./find-index";
import move from "array-move";
/*import { CloseButton } from "./CloseButton";
import { add, remove } from "./array-utils";
import Toggle from "react-toggle";
import Sound from "react-sound";

const PlayPenguinSound = () => {
  return (
    <Sound
      url="./penguin.mp3"
      playStatus={Sound.status.PLAYING}
      playFromPosition={0 }
      playStatus={this.state.playStatus}
      playFromPosition={this.state.position}
      volume={100}
      playbackRate={1}
      loop={false}
      onLoading={({ bytesLoaded, bytesTotal }) =>
        console.log(`${(bytesLoaded / bytesTotal) * 100}% loaded`)
      }
      onLoad={() => console.log("Loaded")}
      onPlaying={({ position }) => console.log("Position", position)}
      onPause={() => console.log("Paused")}
      onResume={() => console.log("Resumed")}
      onStop={() => console.log("Stopped")}
      onFinishedPlaying={() =>
        this.setState({ playStatus: Sound.status.STOPPED })
      }
    />
  );
};*/

const Title = () => {
  const [title, setTitle] = useState("Click here");

  return <h1 onClick={() => setTitle("New title")}>{title}</h1>;
};

const CheckBox = () => {
  const checkBox,
    toggleCheck = false;
  return <span role="img">✅</span>;
};

const generateCloseButton = () => {
  return <div />;
};

const generateToggle = text => {
  return (
    <div>
      <motion.span role="img" class="toggle">
        <label>
          <Toggle
            defaultChecked={false}
            icons={{ checked: text, unchecked: text }}
            onChange={false}
            whileHover={false}
            whileTap={false}
          />
        </label>
      </motion.span>
    </div>
  );
};

const Item = ({ color, setPosition, moveItem, i, text }) => {
  const x = useMotionValue(0);
  const xInput = [-50, 1, 50];
  const background = useTransform(x, xInput, [
    //"linear-gradient(180deg, #00000 0%, #ff008c 100%)",
    "linear-gradient(180deg,  rgb(211, 9, 225) 0%, #ff008c 100%)",
    //    "linear-gradient(180deg, #7700ff 0%, {rgb(68, 0, 255)} 0%)",
    "linear-gradient(180deg, " + color + " 0%, " + color + " 100%)",
    "linear-gradient(180deg, rgb(230, 255, 0) 0%, rgb(3, 209, 0) 100%)"
  ]);
  const transparency = useTransform(x, xInput, [
    "linear-gradient(180deg, #ff008c 0%, rgb(211, 9, 225) 100%)",
    "linear-gradient(180deg, #7700ff 0%, rgb(68, 0, 255) 100%)",
    "linear-gradient(180deg, rgb(230, 255, 0) 0%, rgb(3, 209, 0) 100%)"
  ]);
  const progressBackground = useTransform(x, xInput, [
    "linear-gradient(180deg, #ffffff 0%, #ffffff 100%)",
    "linear-gradient(180deg, " + color + " 0%, " + color + " 100%)",
    "linear-gradient(180deg, #ffffff 0%, #ffffff 100%)"
  ]);
  const progressColor = useTransform(x, xInput, [
    //"rgb(211, 9, 225)",
    //        "rgb(68, 0, 255)",
    //  { defaultColor },
    "#ff008c",
    color,
    "rgb(3, 209, 0)"
  ]);
  const opacity = useTransform(x, xInput, [0.0, 0.0, 0.0]);

  const tickPath = useTransform(x, [1, 25], [0, 1]);
  const crossPathA = useTransform(x, [-1, -12], [0, 1]);
  const crossPathB = useTransform(x, [-13, -25], [0, 1]);

  const [isDragging, setDragging] = useState(false);

  // We'll use a `ref` to access the DOM element that the `motion.li` produces.
  // This will allow us to measure its height and position, which will be useful to
  // decide when a dragging element should switch places with its siblings.
  const ref = useRef(null);

  // By manually creating a reference to `dragOriginY` we can manipulate this value
  // if the user is dragging this DOM element while the drag gesture is active to
  // compensate for any movement as the items are re-positioned.
  const dragOriginY = useMotionValue(0);

  // Update the measured position of the item so we can calculate when we should rearrange.
  useEffect(() => {
    setPosition(i, {
      height: ref.current.offsetHeight,
      top: ref.current.offsetTop
    });
  });

  const constraintsRef = useRef(null);
  const rotateY = useTransform(x, [-200, 0, 200], [-45, 0, 45], {
    clamp: false
  });

  return (
    <div>
      <motion.li
        ref={ref}
        initial={false}
        // If we're dragging, we want to set the zIndex of that item to be on top of the other items.
        animate={isDragging ? onTop : flat}
        style={{ background: color, height: heights[color] }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 1.12 }}
        drag="y"
        dragOriginY={dragOriginY}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={1}
        onDragStart={() => setDragging(true)}
        onDragEnd={() => setDragging(false)}
        onDrag={(e, { point }) => moveItem(i, point.y)}
        // onTapEnd={() => toggleCheckmark()}
        positionTransition={({ delta }) => {
          if (isDragging) {
            // If we're dragging, we want to "undo" the items movement within the list
            // by manipulating its dragOriginY. This will keep the item under the cursor,
            // even though it's jumping around the DOM.
            dragOriginY.set(dragOriginY.get() + delta.y);
          }

          // If `positionTransition` is a function and returns `false`, it's telling
          // Motion not to animate from its old position into its new one. If we're
          // dragging, we don't want any animation to occur.
          return !isDragging;
        }}
      >
        <motion.div
          className="example-container"
          style={{ background: background }}
        >
          <motion.span
            className="progress-icon right-check"
            style={{ background: progressBackground }}
          >
            <svg viewBox="0 0 50 50">
              <motion.path
                fill="none"
                strokeWidth="3"
                stroke={progressColor}
                d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0"
                style={{ translateX: 5, translateY: 5 }}
              />
              <motion.path
                fill="none"
                strokeWidth="3"
                stroke={progressColor}
                d="M17,17 L33,33"
                strokeDasharray="0 1"
                style={{ pathLength: crossPathA }}
              />
              <motion.path
                fill="none"
                strokeWidth="3"
                stroke={progressColor}
                d="M33,17 L17,33"
                strokeDasharray="0 1"
                style={{ pathLength: crossPathB }}
              />
              <motion.path
                fill="none"
                strokeWidth="3"
                stroke={progressColor}
                d="M14,26 L 22,33 L 35,16"
                strokeDasharray="0 1"
                style={{ pathLength: tickPath }}
              />
            </svg>
          </motion.span>
          <motion.span
            className="progress-icon left-close"
            style={{ background: progressBackground }}
          >
            <svg viewBox="0 0 50 50">
              <motion.path
                fill="none"
                strokeWidth="3"
                stroke={progressColor}
                d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0"
                style={{ translateX: 5, translateY: 5 }}
              />
              <motion.path
                fill="none"
                strokeWidth="3"
                stroke={progressColor}
                d="M17,17 L33,33"
                strokeDasharray="0 1"
                style={{ pathLength: crossPathA }}
              />
              <motion.path
                fill="none"
                strokeWidth="3"
                stroke={progressColor}
                d="M33,17 L17,33"
                strokeDasharray="0 1"
                style={{ pathLength: crossPathB }}
              />
              <motion.path
                fill="none"
                strokeWidth="3"
                stroke={progressColor}
                d="M14,26 L 22,33 L 35,16"
                strokeDasharray="0 1"
                style={{ pathLength: tickPath }}
              />
            </svg>
          </motion.span>

          <motion.div
            className="box"
            style={{ x }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
          >
            {text}
          </motion.div>
        </motion.div>

        {
          //<CloseButton close={() => colors.remove(color, id)} />
        }
      </motion.li>
    </div>
  );
};

export const Example = () => {
  const [colors, setColors] = useState(initialColors);
  const [texts, setTexts] = useState(initialTexts);

  // We need to collect an array of height and position data for all of this component's
  // `Item` children, so we can later us that in calculations to decide when a dragging
  // `Item` should swap places with its siblings.
  const positions = useRef<Position[]>([]).current;
  const setPosition = (i: number, offset: Position) => (positions[i] = offset);

  // Find the ideal index for a dragging item based on its position in the array, and its
  // current drag offset. If it's different to its current index, we swap this item with that
  // sibling.
  const moveItem = (i: number, dragOffset: number) => {
    const targetIndex = findIndex(i, dragOffset, positions);
    if (targetIndex !== i) setColors(move(colors, i, targetIndex));
    setTexts(move(texts, i, targetIndex));
  };

  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  const rotateY = useTransform(x, [-200, 0, 200], [-45, 0, 45], {
    clamp: false
  });

  return (
    <div>
      <ul>
        <h1>Penguins Are Beautiful</h1>
        {colors.map((color, i) => (
          <div>
            <Item
              key={color}
              i={i}
              color={color}
              setPosition={setPosition}
              moveItem={moveItem}
              text={texts[i]}
              checked={false}
            />
          </div>
        ))}
      </ul>

      <motion.div
        className="container"
        ref={constraintsRef}
        style={{
          rotateY
        }}
      >
        <motion.div
          className="item"
          drag="x"
          dragConstraints={constraintsRef}
          style={{
            x
          }}
        >
          <p>
            Yes, we say <br /> <b>Pingüinos son bellos</b> <br /> in penguin!
            <motion.div
              className="speechBubble"
              aria-label="speechBubble"
              role="img"
              animate={{
                scale: [0.6, 0.7, 0.6, 0.7, 0.6]
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.25, 0.5, 0.75, 1],
                loop: Infinity,
                repeatDelay: 0
              }}
            >
              <span role="img" aria-label="speechBubble">
                💬
              </span>
            </motion.div>
            <motion.div
              className="penguin"
              aria-label="penguin"
              role="img"
              animate={{
                scale: [1, 1.5, 2, 2.5, 2]
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut"
              }}
              whileHover={{ scale: 2.5 }}
              whileTap={{ rotate: [5, -5, 5, 0] }}
            >
              {/*PlayPenguinSound*/}
              <span role="img" aria-label="Penguin">
                🐧
              </span>
            </motion.div>
          </p>
        </motion.div>
      </motion.div>

      <motion.button
        className="homeToAntarctica"
        onClick={() => false}
        whileHover={{
          scale: 2,
          rotate: [5, -5, 5, 0]
          //background: "#265fb5"
        }}
        whileTap={{ scale: 3, background: "transparent" }}
        animate={{
          scale: [0.9, 0.95, 1.0, 0.95]
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75],
          //loop: Infinity,
          repeatDelay: 0
        }}
      >
        <span role="img" aria-label="Home to Antarctica">
          🇦🇶
        </span>
      </motion.button>
    </div>
  );
};

// Spring configs
const onTop = { zIndex: 1 };
const flat = {
  zIndex: 0,
  transition: { delay: 0.3 }
};

const initialColors = ["#FF008C", "#D309E1", "#9C1AFF", "#7700FF"];
const heights = {
  /*"#FF008C": 60,
  "#D309E1": 80,
  "#9C1AFF": 40,
  "#7700FF": 100*/
  "#FF008C": 40,
  "#D309E1": 40,
  "#9C1AFF": 40,
  "#7700FF": 40
};
const initialTexts = ["Pingüinos", "Bellos", "Son", "Malos"];
